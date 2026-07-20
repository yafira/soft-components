'use client';

import dynamic from 'next/dynamic';

const PotentiometerDemo = dynamic(() => import('./PotentiometerDemo'), {
  ssr: false,
  loading: () => (
    <div className="pot-skeleton" aria-hidden="true">
      <div className="skel-track" />
      <style>{`
        .pot-skeleton { text-align: center; }
        .skel-track { max-width: 560px; height: 140px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyPotentiometerDemo() {
  return <PotentiometerDemo />;
}
