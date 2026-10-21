import assert from "node:assert/strict";
import test from "node:test";
import { artifactFromChat, artifactCall, chatCall, sessionCall } from "../public/glean.js";

test("the page calls Glean chat, session mint, and artifact download directly", () => {
  const chat = chatCall("https://example.glean.com/", "client-token", "Draw a chart");
  assert.equal(chat.url, "https://example.glean.com/rest/api/v1/chat");
  assert.equal(chat.init.headers.Authorization, "Bearer client-token");
  const body = JSON.parse(chat.init.body);
  assert.deepEqual(body.agentConfig.clientCapabilities.artifacts.allowedArtifactTypes, ["HTML_CODE"]);
  assert.equal(body.messages[0].fragments[0].text, "Draw a chart");

  const session = sessionCall("https://example.glean.com", "auth-key", "ada@example.com");
  assert.equal(session.url, "https://example.glean.com/rest/api/v1/createauthtoken");
  assert.equal(session.init.headers["X-Glean-ActAs"], "ada@example.com");
  assert.equal(session.init.headers.Authorization, "Bearer auth-key");

  const artifact = artifactCall("https://example.glean.com", "session-token", "abc/1");
  assert.equal(artifact.url, "https://example.glean.com/api/v1/artifacts/abc%2F1");
  assert.equal(artifact.init.method, "GET");
  assert.equal(artifact.init.headers.Authorization, "Bearer session-token");
});

test("chat parsing prefers the HTML artifact", () => {
  const artifact = artifactFromChat({
    messages: [
      {
        messageType: "ARTIFACT_INLINE_HTML",
        artifactInfo: { id: "inline" },
        fragments: [{ artifact: { resolvedContent: "<p>inline</p>" } }],
      },
      {
        messageType: "ARTIFACT_HTML",
        artifactInfo: { id: "html" },
        fragments: [{ artifact: { name: "chart.html", resolvedContent: "<p>chart</p>" } }],
      },
    ],
  });
  assert.deepEqual(artifact, {
    id: "html",
    name: "chart.html",
    html: "<p>chart</p>",
    messageType: "ARTIFACT_HTML",
  });
});
