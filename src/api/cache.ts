const PREFIX = 'cncf-wrapped:v1:';

/** Default cache TTL: 1 hour. */
export const DEFAULT_TTL_MS = 60 * 60 * 1000;

interface CacheEntry<T> {
  v: T;
  exp: number;
}

function storage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    // Some privacy modes throw on any localStorage access.
    return null;
  }
}

/** Cache key derived from the API name + full payload (includes the login when present). */
export function cacheKey(api: string, payload: unknown): string {
  return `${PREFIX}${api}:${JSON.stringify(payload)}`;
}

export function cacheGet<T>(key: string): T | undefined {
  const store = storage();
  if (!store) return undefined;
  try {
    const raw = store.getItem(key);
    if (raw === null) return undefined;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (typeof entry !== 'object' || entry === null || typeof entry.exp !== 'number' || entry.exp <= Date.now()) {
      store.removeItem(key);
      return undefined;
    }
    return entry.v;
  } catch {
    return undefined;
  }
}

export function cacheSet<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): void {
  const store = storage();
  if (!store) return;
  const entry: CacheEntry<T> = { v: value, exp: Date.now() + ttlMs };
  try {
    store.setItem(key, JSON.stringify(entry));
  } catch {
    // Quota exceeded / private mode: caching is best-effort.
  }
}

/** Serves `fn()` through the localStorage cache. Note: `undefined` results are not cacheable. */
export async function cached<T>(key: string, fn: () => Promise<T>, ttlMs: number = DEFAULT_TTL_MS): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;
  const value = await fn();
  cacheSet(key, value, ttlMs);
  return value;
}
