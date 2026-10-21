const CHAT_TIMEOUT_MS = 180_000;
const API_TIMEOUT_MS = 20_000;

export function chatCall(serverUrl, token, prompt) {
  return {
    url: `${base(serverUrl)}/rest/api/v1/chat`,
    init: {
      method: "POST",
      credentials: "omit",
      headers: jsonHeaders(token),
      body: JSON.stringify({
        messages: [
          {
            author: "USER",
            messageType: "CONTENT",
            fragments: [{ text: prompt }],
          },
        ],
        saveChat: true,
        agentConfig: {
          agent: "DEFAULT",
          useCanvas: true,
          clientCapabilities: {
            artifacts: { allowedArtifactTypes: ["HTML_CODE"] },
          },
        },
        sourceInfo: {
          feature: "CHAT",
          initiator: "USER",
          platform: "WEB",
          isDebug: false,
        },
      }),
      signal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
    },
  };
}

export function sessionCall(serverUrl, apiKey, email) {
  return {
    url: `${base(serverUrl)}/rest/api/v1/createauthtoken`,
    init: {
      method: "POST",
      credentials: "omit",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Glean-ActAs": email,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    },
  };
}

export function artifactCall(serverUrl, token, artifactId) {
  return {
    url: `${base(serverUrl)}/api/v1/artifacts/${encodeURIComponent(artifactId)}`,
    init: {
      method: "GET",
      credentials: "omit",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    },
  };
}

export async function generateArtifact({ serverUrl, user, authTokenApiKey, prompt }) {
  if (!user?.token) throw new Error("This user has no Glean client token");
  if (!authTokenApiKey) throw new Error("GLEAN_AUTH_TOKEN_API_KEY is unset");

  const chatPromise = send(chatCall(serverUrl, user.token, prompt));
  const sessionPromise = send(sessionCall(serverUrl, authTokenApiKey, user.email));
  const chat = await chatPromise;
  const artifact = artifactFromChat(chat);
  if (!artifact?.id) {
    throw new Error(answerText(chat) || "Glean did not return an HTML artifact");
  }
  const session = await sessionPromise;
  if (!session?.token) throw new Error("Glean did not return a session token");
  const downloaded = await send(artifactCall(serverUrl, session.token, artifact.id));
  const html = artifactHtml(downloaded);
  if (!html) throw new Error("Glean returned the artifact without HTML content");
  return {
    id: artifact.id,
    name: downloaded?.artifact?.name || artifact.name || "Untitled graph",
    html,
  };
}

export async function downloadArtifact({ serverUrl, user, authTokenApiKey, artifactId }) {
  if (!authTokenApiKey) throw new Error("GLEAN_AUTH_TOKEN_API_KEY is unset");
  const session = await send(sessionCall(serverUrl, authTokenApiKey, user.email));
  if (!session?.token) throw new Error("Glean did not return a session token");
  const downloaded = await send(artifactCall(serverUrl, session.token, artifactId));
  const html = artifactHtml(downloaded);
  if (!html) throw new Error("Glean returned the artifact without HTML content");
  return html;
}

export function artifactFromChat(payload) {
  const found = [];
  for (const message of messagesOf(payload)) {
    if (message?.messageType !== "ARTIFACT_HTML" && message?.messageType !== "ARTIFACT_INLINE_HTML") continue;
    const id = message.artifactInfo?.id;
    if (!id) continue;
    let html = "";
    let name = "";
    for (const fragment of message.fragments || []) {
      const artifact = fragment.artifact || {};
      if (artifact.name) name = artifact.name;
      if (typeof artifact.resolvedContent === "string" && artifact.resolvedContent) html = artifact.resolvedContent;
    }
    found.push({ id, name, html, messageType: message.messageType });
  }
  return (
    found.find((item) => item.messageType === "ARTIFACT_HTML" && item.html) ||
    found.find((item) => item.messageType === "ARTIFACT_HTML") ||
    found.find((item) => item.html) ||
    found.at(-1) ||
    null
  );
}

export function artifactHtml(payload) {
  const text = payload?.artifact?.content?.text;
  return typeof text === "string" ? text : "";
}

async function send(call) {
  let response;
  try {
    response = await fetch(call.url, call.init);
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new Error("Glean request timed out");
    }
    throw new Error(
      "The browser blocked the call to Glean. Glean only allows that from its own site. Run npm run demo and use that window.",
    );
  }
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!response.ok) {
    const message = typeof data === "string" ? data.trim() : data?.message || data?.error || response.statusText;
    throw new Error(redact(message || `Glean returned ${response.status}`));
  }
  return data;
}

function answerText(payload) {
  return messagesOf(payload)
    .filter((message) => message?.author === "GLEAN_AI" && (message.messageType || "CONTENT") === "CONTENT")
    .map((message) =>
      (message.fragments || [])
        .map((fragment) => (typeof fragment.text === "string" ? fragment.text : ""))
        .join(""),
    )
    .join("\n\n")
    .trim();
}

function messagesOf(payload) {
  if (Array.isArray(payload?.messages)) return payload.messages;
  if (Array.isArray(payload?.chat?.messages)) return payload.chat.messages;
  return [];
}

function jsonHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function base(serverUrl) {
  return String(serverUrl || "").replace(/\/$/, "");
}

function redact(value) {
  return String(value)
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/GLEAN_AUTH_TOKEN_\S+/g, "[redacted]")
    .replace(/[A-Za-z0-9+/]{40,}={0,2}/g, "[redacted]")
    .slice(0, 300);
}
