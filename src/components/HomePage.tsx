import { useState, type FormEvent } from 'react';
import { normalizeLogin } from '../api/devstats';
import { useI18n } from '../i18n/context';

const LOGIN_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/i;

export function HomePage({
  onSubmit,
  onFortune,
}: {
  onSubmit: (login: string) => void;
  onFortune: (login: string) => void;
}) {
  const { t } = useI18n();
  const [value, setValue] = useState('');
  const [errorKind, setErrorKind] = useState<'empty' | 'invalid' | null>(null);

  const validate = (): string | null => {
    const login = normalizeLogin(value);
    if (!login) {
      setErrorKind('empty');
      return null;
    }
    if (login.length > 39 || !LOGIN_RE.test(login)) {
      setErrorKind('invalid');
      return null;
    }
    return login;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const login = validate();
    if (login) onSubmit(login);
  };

  const drawFortune = () => {
    const login = validate();
    if (login) onFortune(login);
  };

  return (
    <main className="home">
      <div className="home-hero">
        <span className="home-kicker">{t.homeKicker}</span>
        <h1 className="home-logo">
          <span className="home-logo-outline">CNCF</span>
          <span className="home-logo-solid">WRAPPED</span>
        </h1>
        <p className="home-tag">{t.homeTag}</p>
      </div>

      <form className="home-form" onSubmit={submit}>
        <label className="home-input-wrap">
          <span className="home-at">@</span>
          <input
            className="home-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setErrorKind(null);
            }}
            placeholder={t.homePlaceholder}
            maxLength={40}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="GitHub ID"
          />
        </label>
        <button className="btn" type="submit">
          {t.homeSubmit}
        </button>
        <button className="btn btn-ghost" type="button" onClick={drawFortune}>
          {t.fortuneEntry}
        </button>
        {errorKind && <p className="home-error">{errorKind === 'empty' ? t.errEmpty : t.errInvalid}</p>}
      </form>

      <button className="home-sample" onClick={() => onSubmit('hydai')}>
        {t.homeSample}
      </button>
    </main>
  );
}
