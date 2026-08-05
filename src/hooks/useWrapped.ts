import { useCallback, useEffect, useState } from 'react';
import { fetchWrapped, type WrappedData } from '../api/wrapped';

export type WrappedState =
  | { phase: 'loading' }
  | { phase: 'ok'; data: WrappedData }
  | { phase: 'not-found'; login: string }
  | { phase: 'error'; message: string };

export function useWrapped(login: string) {
  const [state, setState] = useState<WrappedState>({ phase: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ phase: 'loading' });
    fetchWrapped(login)
      .then((res) => {
        if (!alive) return;
        setState(res.status === 'ok' ? { phase: 'ok', data: res.data } : { phase: 'not-found', login: res.login });
      })
      .catch((err: unknown) => {
        if (alive) setState({ phase: 'error', message: err instanceof Error ? err.message : String(err) });
      });
    return () => {
      alive = false;
    };
  }, [login, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { state, retry };
}
