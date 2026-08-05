import { cacheKey, cached } from './cache';

export const DEVSTATS_API_URL = 'https://devstats.cncf.io/api/v1';

export type DevStatsErrorKind = 'network' | 'http' | 'api';

export class DevStatsError extends Error {
  readonly kind: DevStatsErrorKind;

  constructor(message: string, kind: DevStatsErrorKind) {
    super(message);
    this.name = 'DevStatsError';
    this.kind = kind;
  }
}

/** Raw POST to the DevStats API. Every call is `POST {api, payload}`. */
async function call<T>(api: string, payload: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(DEVSTATS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api, payload }),
    });
  } catch (cause) {
    throw new DevStatsError(`DevStats unreachable: ${String(cause)}`, 'network');
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = undefined;
  }

  // DevStats reports some errors as an {"error": "..."} body (even with HTTP 200).
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  ) {
    throw new DevStatsError((data as { error: string }).error, 'api');
  }
  if (!res.ok) throw new DevStatsError(`DevStats HTTP ${res.status}`, 'http');
  if (data === undefined) throw new DevStatsError('DevStats returned an invalid response', 'api');
  return data as T;
}

/** Normalizes a GitHub login the way DevStats leaderboards store it (lowercase, no leading @). */
export function normalizeLogin(raw: string): string {
  return raw.trim().replace(/^@/, '').toLowerCase();
}

export interface CareerContributions {
  contributions: number;
  issues: number;
  prs: number;
}

/** Career totals across all CNCF projects. Returns all zeros for unknown users. */
export async function fetchCareerContributions(githubId: string): Promise<CareerContributions> {
  const payload = { github_id: normalizeLogin(githubId) };
  return cached(cacheKey('GithubIDContributions', payload), () =>
    call<CareerContributions>('GithubIDContributions', payload),
  );
}

export const DEV_ACT_METRICS = ['Contributions', 'PRs', 'Issues', 'Comments', 'Commits'] as const;
export type DevActMetric = (typeof DEV_ACT_METRICS)[number];

export interface DevActEntry {
  rank: number;
  login: string;
  number: number;
}

interface DevActCntResponse {
  rank: number[] | null;
  login: string[] | null;
  number: number[] | null;
}

// The github_id field must always be present in the payload (empty string = full leaderboard).
function devActPayload(metric: DevActMetric, githubId: string) {
  return {
    project: 'all',
    range: 'Last year',
    metric,
    repository_group: 'All',
    country: 'All',
    github_id: githubId,
  };
}

const NOT_FOUND_RE = /not found in results/i;

/**
 * One user's last-year count + rank for a metric.
 * Returns null when the user is below the leaderboard threshold (DevStats answers
 * with a "github_id ... not found in results" error or with empty arrays).
 */
export async function fetchDevAct(metric: DevActMetric, githubId: string): Promise<DevActEntry | null> {
  const payload = devActPayload(metric, normalizeLogin(githubId));
  return cached(cacheKey('DevActCnt', payload), async () => {
    let data: DevActCntResponse;
    try {
      data = await call<DevActCntResponse>('DevActCnt', payload);
    } catch (err) {
      if (err instanceof DevStatsError && err.kind === 'api' && NOT_FOUND_RE.test(err.message)) {
        return null;
      }
      throw err;
    }
    if (!data.rank?.length || !data.login?.length || !data.number?.length) return null;
    return { rank: data.rank[0], login: data.login[0], number: data.number[0] };
  });
}

/** Size of the ranked leaderboard for a metric — the percentile denominator. */
export async function fetchRankedCount(metric: DevActMetric = 'Contributions'): Promise<number> {
  const payload = devActPayload(metric, '');
  // Cache only the count: the full leaderboard is ~40 KB and we never need the rows.
  return cached(cacheKey('DevActCnt:count', payload), async () => {
    const data = await call<DevActCntResponse>('DevActCnt', payload);
    return data.login?.length ?? 0;
  });
}

export interface SiteStats {
  contributors: number;
  contributions: number;
  commits: number;
  repositories: number;
  countries: number;
  companies: number;
}

/** Site-wide totals for the whole CNCF ("all" project). */
export async function fetchSiteStats(): Promise<SiteStats> {
  const payload = { project: 'all' };
  return cached(cacheKey('SiteStats', payload), () => call<SiteStats>('SiteStats', payload));
}
