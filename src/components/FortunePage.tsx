import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchFortuneData, type FortuneData } from '../api/fortune';
import type { AppRoute } from '../hooks/useRoute';
import { useI18n } from '../i18n/context';
import { drawFortune, localDateStr, parseDateParam } from '../lib/fortune';
import { FORTUNE_WIDTH, FortuneCard } from './FortuneCard';
import { ExportBar } from './ExportBar';
import { LoadingScreen } from './StatusScreens';
import { ScaledFit } from './ScaledFit';

export function FortunePage({ login, onNavigate }: { login: string; onNavigate: (route: AppRoute) => void }) {
  const { t } = useI18n();
  const [data, setData] = useState<FortuneData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Easter egg: &date=YYYY-MM-DD shows a specific day (not advertised in the UI).
  const dateStr = useMemo(
    () => parseDateParam(new URLSearchParams(window.location.search).get('date')) ?? localDateStr(),
    [],
  );

  useEffect(() => {
    let alive = true;
    fetchFortuneData(login).then((d) => {
      if (alive) setData(d);
    });
    return () => {
      alive = false;
    };
  }, [login]);

  const fortune = useMemo(
    () => (data ? drawFortune(login, dateStr, data.commits?.number ?? 0) : null),
    [login, dateStr, data],
  );

  if (!data || !fortune) return <LoadingScreen login={login} />;

  return (
    <>
      <div className="fortune-stage">
        <ScaledFit designWidth={FORTUNE_WIDTH}>
          <FortuneCard cardRef={cardRef} fortune={fortune} data={data} />
        </ScaledFit>
      </div>

      <ExportBar
        getNode={() => cardRef.current}
        fileName={`cncf-fortune-${fortune.login}-${dateStr}.png`}
        shareText={t.fortuneShareText(fortune.login)}
      />

      <button className="card-switch" onClick={() => onNavigate({ view: 'card', login })}>
        {t.fortuneBackToCard}
      </button>
    </>
  );
}
