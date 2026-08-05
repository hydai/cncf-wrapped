import { useCallback, useEffect, useState } from 'react';

export type AppRoute = { view: 'home' } | { view: 'card'; login: string } | { view: 'fortune'; login: string };

function readRoute(): AppRoute {
  const params = new URLSearchParams(window.location.search);
  const fortune = params.get('fortune');
  if (fortune) return { view: 'fortune', login: fortune };
  const user = params.get('user');
  if (user) return { view: 'card', login: user };
  return { view: 'home' };
}

/**
 * Query params are the whole "router" — ?user= for the wrapped card,
 * ?fortune= for the daily fortune. Survives GitHub Pages subpath hosting
 * without 404 hacks; ?lang= (and the &date= easter egg) ride along.
 */
export function useRoute() {
  const [route, setRoute] = useState<AppRoute>(readRoute);

  useEffect(() => {
    const onPop = () => setRoute(readRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((next: AppRoute) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('user');
    url.searchParams.delete('fortune');
    url.searchParams.delete('date'); // fortune easter egg never leaks across views
    if (next.view === 'card') url.searchParams.set('user', next.login);
    if (next.view === 'fortune') url.searchParams.set('fortune', next.login);
    window.history.pushState({}, '', url);
    setRoute(next);
    window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
}
