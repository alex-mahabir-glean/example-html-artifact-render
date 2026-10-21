const ARTIFACT_MESSAGE_TYPES = new Set(["ARTIFACT_HTML", "ARTIFACT_INLINE_HTML"]);

export function libraryUrl(artifactId) {
  return artifactId ? `https://app.glean.com/library/${artifactId}` : null;
}

export function parseChatPayload(payload) {
  const messages = collectMessages(payload);
  const artifacts = [];
  const answer = [];
  const questions = [];

  for (const message of messages) {
    const messageType = message.messageType || "CONTENT";
    if (message.author === "GLEAN_AI" && messageType === "CONTENT") {
      const text = fragmentText(message);
      if (text.trim()) answer.push(text);
    }
    if (messageType === "ARTIFACT_USER_QUESTIONS") {
      for (const fragment of message.fragments || []) {
        const content = fragment.artifact?.clarifyingQuestionsContent;
        if (content) questions.push(content);
      }
    }
    if (!ARTIFACT_MESSAGE_TYPES.has(messageType)) continue;
    const info = message.artifactInfo || {};
    if (!info.id) continue;
    let html = "";
    let name = "";
    let filePathHint = "";
    for (const fragment of message.fragments || []) {
      const artifact = fragment.artifact || {};
      if (artifact.name) name = artifact.name;
      if (artifact.filePathHint) filePathHint = artifact.filePathHint;
      if (typeof artifact.resolvedContent === "string" && artifact.resolvedContent) {
        html = artifact.resolvedContent;
      }
    }
    artifacts.push({
      id: info.id,
      version: info.version ?? null,
      name: name || info.name || "Untitled graph",
      filePathHint,
      html,
      messageType,
    });
  }

  const graph =
    artifacts.find((item) => item.messageType === "ARTIFACT_HTML" && item.html) ||
    artifacts.find((item) => item.messageType === "ARTIFACT_HTML") ||
    artifacts.find((item) => item.html) ||
    artifacts.at(-1) ||
    null;

  return {
    chatId: payload?.chatId || payload?.chat?.id || null,
    answer: answer.join("\n\n").trim(),
    questions,
    artifact: graph,
  };
}

export function artifactHtml(payload) {
  const artifact = payload?.artifact || payload;
  const text = artifact?.content?.text;
  return typeof text === "string" ? text : "";
}

export function artifactSummary(payload) {
  const artifact = payload?.artifact || payload;
  if (!artifact || typeof artifact !== "object") return null;
  const metadata = artifact.metadata || {};
  return {
    id: artifact.id,
    name: artifact.name || "Untitled graph",
    type: artifact.type || null,
    chatId: artifact.chatId || null,
    filePathHint: artifact.filePathHint || null,
    version: metadata.version ?? null,
    minorVersion: metadata.minorVersion ?? null,
    html: artifactHtml(payload),
    libraryUrl: libraryUrl(artifact.id),
  };
}

function collectMessages(payload) {
  if (Array.isArray(payload?.messages)) return payload.messages;
  if (Array.isArray(payload?.chat?.messages)) return payload.chat.messages;
  if (Array.isArray(payload?.chatResult?.chat?.messages)) return payload.chatResult.chat.messages;
  return [];
}

function fragmentText(message) {
  return (message.fragments || [])
    .map((fragment) => (typeof fragment.text === "string" ? fragment.text : ""))
    .join("");
}
