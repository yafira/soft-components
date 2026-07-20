'use client';

import dynamic from 'next/dynamic';

const FabricBendDemo = dynamic(() => import('./FabricBendDemo'), {
  ssr: false,
  loading: () => (
    <div className="bend-skeleton" aria-hidden="true">
      <div className="skel-strip" />
      <style>{`
        .bend-skeleton { text-align: center; }
        .skel-strip { max-width: 400px; height: 120px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyFabricBendDemo() {
  return <FabricBendDemo />;
}
