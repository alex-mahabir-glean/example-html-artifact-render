import assert from "node:assert/strict";
import test from "node:test";
import { describeGleanCall, formatGleanCall } from "../lib/glean-log.mjs";
import { chatRequestBody, createGleanClient } from "../lib/glean.mjs";

test("a Glean log records the posted request and leaves out credentials", () => {
  const entry = describeGleanCall({
    method: "POST",
    url: "https://example.glean.com/rest/api/v1/createauthtoken",
    status: 200,
    ms: 120,
    headers: {
      Authorization: "Bearer secretvalue",
      "X-Glean-ActAs": "ada@example.com",
      Accept: "application/json",
    },
    body: {
      token: "GLEAN_AUTH_TOKEN_secretvalue",
      expirationTime: Math.floor(Date.now() / 1000) + 3600,
    },
  });

  assert.equal(entry.path, "/rest/api/v1/createauthtoken");
  assert.equal(entry.request.headers.Authorization, "Bearer [redacted]");
  assert.equal(entry.request.headers["X-Glean-ActAs"], "ada@example.com");
  assert.equal(entry.response.tokenPresent, true);
  assert.equal(JSON.stringify(entry).includes("secretvalue"), false);
  const formatted = formatGleanCall(entry);
  assert.match(formatted, /^glean POST \/rest\/api\/v1\/createauthtoken 200 120ms\nrequest\n\{/m);
  assert.match(formatted, /"X-Glean-ActAs": "ada@example.com"/);
});

test("the client log summarizes chat without the bearer token", async () => {
  const calls = [];
  const token = "client-token-value-0123456789abcdef0123456789";
  const client = createGleanClient({
    serverUrl: "https://example.glean.com",
    token,
    onCall: (entry) => calls.push(entry),
  });
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        chatId: "chat-1",
        messages: [
          {
            messageType: "ARTIFACT_HTML",
            artifactInfo: { id: "artifact-1" },
            fragments: [{ artifact: { name: "chart.html", resolvedContent: "<p>chart</p>" } }],
          },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  try {
    await client.generateGraph("Draw a chart");
  } finally {
    globalThis.fetch = original;
  }

  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, "/rest/api/v1/chat");
  assert.deepEqual(calls[0].request.body, chatRequestBody("Draw a chart"));
  assert.equal(calls[0].request.headers.Authorization, "Bearer [redacted]");
  assert.equal(calls[0].response.artifactId, "artifact-1");
  assert.equal(calls[0].response.htmlBytes, "<p>chart</p>".length);
  assert.equal(JSON.stringify(calls).includes(token), false);
  assert.equal(JSON.stringify(calls).includes("<p>chart</p>"), false);
});