import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createConnection } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../lib/config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const config = loadConfig();
if (!(await portOpen(config.port))) {
  const server = spawn(process.execPath, ["server.mjs"], {
    cwd: root,
    detached: true,
    stdio: "ignore",
  });
  server.unref();
  await waitForPort(config.port);
}

await access(chromePath);
const profile = join(tmpdir(), "example-html-artifact-render-browser");
const chrome = spawn(
  chromePath,
  [
    `--user-data-dir=${profile}`,
    "--disable-web-security",
    "--disable-site-isolation-trials",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-sync",
    `http://localhost:${config.port}`,
  ],
  { detached: true, stdio: "ignore" },
);
chrome.unref();
console.log(`Opened http://localhost:${config.port}`);
console.log("That window can call Glean. The network panel shows those requests. Use it only for this demo.");

function portOpen(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" });
    const done = (open) => {
      socket.destroy();
      resolve(open);
    };
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
  });
}

async function waitForPort(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (await portOpen(port)) return;
    await delay(100);
  }
  throw new Error(`Server did not listen on ${port}`);
}
