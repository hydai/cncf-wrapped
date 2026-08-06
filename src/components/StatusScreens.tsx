import { useState } from 'react';
import { useI18n } from '../i18n/context';

export function LoadingScreen({ login }: { login: string }) {
  const { t } = useI18n();
  // Stable seed: switching language shows the same line's translation.
  const [seed] = useState(() => Math.random());
  const line = t.loadingLines[Math.floor(seed * t.loadingLines.length)];

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
      <p className="status-fine">{t.loadingFine}</p>
    </section>
  );
}

export function NotFoundScreen({ login, onHome }: { login: string; onHome: () => void }) {
  const { t } = useI18n();
  return (
    <section className="status">
      <span className="status-emoji" role="img" aria-label="seedling">
        🌱
      </span>
      <h2 className="status-title">{t.nfTitle}</h2>
      <p className="status-text">{t.nfBody(login)}</p>
      <p className="status-fine">{t.nfFine}</p>
      <div className="status-actions">
        <button className="btn" onClick={onHome}>
          {t.nfAction}
        </button>
      </div>

      <div className="nf-join">
        <h3 className="nf-join-title">{t.nfJoinTitle}</h3>
        <ul className="nf-join-list">
          {t.nfJoinItems.map(({ href, label, desc }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
              <span> — {desc}</span>
            </li>
          ))}
        </ul>
        <p className="nf-comeback">{t.nfComeback}</p>
      </div>
    </section>
  );
}

export function ErrorScreen({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  const { t } = useI18n();
  return (
    <section className="status">
      <span className="status-emoji" role="img" aria-label="sleeping">
        😴
      </span>
      <h2 className="status-title">{t.errTitle}</h2>
      <p className="status-text">{t.errBody}</p>
      <div className="status-actions">
        <button className="btn" onClick={onRetry}>
          {t.errRetry}
        </button>
        <button className="btn btn-ghost" onClick={onHome}>
          {t.errHome}
        </button>
      </div>
    </section>
  );
}
