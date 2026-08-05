import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchFortuneData } from './fortune';

function ok(body: unknown): Response {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchFortuneData', () => {
  it('collects career, commits, contributions and avatar when available', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input).includes('avatars.githubusercontent.com')) {
          return { ok: false, status: 404 } as unknown as Response;
        }
        const { api, payload } = JSON.parse(String(init?.body)) as {
          api: string;
          payload: Record<string, string>;
        };
        if (api === 'GithubIDContributions') return ok({ contributions: 29086, issues: 1371, prs: 2941 });
        if (api === 'DevActCnt' && payload.metric === 'Commits') {
          return ok({ rank: [84], login: ['hydai'], number: [1808] });
        }
        if (api === 'DevActCnt' && payload.metric === 'Contributions') {
          return ok({ rank: [119], login: ['hydai'], number: [1393] });
        }
        throw new Error(`unexpected: ${api}`);
      }),
    );

    const data = await fetchFortuneData('hydai');
    expect(data.career?.contributions).toBe(29086);
    expect(data.commits).toEqual({ rank: 84, login: 'hydai', number: 1808 });
    expect(data.contributions?.rank).toBe(119);
    expect(data.avatarDataUrl).toBeNull();
  });

  it('degrades to nulls for unknown users (still drawable)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input).includes('avatars.githubusercontent.com')) {
          return { ok: false, status: 404 } as unknown as Response;
        }
        const { api } = JSON.parse(String(init?.body)) as { api: string };
        if (api === 'GithubIDContributions') return ok({ contributions: 0, issues: 0, prs: 0 });
        return ok({ error: "API 'DevActCnt': github_id 'nobody' not found in results" });
      }),
    );

    const data = await fetchFortuneData('nobody');
    expect(data.career?.contributions).toBe(0);
    expect(data.commits).toBeNull();
    expect(data.contributions).toBeNull();
  });

  it('never throws, even when everything is down', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('offline'))));
    const data = await fetchFortuneData('hydai');
    expect(data).toEqual({ career: null, commits: null, contributions: null, avatarDataUrl: null });
  });
});
