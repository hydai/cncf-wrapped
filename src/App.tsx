import { useEffect } from 'react';
import { CardPage } from './components/CardPage';
import { FortunePage } from './components/FortunePage';
import { HomePage } from './components/HomePage';
import { useRoute } from './hooks/useRoute';
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
  const { route, navigate } = useRoute();
  const { t } = useI18n();

  useEffect(() => {
    document.title =
      route.view === 'card'
        ? t.docTitleUser(route.login)
        : route.view === 'fortune'
          ? t.docTitleFortune(route.login)
          : t.docTitleHome;
  }, [route, t]);

  return (
    <div className="page">
      <header className="page-top">
        <button className="page-brand" onClick={() => navigate({ view: 'home' })} aria-label={t.brandAria}>
          CNCF WRAPPED
        </button>
        <LangToggle />
      </header>

      {route.view === 'home' && (
        <HomePage
          onSubmit={(login) => navigate({ view: 'card', login })}
          onFortune={(login) => navigate({ view: 'fortune', login })}
        />
      )}
      {route.view === 'card' && <CardPage key={route.login} login={route.login} onNavigate={navigate} />}
      {route.view === 'fortune' && <FortunePage key={route.login} login={route.login} onNavigate={navigate} />}

      <footer className="page-foot">{t.pageFoot}</footer>
    </div>
  );
}
