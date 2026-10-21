import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { chatRequestBody } from "../lib/glean.mjs";

const collectionPath = new URL("../postman/glean-html-artifact.postman_collection.json", import.meta.url);
const environmentPath = new URL("../postman/glean-html-artifact.postman_environment.json", import.meta.url);

test("the Postman collection matches the chat request and has no credentials", async () => {
  const collection = JSON.parse(await readFile(collectionPath, "utf8"));
  const environment = JSON.parse(await readFile(environmentPath, "utf8"));
  const names = collection.item.map((item) => item.name);
  assert.deepEqual(names, ["Create session token", "Chat", "Get artifact"]);

  const chat = collection.item[1];
  assert.equal(chat.request.method, "POST");
  assert.equal(chat.request.url, "{{baseUrl}}/rest/api/v1/chat");
  const script = chat.event[0].script.exec.join("\n");
  assert.match(script, /messageType === 'ARTIFACT_HTML'/);
  assert.match(script, /artifactInfo\.id/);
  assert.match(script, /collectionVariables\.set\('artifactId'/);
  assert.match(script, /environment\.set\('artifactId'/);

  const posted = JSON.parse(chat.request.body.raw);
  assert.deepEqual(posted, chatRequestBody(posted.messages[0].fragments[0].text));
  assert.equal(posted.agentConfig.clientCapabilities.artifacts.allowedArtifactTypes[0], "HTML_CODE");

  const session = collection.item[0];
  assert.equal(session.request.url, "{{baseUrl}}/rest/api/v1/createauthtoken");
  assert.equal(header(session, "Authorization"), "Bearer {{authTokenApiKey}}");
  assert.equal(header(session, "X-Glean-ActAs"), "{{actAsEmail}}");

  const artifact = collection.item[2];
  assert.equal(artifact.request.method, "GET");
  assert.equal(artifact.request.url, "{{baseUrl}}/api/v1/artifacts/{{artifactId}}");
  assert.equal(header(artifact, "Authorization"), "Bearer {{sessionToken}}");

  const packed = JSON.stringify({ collection, environment });
  assert.equal(packed.includes("GLEAN_AUTH_TOKEN_"), false);
  assert.equal(environment.values.find((item) => item.key === "clientToken").value, "");
  assert.equal(environment.values.find((item) => item.key === "authTokenApiKey").value, "");
});

function header(item, key) {
  return item.request.header.find((entry) => entry.key === key)?.value;
}
