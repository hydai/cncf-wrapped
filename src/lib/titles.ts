export type TitleId = 'merge-machine' | 'keyboard-warrior' | 'bug-whisperer' | 'code-goblin';

export interface TitleInfo {
  id: TitleId;
  en: string;
  zh: string;
  emoji: string;
}

export const TITLES: Record<TitleId, TitleInfo> = {
  'merge-machine': { id: 'merge-machine', en: 'Merge Machine', zh: '合併機器', emoji: '🔀' },
  'keyboard-warrior': { id: 'keyboard-warrior', en: 'Keyboard Warrior', zh: '鍵盤俠', emoji: '⌨️' },
  'bug-whisperer': { id: 'bug-whisperer', en: 'Bug Whisperer', zh: '蟲語者', emoji: '🐛' },
  'code-goblin': { id: 'code-goblin', en: 'Code Goblin', zh: '程式碼地精', emoji: '👺' },
};

export interface MetricCounts {
  prs?: number | null;
  issues?: number | null;
  comments?: number | null;
  commits?: number | null;
}

/** Highest count wins the title; ties break in this order. */
const METRIC_PRIORITY: Array<{ key: keyof MetricCounts; title: TitleId }> = [
  { key: 'prs', title: 'merge-machine' },
  { key: 'commits', title: 'code-goblin' },
  { key: 'issues', title: 'bug-whisperer' },
  { key: 'comments', title: 'keyboard-warrior' },
];

export interface TitleResult {
  id: TitleId;
  /** Top-10 overall contributions rank earns "The Machine" flair. */
  machine: boolean;
  basedOn: 'yearly-metrics' | 'career' | 'default';
}

export interface TitleInput {
  /** Last-year per-metric counts (null/undefined when below the leaderboard threshold). */
  metrics: MetricCounts;
  /** Career totals, used as fallback when no yearly metric data exists. */
  career: { prs: number; issues: number };
  /** Overall "Contributions" rank for the last year, null when unranked. */
  contributionsRank: number | null;
}

export function computeTitle({ metrics, career, contributionsRank }: TitleInput): TitleResult {
  const machine = contributionsRank !== null && contributionsRank <= 10;

  let best: { title: TitleId; count: number } | null = null;
  for (const { key, title } of METRIC_PRIORITY) {
    const count = metrics[key];
    if (typeof count === 'number' && count > 0 && (best === null || count > best.count)) {
      best = { title, count };
    }
  }
  if (best) return { id: best.title, machine, basedOn: 'yearly-metrics' };

  // Below the leaderboard threshold: fall back to career PR/issue totals.
  if (career.prs > 0 || career.issues > 0) {
    return {
      id: career.prs >= career.issues ? 'merge-machine' : 'bug-whisperer',
      machine,
      basedOn: 'career',
    };
  }

  // Contributions exist but no PRs/issues on record: committing in the shadows.
  return { id: 'code-goblin', machine, basedOn: 'default' };
}
