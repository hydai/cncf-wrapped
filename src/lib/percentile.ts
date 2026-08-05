/**
 * "Top X%" for a leaderboard position, rounded UP to one decimal so we never
 * overstate how elite someone is. Example: rank 119 of 1874 -> 6.4.
 */
export function topPercent(rank: number, total: number): number {
  if (!Number.isFinite(rank) || !Number.isFinite(total) || rank <= 0 || total <= 0) return 100;
  const pct = (rank / total) * 100;
  // The 1e-9 nudge keeps float noise from bumping exact values (10% -> 10.1%).
  const rounded = Math.ceil(pct * 10 - 1e-9) / 10;
  return Math.min(100, Math.max(0.1, rounded));
}

export function formatTopPercent(p: number): string {
  return `${Number.isInteger(p) ? String(p) : p.toFixed(1)}%`;
}
