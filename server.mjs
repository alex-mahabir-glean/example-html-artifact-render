import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { createArtifactCache } from "./lib/cache.mjs";
import { loadConfig } from "./lib/config.mjs";
import { HttpError, publicErrorMessage } from "./lib/errors.mjs";
import { artifactSummary, createAuthTokenMinter, createGleanClient } from "./lib/glean.mjs";
import { libraryUrl } from "./lib/artifact.mjs";
import { readJson, send, sendPublicFile } from "./lib/http.mjs";

export function createApp(config) {
  const cache = createArtifactCache(config.cachePath);
  const mintSession = config.authTokenApiKey
    ? createAuthTokenMinter({ serverUrl: config.serverUrl, apiKey: config.authTokenApiKey })
    : null;

  async function clientsFor(userId) {
    const user = config.users.find((item) => item.id === String(userId || "")) || config.users[0];
    const chat = createGleanClient({ serverUrl: config.serverUrl, token: user.token });
    if (!mintSession) return { user, chat, artifacts: chat };
    const session = await mintSession(user.email);
    return {
      user,
      chat,
      artifacts: createGleanClient({ serverUrl: config.serverUrl, token: session }),
    };
  }

  async function downloadArtifact(glean, artifactId, version) {
    const payload = version
      ? await glean.getVersion(artifactId, version)
      : await glean.getArtifact(artifactId);
    const summary = artifactSummary(payload);
    if (!summary?.html) {
      throw new HttpError("Glean returned the artifact without HTML content", 502);
    }
    return summary;
  }

  return createServer(async (request, response) => {
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
          users: config.users.map(publicUser),
          artifactsUseSession: Boolean(mintSession),
        });
      }
      if (request.method === "POST" && pathname === "/api/generate") {
        return await generate(request, response);
      }

      const artifactMatch = pathname.match(/^\/api\/artifacts\/([^/]+)$/);
      if (artifactMatch && request.method === "GET") {
        return await readArtifact(url, artifactMatch[1], response);
      }
      if (artifactMatch && request.method === "DELETE") {
        return await removeArtifact(url, artifactMatch[1], response);
      }

      const versionsMatch = pathname.match(/^\/api\/artifacts\/([^/]+)\/versions$/);
      if (versionsMatch && request.method === "GET") {
        const { artifacts } = await clientsFor(url.searchParams.get("userId"));
        return send(response, 200, await artifacts.listVersions(decodeURIComponent(versionsMatch[1])));
      }

      const versionMatch = pathname.match(/^\/api\/artifacts\/([^/]+)\/versions\/([^/]+)$/);
      if (versionMatch && request.method === "PUT") {
        const { artifacts } = await clientsFor(url.searchParams.get("userId"));
        const payload = await artifacts.updateVersion(
          decodeURIComponent(versionMatch[1]),
          decodeURIComponent(versionMatch[2]),
          await readJson(request),
        );
        return send(response, 200, { artifact: artifactSummary(payload) });
      }

      if (request.method === "GET" && pathname === "/api/artifacts") {
        const { artifacts: glean } = await clientsFor(url.searchParams.get("userId"));
        const payload = await glean.listArtifacts();
        const artifacts = Array.isArray(payload?.artifacts) ? payload.artifacts : [];
        return send(response, 200, {
          artifacts: artifacts.map((item) => artifactSummary({ artifact: item })).filter(Boolean),
          cursor: payload?.cursor || null,
        });
      }

      return send(response, 404, { error: "Not found" });
    } catch (error) {
      const status = error instanceof URIError || error instanceof SyntaxError ? 400 : error.status || 500;
      return send(response, status, { error: publicErrorMessage(error), status });
    }

    async function generate(request, response) {
      const body = await readJson(request);
      const prompt = String(body.prompt || "").trim();
      if (!prompt) throw new HttpError("A prompt is required", 400);
      const { user, chat, artifacts } = await clientsFor(body.userId);
      const result = await chat.generateGraph(prompt);
      if (!result.artifact?.id) {
        return send(response, 422, {
          error: "Glean did not return an HTML artifact",
          chatId: result.chatId,
          answer: result.answer,
          questions: result.questions,
        });
      }
      cache.remember(user.id, result.artifact, result.chatId);
      let download = null;
      try {
        download = await downloadArtifact(artifacts, result.artifact.id, null);
      } catch (error) {
        download = { error: publicErrorMessage(error), status: error.status || 500 };
      }
      return send(response, 200, {
        user: publicUser(user),
        chatId: result.chatId,
        answer: result.answer,
        questions: result.questions,
        artifact: {
          id: result.artifact.id,
          name: result.artifact.name,
          version: result.artifact.version,
          libraryUrl: libraryUrl(result.artifact.id),
        },
        download,
      });
    }

    async function readArtifact(url, rawId, response) {
      const artifactId = decodeURIComponent(rawId);
      const version = url.searchParams.get("version");
      const { artifacts: glean } = await clientsFor(url.searchParams.get("userId"));
      const upstream = artifactUpstream(config.serverUrl, artifactId, version);
      try {
        const summary = await downloadArtifact(glean, artifactId, version);
        return send(response, 200, { source: "glean", artifact: summary, upstream });
      } catch (error) {
        const cached = !version ? cache.get(artifactId) : null;
        if (!cached?.html) throw error;
        return send(response, 200, {
          source: "chat",
          upstream,
          warning: `GET ${upstream} returned ${error.status || 500} ${publicErrorMessage(error)}. The chart is the HTML chat attached to this artifact id.`,
          gleanStatus: error.status || 500,
          artifact: {
            id: cached.id,
            name: cached.name,
            type: "HTML_CODE",
            chatId: cached.chatId,
            filePathHint: cached.filePathHint,
            version: cached.version,
            minorVersion: null,
            html: cached.html,
            libraryUrl: libraryUrl(cached.id),
          },
        });
      }
    }

    async function removeArtifact(url, rawId, response) {
      const artifactId = decodeURIComponent(rawId);
      const { artifacts } = await clientsFor(url.searchParams.get("userId"));
      await artifacts.deleteArtifact(artifactId);
      cache.forget(artifactId);
      return send(response, 200, { deleted: artifactId });
    }
  });
}

function publicUser(user) {
  return { id: user.id, email: user.email };
}

function artifactUpstream(serverUrl, artifactId, version) {
  const path = version
    ? `/api/v1/artifacts/${artifactId}/versions/${version}`
    : `/api/v1/artifacts/${artifactId}`;
  return `${serverUrl}${path}`;
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
    console.log(`Graph studio listening on http://localhost:${config.port}`);
    console.log(
      config.authTokenApiKey
        ? "Artifact routes use a minted Glean session."
        : "GLEAN_AUTH_TOKEN_API_KEY is unset; artifact routes use the chat token.",
    );
  });
}
