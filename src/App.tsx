import { useEffect } from 'react';
import { CardPage } from './components/CardPage';
import { HomePage } from './components/HomePage';
import { useUserParam } from './hooks/useUserParam';
import { useI18n } from './i18n/context';
import type { Lang } from './i18n/lang';

const LANG_OPTIONS: Array<{ value: Lang; label: string }> = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'EN' },
];

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-toggle" role="group" aria-label="Language / 語言">
      {LANG_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          className={value === lang ? 'active' : undefined}
          aria-pressed={value === lang}
          onClick={() => setLang(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const { user, navigate } = useUserParam();
  const { t } = useI18n();

  useEffect(() => {
    document.title = user ? t.docTitleUser(user) : t.docTitleHome;
  }, [user, t]);

  return (
    <div className="page">
      <header className="page-top">
        <button className="page-brand" onClick={() => navigate(null)} aria-label={t.brandAria}>
          CNCF WRAPPED
        </button>
        <LangToggle />
      </header>

      {user ? <CardPage key={user} login={user} onNavigate={navigate} /> : <HomePage onSubmit={navigate} />}

      <footer className="page-foot">{t.pageFoot}</footer>
    </div>
  );
}
