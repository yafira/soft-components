'use client';

import dynamic from 'next/dynamic';

const FeltButtonCutaway = dynamic(() => import('./FeltButtonCutaway'), {
  ssr: false,
  loading: () => (
    <div className="cutaway-skeleton" aria-hidden="true">
      <div className="skel-diagram" />
      <style>{`
        .cutaway-skeleton { text-align: center; }
        .skel-diagram { max-width: 560px; height: 240px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyFeltButtonCutaway() {
  return <FeltButtonCutaway />;
}
