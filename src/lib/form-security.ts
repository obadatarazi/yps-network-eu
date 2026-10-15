/** Client-side join-form abuse checks (bots / rapid submit). Not a server DoS shield. */

const RATE_KEY = "yps-join-prepare";
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MIN_FILL_MS = 1600;

export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  organisation: 200,
  place: 120,
  access: 500,
  message: 4000,
} as const;

export function sanitizeText(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, max);
}

export function isHoneypotTripped(value: string): boolean {
  return value.trim().length > 0;
}

export function wasFilledTooFast(startedAt: number, now = Date.now()): boolean {
  return now - startedAt < MIN_FILL_MS;
}

export function isJoinRateLimited(now = Date.now()): boolean {
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    const stamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = stamps.filter((t) => typeof t === "number" && now - t < RATE_WINDOW_MS);
    return recent.length >= RATE_MAX;
  } catch {
    return false;
  }
}

export function recordJoinPrepare(now = Date.now()): void {
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    const stamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = stamps.filter((t) => typeof t === "number" && now - t < RATE_WINDOW_MS);
    recent.push(now);
    sessionStorage.setItem(RATE_KEY, JSON.stringify(recent));
  } catch {
    // Private mode / blocked storage — skip recording.
  }
}
