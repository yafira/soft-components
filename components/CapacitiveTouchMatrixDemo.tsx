'use client';

import { useRef, useState, useCallback } from 'react';
import styles from './CapacitiveTouchMatrixDemo.module.css';

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
    <div className={styles.demo}>
      <div
        ref={gridRef}
        className={styles.grid}
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
            className={`${styles.pad}${active.has(i) ? ` ${styles.padOn}` : ''}`}
            aria-pressed={active.has(i)}
            aria-label={`pad ${i + 1}`}
            onFocus={() => touch(i, true)}
            onBlur={() => touch(i, false)}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); touch(i, !active.has(i)); } }}
          />
        ))}
      </div>
      <p className={styles.readout}>{active.size} Pad{active.size === 1 ? '' : 's'} touched</p>
      <p className={styles.hint}>Drag across the pads — each one reports independently, like a real matrix scan</p>
    </div>
  );
}
