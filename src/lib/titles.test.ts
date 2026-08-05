import { describe, expect, it } from 'vitest';
import { computeTitle, type TitleInput } from './titles';

function input(partial: Partial<TitleInput>): TitleInput {
  return {
    metrics: {},
    career: { prs: 0, issues: 0 },
    contributionsRank: null,
    ...partial,
  };
}

describe('computeTitle', () => {
  it('crowns the metric with the highest count', () => {
    expect(
      computeTitle(input({ metrics: { prs: 700, issues: 100, comments: 500, commits: 93 } })),
    ).toEqual({ id: 'merge-machine', machine: false, basedOn: 'yearly-metrics' });

    expect(
      computeTitle(input({ metrics: { prs: 10, issues: 100, comments: 500, commits: 93 } })).id,
    ).toBe('keyboard-warrior');

    expect(
      computeTitle(input({ metrics: { prs: 10, issues: 700, comments: 500, commits: 93 } })).id,
    ).toBe('bug-whisperer');

    expect(
      computeTitle(input({ metrics: { prs: 10, issues: 100, comments: 500, commits: 930 } })).id,
    ).toBe('code-goblin');
  });

  it('breaks ties by priority: PRs > Commits > Issues > Comments', () => {
    expect(computeTitle(input({ metrics: { prs: 500, comments: 500 } })).id).toBe('merge-machine');
    expect(computeTitle(input({ metrics: { commits: 500, comments: 500 } })).id).toBe('code-goblin');
    expect(computeTitle(input({ metrics: { issues: 500, comments: 500 } })).id).toBe('bug-whisperer');
  });

  it('ignores missing and zero metrics', () => {
    expect(computeTitle(input({ metrics: { prs: null, issues: 0, comments: 3 } })).id).toBe('keyboard-warrior');
  });

  it('adds "The Machine" flair only for top-10 overall rank', () => {
    expect(computeTitle(input({ metrics: { prs: 1 }, contributionsRank: 10 })).machine).toBe(true);
    expect(computeTitle(input({ metrics: { prs: 1 }, contributionsRank: 1 })).machine).toBe(true);
    expect(computeTitle(input({ metrics: { prs: 1 }, contributionsRank: 11 })).machine).toBe(false);
    expect(computeTitle(input({ metrics: { prs: 1 } })).machine).toBe(false);
  });

  it('falls back to career PR/issue totals for unranked users', () => {
    expect(computeTitle(input({ career: { prs: 20, issues: 5 } }))).toEqual({
      id: 'merge-machine',
      machine: false,
      basedOn: 'career',
    });
    expect(computeTitle(input({ career: { prs: 2, issues: 5 } })).id).toBe('bug-whisperer');
    // Ties lean toward PRs.
    expect(computeTitle(input({ career: { prs: 5, issues: 5 } })).id).toBe('merge-machine');
  });

  it('defaults to code-goblin when nothing but raw contributions exist', () => {
    expect(computeTitle(input({}))).toEqual({ id: 'code-goblin', machine: false, basedOn: 'default' });
  });
});
