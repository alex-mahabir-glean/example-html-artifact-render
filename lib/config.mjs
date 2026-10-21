import { resolve } from "node:path";
import { loadEnv, loadUsers } from "./env.mjs";

export function loadConfig({
  env = overlayEnv(loadEnv()),
  publicDir = resolve("public"),
  cachePath = resolve("data/captured-artifacts.json"),
} = {}) {
  const serverUrl = String(env.GLEAN_SERVER_URL || "").replace(/\/$/, "");
  if (!serverUrl) {
    throw new Error("GLEAN_SERVER_URL is missing from .env.local");
  }
  let parsed;
  try {
    parsed = new URL(serverUrl);
  } catch {
    throw new Error("GLEAN_SERVER_URL must be an absolute URL");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("GLEAN_SERVER_URL must be an http(s) URL");
  }

  const users = loadUsers(env);
  if (users.length === 0) {
    throw new Error("No USER_n / USER_n_CLIENT_TOKEN pairs found in .env.local");
  }

  const port = Number(env.PORT || 8787);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer from 1 to 65535");
  }

  return {
    serverUrl,
    port,
    users,
    authTokenApiKey: env.GLEAN_AUTH_TOKEN_API_KEY || "",
    publicDir: resolve(publicDir),
    cachePath: resolve(cachePath),
  };
}

function overlayEnv(fileEnv) {
  const env = { ...fileEnv };
  for (const [key, value] of Object.entries(process.env)) {
    if (value) env[key] = value;
  }
  return env;
}
