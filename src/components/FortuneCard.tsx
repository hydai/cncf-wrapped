import '@fontsource/noto-serif-tc/700.css'
import '@fontsource/noto-serif-tc/900.css'
import { Fragment } from 'react';
import type { FortuneData } from '../api/fortune';
import { useI18n } from '../i18n/context';
import { formatNumber } from '../lib/format';
import { sexagenaryYear, type FortuneResult } from '../lib/fortune';
import { CMDS, EMOJIS, JI_POOL, LEVELS, POEMS, YI_POOL } from '../lib/fortuneContent';
import './FortuneCard.css';

export const FORTUNE_WIDTH = 430;

/** Renders text so line breaks only ever happen at spaces, never inside a token. */
function NoBreakTokens({ text }: { text: string }) {
  const tokens = text.split(' ');
  return (
    <>
      {tokens.map((token, i) => (
        <Fragment key={i}>
          <span className="fc-token">{token}</span>
          {i < tokens.length - 1 && ' '}
        </Fragment>
      ))}
    </>
  );
}

function gradeFontSize(text: string, isEn: boolean): number {
  if (isEn) return text.length > 12 ? 21 : 26;
  return text.length <= 2 ? 40 : 30;
}

export function FortuneCard({
  fortune,
  data,
  cardRef,
}: {
  fortune: FortuneResult;
  data: FortuneData;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  const { lang, t } = useI18n();
  const level = LEVELS[fortune.levelIndex];
  const poem = POEMS[fortune.levelIndex][fortune.poemIndex][lang];
  const grade = level[lang];
  const { cmd, note } = CMDS[fortune.cmdIndex];
  const year = Number(fortune.dateStr.slice(0, 4));
  const dateDisplay = lang === 'zh' ? fortune.dateStr.replaceAll('-', '／') : fortune.dateStr;

  const { career, commits, contributions } = data;
  const hasCareer = career !== null && career.contributions > 0;
  const basis = hasCareer
    ? commits && contributions
      ? t.fortuneBasisFull(
          fortune.login,
          formatNumber(career.contributions),
          formatNumber(commits.number),
          formatNumber(contributions.rank),
        )
      : t.fortuneBasisCareer(fortune.login, formatNumber(career.contributions))
    : t.fortuneBasisAnon(fortune.login);

  return (
    <div className={`fortune-card is-${lang}`} ref={cardRef}>
      <div className="fc-head">
        <div className="fc-title">{t.fortuneTitle}</div>
        <div className="fc-date">
          {dateDisplay}
          <br />
          <NoBreakTokens text={t.fortuneAlmanac(sexagenaryYear(year))} />
        </div>
      </div>

      <div className="fc-who">
        {data.avatarDataUrl ? (
          <img className="fc-avatar" src={data.avatarDataUrl} alt="" />
        ) : (
          <span className="fc-avatar fc-avatar-fallback">{fortune.login.charAt(0).toUpperCase()}</span>
        )}
        <div>
          <div className="fc-name">{fortune.login}</div>
          <div className="fc-sub">
            {commits ? t.fortuneGuardian(formatNumber(commits.number), commits.rank ? formatNumber(commits.rank) : null) : t.fortuneGuardianFallback}
          </div>
        </div>
      </div>

      <div className="fc-level">
        <div className={`fc-grade${lang === 'en' ? ' fc-grade-en' : ''}`} style={{ fontSize: gradeFontSize(grade, lang === 'en') }}>
          {grade}
        </div>
        <div className="fc-stars">{'★'.repeat(fortune.stars) + '☆'.repeat(5 - fortune.stars)}</div>
      </div>

      <div className="fc-poem">
        {poem.map((line, i) => (
          <Fragment key={i}>
            {line}
            {i < poem.length - 1 && <br />}
          </Fragment>
        ))}
      </div>

      <div className="fc-yi-ji">
        <div className="fc-col fc-yi">
          <h3>{t.fortuneDo}</h3>
          <ul>
            {fortune.yiIndexes.map((i) => (
              <li key={i}>{YI_POOL[i][lang]}</li>
            ))}
          </ul>
        </div>
        <div className="fc-col fc-ji">
          <h3>{t.fortuneDont}</h3>
          <ul>
            {fortune.jiIndexes.map((i) => (
              <li key={i}>{JI_POOL[i][lang]}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fc-lucky">
        <div className="fc-lk">
          <div className="fc-lk-k">{t.fortuneLuckyCmd}</div>
          <div className="fc-lk-v fc-lk-cmd">
            <NoBreakTokens text={cmd} />
          </div>
          <div className="fc-lk-n">{note[lang]}</div>
        </div>
        <div className="fc-lk">
          <div className="fc-lk-k">{t.fortuneLuckyHour}</div>
          <div className="fc-lk-v">{String(fortune.luckyHour).padStart(2, '0')}:00</div>
          <div className="fc-lk-n">{t.fortuneLuckyHourNote}</div>
        </div>
        <div className="fc-lk">
          <div className="fc-lk-k">{t.fortuneLuckyEmoji}</div>
          <div className="fc-lk-v fc-lk-emoji">{EMOJIS[fortune.emojiIndex]}</div>
          <div className="fc-lk-n">{t.fortuneLuckyEmojiNote}</div>
        </div>
      </div>

      <div className="fc-basis">{basis}</div>
      <div className="fc-seal">
        開源
        <br />
        大吉
      </div>

      <div className="fc-brand">{t.fortuneBrand}</div>
      <div className="fc-hint">{t.fortuneHint}</div>
    </div>
  );
}
