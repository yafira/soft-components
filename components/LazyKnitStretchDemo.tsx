'use client';

import dynamic from 'next/dynamic';

const KnitStretchDemo = dynamic(() => import('./KnitStretchDemo'), {
  ssr: false,
  loading: () => (
    <div className="knit-skeleton" aria-hidden="true">
      <div className="skel-swatch" />
      <style>{`
        .knit-skeleton { text-align: center; }
        .skel-swatch { max-width: 400px; height: 120px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyKnitStretchDemo() {
  return <KnitStretchDemo />;
}
