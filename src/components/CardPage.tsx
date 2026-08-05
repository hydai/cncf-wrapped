import { useMemo, useRef } from 'react';
import { useFitScale } from '../hooks/useFitScale';
import { useWrapped } from '../hooks/useWrapped';
import { useI18n } from '../i18n/context';
import { getMemeLine, pickMemeLineIndex } from '../lib/copy';
import { CARD_WIDTH, WrappedCard } from './WrappedCard';
import { ExportBar } from './ExportBar';
import { MethodologyNote } from './MethodologyNote';
import { ErrorScreen, LoadingScreen, NotFoundScreen } from './StatusScreens';

export function CardPage({ login, onNavigate }: { login: string; onNavigate: (login: string | null) => void }) {
  const { lang, t } = useI18n();
  const { state, retry } = useWrapped(login);
  const { ref, scale } = useFitScale(CARD_WIDTH);
  const cardRef = useRef<HTMLDivElement>(null);

  // Pick the joke once per load; language switches translate it instead of re-rolling.
  const memeIndex = useMemo(
    () => (state.phase === 'ok' ? pickMemeLineIndex(state.data.title.id) : 0),
    [state],
  );
  const memeLine = state.phase === 'ok' ? getMemeLine(state.data.title.id, memeIndex, lang) : '';

  return (
    <>
      {state.phase === 'loading' && <LoadingScreen login={login} />}
      {state.phase === 'not-found' && <NotFoundScreen login={state.login} onHome={() => onNavigate(null)} />}
      {state.phase === 'error' && <ErrorScreen onRetry={retry} onHome={() => onNavigate(null)} />}

      {state.phase === 'ok' && (
        <div className="card-stage">
          <div className="card-scaler" ref={ref}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <WrappedCard cardRef={cardRef} data={state.data} memeLine={memeLine} />
            </div>
          </div>
        </div>
      )}

      {state.phase === 'ok' && (
        <>
          <ExportBar getNode={() => cardRef.current} login={state.data.login} />
          <MethodologyNote />
          <button className="card-switch" onClick={() => onNavigate(null)}>
            {t.switchUser}
          </button>
        </>
      )}
    </>
  );
}
