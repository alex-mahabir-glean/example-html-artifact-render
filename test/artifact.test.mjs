import assert from "node:assert/strict";
import test from "node:test";
import { artifactSummary, parseChatPayload } from "../lib/artifact.mjs";

test("chat parser prefers the HTML artifact body over empty text", () => {
  const parsed = parseChatPayload({
    chatId: "chat-1",
    messages: [
      {
        author: "GLEAN_AI",
        messageType: "CONTENT",
        fragments: [{ text: "Here is the chart." }],
      },
      {
        messageType: "ARTIFACT_INLINE_HTML",
        artifactInfo: { id: "inline-1", version: 1 },
        fragments: [{ artifact: { resolvedContent: "<p>inline</p>", name: "inline.html" } }],
      },
      {
        messageType: "ARTIFACT_HTML",
        artifactInfo: { id: "html-1", version: 3 },
        fragments: [
          { text: "" },
          { artifact: { name: "volume.html", filePathHint: "html/volume.html", resolvedContent: "<!DOCTYPE html>" } },
        ],
      },
    ],
  });

  assert.equal(parsed.chatId, "chat-1");
  assert.equal(parsed.answer, "Here is the chart.");
  assert.equal(parsed.artifact.id, "html-1");
  assert.equal(parsed.artifact.version, 3);
  assert.equal(parsed.artifact.html, "<!DOCTYPE html>");
  assert.equal(parsed.artifact.filePathHint, "html/volume.html");
});

test("artifact summary reads content.text", () => {
  const summary = artifactSummary({
    artifact: {
      id: "abc",
      name: "volume.html",
      type: "HTML_CODE",
      content: { text: "<svg></svg>" },
      metadata: { version: 2, minorVersion: 4 },
    },
  });
  assert.deepEqual(summary, {
    id: "abc",
    name: "volume.html",
    type: "HTML_CODE",
    chatId: null,
    filePathHint: null,
    version: 2,
    minorVersion: 4,
    html: "<svg></svg>",
    libraryUrl: "https://app.glean.com/library/abc",
  });
});
