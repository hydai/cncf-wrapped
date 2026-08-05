# CNCF Wrapped 🎁

**你的雲原生年度迷因卡** — 輸入 GitHub ID，把你在 CNCF 專案的貢獻做成一張
Spotify Wrapped 風格的卡片，一鍵下載 / 複製 PNG，貼到 X、Slack、Discord 炫耀（或自嘲）。

**Live: <https://hydai.github.io/cncf-wrapped/>**

| 首頁 | 卡片（PNG 匯出） |
| --- | --- |
| ![首頁](docs/home.png) | ![hydai 的卡片](docs/card-hydai.png) |

## 卡片內容

- 頭像 + GitHub ID
- 年度排名 `#N` + `TOP X%` 徽章（榜外使用者只顯示貢獻數）
- 年度貢獻數、生涯總貢獻（含 PRs / Issues 細項）
- 迷因稱號：由年度各 metric 中數量最高者決定
  - PRs →「Merge Machine 合併機器」
  - Comments →「Keyboard Warrior 鍵盤俠」
  - Issues →「Bug Whisperer 蟲語者」
  - Commits →「Code Goblin 程式碼地精」
  - 年度排名進 Top 10 再加掛 **⚡ THE MACHINE**
- 每個稱號一個迷因文案池，隨機抽一句

## 資料來源

所有資料來自 [CNCF DevStats](https://devstats.cncf.io) 的公開 API
（`POST https://devstats.cncf.io/api/v1`，CORS 開放，瀏覽器直打）：

| 用途 | API |
| --- | --- |
| 生涯總貢獻 | `GithubIDContributions` |
| 年度排名 / 各 metric 數量 | `DevActCnt`（project=all, range=Last year） |
| 百分位分母（榜上人數） | `DevActCnt`（`github_id: ""` 取全榜） |
| 全站數字 | `SiteStats` |

回應會以 localStorage 快取 1 小時。排行榜有門檻截斷，榜外使用者顯示生涯貢獻、
不顯示排名與百分位（百分位一律標註 *of ranked contributors*）。

## 技術

- Vite + React + TypeScript 純靜態 SPA（GitHub Pages，無後端）
- 卡片路由用 `?user=<github-id>` query param，Pages 子路徑友善
- PNG 由瀏覽器端 [html-to-image](https://github.com/bubkoo/html-to-image) 產生：
  下載 / Clipboard API 複製 / Web Share API（行動裝置）
- 頭像經 `fetch → blob → dataURL` 載入，避免 canvas taint
- 字型：Unbounded + Noto Sans TC（fontsource 自架，匯出 PNG 不跑版）

## 開發

```bash
npm install
npm run dev        # http://localhost:5173/cncf-wrapped/
npm test           # vitest（fetch 全部 mock，不打真實 API）
npm run build      # tsc + vite build → dist/
```

## 部署

Push 到 `master` 會觸發 GitHub Actions（`.github/workflows/deploy.yml`）：
build → 上傳 artifact → 部署到 GitHub Pages。

---

非官方粉絲專案，與 CNCF 無關。資料版權屬於各原始專案與 CNCF DevStats。
