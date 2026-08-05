import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DevStatsError, type DevActMetric } from './devstats';
import { fetchWrapped } from './wrapped';

function ok(body: unknown): Response {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

interface Fixtures {
  career: { contributions: number; issues: number; prs: number };
  /** Per-metric leaderboard row, or 'not-found', or 'http-500'. */
  devAct: Partial<Record<DevActMetric, { rank: number; number: number } | 'not-found' | 'http-500'>>;
  leaderboardSize: number;
}

function stubDevStats(f: Fixtures) {
  const mock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('avatars.githubusercontent.com')) {
      return { ok: false, status: 404 } as unknown as Response;
    }
    const { api, payload } = JSON.parse(String(init?.body)) as {
      api: string;
      payload: Record<string, string>;
    };
    if (api === 'GithubIDContributions') return ok(f.career);
    if (api === 'SiteStats') {
      return ok({ contributors: 325042, contributions: 21930460, commits: 5780150, repositories: 15505, countries: 193, companies: 20996 });
    }
    if (api === 'DevActCnt') {
      if (payload.github_id === '') {
        const n = f.leaderboardSize;
        return ok({
          rank: Array.from({ length: n }, (_, i) => i + 1),
          login: Array.from({ length: n }, (_, i) => `user${i}`),
          number: Array.from({ length: n }, () => 1),
        });
      }
      const row = f.devAct[payload.metric as DevActMetric];
      if (row === 'http-500') return { ok: false, status: 500, json: async () => ({}) } as unknown as Response;
      if (row === 'not-found' || row === undefined) {
        return ok({ error: `API 'DevActCnt': github_id '${payload.github_id}' not found in results` });
      }
      return ok({ rank: [row.rank], login: [payload.github_id], number: [row.number] });
    }
    throw new Error(`unexpected api: ${api}`);
  });
  vi.stubGlobal('fetch', mock);
  return mock;
}

const HYDAI: Fixtures = {
  career: { contributions: 29086, issues: 1371, prs: 2941 },
  devAct: {
    Contributions: { rank: 119, number: 1393 },
    PRs: { rank: 50, number: 700 },
    Issues: { rank: 80, number: 100 },
    Comments: { rank: 70, number: 500 },
    Commits: { rank: 90, number: 93 },
  },
  leaderboardSize: 1874,
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchWrapped', () => {
  it('assembles the full card model for a ranked user', async () => {
    const mock = stubDevStats(HYDAI);
    const res = await fetchWrapped(' @HydAI ');

    expect(res.status).toBe('ok');
    if (res.status !== 'ok') return;
    const d = res.data;

    expect(d.login).toBe('hydai');
    expect(d.career).toEqual(HYDAI.career);
    expect(d.yearly).toEqual({ contributions: 1393, rank: 119, rankedTotal: 1874, topPercent: 6.4 });
    expect(d.metrics.prs).toEqual({ count: 700, rank: 50 });
    expect(d.metrics.commits).toEqual({ count: 93, rank: 90 });
    expect(d.title).toEqual({ id: 'merge-machine', machine: false, basedOn: 'yearly-metrics' });
    expect(d.site?.contributors).toBe(325042);
    expect(d.avatarDataUrl).toBeNull(); // avatar fetch stubbed to 404

    // Every DevStats request must carry the lowercased login.
    for (const [url, init] of mock.mock.calls as Array<[string, RequestInit?]>) {
      if (!String(url).includes('devstats')) continue;
      const { payload } = JSON.parse(String(init?.body)) as { payload: Record<string, unknown> };
      if ('github_id' in payload && payload.github_id !== '') expect(payload.github_id).toBe('hydai');
    }
  });

  it('flags top-10 users as The Machine', async () => {
    stubDevStats({ ...HYDAI, devAct: { ...HYDAI.devAct, Contributions: { rank: 3, number: 20000 } } });
    const res = await fetchWrapped('hydai');
    expect(res.status === 'ok' && res.data.title.machine).toBe(true);
  });

  it('returns not-found after a single call when career contributions are zero', async () => {
    const mock = stubDevStats({ career: { contributions: 0, issues: 0, prs: 0 }, devAct: {}, leaderboardSize: 0 });
    expect(await fetchWrapped('zz-no-such-user')).toEqual({ status: 'not-found', login: 'zz-no-such-user' });
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('builds an unranked card (no rank / percentile) for below-threshold users', async () => {
    stubDevStats({ career: { contributions: 42, issues: 5, prs: 2 }, devAct: {}, leaderboardSize: 1874 });
    const res = await fetchWrapped('smalltimer');

    expect(res.status).toBe('ok');
    if (res.status !== 'ok') return;
    expect(res.data.yearly).toEqual({ contributions: null, rank: null, rankedTotal: 1874, topPercent: null });
    expect(res.data.metrics).toEqual({ prs: null, issues: null, comments: null, commits: null });
    expect(res.data.title).toEqual({ id: 'bug-whisperer', machine: false, basedOn: 'career' });
  });

  it('propagates hard failures of required calls', async () => {
    stubDevStats({ ...HYDAI, devAct: { ...HYDAI.devAct, Contributions: 'http-500' } });
    await expect(fetchWrapped('hydai')).rejects.toBeInstanceOf(DevStatsError);
  });

  it('survives failures of optional calls', async () => {
    stubDevStats({ ...HYDAI, devAct: { ...HYDAI.devAct, Comments: 'http-500', Commits: 'http-500' } });
    const res = await fetchWrapped('hydai');
    expect(res.status).toBe('ok');
    if (res.status !== 'ok') return;
    expect(res.data.metrics.comments).toBeNull();
    expect(res.data.title.id).toBe('merge-machine');
  });

  it('rejects an empty login without calling the API', async () => {
    const mock = stubDevStats(HYDAI);
    await expect(fetchWrapped('  @ ')).rejects.toBeInstanceOf(DevStatsError);
    expect(mock).not.toHaveBeenCalled();
  });
});
