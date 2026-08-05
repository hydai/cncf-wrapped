import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DICTS, type Dict } from './dict';
import { detectLang, persistLang, type Lang } from './lang';

interface I18n {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18n | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectLang());

  useEffect(() => {
    document.documentElement.lang = DICTS[lang].htmlLang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    persistLang(next);
    // Keep the URL shareable in the chosen language; replace to avoid history spam.
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    window.history.replaceState({}, '', url);
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: DICTS[lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>');
  return ctx;
}
