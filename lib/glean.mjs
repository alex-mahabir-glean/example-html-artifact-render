import { parseChatPayload } from "./artifact.mjs";
import { HttpError, publicErrorMessage } from "./errors.mjs";
import { describeGleanCall } from "./glean-log.mjs";

const CHAT_TIMEOUT_MS = 180_000;
const API_TIMEOUT_MS = 20_000;

// Cursor's command sandbox sets SSL_CERT_FILE to its own CA and replaces
// Node's default trust store. Glean's public certificate then fails with
// UNABLE_TO_GET_ISSUER_CERT_LOCALLY. NODE_EXTRA_CA_CERTS still supplies the
// extra CA when a proxy is intercepting TLS.
export function keepDefaultCertificateAuthorities() {
  if (process.env.SSL_CERT_FILE) delete process.env.SSL_CERT_FILE;
}

keepDefaultCertificateAuthorities();

function unreachableMessage(error) {
  const code = error?.cause?.code || error?.code;
  return code ? `Glean could not be reached (${code})` : "Glean could not be reached";
}

export function chatRequestBody(prompt) {
  return {
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
  };
}

export function createAuthTokenMinter({ serverUrl, apiKey }) {
  const base = serverUrl.replace(/\/$/, "");
  const cache = new Map();

  return async function mint(email, onCall) {
    const now = Date.now();
    const url = `${base}/rest/api/v1/createauthtoken`;
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "X-Glean-ActAs": email,
      Accept: "application/json",
    };
    const cached = cache.get(email);
    if (cached?.token && cached.expiresAt - 60_000 > now) {
      onCall?.(
        describeGleanCall({
          method: "POST",
          url,
          status: 200,
          ms: 0,
          cached: true,
          headers,
        }),
      );
      return cached.token;
    }
    if (cached?.pending) return cached.pending;

    const pending = (async () => {
      keepDefaultCertificateAuthorities();
      const started = Date.now();
      let response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers,
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });
      } catch (error) {
        const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
        const wrapped = new HttpError(timedOut ? "Glean request timed out" : unreachableMessage(error), timedOut ? 504 : 502);
        onCall?.(
          describeGleanCall({
            method: "POST",
            url,
            ms: Date.now() - started,
            headers,
            error: wrapped,
          }),
        );
        throw wrapped;
      }
      const text = await response.text();
      let payload = null;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = text;
      }
      onCall?.(
        describeGleanCall({
          method: "POST",
          url,
          status: response.status,
          ms: Date.now() - started,
          headers,
          body: payload,
          error: response.ok ? undefined : `Could not mint a Glean session for artifact access (${response.status})`,
        }),
      );
      if (!response.ok) {
        throw new HttpError(`Could not mint a Glean session for artifact access (${response.status})`, response.status);
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

export function createGleanClient({ serverUrl, token, onCall } = {}) {
  const base = serverUrl.replace(/\/$/, "");

  async function request(path, { method = "GET", body, accept = "application/json", timeoutMs = API_TIMEOUT_MS } = {}) {
    keepDefaultCertificateAuthorities();
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: accept,
    };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const url = `${base}${path}`;
    const started = Date.now();
    let response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      const wrapped = new HttpError(timedOut ? "Glean request timed out" : unreachableMessage(error), timedOut ? 504 : 502);
      onCall?.(
        describeGleanCall({
          method,
          url,
          ms: Date.now() - started,
          headers,
          json: body,
          error: wrapped,
        }),
      );
      throw wrapped;
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
    const message =
      typeof data === "string" ? data.trim() : data?.message || data?.error || response.statusText;
    onCall?.(
      describeGleanCall({
        method,
        url,
        status: response.status,
        ms: Date.now() - started,
        headers,
        json: body,
        body: data,
        error: response.ok ? undefined : message || `Glean returned ${response.status}`,
      }),
    );
    if (!response.ok) {
      throw new HttpError(publicErrorMessage(message || `Glean returned ${response.status}`), response.status);
    }
    return data;
  }

  return {
    async generateGraph(prompt) {
      const payload = await request("/rest/api/v1/chat", {
        method: "POST",
        timeoutMs: CHAT_TIMEOUT_MS,
        body: chatRequestBody(prompt),
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
