'use client';

import { useRef, useState, useCallback } from 'react';
import { animate } from 'motion';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './FeltButtonDemo.module.css';

export default function FeltButtonDemo() {
  const faceRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const downRef = useRef(false);

  const [stiffness, setStiffness] = useState(140);
  const [damping, setDamping] = useState(14);
  const [depth, setDepth] = useState(0.22);
  const [presses, setPresses] = useState(0);

  const ratio = damping / (2 * Math.sqrt(stiffness));
  const character =
    ratio >= 1.05 ? 'overdamped — slow and syrupy'
    : ratio >= 0.92 ? 'critically damped — firm, no bounce'
    : ratio >= 0.6 ? 'underdamped — a little bounce'
    : 'very bouncy — more rubber than felt';

  const press = useCallback(() => {
    if (downRef.current || !faceRef.current) return;
    downRef.current = true;
    const reduced = prefersReducedMotion();
    animate(
      faceRef.current,
      { scaleY: 1 - depth, scaleX: 1 + depth * 0.6 },
      { type: 'spring', stiffness: stiffness * 0.85, damping: damping * 1.35, duration: reduced ? 0 : undefined }
    );
  }, [stiffness, damping, depth]);

  const release = useCallback(() => {
    if (!downRef.current || !faceRef.current) return;
    downRef.current = false;
    const reduced = prefersReducedMotion();
    animate(
      faceRef.current,
      { scaleY: 1, scaleX: 1 },
      { type: 'spring', stiffness, damping, duration: reduced ? 0 : undefined }
    );
    setPresses((p) => p + 1);
  }, [stiffness, damping]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); press(); }
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') release();
  };

  return (
    <div className={styles.demoRow}>
      <button
        ref={btnRef}
        className={styles.feltBtn}
        aria-label="press the felt button"
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      >
        <span ref={faceRef} className={styles.feltFace}>
          <svg className={styles.feltTexture} viewBox="0 0 140 140" aria-hidden="true" preserveAspectRatio="none">
            <filter id="fibers">
              <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={3} seed={7} />
              <feColorMatrix values="0 0 0 0 0.77  0 0 0 0 0.42  0 0 0 0 0.55  0 0 0 0.28 0" />
            </filter>
            <rect width="140" height="140" filter="url(#fibers)" />
          </svg>
          <span className={styles.feltLabel}>press</span>
        </span>
      </button>

      <div className={styles.knobs}>
        <label>
          <span>stiffness <em>{stiffness}</em></span>
          <input type="range" min={40} max={400} step={1} value={stiffness}
                 onChange={(e) => setStiffness(parseFloat(e.target.value))} />
        </label>
        <label>
          <span>damping <em>{damping}</em></span>
          <input type="range" min={4} max={40} step={1} value={damping}
                 onChange={(e) => setDamping(parseFloat(e.target.value))} />
        </label>
        <label>
          <span>squash depth <em>{depth.toFixed(2)}</em></span>
          <input type="range" min={0.05} max={0.4} step={0.01} value={depth}
                 onChange={(e) => setDepth(parseFloat(e.target.value))} />
        </label>
        <p className={styles.readout}>
          Damping ratio <em>{ratio.toFixed(2)}</em> · <span>{character}</span>
        </p>
        <p className={styles.presses} aria-live="polite">
          {presses} {presses === 1 ? 'press' : 'presses'}
        </p>
      </div>
    </div>
  );
}
