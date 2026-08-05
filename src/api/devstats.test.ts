import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEVSTATS_API_URL,
  DevStatsError,
  fetchCareerContributions,
  fetchDevAct,
  fetchRankedCount,
  fetchSiteStats,
  normalizeLogin,
} from './devstats';

function ok(body: unknown): Response {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

function httpError(status: number, body: unknown = {}): Response {
  return { ok: false, status, json: async () => body } as unknown as Response;
}

function lastRequest(mock: ReturnType<typeof vi.fn>) {
  const [url, init] = mock.mock.calls.at(-1) as [string, RequestInit];
  return { url, init, body: JSON.parse(String(init.body)) as { api: string; payload: Record<string, unknown> } };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('normalizeLogin', () => {
  it('trims, lowercases and strips a leading @', () => {
    expect(normalizeLogin(' @HydAI ')).toBe('hydai');
    expect(normalizeLogin('hydai')).toBe('hydai');
  });
});

describe('fetchCareerContributions', () => {
  it('POSTs {api, payload} with a normalized github_id', async () => {
    const mock = vi.fn(async () => ok({ contributions: 29086, issues: 1371, prs: 2941 }));
    vi.stubGlobal('fetch', mock);

    const res = await fetchCareerContributions('HydAI');
    expect(res).toEqual({ contributions: 29086, issues: 1371, prs: 2941 });

    const { url, init, body } = lastRequest(mock);
    expect(url).toBe(DEVSTATS_API_URL);
    expect(init.method).toBe('POST');
    expect(body).toEqual({ api: 'GithubIDContributions', payload: { github_id: 'hydai' } });
  });

  it('serves repeat calls from the cache', async () => {
    const mock = vi.fn(async () => ok({ contributions: 1, issues: 0, prs: 0 }));
    vi.stubGlobal('fetch', mock);
    await fetchCareerContributions('hydai');
    await fetchCareerContributions('hydai');
    expect(mock).toHaveBeenCalledTimes(1);
  });
});

describe('fetchDevAct', () => {
  it('sends the full payload, github_id included', async () => {
    const mock = vi.fn(async () => ok({ rank: [119], login: ['hydai'], number: [1393] }));
    vi.stubGlobal('fetch', mock);

    const entry = await fetchDevAct('Contributions', 'hydai');
    expect(entry).toEqual({ rank: 119, login: 'hydai', number: 1393 });

    expect(lastRequest(mock).body).toEqual({
      api: 'DevActCnt',
      payload: {
        project: 'all',
        range: 'Last year',
        metric: 'Contributions',
        repository_group: 'All',
        country: 'All',
        github_id: 'hydai',
      },
    });
  });

  it('returns null for the "not found in results" API error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ok({ error: "API 'DevActCnt': github_id 'nobody' not found in results" })),
    );
    expect(await fetchDevAct('PRs', 'nobody')).toBeNull();
  });

  it('returns null for empty result arrays', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ok({ rank: [], login: [], number: [] })));
    expect(await fetchDevAct('Issues', 'nobody')).toBeNull();
  });

  it('throws DevStatsError for other API errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ok({ error: 'something exploded' })));
    await expect(fetchDevAct('Comments', 'hydai')).rejects.toMatchObject({
      name: 'DevStatsError',
      kind: 'api',
    });
  });

  it('throws DevStatsError(network) when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('offline'))));
    await expect(fetchDevAct('Commits', 'hydai')).rejects.toMatchObject({ kind: 'network' });
  });

  it('throws DevStatsError(http) on non-2xx responses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => httpError(502)));
    await expect(fetchDevAct('Commits', 'hydai')).rejects.toMatchObject({ kind: 'http' });
  });

  it('does not cache failures', async () => {
    const mock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(httpError(500))
      .mockResolvedValueOnce(ok({ rank: [1], login: ['hydai'], number: [2] }));
    vi.stubGlobal('fetch', mock);
    await expect(fetchDevAct('PRs', 'hydai')).rejects.toBeInstanceOf(DevStatsError);
    expect(await fetchDevAct('PRs', 'hydai')).toEqual({ rank: 1, login: 'hydai', number: 2 });
  });
});

describe('fetchRankedCount', () => {
  it('asks for the full leaderboard with an empty github_id and returns its size', async () => {
    const mock = vi.fn(async () =>
      ok({ rank: [1, 2, 3], login: ['a', 'b', 'c'], number: [30, 20, 10] }),
    );
    vi.stubGlobal('fetch', mock);

    expect(await fetchRankedCount('Contributions')).toBe(3);
    expect(lastRequest(mock).body.payload.github_id).toBe('');

    // Second call hits the cache (only the count is stored).
    expect(await fetchRankedCount('Contributions')).toBe(3);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});

describe('fetchSiteStats', () => {
  it('fetches project=all site stats', async () => {
    const stats = {
      contributors: 325042,
      contributions: 21930460,
      commits: 5780150,
      repositories: 15505,
      countries: 193,
      companies: 20996,
    };
    const mock = vi.fn(async () => ok(stats));
    vi.stubGlobal('fetch', mock);

    expect(await fetchSiteStats()).toMatchObject(stats);
    expect(lastRequest(mock).body).toEqual({ api: 'SiteStats', payload: { project: 'all' } });
  });
});
