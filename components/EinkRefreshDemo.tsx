'use client';

import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/spring';

const PHRASES = [
  'the gap keeps',
  'fibers relax',
  'a soft yes',
  'press again',
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
    <div className="eink-demo">
      <div ref={panelRef} className="eink-panel">
        <p className="eink-text">
          {PHRASES[phraseIndex]}
          {ghost && <span className="ghost"> {PHRASES[(phraseIndex + 2) % PHRASES.length]}</span>}
        </p>
      </div>
      <div className="eink-buttons">
        <button className="pill" onClick={() => refresh(false)} disabled={refreshing}>partial refresh</button>
        <button className="pill outline" onClick={() => refresh(true)} disabled={refreshing}>full refresh</button>
      </div>
      <p className="hint">
        partial refresh is fast but can leave a faint ghost of the old text.
        full refresh flashes black/white a few times first to clear it.
      </p>

      <style>{`
        .eink-demo { text-align: center; }
        .eink-panel {
          max-width: 420px;
          margin: 0 auto 1rem;
          height: 140px;
          border-radius: var(--radius);
          background: #f4f0fb;
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .eink-text {
          font-family: var(--font-body);
          font-size: 1.1rem;
          color: var(--ink);
          margin: 0;
        }
        .ghost { color: var(--ink-soft); opacity: 0.35; }
        .eink-buttons { display: flex; gap: 0.6rem; justify-content: center; margin-bottom: 0.6rem; }
        .pill {
          font-family: var(--font-body);
          font-size: 0.82rem;
          border-radius: 999px;
          padding: 0.45rem 1.1rem;
          cursor: pointer;
          border: 1.5px solid var(--butter-deep);
          background: var(--butter);
          color: var(--ink);
        }
        .pill:hover:not(:disabled) { background: #f7dd8f; }
        .pill.outline { background: transparent; border-color: var(--wisteria-deep); color: var(--wisteria-deep); }
        .pill.outline:hover:not(:disabled) { background: var(--wisteria); }
        .pill:disabled { opacity: 0.5; cursor: default; }
        .hint { font-size: 0.78rem; color: var(--ink-soft); max-width: 40ch; margin: 0 auto; }
      `}</style>
    </div>
  );
}
