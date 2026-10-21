import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnv(filePath = resolve(process.cwd(), ".env.local")) {
  let text = "";
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    return {};
  }
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

export function loadUsers(env) {
  const users = [];
  for (const [key, value] of Object.entries(env)) {
    const match = key.match(/^USER_(\d+)$/);
    if (!match || !value) continue;
    const token = env[`USER_${match[1]}_CLIENT_TOKEN`];
    if (!token) continue;
    users.push({
      id: match[1],
      email: value,
      token,
    });
  }
  users.sort((a, b) => Number(a.id) - Number(b.id));
  return users;
}
