export type Lang = 'zh' | 'en';

export const LANG_STORAGE_KEY = 'cncf-wrapped:lang';

function normalize(value: string | null | undefined): Lang | null {
  const v = value?.trim().toLowerCase();
  if (!v) return null;
  if (v === 'zh' || v.startsWith('zh-')) return 'zh';
  if (v === 'en' || v.startsWith('en-')) return 'en';
  return null;
}

export function readStoredLang(): string | null {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // best-effort
  }
}

export interface DetectSources {
  search?: string;
  stored?: string | null;
  navigatorLanguage?: string;
}

/**
 * Language resolution order: ?lang= param (share links) > stored choice >
 * navigator.language (zh* -> zh, anything else -> en).
 */
export function detectLang(sources: DetectSources = {}): Lang {
  const search = sources.search ?? (typeof window === 'undefined' ? '' : window.location.search);
  const fromParam = normalize(new URLSearchParams(search).get('lang'));
  if (fromParam) return fromParam;

  const stored = sources.stored !== undefined ? sources.stored : readStoredLang();
  const fromStored = normalize(stored);
  if (fromStored) return fromStored;

  const nav = sources.navigatorLanguage ?? (typeof navigator === 'undefined' ? '' : navigator.language);
  return normalize(nav) ?? 'en';
}
