const app = document.querySelector("#app");
const defaultPrompt =
  "Create a self-contained interactive HTML artifact, not inline code or markdown. Draw a bar chart titled Sample pipeline volume with three bars: Discovery 12, Clinical 7, and Filing 3. Use only inline CSS and SVG. Do not ask follow-up questions.";

const graphMatch = location.pathname.match(/^\/graph\/([^/]+)$/);
if (graphMatch) {
  renderArtifact(decodeURIComponent(graphMatch[1]));
} else {
  renderForm();
}

async function renderForm() {
  const config = await getJson("/api/config");
  const users = config.users || [];
  const userField =
    users.length > 1
      ? `<label for="user">User</label>
         <select id="user" name="userId">
           ${users.map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.email)}</option>`).join("")}
         </select>`
      : `<input id="user" type="hidden" value="${escapeHtml(users[0]?.id || "1")}">`;

  app.innerHTML = `
    <main class="shell">
      <form id="generate-form" class="panel">
        ${userField}
        <label for="prompt">Prompt</label>
        <textarea id="prompt" name="prompt">${escapeHtml(defaultPrompt)}</textarea>
        <div class="actions">
          <button type="button" id="generate">Generate</button>
        </div>
        <p class="status" id="status" hidden></p>
        <p class="error" id="error" hidden></p>
      </form>
      <ol class="calls" id="calls" hidden></ol>
      <div class="frame-wrap" id="frame-wrap" hidden>
        <iframe id="graph" sandbox="allow-scripts" title="Generated HTML artifact"></iframe>
      </div>
    </main>
  `;

  document.querySelector("#generate").addEventListener("click", async () => {
    const button = document.querySelector("#generate");
    const status = document.querySelector("#status");
    const error = document.querySelector("#error");
    error.hidden = true;
    status.hidden = false;
    status.textContent = "Generating the artifact. This usually takes a minute.";
    button.disabled = true;
    showCalls([]);
    try {
      const result = await postJson("/api/generate", {
        userId: document.querySelector("#user").value,
        prompt: document.querySelector("#prompt").value,
      });
      if (!result.html) throw new Error("Glean did not return an artifact");
      showCalls(result.calls);
      showFrame(result.html);
      status.hidden = true;
    } catch (cause) {
      showCalls(cause.calls);
      error.hidden = false;
      error.textContent = cause.message;
      status.hidden = true;
      button.disabled = false;
    }
  });
}

function showFrame(html) {
  document.querySelector("#generate-form").hidden = true;
  const wrap = document.querySelector("#frame-wrap");
  wrap.hidden = false;
  document.querySelector("#graph").srcdoc = html;
}

function showCalls(calls) {
  const list = document.querySelector("#calls");
  if (!list) return;
  if (!calls?.length) {
    list.hidden = true;
    list.innerHTML = "";
    return;
  }
  list.hidden = false;
  list.innerHTML = calls.map((call) => `<li>${escapeHtml(formatCall(call))}</li>`).join("");
}

function formatCall(call) {
  const status = call.cached ? "cached" : call.status ?? "error";
  const seconds = `${(Number(call.ms) / 1000).toFixed(1)}s`;
  const detail =
    call.error ||
    call.response?.artifactId ||
    call.response?.id ||
    (call.response?.chatId ? `chat ${call.response.chatId}` : "") ||
    (call.response?.tokenPresent ? "session" : "");
  return [`${call.method} ${call.path}`, status, seconds, detail].filter(Boolean).join("  ");
}

async function renderArtifact(artifactId) {
  app.innerHTML = `
    <main class="shell">
      <p class="status" id="status">Loading the artifact.</p>
      <p class="error" id="error" hidden></p>
      <ol class="calls" id="calls" hidden></ol>
      <div class="frame-wrap" id="frame-wrap" hidden>
        <iframe id="graph" sandbox="allow-scripts" title="Generated HTML artifact"></iframe>
      </div>
    </main>
  `;
  try {
    const payload = await getJson(`/api/artifacts/${encodeURIComponent(artifactId)}`);
    showCalls(payload.calls);
    document.querySelector("#status").hidden = true;
    document.querySelector("#frame-wrap").hidden = false;
    document.querySelector("#graph").srcdoc = payload.artifact.html;
  } catch (error) {
    showCalls(error.calls);
    const status = document.querySelector("#status");
    status.hidden = true;
    const banner = document.querySelector("#error");
    banner.hidden = false;
    banner.textContent = error.message;
  }
}

async function getJson(url) {
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status})`);
    error.calls = payload.calls;
    throw error;
  }
  return payload;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status})`);
    error.calls = payload.calls;
    throw error;
  }
  return payload;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
