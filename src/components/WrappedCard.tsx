import type { WrappedData } from '../api/wrapped';
import { useI18n } from '../i18n/context';
import { formatNumber } from '../lib/format';
import { formatTopPercent } from '../lib/percentile';
import { TITLES } from '../lib/titles';
import './WrappedCard.css';

export const CARD_WIDTH = 480;
export const CARD_HEIGHT = 640;
export const SITE_HOST = 'hydai.github.io/cncf-wrapped';

function heroFontSize(text: string): number {
  if (text.length <= 5) return 88;
  if (text.length <= 7) return 70;
  if (text.length <= 9) return 56;
  return 44;
}

function loginFontSize(login: string): number {
  if (login.length <= 13) return 24;
  if (login.length <= 20) return 18;
  return 14;
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'lime' | 'blue' | 'pink' | 'orange' }) {
  return (
    <div className="wc-stat">
      <span className="wc-stat-label">{label}</span>
      <span className={`wc-stat-value wc-tone-${tone}`}>{value}</span>
    </div>
  );
}

export function WrappedCard({
  data,
  memeLine,
  cardRef,
}: {
  data: WrappedData;
  memeLine: string;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  const { lang, t } = useI18n();
  const { career, yearly, title } = data;
  const info = TITLES[title.id];
  const ranked = yearly.rank !== null;
  const hero = ranked ? `#${formatNumber(yearly.rank as number)}` : formatNumber(career.contributions);
  const heroNote = ranked ? t.rankedNote(formatNumber(yearly.rankedTotal)) : t.unrankedNote;
  // English titles stack word-per-line, Wrapped-poster style; Chinese stays on one line.
  const titleLines = lang === 'en' ? info.en.split(' ') : [info.zh];

  return (
    <div className={`wrap-card is-${lang}`} ref={cardRef}>
      <span className="wc-spark wc-spark-1">✦</span>
      <span className="wc-spark wc-spark-2">✦</span>
      <span className="wc-spark wc-spark-3">✦</span>
      <span className="wc-spark wc-spark-4">✧</span>

      <header className="wc-top">
        <span className="wc-brand">CNCF WRAPPED</span>
        <span className="wc-range">{t.cardRange}</span>
      </header>

      <div className="wc-id">
        {data.avatarDataUrl ? (
          <img className="wc-avatar" src={data.avatarDataUrl} alt="" />
        ) : (
          <span className="wc-avatar wc-avatar-fallback">{data.login.charAt(0).toUpperCase()}</span>
        )}
        <div className="wc-id-text">
          <span className="wc-login" style={{ fontSize: loginFontSize(data.login) }}>
            @{data.login}
          </span>
          <span className="wc-id-sub">{t.cardIdSub}</span>
        </div>
      </div>

      <div className="wc-hero">
        <div className="wc-hero-main">
          <span className="wc-hero-label">{ranked ? t.heroRankLabel : t.heroUnrankedLabel}</span>
          <span className="wc-hero-number" style={{ fontSize: heroFontSize(hero) }}>
            {hero}
          </span>
        </div>
        <div className="wc-hero-side">
          <span className={`wc-chip${ranked ? '' : ' wc-chip-ghost'}`}>
            {ranked ? t.topChip(formatTopPercent(yearly.topPercent as number)) : t.lurkChip}
          </span>
          <span className="wc-hero-note">
            {heroNote[0]}
            <br />
            {heroNote[1]}
          </span>
        </div>
      </div>

      <div className="wc-grid">
        <Stat
          label={t.statYearly}
          value={yearly.contributions !== null ? formatNumber(yearly.contributions) : '—'}
          tone="lime"
        />
        <Stat label={t.statAllTime} value={formatNumber(career.contributions)} tone="blue" />
        <Stat label={t.statPrs} value={formatNumber(career.prs)} tone="pink" />
        <Stat label={t.statIssues} value={formatNumber(career.issues)} tone="orange" />
      </div>

      <div className="wc-title">
        <span className="wc-title-label">{t.titleLabel}</span>
        <div className="wc-title-row">
          <span className="wc-title-emoji">{info.emoji}</span>
          <div className="wc-title-text">
            <span className="wc-title-en">
              {titleLines.map((line) => (
                <span key={line} className={`wc-title-word${lang === 'zh' ? ' wc-title-word-zh' : ''}`}>
                  {line}
                </span>
              ))}
            </span>
          </div>
          {title.machine && <span className="wc-machine">⚡ THE MACHINE</span>}
        </div>
        <p className="wc-quote">{memeLine}</p>
      </div>

      <footer className="wc-foot">
        <span className="wc-foot-url">{SITE_HOST}</span>
        <span className="wc-foot-cta">{t.footCta}</span>
      </footer>
    </div>
  );
}
