import { describe, expect, it } from 'vitest';
import { DICTS } from './dict';
import { detectLang } from './lang';

describe('detectLang', () => {
  it('prefers the ?lang= param over everything', () => {
    expect(detectLang({ search: '?lang=en', stored: 'zh', navigatorLanguage: 'zh-TW' })).toBe('en');
    expect(detectLang({ search: '?user=hydai&lang=zh', stored: 'en', navigatorLanguage: 'en-US' })).toBe('zh');
  });

  it('accepts region-tagged params', () => {
    expect(detectLang({ search: '?lang=zh-TW', stored: null, navigatorLanguage: 'en-US' })).toBe('zh');
    expect(detectLang({ search: '?lang=en-GB', stored: 'zh', navigatorLanguage: 'zh-TW' })).toBe('en');
  });

  it('ignores invalid params and falls through to storage', () => {
    expect(detectLang({ search: '?lang=klingon', stored: 'en', navigatorLanguage: 'zh-TW' })).toBe('en');
  });

  it('uses the stored choice before navigator.language', () => {
    expect(detectLang({ search: '', stored: 'zh', navigatorLanguage: 'en-US' })).toBe('zh');
    expect(detectLang({ search: '', stored: 'garbage', navigatorLanguage: 'zh-TW' })).toBe('zh');
  });

  it('maps navigator.language: zh* -> zh, everything else -> en', () => {
    expect(detectLang({ search: '', stored: null, navigatorLanguage: 'zh-TW' })).toBe('zh');
    expect(detectLang({ search: '', stored: null, navigatorLanguage: 'zh' })).toBe('zh');
    expect(detectLang({ search: '', stored: null, navigatorLanguage: 'en-US' })).toBe('en');
    expect(detectLang({ search: '', stored: null, navigatorLanguage: 'ja' })).toBe('en');
    expect(detectLang({ search: '', stored: null, navigatorLanguage: '' })).toBe('en');
  });
});

describe('DICTS', () => {
  it('keeps loading lines index-aligned across languages', () => {
    expect(DICTS.zh.loadingLines.length).toBe(DICTS.en.loadingLines.length);
    expect(DICTS.zh.loadingLines.length).toBeGreaterThan(0);
  });
});
