import { useEffect, useState } from 'react';

/**
 * Scale factor that fits a fixed-width design inside its (possibly narrower)
 * container. Uses a callback ref so it also works when the observed element
 * mounts later (e.g. after a loading state).
 */
export function useFitScale(designWidth: number) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / designWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el, designWidth]);

  return { ref: setEl, scale };
}
