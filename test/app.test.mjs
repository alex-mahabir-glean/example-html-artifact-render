import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createApp } from "../server.mjs";

test("config hides tokens and static files stay inside public/", async () => {
  const root = await mkdtemp(join(tmpdir(), "graph-app-"));
  const publicDir = join(root, "public");
  await mkdir(publicDir);
  await writeFile(join(publicDir, "index.html"), "<!doctype html><title>studio</title>");
  await writeFile(join(root, "secret.txt"), "secret");

  const token = "user-client-token-should-not-leak";
  const authTokenApiKey = "auth-key-should-not-leak";
  const server = createApp({
    serverUrl: "https://example.glean.com",
    port: 0,
    users: [{ id: "1", email: "ada@example.com", token }],
    authTokenApiKey,
    publicDir,
    cachePath: join(root, "cache.json"),
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const config = await fetch(`http://127.0.0.1:${port}/api/config`).then((response) => response.json());
    assert.equal(JSON.stringify(config).includes(token), false);
    assert.equal(JSON.stringify(config).includes(authTokenApiKey), false);
    assert.deepEqual(config.users, [{ id: "1", email: "ada@example.com" }]);

    const page = await fetch(`http://127.0.0.1:${port}/graph/sample`);
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.match(html, /studio/);
    assert.equal(html.includes(token), false);

    const escaped = await fetch(`http://127.0.0.1:${port}/assets/../secret.txt`);
    assert.equal(escaped.status, 404);

    const missing = await fetch(`http://127.0.0.1:${port}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "  " }),
    });
    assert.equal(missing.status, 400);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
