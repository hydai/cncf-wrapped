import { cacheKey, cached } from './cache';
import {
  DevStatsError,
  fetchCareerContributions,
  fetchDevAct,
  fetchRankedCount,
  fetchSiteStats,
  normalizeLogin,
  type CareerContributions,
  type DevActEntry,
  type SiteStats,
} from './devstats';
import { topPercent } from '../lib/percentile';
import { computeTitle, type TitleResult } from '../lib/titles';

export interface MetricStat {
  count: number;
  rank: number;
}

export interface WrappedData {
  login: string;
  avatarDataUrl: string | null;
  career: CareerContributions;
  yearly: {
    contributions: number | null;
    rank: number | null;
    /** Number of contributors on the ranked leaderboard (percentile denominator). */
    rankedTotal: number;
    topPercent: number | null;
  };
  metrics: {
    prs: MetricStat | null;
    issues: MetricStat | null;
    comments: MetricStat | null;
    commits: MetricStat | null;
  };
  site: SiteStats | null;
  title: TitleResult;
}

export type WrappedResult = { status: 'ok'; data: WrappedData } | { status: 'not-found'; login: string };

function toStat(entry: DevActEntry | null): MetricStat | null {
  return entry ? { count: entry.number, rank: entry.rank } : null;
}

/** Nice-to-have data: swallow failures instead of killing the whole card. */
async function optional<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

export function avatarUrl(login: string): string {
  // github.com/{login}.png redirects here anyway, but without CORS headers;
  // the avatars host serves the same image with Access-Control-Allow-Origin: *.
  return `https://avatars.githubusercontent.com/${encodeURIComponent(login)}?size=240`;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Loads the avatar as a data URL so the PNG export canvas is never tainted. */
export async function loadAvatarDataUrl(login: string): Promise<string | null> {
  return cached(cacheKey('avatar', { login }), async () => {
    const res = await fetch(avatarUrl(login));
    if (!res.ok) return null;
    return blobToDataUrl(await res.blob());
  });
}

export async function fetchWrapped(rawLogin: string): Promise<WrappedResult> {
  const login = normalizeLogin(rawLogin);
  if (!login) throw new DevStatsError('empty GitHub ID', 'api');

  // Career totals double as the existence check, so a typo costs one API call, not eight.
  const career = await fetchCareerContributions(login);
  if (career.contributions <= 0) return { status: 'not-found', login };

  const [contribAct, rankedTotal, prs, issues, comments, commits, site, avatarDataUrl] = await Promise.all([
    fetchDevAct('Contributions', login),
    fetchRankedCount('Contributions'),
    optional(fetchDevAct('PRs', login)),
    optional(fetchDevAct('Issues', login)),
    optional(fetchDevAct('Comments', login)),
    optional(fetchDevAct('Commits', login)),
    optional(fetchSiteStats()),
    optional(loadAvatarDataUrl(login)),
  ]);

  const rank = contribAct?.rank ?? null;
  const title = computeTitle({
    metrics: {
      prs: prs?.number ?? null,
      issues: issues?.number ?? null,
      comments: comments?.number ?? null,
      commits: commits?.number ?? null,
    },
    career: { prs: career.prs, issues: career.issues },
    contributionsRank: rank,
  });

  return {
    status: 'ok',
    data: {
      login,
      avatarDataUrl,
      career,
      yearly: {
        contributions: contribAct?.number ?? null,
        rank,
        rankedTotal,
        topPercent: rank !== null && rankedTotal > 0 ? topPercent(rank, rankedTotal) : null,
      },
      metrics: {
        prs: toStat(prs),
        issues: toStat(issues),
        comments: toStat(comments),
        commits: toStat(commits),
      },
      site,
      title,
    },
  };
}
