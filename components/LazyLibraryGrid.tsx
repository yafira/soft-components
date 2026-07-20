'use client';

import dynamic from 'next/dynamic';

const LibraryGrid = dynamic(() => import('./LibraryGrid'), {
  ssr: false,
  loading: () => (
    <section className="wrap">
      <div className="grid-skeleton" aria-hidden="true">
        <div className="skel-card" />
        <div className="skel-card" />
        <div className="skel-card" />
      </div>
      <style>{`
        .grid-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.4rem;
          padding-bottom: 2rem;
        }
        .skel-card {
          height: 260px;
          border-radius: var(--radius-lg);
          background: var(--card);
          border: 1px solid var(--line);
        }
      `}</style>
    </section>
  ),
});

export default function LazyLibraryGrid() {
  return <LibraryGrid />;
}
