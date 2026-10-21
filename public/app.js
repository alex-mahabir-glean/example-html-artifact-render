const app = document.querySelector("#app");
const defaultPrompt =
  "Create a self-contained interactive HTML artifact, not inline code or markdown. Draw a bar chart titled Sample pipeline volume with three bars: Discovery 12, Clinical 7, and Filing 3. Use only inline CSS and SVG. Do not ask follow-up questions.";

const path = location.pathname;
const graphMatch = path.match(/^\/graph\/([^/]+)$/);

if (graphMatch) {
  renderGraph(decodeURIComponent(graphMatch[1]));
} else {
  renderHome();
}

async function renderHome() {
  const config = await getJson("/api/config");
  const users = config.users || [];
  app.innerHTML = `
    <main class="shell">
      <header class="top">
        <div>
          <h1 class="brand">Graph studio</h1>
          <p class="lede">Ask Glean chat for an HTML artifact, then open that artifact id and render the graph here.</p>
        </div>
      </header>
      <div class="layout">
        <section class="panel">
          <form id="generate-form">
            <label for="user">Glean user</label>
            <select id="user" name="userId">
              ${users.map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.email)}</option>`).join("")}
            </select>
            <div class="row">
              <label for="prompt">Ask chat for a graph</label>
              <textarea id="prompt" name="prompt">${escapeHtml(defaultPrompt)}</textarea>
            </div>
            <div class="actions">
              <button type="submit" id="generate">Generate graph</button>
            </div>
            <p class="status" id="status" hidden></p>
            <p class="error" id="error" hidden></p>
          </form>
        </section>
        <section class="panel">
          <h2>Open an artifact</h2>
          <form id="open-form">
            <label for="artifact-id">Artifact id</label>
            <input id="artifact-id" name="artifactId" type="text" placeholder="Paste an artifact id" />
            <div class="actions">
              <button type="submit" class="secondary">Render</button>
            </div>
          </form>
          <div id="library"></div>
        </section>
      </div>
    </main>
  `;

  document.querySelector("#generate-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = document.querySelector("#generate");
    const status = document.querySelector("#status");
    const error = document.querySelector("#error");
    error.hidden = true;
    status.hidden = false;
    status.textContent = "Asking Glean chat for an HTML graph. This usually takes a minute.";
    button.disabled = true;
    try {
      const result = await postJson("/api/generate", {
        userId: document.querySelector("#user").value,
        prompt: document.querySelector("#prompt").value,
      });
      if (!result.artifact?.id) {
        throw new Error(result.error || "Chat did not return an artifact");
      }
      sessionStorage.setItem("graph-user", document.querySelector("#user").value);
      location.assign(`/graph/${encodeURIComponent(result.artifact.id)}`);
    } catch (cause) {
      error.hidden = false;
      error.textContent = cause.message;
      status.hidden = true;
      button.disabled = false;
    }
  });

  document.querySelector("#open-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const artifactId = document.querySelector("#artifact-id").value.trim();
    if (!artifactId) return;
    rememberUser();
    location.assign(`/graph/${encodeURIComponent(artifactId)}`);
  });

  const userSelect = document.querySelector("#user");
  const storedUser = sessionStorage.getItem("graph-user");
  if (storedUser && users.some((user) => user.id === storedUser)) userSelect.value = storedUser;
  userSelect.addEventListener("change", rememberUser);
  rememberUser();

  function rememberUser() {
    sessionStorage.setItem("graph-user", userSelect.value);
    loadLibrary(userSelect.value);
  }
}

let libraryRequest = 0;

async function loadLibrary(userId) {
  const library = document.querySelector("#library");
  if (!userId || !library) return;
  const requestId = ++libraryRequest;
  try {
    const payload = await getJson(`/api/artifacts?userId=${encodeURIComponent(userId)}`);
    if (requestId !== libraryRequest) return;
    const artifacts = payload.artifacts || [];
    if (artifacts.length === 0) {
      library.innerHTML = `<p class="muted">No HTML artifacts were returned.</p>`;
      return;
    }
    library.innerHTML = artifacts
      .map(
        (artifact) => `
          <div class="library-item">
            <a href="/graph/${encodeURIComponent(artifact.id)}">${escapeHtml(artifact.name || artifact.id)}</a>
            <span class="muted">${escapeHtml(artifact.type || "")}</span>
          </div>
        `,
      )
      .join("");
  } catch (error) {
    if (requestId !== libraryRequest) return;
    library.innerHTML = `<p class="muted">Artifact list is unavailable (${escapeHtml(error.message)}).</p>`;
  }
}

async function renderGraph(artifactId) {
  const userId = sessionStorage.getItem("graph-user") || "";
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  app.innerHTML = `
    <main class="stage-page">
      <header class="stage-bar">
        <div>
          <p class="muted" style="margin:0 0 4px">Artifact ${escapeHtml(artifactId)}</p>
          <h1 class="stage-title" id="title">Loading graph</h1>
        </div>
        <div class="stage-actions">
          <a class="secondary" href="/">New graph</a>
          <a class="secondary" id="library-link" href="https://app.glean.com/library/${encodeURIComponent(artifactId)}" target="_blank" rel="noreferrer">Open in Glean</a>
        </div>
      </header>
      <p class="banner" id="banner" hidden></p>
      <div class="frame-wrap">
        <iframe id="graph" sandbox="allow-scripts" title="Glean HTML graph"></iframe>
      </div>
    </main>
  `;

  try {
    const payload = await getJson(`/api/artifacts/${encodeURIComponent(artifactId)}${query}`);
    const artifact = payload.artifact;
    document.querySelector("#title").textContent = artifact.name || "Graph";
    const banner = document.querySelector("#banner");
    if (payload.warning) {
      banner.hidden = false;
      banner.textContent = payload.warning;
    }
    const frame = document.querySelector("#graph");
    frame.srcdoc = artifact.html;
  } catch (error) {
    document.querySelector("#title").textContent = "Could not render graph";
    const banner = document.querySelector("#banner");
    banner.hidden = false;
    banner.textContent = error.message;
  }
}

async function getJson(url) {
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || payload.answer || `Request failed (${response.status})`);
  return payload;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
