'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const EinkRefreshDemo = dynamic(() => import('./EinkRefreshDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ maxWidth: 420, height: 140 }} />
    </div>
  ),
});

export default function LazyEinkRefreshDemo() {
  return <EinkRefreshDemo />;
}
