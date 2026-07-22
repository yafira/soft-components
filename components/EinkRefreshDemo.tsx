'use client';

import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './EinkRefreshDemo.module.css';

const PHRASES = [
  'The gap keeps',
  'Fibers relax',
  'A soft yes',
  'Press again',
];

export default function EinkRefreshDemo() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [ghost, setGhost] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const refresh = useCallback((full: boolean) => {
    const panel = panelRef.current;
    if (!panel || refreshing) return;
    tlRef.current?.kill();
    setRefreshing(true);
    const reduced = prefersReducedMotion();
    const nextIndex = (phraseIndex + 1) % PHRASES.length;

    if (reduced) {
      setPhraseIndex(nextIndex);
      setGhost(!full && Math.random() > 0.5);
      setRefreshing(false);
      return;
    }

    const flashes = full ? 4 : 1;
    const tl = gsap.timeline({
      onComplete: () => {
        setPhraseIndex(nextIndex);
        setGhost(!full && Math.random() > 0.5);
        setRefreshing(false);
      },
    });
    tlRef.current = tl;

    for (let i = 0; i < flashes; i++) {
      tl.set(panel, { backgroundColor: '#2a2530' })
        .set(panel, { backgroundColor: '#f4f0fb' }, '+=0.09');
    }
    tl.set(panel, { backgroundColor: '#f4f0fb' });
  }, [phraseIndex, refreshing]);

  return (
    <div className={styles.demo}>
      <div ref={panelRef} className={styles.panel}>
        <p className={styles.text}>
          {PHRASES[phraseIndex]}
          {ghost && <span className={styles.ghost}> {PHRASES[(phraseIndex + 2) % PHRASES.length]}</span>}
        </p>
      </div>
      <div className={styles.buttons}>
        <button className={styles.refreshBtn} onClick={() => refresh(false)} disabled={refreshing}>partial refresh</button>
        <button className={`${styles.refreshBtn} ${styles.outline}`} onClick={() => refresh(true)} disabled={refreshing}>full refresh</button>
      </div>
      <p className={styles.hint}>
        Partial refresh is fast but can leave a faint ghost of the old text.
        Full refresh flashes black/white a few times first to clear it.
      </p>
    </div>
  );
}
