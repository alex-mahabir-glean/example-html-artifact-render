import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { loadConfig } from "./lib/config.mjs";
import { HttpError, publicErrorMessage } from "./lib/errors.mjs";
import { writeGleanCall } from "./lib/glean-log.mjs";
import { artifactSummary, createAuthTokenMinter, createGleanClient } from "./lib/glean.mjs";
import { libraryUrl } from "./lib/artifact.mjs";
import { readJson, send, sendPublicFile } from "./lib/http.mjs";

export function createApp(config, log = writeGleanCall) {
  const mintSession = config.authTokenApiKey
    ? createAuthTokenMinter({ serverUrl: config.serverUrl, apiKey: config.authTokenApiKey })
    : null;

  return createServer(async (request, response) => {
    const started = Date.now();
    const calls = [];
    const onCall = (entry) => {
      calls.push(entry);
      log(entry);
    };

    try {
      const url = new URL(request.url, "http://localhost");
      const { pathname } = url;

      if (request.method === "GET" && (pathname === "/" || pathname.startsWith("/graph/"))) {
        return sendPublicFile(response, config.publicDir, "index.html");
      }
      if (request.method === "GET" && pathname.startsWith("/assets/")) {
        return sendPublicFile(response, config.publicDir, pathname.slice("/assets/".length));
      }
      if (request.method === "GET" && pathname === "/api/config") {
        return send(response, 200, {
          serverUrl: config.serverUrl,
          users: config.users.map((user) => ({ id: user.id, email: user.email })),
        });
      }
      if (request.method === "POST" && pathname === "/api/generate") {
        return await generate(request, response, onCall, calls);
      }

      const artifactMatch = pathname.match(/^\/api\/artifacts\/([^/]+)$/);
      if (artifactMatch && request.method === "GET") {
        return await readArtifact(url, artifactMatch[1], response, onCall, calls);
      }

      return send(response, 404, { error: "Not found" });
    } catch (error) {
      const status = error instanceof URIError || error instanceof SyntaxError ? 400 : error.status || 500;
      return send(response, status, { error: publicErrorMessage(error), status, calls, ms: Date.now() - started });
    }
  });

  async function generate(request, response, onCall, calls) {
    const started = Date.now();
    const body = await readJson(request);
    const prompt = String(body.prompt || "").trim();
    if (!prompt) throw new HttpError("A prompt is required", 400);
    const user = config.users.find((item) => item.id === String(body.userId || "")) || config.users[0];
    const chat = createGleanClient({ serverUrl: config.serverUrl, token: user.token, onCall });
    const sessionPromise = mintSession ? mintSession(user.email, onCall) : Promise.resolve(user.token);
    const [chatOutcome, sessionOutcome] = await Promise.allSettled([chat.generateGraph(prompt), sessionPromise]);
    if (chatOutcome.status === "rejected") throw chatOutcome.reason;
    if (sessionOutcome.status === "rejected") throw sessionOutcome.reason;

    const result = chatOutcome.value;
    if (!result.artifact?.id) {
      return send(response, 422, {
        error: "Glean did not return an HTML artifact",
        chatId: result.chatId,
        answer: result.answer,
        calls,
        ms: Date.now() - started,
      });
    }

    const artifacts = createGleanClient({
      serverUrl: config.serverUrl,
      token: sessionOutcome.value,
      onCall,
    });
    const summary = artifactSummary(await artifacts.getArtifact(result.artifact.id));
    if (!summary?.html) throw new HttpError("Glean returned the artifact without HTML content", 502);
    return send(response, 200, {
      artifact: {
        id: result.artifact.id,
        name: summary.name || result.artifact.name,
        version: summary.version ?? result.artifact.version,
        libraryUrl: libraryUrl(result.artifact.id),
      },
      html: summary.html,
      calls,
      ms: Date.now() - started,
    });
  }

  async function readArtifact(url, rawId, response, onCall, calls) {
    const started = Date.now();
    const artifactId = decodeURIComponent(rawId);
    const user = config.users.find((item) => item.id === String(url.searchParams.get("userId") || "")) || config.users[0];
    const session = mintSession ? await mintSession(user.email, onCall) : user.token;
    const artifacts = createGleanClient({ serverUrl: config.serverUrl, token: session, onCall });
    const summary = artifactSummary(await artifacts.getArtifact(artifactId));
    if (!summary?.html) throw new HttpError("Glean returned the artifact without HTML content", 502);
    return send(response, 200, { artifact: summary, calls, ms: Date.now() - started });
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  const server = createApp(config);
  server.requestTimeout = 0;
  server.headersTimeout = 0;
  server.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
    console.log("Glean calls are made by this server. Each one is logged as a glean JSON line.");
  });
}
