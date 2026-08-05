import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_TTL_MS, cacheGet, cacheKey, cacheSet, cached } from './cache';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('cacheKey', () => {
  it('includes the API name and the payload (with login)', () => {
    const key = cacheKey('DevActCnt', { metric: 'PRs', github_id: 'hydai' });
    expect(key).toContain('DevActCnt');
    expect(key).toContain('hydai');
    expect(key).toContain('PRs');
  });
});

describe('cacheGet / cacheSet', () => {
  it('round-trips values', () => {
    cacheSet('k', { a: 1 });
    expect(cacheGet('k')).toEqual({ a: 1 });
  });

  it('expires entries after the 1 hour TTL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    cacheSet('k', 'v');
    expect(DEFAULT_TTL_MS).toBe(60 * 60 * 1000);

    vi.setSystemTime(new Date('2026-01-01T00:59:59Z'));
    expect(cacheGet('k')).toBe('v');

    vi.setSystemTime(new Date('2026-01-01T01:00:01Z'));
    expect(cacheGet('k')).toBeUndefined();
    expect(localStorage.getItem('k')).toBeNull(); // pruned on read
  });

  it('honours a custom TTL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    cacheSet('k', 'v', 1000);
    vi.setSystemTime(new Date('2026-01-01T00:00:02Z'));
    expect(cacheGet('k')).toBeUndefined();
  });

  it('ignores corrupted entries', () => {
    localStorage.setItem('bad', '{not json');
    expect(cacheGet('bad')).toBeUndefined();
    localStorage.setItem('no-exp', JSON.stringify({ v: 1 }));
    expect(cacheGet('no-exp')).toBeUndefined();
  });
});

describe('cached', () => {
  it('invokes the loader once, then serves from cache', async () => {
    const fn = vi.fn(async () => 42);
    expect(await cached('num', fn)).toBe(42);
    expect(await cached('num', fn)).toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('caches null results too', async () => {
    const fn = vi.fn(async () => null);
    expect(await cached('null', fn)).toBeNull();
    expect(await cached('null', fn)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('dedupes concurrent loads of the same key', async () => {
    let release!: (v: string) => void;
    const fn = vi.fn(() => new Promise<string>((r) => (release = r)));
    const a = cached('dedupe', fn);
    const b = cached('dedupe', fn);
    expect(fn).toHaveBeenCalledTimes(1);
    release('x');
    expect(await a).toBe('x');
    expect(await b).toBe('x');
  });

  it('does not cache failures', async () => {
    const fn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce('ok');
    await expect(cached('flaky', fn)).rejects.toThrow('boom');
    expect(await cached('flaky', fn)).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
