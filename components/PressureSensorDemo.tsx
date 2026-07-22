'use client';

import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './PressureSensorDemo.module.css';

export default function PressureSensorDemo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<SVGRectElement>(null);
  const veloRef = useRef<SVGRectElement>(null);
  const bottomRef = useRef<SVGRectElement>(null);
  const [readout, setReadout] = useState('R ≈ 24.0 kΩ');
  const [barWidth, setBarWidth] = useState(4);
  const stateRef = useRef({ force: 0 });
  const holdingRef = useRef(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const render = useCallback(() => {
    const v = stateRef.current.force;
    if (topRef.current) gsap.set(topRef.current, { y: 16 * v });
    if (veloRef.current) gsap.set(veloRef.current, { y: 8 * v, scaleY: 1 - 0.5 * v });
    const shade = Math.round(201 - 60 * v);
    veloRef.current?.setAttribute('fill', `rgb(${shade}, ${shade - 5}, ${shade - 14})`);
    if (bottomRef.current) gsap.set(bottomRef.current, { y: -2 * v });
    const r = 24 / (1 + 9 * v);
    setReadout(v > 0.01 ? `R ≈ ${r.toFixed(1)} kΩ` : 'R ≈ 24.0 kΩ');
    setBarWidth(Math.max(300 * v, 4));
  }, []);

  const start = useCallback(() => {
    holdingRef.current = true;
    tweenRef.current?.kill();
    if (prefersReducedMotion()) {
      stateRef.current.force = 1;
      render();
      return;
    }
    tweenRef.current = gsap.to(stateRef.current, {
      force: 1,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: render,
    });
  }, [render]);

  const stop = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    tweenRef.current?.kill();
    if (prefersReducedMotion()) {
      stateRef.current.force = 0;
      render();
      return;
    }
    tweenRef.current = gsap.to(stateRef.current, {
      force: 0,
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: render,
    });
  }, [render]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); start(); }
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') stop();
  };

  return (
    <div>
      <button
        ref={btnRef}
        className={styles.stackBtn}
        aria-label="press and hold to squeeze the sensor stack"
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      >
        <svg viewBox="0 0 560 230" role="img" className={styles.svg}>
          <title>velostat pressure sensor demo</title>
          <desc>a three-layer stack that compresses under pressure while a resistance readout falls.</desc>
          <g ref={topRef}>
            <rect x="160" y="30" width="240" height="30" rx="9" fill="var(--wisteria)" stroke="var(--wisteria-deep)" />
            <text x="280" y="49" textAnchor="middle" className={styles.label} fill="var(--wisteria-deep)">Conductive fabric</text>
          </g>
          <g ref={veloRef} style={{ transformBox: 'view-box', transformOrigin: '280px 87px' }}>
            <rect x="160" y="72" width="240" height="30" rx="9" fill="#c9c4bb" stroke="#8b857a" />
            <text x="280" y="91" textAnchor="middle" className={styles.label} fill="#5c574e">Velostat</text>
          </g>
          <g ref={bottomRef}>
            <rect x="160" y="114" width="240" height="30" rx="9" fill="var(--wisteria)" stroke="var(--wisteria-deep)" />
            <text x="280" y="133" textAnchor="middle" className={styles.label} fill="var(--wisteria-deep)">Conductive fabric</text>
          </g>
          <text x="280" y="185" textAnchor="middle" className={styles.readout}>{readout}</text>
          <rect x="130" y="200" width="300" height="8" rx="4" fill="var(--paper)" stroke="var(--line)" />
          <rect x="130" y="200" width={barWidth} height="8" rx="4" fill="var(--wisteria-deep)" />
        </svg>
      </button>
      <p className={styles.hint}>Press and hold — works with space or enter too</p>
    </div>
  );
}
