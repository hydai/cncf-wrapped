import { describe, expect, it } from 'vitest';
import { djb2, drawFortune, levelIndexFor, localDateStr, parseDateParam, sexagenaryYear } from './fortune';
import { CMDS, EMOJIS, JI_POOL, LEVELS, POEMS, YI_POOL } from './fortuneContent';

describe('drawFortune determinism', () => {
  it('same login + same date -> identical result', () => {
    const a = drawFortune('hydai', '2026-08-06', 1808);
    const b = drawFortune('hydai', '2026-08-06', 1808);
    expect(a).toEqual(b);
  });

  it('is case- and whitespace-insensitive on the login (language-independent seed)', () => {
    expect(drawFortune(' @HydAI ', '2026-08-06', 1808)).toEqual(drawFortune('hydai', '2026-08-06', 1808));
  });

  it('different dates produce different draws', () => {
    const seen = new Set<string>();
    for (let d = 1; d <= 30; d++) {
      const day = String(d).padStart(2, '0');
      const f = drawFortune('hydai', `2026-09-${day}`, 1808);
      seen.add(JSON.stringify([f.levelIndex, f.poemIndex, f.yiIndexes, f.jiIndexes, f.cmdIndex, f.emojiIndex]));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('commit count only flavours the lucky hour, never the draw', () => {
    const rich = drawFortune('hydai', '2026-08-06', 1808);
    const poor = drawFortune('hydai', '2026-08-06', 0);
    expect({ ...rich, luckyHour: 0 }).toEqual({ ...poor, luckyHour: 0 });
  });

  it('stays within pool bounds and picks unique do/dont items', () => {
    for (let d = 1; d <= 28; d++) {
      const f = drawFortune('someone', `2026-02-${String(d).padStart(2, '0')}`, 42);
      expect(f.levelIndex).toBeGreaterThanOrEqual(0);
      expect(f.levelIndex).toBeLessThan(LEVELS.length);
      expect(f.poemIndex).toBeLessThan(POEMS[f.levelIndex].length);
      expect(f.cmdIndex).toBeLessThan(CMDS.length);
      expect(f.emojiIndex).toBeLessThan(EMOJIS.length);
      expect(f.luckyHour).toBeGreaterThanOrEqual(0);
      expect(f.luckyHour).toBeLessThan(24);
      expect(new Set(f.yiIndexes).size).toBe(3);
      expect(new Set(f.jiIndexes).size).toBe(3);
      for (const i of f.yiIndexes) expect(i).toBeLessThan(YI_POOL.length);
      for (const i of f.jiIndexes) expect(i).toBeLessThan(JI_POOL.length);
    }
  });

  it('works with zero data (unknown / unranked users still get a fortune)', () => {
    const f = drawFortune('zz-no-such-user', '2026-08-06', 0);
    expect(f.stars).toBe(LEVELS[f.levelIndex].stars);
  });
});

describe('level weighting', () => {
  it('weights sum to 100', () => {
    expect(LEVELS.reduce((s, l) => s + l.weight, 0)).toBe(100);
  });

  it('maps cumulative boundaries correctly (14/26/30/20/10)', () => {
    expect(levelIndexFor(0)).toBe(0);
    expect(levelIndexFor(13.999)).toBe(0);
    expect(levelIndexFor(14)).toBe(1);
    expect(levelIndexFor(39.999)).toBe(1);
    expect(levelIndexFor(40)).toBe(2);
    expect(levelIndexFor(69.999)).toBe(2);
    expect(levelIndexFor(70)).toBe(3);
    expect(levelIndexFor(89.999)).toBe(3);
    expect(levelIndexFor(90)).toBe(4);
    expect(levelIndexFor(99.999)).toBe(4);
  });
});

describe('content pools', () => {
  it('has at least two index-aligned bilingual poems per level', () => {
    expect(POEMS.length).toBe(LEVELS.length);
    for (const poems of POEMS) {
      expect(poems.length).toBeGreaterThanOrEqual(2);
      for (const poem of poems) {
        expect(poem.zh.length).toBeGreaterThan(0);
        expect(poem.zh.length).toBe(poem.en.length);
        for (const line of [...poem.zh, ...poem.en]) expect(line.trim()).not.toBe('');
      }
    }
  });

  it('has 10+ aligned do/dont entries and non-empty commands', () => {
    expect(YI_POOL.length).toBeGreaterThanOrEqual(10);
    expect(JI_POOL.length).toBeGreaterThanOrEqual(10);
    for (const item of [...YI_POOL, ...JI_POOL]) {
      expect(item.zh.trim()).not.toBe('');
      expect(item.en.trim()).not.toBe('');
    }
    for (const { cmd, note } of CMDS) {
      expect(cmd.startsWith('git')).toBe(true);
      expect(note.zh.trim()).not.toBe('');
      expect(note.en.trim()).not.toBe('');
    }
    expect(EMOJIS.length).toBeGreaterThanOrEqual(10);
  });

  it('levels carry bilingual names', () => {
    for (const l of LEVELS) {
      expect(l.zh.trim()).not.toBe('');
      expect(l.en.trim()).not.toBe('');
    }
  });
});

describe('date helpers', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(localDateStr(new Date(2026, 7, 6, 23, 59))).toBe('2026-08-06');
    expect(localDateStr(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
  });

  it('accepts only sane YYYY-MM-DD easter-egg params', () => {
    expect(parseDateParam('2026-08-06')).toBe('2026-08-06');
    expect(parseDateParam(' 2026-12-31 ')).toBe('2026-12-31');
    expect(parseDateParam('2026-13-01')).toBeNull();
    expect(parseDateParam('2026-00-10')).toBeNull();
    expect(parseDateParam('2026-01-32')).toBeNull();
    expect(parseDateParam('yesterday')).toBeNull();
    expect(parseDateParam(null)).toBeNull();
  });

  it('computes the sexagenary year (2026 = 丙午)', () => {
    expect(sexagenaryYear(2026)).toBe('丙午');
    expect(sexagenaryYear(1984)).toBe('甲子');
  });
});

describe('djb2', () => {
  it('is stable', () => {
    expect(djb2('hydai|2026-08-06')).toBe(djb2('hydai|2026-08-06'));
    expect(djb2('a')).not.toBe(djb2('b'));
  });
});
