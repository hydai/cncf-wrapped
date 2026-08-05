import { useCallback, useEffect, useState } from 'react';

function readUser(): string | null {
  return new URLSearchParams(window.location.search).get('user');
}

/**
 * ?user=<github-id> is the whole "router" — query params survive GitHub Pages
 * subpath hosting without any 404 hacks.
 */
export function useUserParam() {
  const [user, setUser] = useState<string | null>(readUser);

  useEffect(() => {
    const onPop = () => setUser(readUser());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((login: string | null) => {
    const url = new URL(window.location.href);
    if (login) url.searchParams.set('user', login);
    else url.searchParams.delete('user');
    window.history.pushState({}, '', url);
    setUser(login);
    window.scrollTo(0, 0);
  }, []);

  return { user, navigate };
}
