import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function createArtifactCache(cachePath) {
  function read() {
    if (!existsSync(cachePath)) return {};
    try {
      const parsed = JSON.parse(readFileSync(cachePath, "utf8"));
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function write(cache) {
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, JSON.stringify(cache));
  }

  return {
    remember(userId, artifact, chatId) {
      if (!artifact?.id || !artifact.html) return;
      const cache = read();
      cache[artifact.id] = {
        userId,
        chatId: chatId || null,
        id: artifact.id,
        name: artifact.name,
        version: artifact.version,
        filePathHint: artifact.filePathHint || null,
        html: artifact.html,
        capturedAt: new Date().toISOString(),
      };
      write(cache);
    },

    get(artifactId) {
      return read()[artifactId] || null;
    },

    forget(artifactId) {
      const cache = read();
      if (!cache[artifactId]) return;
      delete cache[artifactId];
      write(cache);
    },
  };
}
