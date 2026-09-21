'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { createTone } from '@/lib/audio';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './LibraryGrid.module.css';

const REST_Y = 64;
const AMPLITUDE = 10;

const conePath = (shift: number) => `M 45 ${REST_Y} Q 110 ${REST_Y - 2 * shift} 175 ${REST_Y}`;

export default function SoftSpeakerCard() {
  const coneRef = useRef<SVGPathElement>(null);
  const weaveRef = useRef<SVGPathElement>(null);
  const coilRef = useRef<SVGGElement>(null);
  const wavesRef = useRef<SVGGElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const frame = frameRef;
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const paint = (shift: number, glow: number) => {
    const d = conePath(shift);
    coneRef.current?.setAttribute('d', d);
    weaveRef.current?.setAttribute('d', d);
    coilRef.current?.setAttribute('transform', `translate(0 ${-shift})`);
    wavesRef.current?.setAttribute('opacity', String(glow));
  };

  const blip = () => {
    const tone = createTone('sine');
    if (!tone) return;
    tone.setFrequency(294);
    tone.setLevel(0.6);
    setTimeout(() => tone.setLevel(0), 350);
    setTimeout(() => tone.stop(), 650);
  };

  const play = () => {
    blip();
    cancelAnimationFrame(frameRef.current);

    if (prefersReducedMotion()) {
      paint(0, 0.8);
      setTimeout(() => paint(0, 0), 500);
      return;
    }

    // a struck diaphragm rings down like a damped spring
    const start = performance.now();
    const step = (now: number) => {
      const t = (now - start) / 1000;
      const envelope = Math.exp(-t * 3.4);
      if (t > 1.2 || envelope < 0.02) {
        paint(0, 0);
        return;
      }
      paint(AMPLITUDE * envelope * Math.cos(2 * Math.PI * 6 * t), Math.min(1, envelope * 1.3));
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  };

  return (
    <article className={styles.card}>
      <button className={styles.demoTrigger} aria-label="animate the soft speaker demo" onClick={play}>
        <svg viewBox="0 0 220 150" role="img" className={styles.thumb}>
          <title>soft speaker demo</title>
          <rect x="78" y="98" width="32" height="8" rx="2" fill="var(--ink)" />
          <rect x="110" y="98" width="32" height="8" rx="2" fill="var(--blush-deep)" />
          <g ref={coilRef}>
            <line x1="110" y1={REST_Y} x2="110" y2="76" stroke="var(--ink-soft)" strokeWidth={1.5} />
            {[86, 102, 118, 134].map((cx) => (
              <ellipse key={cx} cx={cx} cy="80" rx="8" ry="4.5" fill="none" stroke="var(--wisteria-deep)" strokeWidth={2} />
            ))}
          </g>
          <path ref={coneRef} d={conePath(0)} fill="none" stroke="var(--blush-deep)" strokeWidth={7} strokeLinecap="round" />
          <path
            ref={weaveRef}
            d={conePath(0)}
            fill="none"
            stroke="var(--blush)"
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="2 5"
            opacity={0.8}
          />
          <g ref={wavesRef} opacity={0} fill="none" stroke="var(--blush-deep)" strokeWidth={2.5} strokeLinecap="round">
            <path d="M 88 44 Q 110 34 132 44" />
            <path d="M 74 34 Q 110 20 146 34" opacity={0.7} />
            <path d="M 60 24 Q 110 6 160 24" opacity={0.45} />
          </g>
          <text x="110" y="122" textAnchor="middle" className={styles.mono}>Thud · hum</text>
          <text x="110" y="140" textAnchor="middle" className={styles.state}>Current → sound</text>
        </svg>
      </button>
      <div className={styles.cardBody}>
        <h2><Link href="/components/soft-speaker">soft speaker</Link></h2>
        <p>A stitched coil and a magnet that make fabric move air. Quiet on purpose.</p>
        <Link className={styles.more} href="/components/soft-speaker">how it works →</Link>
      </div>
    </article>
  );
}
