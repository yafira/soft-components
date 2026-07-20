'use client';

import dynamic from 'next/dynamic';

const FeltButtonDemo = dynamic(() => import('./FeltButtonDemo'), {
  ssr: false,
  loading: () => (
    <div className="demo-skeleton" aria-hidden="true">
      <div className="skel-btn" />
      <div className="skel-knobs" />
      <style>{`
        .demo-skeleton { display: flex; flex-wrap: wrap; gap: 2.2rem; align-items: center; }
        .skel-btn { width: 140px; height: 140px; border-radius: 34px; background: var(--blush); opacity: 0.5; }
        .skel-knobs { flex: 1; min-width: 240px; height: 140px; background: var(--card); border-radius: var(--radius); }
      `}</style>
    </div>
  ),
});

export default function LazyFeltButtonDemo() {
  return <FeltButtonDemo />;
}
