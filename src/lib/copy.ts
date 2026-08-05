import type { TitleId } from './titles';

export const MEME_LINES: Record<TitleId, string[]> = {
  'merge-machine': [
    '你的 PR 比我的人生規劃還多。',
    'CI 還沒跑完，你的下一個 PR 已經開好了。',
    'Maintainer 看到你的名字，手就自動移向 Approve。',
    'Rebase、squash、merge——你的一天比 Git 還忙。',
  ],
  'keyboard-warrior': [
    '這串討論 87 樓，其中 42 樓是你。',
    '別人留 +1，你留三個段落外加參考連結。',
    '你的 code review 比原本的 PR 還長。',
    'Resolve conversation？不，你只 start conversation。',
  ],
  'bug-whisperer': [
    '你不找 bug，bug 自己來找你。',
    'Steps to reproduce：1. 你出現。',
    'Maintainer 最怕收到你的 issue——因為都是真的。',
    '你開的 issue 數，比某些專案的 star 還多。',
  ],
  'code-goblin': [
    '凌晨三點的 commit，都是你的。',
    'git blame 挖到最後，都是你。',
    '一天不 push，渾身不對勁。',
    'main branch 不是保護分支，是你家。',
  ],
};

/** Picks one meme line for a title. Pass a custom `rand` for deterministic output. */
export function pickMemeLine(id: TitleId, rand: () => number = Math.random): string {
  const pool = MEME_LINES[id];
  const idx = Math.min(pool.length - 1, Math.max(0, Math.floor(rand() * pool.length)));
  return pool[idx];
}
