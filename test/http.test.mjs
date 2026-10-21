import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { resolvePublicFile } from "../lib/http.mjs";
import { loadUsers } from "../lib/env.mjs";
import { publicErrorMessage } from "../lib/errors.mjs";

test("public files cannot escape the public directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "graph-public-"));
  await writeFile(join(root, "app.js"), "ok");

  assert.equal(resolvePublicFile(root, "app.js")?.endsWith("app.js"), true);
  assert.equal(resolvePublicFile(root, "../secret.txt"), null);
  assert.equal(resolvePublicFile(root, "nested/../../secret.txt"), null);
});

test("users require a paired client token and stay ordered", () => {
  const users = loadUsers({
    USER_2: "second@example.com",
    USER_2_CLIENT_TOKEN: "second-token",
    USER_10: "tenth@example.com",
    USER_1: "first@example.com",
    USER_1_CLIENT_TOKEN: "first-token",
    USER_3: "missing-token@example.com",
  });
  assert.deepEqual(
    users.map((user) => user.id),
    ["1", "2"],
  );
  assert.equal(users[0].token, "first-token");
});

test("error text does not keep bearer secrets", () => {
  const message = publicErrorMessage(
    "Bearer GLEAN_AUTH_TOKEN_examplevalue and AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  );
  assert.equal(message.includes("examplevalue"), false);
  assert.equal(message.includes("AAAAAAAA"), false);
  assert.match(message, /Bearer \[redacted\]/);
});
