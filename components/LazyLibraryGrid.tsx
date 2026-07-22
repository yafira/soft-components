'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const LibraryGrid = dynamic(() => import('./LibraryGrid'), {
  ssr: false,
  loading: () => (
    <section className="wrap">
      <div className={styles.grid} aria-hidden="true">
        <div className={styles.gridCard} />
        <div className={styles.gridCard} />
        <div className={styles.gridCard} />
      </div>
    </section>
  ),
});

export default function LazyLibraryGrid() {
  return <LibraryGrid />;
}
