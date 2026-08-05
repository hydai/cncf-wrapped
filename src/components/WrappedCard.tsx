import type { WrappedData } from '../api/wrapped';
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

export function WrappedCard({ data, memeLine }: { data: WrappedData; memeLine: string }) {
  const { career, yearly, title } = data;
  const info = TITLES[title.id];
  const ranked = yearly.rank !== null;
  const hero = ranked ? `#${formatNumber(yearly.rank as number)}` : formatNumber(career.contributions);

  return (
    <div className="wrap-card">
      <span className="wc-spark wc-spark-1">✦</span>
      <span className="wc-spark wc-spark-2">✦</span>
      <span className="wc-spark wc-spark-3">✦</span>
      <span className="wc-spark wc-spark-4">✧</span>

      <header className="wc-top">
        <span className="wc-brand">CNCF WRAPPED</span>
        <span className="wc-range">LAST 365 DAYS</span>
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
          <span className="wc-id-sub">雲原生年度成績單</span>
        </div>
      </div>

      <div className="wc-hero">
        <div className="wc-hero-main">
          <span className="wc-hero-label">{ranked ? '年度排名 · ANNUAL RANK' : '生涯總貢獻 · ALL-TIME'}</span>
          <span className="wc-hero-number" style={{ fontSize: heroFontSize(hero) }}>
            {hero}
          </span>
        </div>
        <div className="wc-hero-side">
          {ranked ? (
            <>
              <span className="wc-chip">TOP {formatTopPercent(yearly.topPercent as number)}</span>
              <span className="wc-hero-note">
                of {formatNumber(yearly.rankedTotal)}
                <br />
                ranked contributors
              </span>
            </>
          ) : (
            <>
              <span className="wc-chip wc-chip-ghost">潛水中</span>
              <span className="wc-hero-note">
                未達年度排行榜門檻
                <br />
                默默耕耘型選手
              </span>
            </>
          )}
        </div>
      </div>

      <div className="wc-grid">
        <Stat
          label="年度貢獻 · 1Y"
          value={yearly.contributions !== null ? formatNumber(yearly.contributions) : '—'}
          tone="lime"
        />
        <Stat label="生涯貢獻 · ALL-TIME" value={formatNumber(career.contributions)} tone="blue" />
        <Stat label="生涯 PULL REQUESTS" value={formatNumber(career.prs)} tone="pink" />
        <Stat label="生涯 ISSUES" value={formatNumber(career.issues)} tone="orange" />
      </div>

      <div className="wc-title">
        <span className="wc-title-label">你的稱號 · YOUR TITLE</span>
        <div className="wc-title-row">
          <span className="wc-title-emoji">{info.emoji}</span>
          <div className="wc-title-text">
            <span className="wc-title-en">
              {info.en.split(' ').map((word) => (
                <span key={word} className="wc-title-word">
                  {word}
                </span>
              ))}
            </span>
            <span className="wc-title-zh">「{info.zh}」</span>
          </div>
          {title.machine && <span className="wc-machine">⚡ THE MACHINE</span>}
        </div>
        <p className="wc-quote">{memeLine}</p>
      </div>

      <footer className="wc-foot">
        <span className="wc-foot-url">{SITE_HOST}</span>
        <span className="wc-foot-cta">產生你的卡片 →</span>
      </footer>
    </div>
  );
}
