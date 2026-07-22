'use client';

import { useRef, useState } from 'react';
import { animate } from 'motion';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './FeltButtonCutaway.module.css';

export default function FeltButtonCutaway() {
  const feltRef = useRef<SVGGElement>(null);
  const padRectRef = useRef<SVGRectElement>(null);
  const [state, setState] = useState('Resting — circuit open');

  const play = () => {
    const felt = feltRef.current;
    const pad = padRectRef.current;
    if (!felt || !pad) return;
    const reduced = prefersReducedMotion();

    setState('Compressing…');
    animate(
      felt,
      { y: 58, scaleX: 1.06, scaleY: 0.66 },
      { type: 'spring', stiffness: 120, damping: 15, duration: reduced ? 0 : undefined }
    ).then(() => {
      pad.setAttribute('fill', '#f2c94c');
      setState('Pressed — layers touching, circuit closed');
      setTimeout(() => {
        pad.setAttribute('fill', 'var(--butter)');
        setState('Resting — circuit open');
        animate(
          felt,
          { y: 0, scaleX: 1, scaleY: 1 },
          { type: 'spring', stiffness: 120, damping: 15, duration: reduced ? 0 : undefined }
        );
      }, 700);
    });
  };

  return (
    <div className={styles.panel}>
      <svg viewBox="0 0 560 240" role="img" className={styles.cutaway}>
        <title>cutaway of the felt button layers</title>
        <desc>the felt top compresses through an air gap until conductive layers touch and close the circuit.</desc>
        <g ref={feltRef} style={{ transformBox: 'view-box', transformOrigin: '280px 57px' }}>
          <rect x="150" y="34" width="260" height="46" rx="14" fill="var(--blush)" stroke="var(--blush-deep)" />
          <text x="280" y="62" textAnchor="middle" className={styles.label} fill="var(--blush-deep)">Felt top — springy fibers</text>
        </g>
        <g>
          <rect x="170" y="96" width="220" height="22" rx="6" fill="var(--paper)" stroke="var(--line)" strokeDasharray="5 5" />
          <text x="430" y="111" className={styles.side}>Air gap</text>
        </g>
        <g>
          <rect ref={padRectRef} x="170" y="130" width="220" height="26" rx="6" fill="var(--butter)" stroke="var(--butter-deep)" />
          <text x="280" y="147" textAnchor="middle" className={styles.label} fill="var(--butter-deep)">Conductive fabric</text>
        </g>
        <g>
          <rect x="150" y="168" width="260" height="20" rx="6" fill="var(--wisteria)" stroke="var(--wisteria-deep)" />
          <text x="280" y="182" textAnchor="middle" className={`${styles.label} ${styles.small}`} fill="var(--wisteria-deep)">Base layer + trace to pin</text>
        </g>
        <text x="280" y="222" textAnchor="middle" className={styles.state}>{state}</text>
      </svg>
      <button className={styles.playBtn} onClick={play}>press the cutaway</button>
    </div>
  );
}
