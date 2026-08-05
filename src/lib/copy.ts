import type { Lang } from '../i18n/lang';
import type { TitleId } from './titles';

/**
 * zh/en pairs per line: index N is the same joke in both languages, so
 * switching language mid-session shows the translation, not a re-roll.
 */
export interface MemeLine {
  zh: string;
  en: string;
}

export const MEME_LINES: Record<TitleId, MemeLine[]> = {
  'merge-machine': [
    { zh: '你的 PR 比我的人生規劃還多。', en: "You've opened more PRs than most people open tabs." },
    { zh: 'CI 還沒跑完，你的下一個 PR 已經開好了。', en: "CI hasn't finished and your next PR is already up." },
    { zh: 'Maintainer 看到你的名字，手就自動移向 Approve。', en: 'Maintainers see your name and the cursor drifts toward Approve.' },
    { zh: 'Rebase、squash、merge——你的一天比 Git 還忙。', en: 'Rebase, squash, merge — you out-throughput the pipeline.' },
  ],
  'keyboard-warrior': [
    { zh: '這串討論 87 樓，其中 42 樓是你。', en: 'That 87-comment thread? 42 of them are you.' },
    { zh: '別人留 +1，你留三個段落外加參考連結。', en: 'Others drop a +1. You drop three paragraphs and a bibliography.' },
    { zh: '你的 code review 比原本的 PR 還長。', en: 'Your reviews are longer than the PRs they review.' },
    { zh: 'Resolve conversation？不，你只 start conversation。', en: 'Resolve conversation? You only start conversations.' },
  ],
  'bug-whisperer': [
    { zh: '你不找 bug，bug 自己來找你。', en: "You don't hunt bugs. Bugs come to confess." },
    { zh: 'Steps to reproduce：1. 你出現。', en: 'Steps to reproduce: 1. You show up.' },
    { zh: 'Maintainer 最怕收到你的 issue——因為都是真的。', en: "Maintainers fear your issues — because they're always real." },
    { zh: '你開的 issue 數，比某些專案的 star 還多。', en: "You've filed more issues than some projects have stars." },
  ],
  'code-goblin': [
    { zh: '凌晨三點的 commit，都是你的。', en: "Every 3 AM commit? Yeah, that's you." },
    { zh: 'git blame 挖到最後，都是你。', en: "Run git blame long enough and it's just your name." },
    { zh: '一天不 push，渾身不對勁。', en: 'A day without a push just feels wrong.' },
    { zh: 'main branch 不是保護分支，是你家。', en: "main isn't a protected branch. It's your living room." },
  ],
};

/** Picks a meme line index for a title. Pass a custom `rand` for deterministic output. */
export function pickMemeLineIndex(id: TitleId, rand: () => number = Math.random): number {
  const pool = MEME_LINES[id];
  return Math.min(pool.length - 1, Math.max(0, Math.floor(rand() * pool.length)));
}

/** Resolves a picked index to the line in the requested language (index clamped). */
export function getMemeLine(id: TitleId, index: number, lang: Lang): string {
  const pool = MEME_LINES[id];
  return pool[Math.min(pool.length - 1, Math.max(0, index))][lang];
}
