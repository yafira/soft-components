'use client';

import dynamic from 'next/dynamic';

const CapacitiveTouchMatrixDemo = dynamic(() => import('./CapacitiveTouchMatrixDemo'), {
  ssr: false,
  loading: () => (
    <div className="matrix-skeleton" aria-hidden="true">
      <div className="skel-grid" />
      <style>{`
        .matrix-skeleton { text-align: center; }
        .skel-grid { max-width: 420px; height: 220px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyCapacitiveTouchMatrixDemo() {
  return <CapacitiveTouchMatrixDemo />;
}
