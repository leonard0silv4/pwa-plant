import "server-only";

// Best-effort sliding-window limiter kept in memory.
// On Vercel each function instance has its own memory, so this caps abuse per
// instance rather than globally — good enough for v1 without external storage.

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_PER_HOUR) || 10;
const MAX_TRACKED_IPS = 10_000;

const hits = new Map<string, number[]>();

export function clientIp(request: Request) {
  // Vercel sets x-forwarded-for with the real client IP first.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function prune(now: number) {
  for (const [ip, times] of hits) {
    const recent = times.filter((t) => now - t < WINDOW_MS);
    if (recent.length) hits.set(ip, recent);
    else hits.delete(ip);
  }
}

export function checkRateLimit(ip: string, now = Date.now()) {
  if (hits.size > MAX_TRACKED_IPS) prune(now);

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    const retryAfter = Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
    return { allowed: false as const, retryAfter };
  }
  recent.push(now);
  hits.set(ip, recent);
  return { allowed: true as const, remaining: MAX_REQUESTS - recent.length };
}

/** Gives the slot back when the request failed for reasons that aren't the user's fault. */
export function refundRateLimit(ip: string) {
  const times = hits.get(ip);
  if (times?.length) times.pop();
}
