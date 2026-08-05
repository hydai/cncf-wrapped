import { useState, type FormEvent } from 'react';
import { normalizeLogin } from '../api/devstats';

const LOGIN_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/i;

export function HomePage({ onSubmit }: { onSubmit: (login: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const login = normalizeLogin(value);
    if (!login) {
      setError('先輸入一個 GitHub ID 吧。');
      return;
    }
    if (login.length > 39 || !LOGIN_RE.test(login)) {
      setError('這看起來不像 GitHub ID（只能有字母、數字和 -）。');
      return;
    }
    onSubmit(login);
  };

  return (
    <main className="home">
      <div className="home-hero">
        <span className="home-kicker">YOUR CLOUD-NATIVE YEAR, MEME-IFIED</span>
        <h1 className="home-logo">
          <span className="home-logo-outline">CNCF</span>
          <span className="home-logo-solid">WRAPPED</span>
        </h1>
        <p className="home-tag">
          輸入 GitHub ID，把你這一年在 CNCF 的貢獻
          <br />
          做成一張可以炫耀（或自嘲）的迷因卡片。
        </p>
      </div>

      <form className="home-form" onSubmit={submit}>
        <label className="home-input-wrap">
          <span className="home-at">@</span>
          <input
            className="home-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder="github-id（試試 hydai）"
            maxLength={40}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="GitHub ID"
          />
        </label>
        <button className="btn" type="submit">
          產生我的卡片 →
        </button>
        {error && <p className="home-error">{error}</p>}
      </form>

      <button className="home-sample" onClick={() => onSubmit('hydai')}>
        還沒想好？先看範例卡片 →
      </button>

      <p className="home-note">
        只計算 CNCF 專案的貢獻 ・ 資料來源{' '}
        <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
          devstats.cncf.io
        </a>
      </p>
    </main>
  );
}
