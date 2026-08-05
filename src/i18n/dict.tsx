import type { ReactNode } from 'react';
import type { Lang } from './lang';

export interface Dict {
  htmlLang: string;
  docTitleHome: string;
  docTitleUser: (login: string) => string;
  brandAria: string;
  pageFoot: ReactNode;

  // home
  homeKicker: string;
  homeTag: ReactNode;
  homePlaceholder: string;
  homeSubmit: string;
  homeSample: string;
  homeNote: ReactNode;
  errEmpty: string;
  errInvalid: string;

  // card page chrome
  switchUser: string;

  // card
  cardRange: string;
  cardIdSub: string;
  heroRankLabel: string;
  heroUnrankedLabel: string;
  topChip: (pct: string) => string;
  lurkChip: string;
  rankedNote: (total: string) => [string, string];
  unrankedNote: [string, string];
  statYearly: string;
  statAllTime: string;
  statPrs: string;
  statIssues: string;
  titleLabel: string;
  footCta: string;

  // status screens
  loadingLines: string[];
  loadingFine: string;
  nfTitle: ReactNode;
  nfBody: (login: string) => ReactNode;
  nfFine: string;
  nfAction: string;
  errTitle: string;
  errBody: ReactNode;
  errRetry: string;
  errHome: string;

  // export
  exportDownload: string;
  exportCopy: string;
  exportShare: string;
  exportBusy: string;
  exportDoneDownload: string;
  exportDoneCopy: string;
  exportDoneShare: string;
  exportFailed: string;
  exportHint: string;
  shareText: (login: string) => string;

  // methodology note (below the card, outside the PNG export node)
  methodTitle: string;
  methodItems: Array<{ term: string; body: ReactNode }>;
}

const zh: Dict = {
  htmlLang: 'zh-Hant',
  docTitleHome: 'CNCF Wrapped — 雲原生年度迷因卡',
  docTitleUser: (login) => `${login} 的 CNCF Wrapped`,
  brandAria: '回首頁',
  pageFoot: (
    <>
      非官方粉絲專案 ・ 資料來自{' '}
      <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
        CNCF DevStats
      </a>
    </>
  ),

  homeKicker: '你的雲原生年度・迷因版',
  homeTag: (
    <>
      輸入 GitHub ID，把你這一年在 CNCF 的貢獻
      <br />
      做成一張可以炫耀（或自嘲）的迷因卡片。
    </>
  ),
  homePlaceholder: 'github-id（試試 hydai）',
  homeSubmit: '產生我的卡片 →',
  homeSample: '還沒想好？先看範例卡片 →',
  homeNote: (
    <>
      只計算 CNCF 專案的貢獻 ・ 資料來源{' '}
      <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
        devstats.cncf.io
      </a>
    </>
  ),
  errEmpty: '先輸入一個 GitHub ID 吧。',
  errInvalid: '這看起來不像 GitHub ID（只能有字母、數字和 -）。',

  switchUser: '換一個 GitHub ID →',

  cardRange: '過去 365 天',
  cardIdSub: '雲原生年度成績單',
  heroRankLabel: '年度排名',
  heroUnrankedLabel: '生涯總貢獻',
  topChip: (pct) => `TOP ${pct}`,
  lurkChip: '潛水中',
  rankedNote: (total) => [`在 ${total} 位`, '上榜貢獻者中'],
  unrankedNote: ['未達年度排行榜門檻', '默默耕耘型選手'],
  statYearly: '年度貢獻',
  statAllTime: '生涯總貢獻',
  statPrs: '生涯 PRs',
  statIssues: '生涯 Issues',
  titleLabel: '你的稱號',
  footCta: '產生你的卡片 →',

  loadingLines: [
    '正在翻你的 git 黑歷史…',
    '正在數你的 commit（有點多，稍等）…',
    '正在叫醒 DevStats…',
    '正在計算你榨乾了多少 CI 分鐘…',
    '正在跟 15,000 個 repo 對帳…',
  ],
  loadingFine: '資料來源：devstats.cncf.io（免費的公共服務，請溫柔對待）',
  nfTitle: (
    <>
      404
      <br />
      查無此人
    </>
  ),
  nfBody: (login) => (
    <>
      DevStats 翻遍了整個 CNCF，還是找不到 <strong>「{login}」</strong>。
      <br />
      可能是拼錯字，也可能你的雲原生之旅根本還沒開始。
    </>
  ),
  nfFine: '這裡只統計 CNCF 專案（Kubernetes、etcd、Envoy…）的貢獻，不是整個 GitHub。',
  nfAction: '換個 ID 再試 →',
  errTitle: 'DevStats 睡著了',
  errBody: (
    <>
      不是你的問題（大概）。
      <br />
      上游資料庫可能正在打盹，或是網路突然想休息。
    </>
  ),
  errRetry: '戳它一下（重試）',
  errHome: '回首頁',

  exportDownload: '⬇️ 下載 PNG',
  exportCopy: '📋 複製圖片',
  exportShare: '📤 分享',
  exportBusy: '產圖中…',
  exportDoneDownload: '已下載！貼到 X / Slack / Discord 炫耀吧 🎉',
  exportDoneCopy: '已複製到剪貼簿！直接 ⌘V 貼出去 🎉',
  exportDoneShare: '分享出去了 🎉',
  exportFailed: '匯出失敗了 😵 再試一次？',
  exportHint: '產生 PNG 後貼到 X / Slack / Discord，就是你的年度戰績。',
  shareText: (login) => `我的 CNCF Wrapped：@${login}`,

  methodTitle: 'ℹ️ 這些數字怎麼算',
  methodItems: [
    {
      term: '排名',
      body: '直接來自 CNCF DevStats 的 DevActCnt API（All CNCF ・ 過去一年 ・ Contributions）。排名由 DevStats 計算，本站原樣呈現、不加工。',
    },
    {
      term: '上榜貢獻者總數',
      body: '同一個 API 不指定 github_id 時回傳的排行榜長度。榜單有貢獻門檻、低於門檻不入榜，所以這個數字遠小於全站 contributors 總數。',
    },
    {
      term: 'TOP X%',
      body: '排名 ÷ 上榜總數 × 100，無條件進位到小數一位（寧可低估、不誇大）。語意是「上榜貢獻者中的前 X%」，不是全體 CNCF 貢獻者中的百分位。',
    },
    {
      term: '榜外使用者',
      body: '未達門檻就不顯示排名與百分比，只顯示貢獻數——默默耕耘也是貢獻。',
    },
    {
      term: '資料來源',
      body: (
        <>
          <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
            devstats.cncf.io
          </a>
          ，資料約每小時更新；本站另有 1 小時快取，所以你剛拿到的 merge 可能要晚一點才會入帳。
        </>
      ),
    },
  ],
};

const en: Dict = {
  htmlLang: 'en',
  docTitleHome: 'CNCF Wrapped — your cloud-native year, meme-ified',
  docTitleUser: (login) => `${login}'s CNCF Wrapped`,
  brandAria: 'Back to home',
  pageFoot: (
    <>
      Unofficial fan project · data from{' '}
      <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
        CNCF DevStats
      </a>
    </>
  ),

  homeKicker: 'YOUR CLOUD-NATIVE YEAR, MEME-IFIED',
  homeTag: (
    <>
      Type a GitHub ID and turn a year of CNCF contributions
      <br />
      into a card worth bragging (or crying) about.
    </>
  ),
  homePlaceholder: 'github-id (try hydai)',
  homeSubmit: 'Make my card →',
  homeSample: 'Not sure yet? See an example →',
  homeNote: (
    <>
      CNCF projects only · data from{' '}
      <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
        devstats.cncf.io
      </a>
    </>
  ),
  errEmpty: 'Type a GitHub ID first.',
  errInvalid: "That doesn't look like a GitHub ID (letters, digits and - only).",

  switchUser: 'Try another GitHub ID →',

  cardRange: 'LAST 365 DAYS',
  cardIdSub: 'CLOUD-NATIVE REPORT CARD',
  heroRankLabel: 'ANNUAL RANK',
  heroUnrankedLabel: 'ALL-TIME CONTRIBUTIONS',
  topChip: (pct) => `TOP ${pct}`,
  lurkChip: 'LURKING',
  rankedNote: (total) => [`of ${total}`, 'ranked contributors'],
  unrankedNote: ['below the leaderboard cutoff', 'grinding in silence'],
  statYearly: 'CONTRIBUTIONS · 1Y',
  statAllTime: 'CONTRIBUTIONS · ALL-TIME',
  statPrs: 'ALL-TIME PRS',
  statIssues: 'ALL-TIME ISSUES',
  titleLabel: 'YOUR TITLE',
  footCta: 'MAKE YOURS →',

  loadingLines: [
    'Digging through your git history (the embarrassing parts)…',
    'Counting your commits (there are… a lot)…',
    'Waking up DevStats…',
    'Calculating how many CI minutes you burned…',
    'Reconciling 15,000 repos…',
  ],
  loadingFine: 'data: devstats.cncf.io (a free public service — be gentle)',
  nfTitle: (
    <>
      404
      <br />
      NEVER HEARD OF 'EM
    </>
  ),
  nfBody: (login) => (
    <>
      DevStats searched every corner of the CNCF and found no trace of <strong>"{login}"</strong>.
      <br />
      Either that's a typo, or your cloud-native era hasn't started yet.
    </>
  ),
  nfFine: 'Only CNCF projects count here (Kubernetes, etcd, Envoy…) — not all of GitHub.',
  nfAction: 'Try another ID →',
  errTitle: 'DevStats fell asleep',
  errBody: (
    <>
      Probably not your fault.
      <br />
      The upstream database is napping, or the network took a break.
    </>
  ),
  errRetry: 'Poke it (retry)',
  errHome: 'Back home',

  exportDownload: '⬇️ Download PNG',
  exportCopy: '📋 Copy image',
  exportShare: '📤 Share',
  exportBusy: 'Rendering…',
  exportDoneDownload: 'Saved! Go show off on X / Slack / Discord 🎉',
  exportDoneCopy: 'Copied! Just ⌘V it anywhere 🎉',
  exportDoneShare: 'Shared 🎉',
  exportFailed: 'Export failed 😵 Try again?',
  exportHint: 'Export the PNG and drop it in X / Slack / Discord — instant flex.',
  shareText: (login) => `My CNCF Wrapped: @${login}`,

  methodTitle: 'ℹ️ How the numbers work',
  methodItems: [
    {
      term: 'Rank',
      body: 'Straight from the CNCF DevStats DevActCnt API (All CNCF · last year · Contributions). DevStats computes it; this site just displays it.',
    },
    {
      term: 'Ranked contributors',
      body: 'The number of rows the same API returns without a github_id. The leaderboard cuts off below a contribution threshold, so it is far smaller than the site-wide contributor count.',
    },
    {
      term: 'Top X%',
      body: 'rank ÷ ranked total × 100, rounded up to one decimal — we would rather undersell you than overstate. It is your percentile among ranked contributors, not among all CNCF contributors.',
    },
    {
      term: 'Unranked users',
      body: 'Below the cutoff there is no rank and no percentile — just contribution counts. Lurking is still contributing.',
    },
    {
      term: 'Data',
      body: (
        <>
          <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
            devstats.cncf.io
          </a>
          , refreshed roughly every hour; this site caches responses for another hour, so a fresh merge may take a moment to land.
        </>
      ),
    },
  ],
};

export const DICTS: Record<Lang, Dict> = { zh, en };
