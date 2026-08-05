import {
  fetchCareerContributions,
  fetchDevAct,
  type CareerContributions,
  type DevActEntry,
} from './devstats';
import { loadAvatarDataUrl } from './wrapped';

export interface FortuneData {
  career: CareerContributions | null;
  /** Yearly Commits entry — seasons the lucky hour and the blessing line. */
  commits: DevActEntry | null;
  /** Yearly Contributions entry — provides the rank in the blessing line. */
  contributions: DevActEntry | null;
  avatarDataUrl: string | null;
}

async function optional<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

/**
 * Real data used purely as "blessing material". Every call is optional and
 * reuses the wrapped client + localStorage cache — unknown, unranked or
 * offline users still get a fortune, just with a humbler blessing line.
 */
export async function fetchFortuneData(login: string): Promise<FortuneData> {
  const [career, commits, contributions, avatarDataUrl] = await Promise.all([
    optional(fetchCareerContributions(login)),
    optional(fetchDevAct('Commits', login)),
    optional(fetchDevAct('Contributions', login)),
    optional(loadAvatarDataUrl(login)),
  ]);
  return { career, commits, contributions, avatarDataUrl };
}
