'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { animate } from 'motion';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './LibraryGrid.module.css';

const TEETH = 12;
const PITCH = 5;
const LOWEST_CELL = 81; // top of the lowest tooth
const START = 0.5;

// slider height for a position p, 0 is open at the bottom and 1 is closed at the top
const sliderY = (p: number) => 88 - p * 62;
const toothCenter = (i: number) => LOWEST_CELL - i * PITCH + PITCH / 2;

// teeth above the slider splay apart, teeth below it interlock
const gapFor = (i: number, p: number) => {
  const centre = toothCenter(i);
  const y = sliderY(p);
  return centre >= y ? 0 : Math.min(14, (y - centre) * 0.45);
};

const engagedAt = (p: number) => {
  const y = sliderY(p);
  let count = 0;
  for (let i = 0; i < TEETH; i++) if (toothCenter(i) >= y) count += 1;
  return count;
};

export default function ZipperSensorCard() {
  const leftRef = useRef<(SVGRectElement | null)[]>([]);
  const rightRef = useRef<(SVGRectElement | null)[]>([]);
  const sliderRef = useRef<SVGGElement>(null);
  const readoutRef = useRef<SVGTextElement>(null);
  const positionRef = useRef(START);

  const apply = (value: number) => {
    const p = Math.min(1, Math.max(0, value));
    for (let i = 0; i < TEETH; i++) {
      const gap = gapFor(i, p);
      leftRef.current[i]?.setAttribute('x', String(103 - gap));
      rightRef.current[i]?.setAttribute('x', String(110 + gap));
    }
    sliderRef.current?.setAttribute('transform', `translate(0 ${sliderY(p)})`);
    if (readoutRef.current) {
      readoutRef.current.textContent = `${engagedAt(p)} of ${TEETH} teeth`;
    }
  };

  const play = () => {
    const reduced = prefersReducedMotion();
    const from = positionRef.current;
    const to = from > 0.5 ? 0 : 1;
    animate(from, to, {
      type: 'spring',
      stiffness: 90,
      damping: 14,
      duration: reduced ? 0 : undefined,
      onUpdate: (latest) => {
        positionRef.current = latest;
        apply(latest);
      },
      onComplete: () => {
        positionRef.current = to;
        apply(to);
      },
    });
  };

  return (
    <article className={styles.card}>
      <button className={styles.demoTrigger} aria-label="animate the zipper sensor demo" onClick={play}>
        <svg viewBox="0 0 220 150" role="img" className={styles.thumb}>
          <title>zipper sensor demo</title>
          {Array.from({ length: TEETH }).map((_, i) => {
            const gap = gapFor(i, START);
            const top = LOWEST_CELL - i * PITCH;
            return (
              <g key={i}>
                <rect
                  ref={(el) => { leftRef.current[i] = el; }}
                  x={103 - gap} y={top + 0.3} width="7" height="2.2" rx="1"
                  fill="var(--wisteria-deep)"
                />
                <rect
                  ref={(el) => { rightRef.current[i] = el; }}
                  x={110 + gap} y={top + 2.6} width="7" height="2.2" rx="1"
                  fill="var(--wisteria-deep)"
                />
              </g>
            );
          })}
          <g ref={sliderRef} transform={`translate(0 ${sliderY(START)})`}>
            <rect x="98" y="-7" width="24" height="14" rx="5" fill="var(--wisteria)" stroke="var(--wisteria-deep)" strokeWidth={1.5} />
            <rect x="106" y="8" width="8" height="12" rx="4" fill="var(--wisteria-deep)" />
          </g>
          <text ref={readoutRef} x="110" y="122" textAnchor="middle" className={styles.mono}>
            {`${engagedAt(START)} of ${TEETH} teeth`}
          </text>
          <text x="110" y="140" textAnchor="middle" className={styles.state}>Slide → resistance</text>
        </svg>
      </button>
      <div className={styles.cardBody}>
        <h2><Link href="/components/zipper-sensor">zipper sensor</Link></h2>
        <p>A zipper read as a position sensor. Every engaged tooth changes the signal.</p>
        <Link className={styles.more} href="/components/zipper-sensor">how it works →</Link>
      </div>
    </article>
  );
}
