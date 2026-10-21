import { existsSync, readFileSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { HttpError } from "./errors.mjs";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

const MAX_BODY_BYTES = 2_000_000;

export function send(response, status, body, type = "application/json; charset=utf-8") {
  const payload = Buffer.isBuffer(body) || typeof body === "string" ? body : JSON.stringify(body);
  response.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(payload);
}

export async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new HttpError("Request body is too large", 413);
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError("Request body must be JSON", 400);
  }
}

export function resolvePublicFile(publicDir, requestPath) {
  const root = resolve(publicDir);
  const target = resolve(root, requestPath);
  const fromRoot = relative(root, target);
  if (fromRoot === "" || fromRoot.startsWith("..") || fromRoot.includes(`..${sep}`)) return null;
  if (!existsSync(target)) return null;
  return target;
}

export function sendPublicFile(response, publicDir, requestPath) {
  const filePath = resolvePublicFile(publicDir, requestPath);
  if (!filePath) {
    send(response, 404, { error: "Not found" });
    return;
  }
  const type = CONTENT_TYPES[extname(filePath)] || "application/octet-stream";
  send(response, 200, readFileSync(filePath), type);
}
