import type { Lang } from '../i18n/lang';

/**
 * Fortune content pools. Everything is stored as zh/en pairs (or shared
 * values), so a picked index means the same item in both languages —
 * switching language re-renders copy but never re-rolls the draw.
 */

export interface FortuneLevel {
  zh: string;
  en: string;
  stars: number;
  /** Weighted draw percentage; all weights sum to 100. */
  weight: number;
}

export const LEVELS: FortuneLevel[] = [
  { zh: '大吉', en: 'GREAT FORTUNE', stars: 5, weight: 14 },
  { zh: '中吉', en: 'GOOD FORTUNE', stars: 4, weight: 26 },
  { zh: '小吉', en: 'SMALL FORTUNE', stars: 3, weight: 30 },
  { zh: '平', en: 'MEH', stars: 2, weight: 20 },
  { zh: '凶（可逆）', en: 'CURSED (REVERTIBLE)', stars: 1, weight: 10 },
];

export interface FortunePoem {
  zh: string[];
  en: string[];
}

/** At least two poems per level; index-aligned across languages. */
export const POEMS: FortunePoem[][] = [
  // 大吉
  [
    {
      zh: ['綠燈千盞一路開，', 'CI 未跑心先知。', '今日 merge 無人擋，', 'main 上花開遍地枝。'],
      en: ['A thousand green lights pave your way,', 'CI approves before it runs.', 'No soul shall block your merge today —', 'main blossoms with a thousand suns.'],
    },
    {
      zh: ['晨起一 push 天下應，', 'reviewer 秒回皆 LGTM。', '宜趁天時開大 PR，', '萬行 diff 也無人 NIT。'],
      en: ['One morning push, the world replies,', 'reviewers chant their LGTMs.', 'Today even a ten-k diff', 'sails through with zero nits from them.'],
    },
  ],
  // 中吉
  [
    {
      zh: ['雲開霧散 conflict 少，', 'rebase 一次即通關。', '貴人出沒 code review，', '一句建議勝十年。'],
      en: ['Clouds part, the conflicts fade away,', 'one rebase and you glide on through.', 'A kindly reviewer crosses your path —', 'one comment worth a year or two.'],
    },
    {
      zh: ['風平浪靜 pipeline 穩，', '測試全綠不用重跑。', '把握午後黃金檔，', '小改小 merge 積福報。'],
      en: ['Calm seas — the pipeline hums along,', 'all tests go green on the first try.', 'Ship small merges after lunch;', 'good karma starts to multiply.'],
    },
  ],
  // 小吉
  [
    {
      zh: ['小雨綿綿 flaky test，', '重跑三次自然過。', '心平氣和寫 commit，', '訊息清楚福自來。'],
      en: ['A drizzle of flaky tests today,', 'rerun them thrice — they pass, they do.', 'Write your commits with a peaceful mind;', 'clear messages bring luck to you.'],
    },
    {
      zh: ['晨有小霧 lint 報警，', '格式修好運自開。', '宜做小事勿貪大，', '一日三 commit 剛剛好。'],
      en: ['Morning fog — the linter whines;', 'fix the format, fortune wakes.', 'Keep it small, resist the greed:', 'three commits a day is all it takes.'],
    },
  ],
  // 平
  [
    {
      zh: ['不宜大動干戈日，', 'refactor 且慢行。', '讀 code 品茶皆修行，', '觀星不如觀 issue。'],
      en: ['No grand crusades are starred today;', 'let that refactor rest a while.', 'Reading code and sipping tea', 'is also progress — call it style.'],
    },
    {
      zh: ['今日平平無大事，', '宜寫文件補測試。', '默默耕耘無人見，', '年終 Wrapped 見真章。'],
      en: ['A quiet day, no drama due —', 'write docs, backfill a test or two.', 'Nobody sees the grind today;', 'year-end Wrapped will make it pay.'],
    },
  ],
  // 凶（可逆）
  [
    {
      zh: ['烏雲罩頂 CI 紅，', 'force push 必遭殃。', '逢凶化吉有一法：', '關機睡覺明日再戰。'],
      en: ['Dark clouds gather, CI burns red,', 'a force-push summons deep despair.', 'One proven ritual lifts the curse:', 'shut down, sleep, respawn elsewhere.'],
    },
    {
      zh: ['水逆行至 production，', '今日部署大不宜。', '若有 hotfix 不得不，', '先拜 rollback 再動手。'],
      en: ['Mercury retrogrades through prod —', 'no deploy shall be blessed today.', 'If a hotfix truly cannot wait,', 'first bow to rollback, then obey.'],
    },
  ],
];

export interface BilingualLine {
  zh: string;
  en: string;
}

/** Auspicious actions (宜) — index-aligned zh/en. */
export const YI_POOL: BilingualLine[] = [
  { zh: '開小而美的 PR', en: 'Open a small, beautiful PR' },
  { zh: '秒回別人的 review', en: 'Reply to reviews instantly' },
  { zh: '補上拖欠的測試', en: 'Backfill the tests you owe' },
  { zh: '整理 issue 標籤', en: 'Tidy up issue labels' },
  { zh: '寫 commit message 寫出感情', en: 'Write commit messages with feeling' },
  { zh: '幫新人指路', en: 'Guide a newcomer home' },
  { zh: '更新過期文件', en: 'Refresh the stale docs' },
  { zh: '給喜歡的專案點 star', en: 'Star a project you love' },
  { zh: '感謝別人的貢獻', en: "Credit someone else's work" },
  { zh: '擦亮 README', en: 'Polish the README' },
];

/** Inauspicious actions (忌) — index-aligned zh/en. */
export const JI_POOL: BilingualLine[] = [
  { zh: '週五下午部署', en: 'Deploying on Friday afternoon' },
  { zh: 'force push 到 main', en: 'Force-pushing to main' },
  { zh: '開 3000 行的 PR', en: 'Opening a 3,000-line PR' },
  { zh: '在 issue 裡吵架', en: 'Arguing in the issues' },
  { zh: 'rebase 到一半去開會', en: 'Abandoning a rebase for a meeting' },
  { zh: '跳過 code review', en: 'Skipping code review' },
  { zh: '用 --no-verify', en: 'Reaching for --no-verify' },
  { zh: '刪除看不懂的舊 code', en: "Deleting old code you don't understand" },
  { zh: '熬夜改 CSS', en: 'Fixing CSS at 3 AM' },
  { zh: '相信「我只改一行」', en: 'Believing "it\'s a one-line change"' },
];

export interface LuckyCommand {
  cmd: string;
  note: BilingualLine;
}

export const CMDS: LuckyCommand[] = [
  { cmd: 'git rebase', note: { zh: '線性歷史，心情舒暢', en: 'linear history, inner peace' } },
  { cmd: 'git cherry-pick', note: { zh: '摘最甜的那顆', en: 'pick the sweetest one' } },
  { cmd: 'git stash', note: { zh: '先放著，是一種智慧', en: 'setting it aside is wisdom' } },
  { cmd: 'git bisect', note: { zh: '抓鬼神器', en: 'the ghost hunter' } },
  { cmd: 'git blame', note: { zh: '看看是誰（是你）', en: "find the culprit (it's you)" } },
  { cmd: 'git log --oneline', note: { zh: '一目瞭然', en: 'clarity at a glance' } },
  { cmd: 'git commit --amend', note: { zh: '完美主義者之友', en: "a perfectionist's best friend" } },
];

/** Language-neutral. */
export const EMOJIS = ['🚀', '✨', '🐛', '🔥', '🎉', '🙏', '💪', '🍀', '⚡', '🧹'];

export function levelName(index: number, lang: Lang): string {
  return LEVELS[index][lang];
}
