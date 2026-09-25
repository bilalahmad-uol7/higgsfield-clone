// Only allow same-origin relative paths as post-auth destinations, so
// `?next=` can't be used as an open redirect (e.g. `//evil.com`, `https://…`).
export function safeNext(next: string | null | undefined, fallback = "/create"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
