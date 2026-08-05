import { describe, expect, it } from 'vitest';
import { formatTopPercent, topPercent } from './percentile';

describe('topPercent', () => {
  it('matches the verified hydai example: rank 119 of 1874 -> 6.4', () => {
    expect(topPercent(119, 1874)).toBe(6.4);
  });

  it('rounds up so the percentile is never overstated', () => {
    expect(topPercent(1, 1874)).toBe(0.1);
    expect(topPercent(2, 1874)).toBe(0.2);
  });

  it('keeps exact percentages exact despite float noise', () => {
    expect(topPercent(100, 1000)).toBe(10);
    expect(topPercent(937, 1874)).toBe(50);
  });

  it('caps at 100 and floors at 0.1', () => {
    expect(topPercent(1874, 1874)).toBe(100);
    expect(topPercent(1, 100000)).toBe(0.1);
  });

  it('returns 100 for degenerate input', () => {
    expect(topPercent(0, 1874)).toBe(100);
    expect(topPercent(5, 0)).toBe(100);
    expect(topPercent(Number.NaN, 10)).toBe(100);
  });
});

describe('formatTopPercent', () => {
  it('keeps one decimal for fractional values', () => {
    expect(formatTopPercent(6.4)).toBe('6.4%');
  });

  it('drops the decimal for integers', () => {
    expect(formatTopPercent(50)).toBe('50%');
  });
});
