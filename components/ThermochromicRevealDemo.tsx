'use client';

import { useRef, useState, useCallback } from 'react';
import { Spring, prefersReducedMotion } from '@/lib/spring';
import styles from './ThermochromicRevealDemo.module.css';

const COLD = [201, 196, 220]; // wisteria-ish
const HOT = [246, 200, 216]; // blush-ish

function lerpColor(t: number) {
  const r = Math.round(COLD[0] + (HOT[0] - COLD[0]) * t);
  const g = Math.round(COLD[1] + (HOT[1] - COLD[1]) * t);
  const b = Math.round(COLD[2] + (HOT[2] - COLD[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ThermochromicRevealDemo() {
  const patchRef = useRef<HTMLDivElement>(null);
  const [temp, setTemp] = useState(0);
  const [heating, setHeating] = useState(false);
  // overdamped spring (ratio > 1): no oscillation, just a lagging approach —
  // a reasonable stand-in for heat diffusing through fabric.
  const springRef = useRef(new Spring({ stiffness: 12, damping: 10, value: 0 }));
  const rafRef = useRef<number | null>(null);

  const render = useCallback(() => {
    const t = Math.min(Math.max(springRef.current.value, 0), 1);
    if (patchRef.current) patchRef.current.style.backgroundColor = lerpColor(t);
    setTemp(t);
  }, []);

  const kick = useCallback(() => {
    if (rafRef.current) return;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      springRef.current.step(dt);
      render();
      if (!springRef.current.settled) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        springRef.current.snap();
        render();
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [render]);

  const toggle = () => {
    const next = !heating;
    setHeating(next);
    // heats quickly (higher stiffness), cools slowly (lower) — thread
    // conducts heat in fast, fabric loses it slowly to the air.
    springRef.current.stiffness = next ? 14 : 4;
    springRef.current.target = next ? 1 : 0;
    if (prefersReducedMotion()) springRef.current.snap();
    render();
    kick();
  };

  return (
    <div className={styles.demo}>
      <button className={styles.patchBtn} onClick={toggle} aria-pressed={heating}>
        <div ref={patchRef} className={styles.patch} style={{ backgroundColor: lerpColor(0) }}>
          <span className={styles.patchLabel}>{heating ? 'heating' : 'press to heat'}</span>
        </div>
      </button>
      <p className={styles.readout}>Temperature: {(temp * 100).toFixed(0)}%</p>
      <p className={styles.hint}>Conductive thread heats the patch; thermochromic ink shifts color as it warms, then fades slowly as it cools</p>
    </div>
  );
}
