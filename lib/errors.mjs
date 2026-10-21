export class HttpError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export function publicErrorMessage(error) {
  const message = typeof error === "string" ? error : error?.message;
  return String(message || "Request failed")
    .replace(/GLEAN_AUTH_TOKEN_\S+/g, "GLEAN_AUTH_TOKEN_[redacted]")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, "[redacted]")
    .trim();
}
