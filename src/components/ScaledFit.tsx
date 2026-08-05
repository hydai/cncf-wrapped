import { useEffect, useState, type ReactNode } from 'react';

/**
 * Scales a fixed-design-width child down to fit its container, compensating
 * the wrapper height so the transform never leaves phantom space (works for
 * children whose natural height is content-driven).
 */
export function ScaledFit({ designWidth, children }: { designWidth: number; children: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [inner, setInner] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!container || !inner) return;
    const update = () => {
      const s = Math.min(1, container.clientWidth / designWidth);
      setScale(s);
      setHeight(inner.offsetHeight * s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [container, inner, designWidth]);

  return (
    <div ref={setContainer} style={{ width: '100%', position: 'relative', height }}>
      <div
        ref={setInner}
        style={{
          width: designWidth,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
