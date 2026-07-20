'use client';

import dynamic from 'next/dynamic';

const EinkRefreshDemo = dynamic(() => import('./EinkRefreshDemo'), {
  ssr: false,
  loading: () => (
    <div className="eink-skeleton" aria-hidden="true">
      <div className="skel-panel" />
      <style>{`
        .eink-skeleton { text-align: center; }
        .skel-panel { max-width: 420px; height: 140px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyEinkRefreshDemo() {
  return <EinkRefreshDemo />;
}
