import { useMemo, useRef } from 'react';
import { useWrapped } from '../hooks/useWrapped';
import { useFitScale } from '../hooks/useFitScale';
import { pickMemeLine } from '../lib/copy';
import { CARD_WIDTH, WrappedCard } from './WrappedCard';
import { ExportBar } from './ExportBar';
import { ErrorScreen, LoadingScreen, NotFoundScreen } from './StatusScreens';

export function CardPage({ login, onNavigate }: { login: string; onNavigate: (login: string | null) => void }) {
  const { state, retry } = useWrapped(login);
  const { ref, scale } = useFitScale(CARD_WIDTH);
  const cardRef = useRef<HTMLDivElement>(null);

  const memeLine = useMemo(
    () => (state.phase === 'ok' ? pickMemeLine(state.data.title.id) : ''),
    [state],
  );

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
          <button className="card-switch" onClick={() => onNavigate(null)}>
            換一個 GitHub ID →
          </button>
        </>
      )}
    </>
  );
}
