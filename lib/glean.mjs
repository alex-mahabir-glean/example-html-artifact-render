import { parseChatPayload } from "./artifact.mjs";
import { HttpError, publicErrorMessage } from "./errors.mjs";

const CHAT_TIMEOUT_MS = 180_000;
const API_TIMEOUT_MS = 20_000;

export function createAuthTokenMinter({ serverUrl, apiKey }) {
  const base = serverUrl.replace(/\/$/, "");
  const cache = new Map();

  return async function mint(email) {
    const now = Date.now();
    const cached = cache.get(email);
    if (cached?.token && cached.expiresAt - 60_000 > now) return cached.token;
    if (cached?.pending) return cached.pending;

    const pending = (async () => {
      let response;
      try {
        response = await fetch(`${base}/rest/api/v1/createauthtoken`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "X-Glean-ActAs": email,
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });
      } catch (error) {
        if (error?.name === "TimeoutError" || error?.name === "AbortError") {
          throw new HttpError("Glean request timed out", 504);
        }
        throw new HttpError("Glean could not be reached", 502);
      }
      const text = await response.text();
      if (!response.ok) {
        throw new HttpError(`Could not mint a Glean session for artifact access (${response.status})`, response.status);
      }
      let payload = null;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
      const token = typeof payload?.token === "string" ? payload.token : "";
      if (!token) {
        throw new HttpError("Glean did not return a session token", 502);
      }
      const expiration = Number(payload.expirationTime);
      const expiresAt =
        Number.isFinite(expiration) && expiration > 0
          ? expiration > 1e12
            ? expiration
            : expiration * 1000
          : now + 10 * 60 * 1000;
      cache.set(email, { token, expiresAt });
      return token;
    })();

    cache.set(email, { pending, expiresAt: 0, token: "" });
    try {
      return await pending;
    } catch (error) {
      cache.delete(email);
      throw error;
    }
  };
}

export function createGleanClient({ serverUrl, token }) {
  const base = serverUrl.replace(/\/$/, "");

  async function request(path, { method = "GET", body, accept = "application/json", timeoutMs = API_TIMEOUT_MS } = {}) {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: accept,
    };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    let response;
    try {
      response = await fetch(`${base}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        throw new HttpError("Glean request timed out", 504);
      }
      throw new HttpError("Glean could not be reached", 502);
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
      const message =
        typeof data === "string"
          ? data.trim()
          : data?.message || data?.error || response.statusText;
      throw new HttpError(publicErrorMessage(message || `Glean returned ${response.status}`), response.status);
    }
    return data;
  }

  return {
    async generateGraph(prompt) {
      const payload = await request("/rest/api/v1/chat", {
        method: "POST",
        timeoutMs: CHAT_TIMEOUT_MS,
        body: {
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
              artifacts: {
                allowedArtifactTypes: ["HTML_CODE"],
              },
            },
          },
          sourceInfo: {
            feature: "CHAT",
            initiator: "USER",
            platform: "WEB",
            isDebug: false,
          },
        },
      });
      return parseChatPayload(payload);
    },

    listArtifacts() {
      const query = new URLSearchParams({
        types: "HTML_CODE",
        limit: "24",
        includeContent: "false",
        permission: "all",
        sortBy: "lastViewedAt",
      });
      return request(`/api/v1/artifacts?${query}`);
    },

    getArtifact(artifactId) {
      return request(`/api/v1/artifacts/${encodeURIComponent(artifactId)}`);
    },

    listVersions(artifactId) {
      return request(`/api/v1/artifacts/${encodeURIComponent(artifactId)}/versions`);
    },

    getVersion(artifactId, version) {
      return request(
        `/api/v1/artifacts/${encodeURIComponent(artifactId)}/versions/${encodeURIComponent(version)}`,
      );
    },

    updateVersion(artifactId, version, body) {
      return request(
        `/api/v1/artifacts/${encodeURIComponent(artifactId)}/versions/${encodeURIComponent(version)}`,
        { method: "PUT", body },
      );
    },

    deleteArtifact(artifactId) {
      return request(`/api/v1/artifacts/${encodeURIComponent(artifactId)}`, {
        method: "DELETE",
      });
    },
  };
}

export { artifactHtml, artifactSummary, parseChatPayload } from "./artifact.mjs";
