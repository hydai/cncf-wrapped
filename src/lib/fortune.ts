import { CMDS, EMOJIS, JI_POOL, LEVELS, POEMS, YI_POOL } from './fortuneContent';

/**
 * Deterministic daily fortune engine.
 *
 * seed = djb2(lowercase(login) + '|' + YYYY-MM-DD): same dev + same local
 * day = same draw, in every language (all picks are indexes into
 * index-aligned bilingual pools). Real data (yearly commits) only flavours
 * the lucky hour; it never affects which fortune is drawn.
 */

export function djb2(str: string): number {
  let h = 5381;
  for (const c of str) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  return h;
}

/** Tiny LCG PRNG over a 32-bit state; returns floats in [0, 1). */
export function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 4294967296;
  };
}

/** Maps a roll in [0, 100) onto the weighted level table. */
export function levelIndexFor(roll: number): number {
  let acc = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    acc += LEVELS[i].weight;
    if (roll < acc) return i;
  }
  return LEVELS.length - 1;
}

/** YYYY-MM-DD in the user's local time zone (not UTC). */
export function localDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Validates the &date=YYYY-MM-DD easter-egg param; returns null if bogus. */
export function parseDateParam(value: string | null): string | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return m[0];
}

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** Sexagenary (干支) name of a Gregorian year, e.g. 2026 -> 丙午. */
export function sexagenaryYear(year: number): string {
  const n = year - 4;
  return STEMS[((n % 10) + 10) % 10] + BRANCHES[((n % 12) + 12) % 12];
}

export interface FortuneResult {
  login: string;
  dateStr: string;
  levelIndex: number;
  stars: number;
  poemIndex: number;
  yiIndexes: number[];
  jiIndexes: number[];
  cmdIndex: number;
  emojiIndex: number;
  luckyHour: number;
}

/** Draws n unique indexes out of [0, size), consuming one rng call per pick. */
function pickIndexes(size: number, n: number, r: () => number): number[] {
  const candidates = Array.from({ length: size }, (_, i) => i);
  const out: number[] = [];
  while (out.length < n && candidates.length > 0) {
    out.push(candidates.splice(Math.floor(r() * candidates.length), 1)[0]);
  }
  return out;
}

export function drawFortune(rawLogin: string, dateStr: string, commits: number): FortuneResult {
  const login = rawLogin.trim().replace(/^@/, '').toLowerCase();
  const r = lcg(djb2(`${login}|${dateStr}`));

  const levelIndex = levelIndexFor(r() * 100);
  const poemIndex = Math.floor(r() * POEMS[levelIndex].length);
  const yiIndexes = pickIndexes(YI_POOL.length, 3, r);
  const jiIndexes = pickIndexes(JI_POOL.length, 3, r);
  const cmdIndex = Math.floor(r() * CMDS.length);
  // Lucky hour is seasoned with real cultivation (yearly commit count).
  const luckyHour = (djb2(login) + Math.max(0, Math.floor(commits)) + Math.floor(r() * 4)) % 24;
  const emojiIndex = Math.floor(r() * EMOJIS.length);

  return {
    login,
    dateStr,
    levelIndex,
    stars: LEVELS[levelIndex].stars,
    poemIndex,
    yiIndexes,
    jiIndexes,
    cmdIndex,
    emojiIndex,
    luckyHour,
  };
}
