import { artifactSummary, parseChatPayload } from "./artifact.mjs";
import { publicErrorMessage } from "./errors.mjs";

export function describeGleanCall({ method, url, status, ms, cached = false, headers, json, body, error }) {
  const parsed = new URL(url);
  const entry = {
    method,
    host: parsed.host,
    path: parsed.pathname,
    status: status ?? null,
    ms,
  };
  if (cached) entry.cached = true;
  const request = postedRequest(headers, json);
  if (request) entry.request = request;
  if (body !== undefined) entry.response = describeBody(parsed.pathname, body);
  if (error) entry.error = publicErrorMessage(error);
  return scrub(entry);
}

export function formatGleanCall(entry) {
  const status = entry.cached ? "cached" : entry.status ?? "error";
  const lines = [`glean ${entry.method} ${entry.path} ${status} ${entry.ms}ms`];
  if (entry.request !== undefined) {
    lines.push("request");
    lines.push(JSON.stringify(entry.request, null, 2));
  }
  if (entry.response !== undefined) {
    lines.push("response");
    lines.push(JSON.stringify(entry.response, null, 2));
  }
  if (entry.error) lines.push(entry.error);
  return lines.join("\n");
}

export function writeGleanCall(entry, write = console.log) {
  write(formatGleanCall(entry));
}

function postedRequest(headers, json) {
  const request = {};
  if (headers) request.headers = redactHeaders(headers);
  if (json !== undefined) request.body = json;
  return Object.keys(request).length ? request : undefined;
}

function redactHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      /^authorization$/i.test(key) ? "Bearer [redacted]" : value,
    ]),
  );
}

function describeBody(pathname, body) {
  if (typeof body !== "object" || body === null) {
    return { bodyChars: String(body ?? "").length };
  }
  if (pathname.endsWith("/createauthtoken")) {
    const expiration = Number(body.expirationTime);
    const expiresAtMs = expiration > 1e12 ? expiration : expiration * 1000;
    return {
      tokenPresent: typeof body.token === "string" && body.token.length > 0,
      expiresInSec: Number.isFinite(expiresAtMs) ? Math.max(0, Math.round((expiresAtMs - Date.now()) / 1000)) : null,
    };
  }
  if (pathname.endsWith("/chat")) {
    const parsed = parseChatPayload(body);
    return {
      chatId: parsed.chatId,
      artifactId: parsed.artifact?.id || null,
      artifactName: parsed.artifact?.name || null,
      htmlBytes: parsed.artifact?.html?.length || 0,
    };
  }
  if (pathname.includes("/artifacts/")) {
    const summary = artifactSummary(body);
    if (!summary) return { htmlBytes: 0 };
    return {
      id: summary.id,
      name: summary.name,
      version: summary.version,
      htmlBytes: summary.html?.length || 0,
    };
  }
  return {};
}

function scrub(entry) {
  return JSON.parse(publicErrorMessage(JSON.stringify(entry)));
}
