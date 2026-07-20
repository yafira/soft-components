'use client';

import { useRef, useState, useCallback } from 'react';

const COLS = 5;
const ROWS = 4;

export default function CapacitiveTouchMatrixDemo() {
  const [active, setActive] = useState<Set<number>>(new Set());
  const draggingRef = useRef(false);

  const touch = useCallback((i: number, on: boolean) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (on) next.add(i);
      else next.delete(i);
      return next;
    });
  }, []);

  const cellFromPoint = (x: number, y: number, gridEl: HTMLDivElement) => {
    const el = document.elementFromPoint(x, y);
    if (!el || !gridEl.contains(el)) return null;
    const idxAttr = (el as HTMLElement).closest('[data-idx]')?.getAttribute('data-idx');
    return idxAttr ? parseInt(idxAttr, 10) : null;
  };

  const gridRef = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    const idx = cellFromPoint(e.clientX, e.clientY, gridRef.current!);
    if (idx !== null) touch(idx, true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !gridRef.current) return;
    const idx = cellFromPoint(e.clientX, e.clientY, gridRef.current);
    if (idx !== null) touch(idx, true);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
    setActive(new Set());
  };

  return (
    <div className="matrix-demo">
      <div
        ref={gridRef}
        className="matrix-grid"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="group"
        aria-label="capacitive touch matrix, drag across pads"
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <button
            key={i}
            data-idx={i}
            className={`matrix-pad${active.has(i) ? ' matrix-pad--on' : ''}`}
            aria-pressed={active.has(i)}
            aria-label={`pad ${i + 1}`}
            onFocus={() => touch(i, true)}
            onBlur={() => touch(i, false)}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); touch(i, !active.has(i)); } }}
          />
        ))}
      </div>
      <p className="matrix-readout">{active.size} pad{active.size === 1 ? '' : 's'} touched</p>
      <p className="hint">drag across the pads — each one reports independently, like a real matrix scan</p>

      <style>{`
        .matrix-demo { text-align: center; }
        .matrix-grid {
          display: grid;
          grid-template-columns: repeat(${COLS}, 1fr);
          gap: 8px;
          max-width: 420px;
          margin: 0 auto;
          touch-action: none;
        }
        .matrix-pad {
          all: unset;
          aspect-ratio: 1;
          border-radius: 8px;
          background: var(--card);
          border: 1.5px solid var(--wisteria);
          cursor: pointer;
          transition: background-color 90ms ease, border-color 90ms ease, transform 90ms ease;
        }
        .matrix-pad:focus-visible { outline: 3px solid var(--wisteria-deep); outline-offset: 2px; }
        .matrix-pad--on {
          background: var(--wisteria-deep);
          border-color: var(--wisteria-deep);
          transform: scale(0.92);
        }
        .matrix-readout { font-family: var(--font-body); font-size: 0.95rem; color: var(--ink); margin-top: 1rem; margin-bottom: 0.2rem; }
        .hint { font-size: 0.78rem; color: var(--ink-soft); }
      `}</style>
    </div>
  );
}
