import { useState } from 'react';

const LOADING_LINES = [
  '正在翻你的 git 黑歷史…',
  '正在數你的 commit（有點多，稍等）…',
  '正在叫醒 DevStats…',
  '正在計算你榨乾了多少 CI 分鐘…',
  '正在跟 15,000 個 repo 對帳…',
];

export function LoadingScreen({ login }: { login: string }) {
  const [line] = useState(() => LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]);
  return (
    <section className="status" aria-busy="true">
      <span className="status-emoji status-emoji-pulse" role="img" aria-label="loading">
        📡
      </span>
      <h2 className="status-title">
        <span className="status-title-accent">@{login}</span>
        <br />
        {line}
      </h2>
      <p className="status-fine">資料來源：devstats.cncf.io（免費的公共服務，請溫柔對待）</p>
    </section>
  );
}

export function NotFoundScreen({ login, onHome }: { login: string; onHome: () => void }) {
  return (
    <section className="status">
      <span className="status-emoji" role="img" aria-label="ghost">
        👻
      </span>
      <h2 className="status-title">
        404
        <br />
        查無此人
      </h2>
      <p className="status-text">
        DevStats 翻遍了整個 CNCF，還是找不到 <strong>「{login}」</strong>。
        <br />
        可能是拼錯字，也可能你的雲原生之旅根本還沒開始。
      </p>
      <p className="status-fine">這裡只統計 CNCF 專案（Kubernetes、etcd、Envoy…）的貢獻，不是整個 GitHub。</p>
      <div className="status-actions">
        <button className="btn" onClick={onHome}>
          換個 ID 再試 →
        </button>
      </div>
    </section>
  );
}

export function ErrorScreen({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  return (
    <section className="status">
      <span className="status-emoji" role="img" aria-label="sleeping">
        😴
      </span>
      <h2 className="status-title">DevStats 睡著了</h2>
      <p className="status-text">
        不是你的問題（大概）。
        <br />
        上游資料庫可能正在打盹，或是網路突然想休息。
      </p>
      <div className="status-actions">
        <button className="btn" onClick={onRetry}>
          戳它一下（重試）
        </button>
        <button className="btn btn-ghost" onClick={onHome}>
          回首頁
        </button>
      </div>
    </section>
  );
}
