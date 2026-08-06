# CNCF Wrapped 🎁

English | [繁體中文](README.zh-TW.md)

[![Deploy](https://github.com/hydai/cncf-wrapped/actions/workflows/deploy.yml/badge.svg)](https://github.com/hydai/cncf-wrapped/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

**Your cloud-native year, meme-ified.** Type a GitHub ID and turn a year of
CNCF contributions into a Spotify-Wrapped-style card — then download or copy
the PNG and flex on X, Slack, or Discord.

**Live: <https://hydai.github.io/cncf-wrapped/>**

| Home | Card (PNG export) |
| --- | --- |
| ![Home](docs/home.png) | ![hydai's card](docs/card-hydai.png) |

## What's on the card

- Avatar + GitHub ID
- Annual rank `#N` + `TOP X%` badge (below-threshold users see contribution
  counts only)
- Yearly contributions and all-time totals (with PRs / issues breakdown)
- A meme title decided by your highest yearly activity metric:
  - PRs → **Merge Machine**
  - Comments → **Comment Maestro**
  - Issues → **Bug Whisperer**
  - Commits → **Code Goblin**
  - a top-10 overall rank additionally earns **⚡ THE MACHINE**
- One meme line per title, drawn from a bilingual pool
- Full zh-TW / English UI toggle (`?lang=zh|en` works in share links)

## Daily dev fortune 🎋

A temple-lottery-style side dish at `?fortune=<github-id>` (buttons on the
home page and under every card): draw your **dev fortune of the day** —
fortune level (大吉 → CURSED (REVERTIBLE)), a geeky fortune poem, DO / DON'T
lists, a lucky git command, a lucky hour seasoned with your real yearly
commit count, and a lucky emoji.

- **Deterministic**: seed = hash(login + local date), so the same dev on the
  same day always draws the same fortune — in both languages. Compare with
  friends; come back tomorrow for a new one.
- **Real data as blessing material**: the card is "consecrated" with your
  actual DevStats numbers (career contributions, yearly commits, rank), with
  a playful fallback for unknown/unranked users.
- Exports to PNG like the main card. For entertainment only — the data is
  real, the fortune is not.

## Data source & how the numbers work

Everything comes from the public [CNCF DevStats](https://devstats.cncf.io)
API (`POST https://devstats.cncf.io/api/v1`, CORS-open, called straight from
the browser):

| Purpose | API |
| --- | --- |
| All-time totals | `GithubIDContributions` |
| Annual rank / per-metric counts | `DevActCnt` (project=all, range=Last year) |
| Percentile denominator (ranked total) | `DevActCnt` with `github_id: ""` |
| Site-wide stats | `SiteStats` |

- **Rank** is computed by DevStats; this site displays it as-is.
- **"Contributions"** counts seven GitHub event types (pushes, PRs, issues,
  PR reviews and three kinds of comments) — one push counts once no matter
  how many commits it carries, so yearly Commits can exceed yearly
  Contributions. Bot accounts are excluded upstream.
- **Ranked total** is the leaderboard length — DevStats cuts the board off
  below a contribution threshold (a dynamic formula scaling with project
  size and time range, computed upstream), so it is far smaller than the
  site-wide contributor count.
- **Top X%** = rank ÷ ranked total × 100, rounded *up* to one decimal. It is
  a percentile among **ranked** contributors, not all CNCF contributors.
- Unranked users get contribution counts only — no rank, no percentile.
- DevStats refreshes roughly hourly; the site caches responses in
  localStorage for another hour.
- Fully auditable: the ranking SQL lives in
  [cncf/devstats](https://github.com/cncf/devstats/blob/master/metrics/shared/project_developer_stats.sql),
  and this site's code is open source too.

The same explanation ships in the ℹ️ “How the numbers work” section under
every card.

## Tech

- Vite + React + TypeScript, fully static SPA on GitHub Pages (no backend)
- `?user=<github-id>` query-param routing — friendly to Pages subpaths
- zh-TW / English via a typed dictionary + `useContext` (no i18n framework);
  resolution order: `?lang=` param > localStorage > `navigator.language`
- PNG generated in the browser with
  [html-to-image](https://github.com/bubkoo/html-to-image): download /
  Clipboard API copy / Web Share API (mobile)
- Avatars loaded `fetch → blob → dataURL` so the export canvas never taints
- Unbounded + Noto Sans TC self-hosted via Fontsource, so exports look the
  same everywhere

## Quick start

Requires Node.js 22+.

```bash
npm install
npm run dev        # http://localhost:5173/cncf-wrapped/
npm test           # vitest (fetch fully mocked — never hits the real API)
npm run build      # tsc + vite build → dist/
```

## Deployment

Pushing to `master` triggers GitHub Actions
(`.github/workflows/deploy.yml`): test → build → deploy to GitHub Pages.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). New meme lines and title ideas are
especially welcome.

## License

[Apache-2.0](LICENSE). Unofficial fan project, not affiliated with the CNCF.
Data belongs to the upstream projects and CNCF DevStats.
