import { describe, expect, it } from 'vitest';
import { MEME_LINES, pickMemeLine } from './copy';
import { TITLES, type TitleId } from './titles';

const TITLE_IDS = Object.keys(TITLES) as TitleId[];

describe('MEME_LINES', () => {
  it('has a non-empty pool for every title', () => {
    for (const id of TITLE_IDS) {
      expect(MEME_LINES[id].length).toBeGreaterThan(0);
      for (const line of MEME_LINES[id]) expect(line.trim()).not.toBe('');
    }
  });
});

describe('pickMemeLine', () => {
  it('is deterministic for a given rand', () => {
    expect(pickMemeLine('merge-machine', () => 0)).toBe(MEME_LINES['merge-machine'][0]);
    const last = MEME_LINES['bug-whisperer'].length - 1;
    expect(pickMemeLine('bug-whisperer', () => 0.999999)).toBe(MEME_LINES['bug-whisperer'][last]);
  });

  it('never leaves the pool, even for rand() === 1', () => {
    for (const id of TITLE_IDS) {
      expect(MEME_LINES[id]).toContain(pickMemeLine(id, () => 1));
      expect(MEME_LINES[id]).toContain(pickMemeLine(id));
    }
  });
});
