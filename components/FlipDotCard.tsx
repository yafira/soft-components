'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { animate } from 'motion';
import { playClick } from '@/lib/audio';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './LibraryGrid.module.css';

const COLS = 9;
const ROWS = 5;
const PITCH = 16;
const OFF = '#3d3648';

// a checkerboard, and its inverse once flipped
const isOn = (r: number, c: number, flipped: boolean) => (r + c + (flipped ? 1 : 0)) % 2 === 0;

export default function FlipDotCard() {
  const dotsRef = useRef<(SVGEllipseElement | null)[]>([]);
  const flippedRef = useRef(false);

  const paintDot = (dot: SVGEllipseElement, on: boolean) => {
    dot.setAttribute('fill', on ? 'var(--butter)' : OFF);
    dot.setAttribute('stroke', on ? 'var(--butter-deep)' : 'rgba(255, 255, 255, 0.12)');
  };

  const play = () => {
    const next = !flippedRef.current;
    flippedRef.current = next;
    const reduced = prefersReducedMotion();

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dot = dotsRef.current[r * COLS + c];
        if (!dot) continue;
        const on = isOn(r, c, next);
        if (reduced) {
          paintDot(dot, on);
          continue;
        }
        // each column flips a beat after the last, and the disc squeezes edge-on
        // in the middle of the flip, where the face changes
        animate(dot, { scaleX: [1, 0.08] }, { duration: 0.07, delay: c * 0.05, ease: 'easeIn' }).then(() => {
          paintDot(dot, on);
          animate(dot, { scaleX: 1 }, { type: 'spring', stiffness: 420, damping: 11 });
        });
      }
    }

    // one soft click per column
    for (let c = 0; c < COLS; c++) {
      playClick({ pitch: 1400 + Math.random() * 1200, gain: 0.05, delay: c * 0.05 + 0.07 });
    }
  };

  return (
    <article className={styles.card}>
      <button className={styles.demoTrigger} aria-label="animate the flip-dot demo" onClick={play}>
        <svg viewBox="0 0 220 150" role="img" className={styles.thumb}>
          <title>flip-dot demo</title>
          <rect x="30" y="16" width="160" height="92" rx="10" fill="#2a2530" />
          {Array.from({ length: ROWS * COLS }).map((_, i) => {
            const r = Math.floor(i / COLS);
            const c = i % COLS;
            const on = isOn(r, c, false);
            return (
              <ellipse
                key={i}
                ref={(el) => { dotsRef.current[i] = el; }}
                cx={46 + c * PITCH}
                cy={30 + r * PITCH}
                rx="5.5"
                ry="5.5"
                fill={on ? 'var(--butter)' : OFF}
                stroke={on ? 'var(--butter-deep)' : 'rgba(255, 255, 255, 0.12)'}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            );
          })}
          <text x="110" y="126" textAnchor="middle" className={styles.mono}>Flip · hold</text>
          <text x="110" y="142" textAnchor="middle" className={styles.state}>Pulse → disc flips</text>
        </svg>
      </button>
      <div className={styles.cardBody}>
        <h2><Link href="/components/flip-dot">flip-dot</Link></h2>
        <p>Magnetized discs that flip between two faces and hold their picture with the power off.</p>
        <Link className={styles.more} href="/components/flip-dot">how it works →</Link>
      </div>
    </article>
  );
}
