import { describe, expect, it } from 'vitest';
import { MEME_LINES, getMemeLine, pickMemeLineIndex } from './copy';
import { TITLES, type TitleId } from './titles';

const TITLE_IDS = Object.keys(TITLES) as TitleId[];

describe('MEME_LINES', () => {
  it('has a non-empty pool with both languages for every title', () => {
    for (const id of TITLE_IDS) {
      expect(MEME_LINES[id].length).toBeGreaterThan(0);
      for (const line of MEME_LINES[id]) {
        expect(line.zh.trim()).not.toBe('');
        expect(line.en.trim()).not.toBe('');
      }
    }
  });
});

describe('pickMemeLineIndex', () => {
  it('is deterministic for a given rand', () => {
    expect(pickMemeLineIndex('merge-machine', () => 0)).toBe(0);
    expect(pickMemeLineIndex('bug-whisperer', () => 0.999999)).toBe(MEME_LINES['bug-whisperer'].length - 1);
  });

  it('never leaves the pool, even for rand() === 1', () => {
    for (const id of TITLE_IDS) {
      const idx = pickMemeLineIndex(id, () => 1);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(MEME_LINES[id].length);
      const random = pickMemeLineIndex(id);
      expect(random).toBeGreaterThanOrEqual(0);
      expect(random).toBeLessThan(MEME_LINES[id].length);
    }
  });
});

describe('getMemeLine', () => {
  it('returns the same joke in both languages for one index', () => {
    for (const id of TITLE_IDS) {
      MEME_LINES[id].forEach((line, i) => {
        expect(getMemeLine(id, i, 'zh')).toBe(line.zh);
        expect(getMemeLine(id, i, 'en')).toBe(line.en);
      });
    }
  });

  it('clamps out-of-range indexes', () => {
    const pool = MEME_LINES['code-goblin'];
    expect(getMemeLine('code-goblin', 999, 'en')).toBe(pool[pool.length - 1].en);
    expect(getMemeLine('code-goblin', -5, 'zh')).toBe(pool[0].zh);
  });
});
