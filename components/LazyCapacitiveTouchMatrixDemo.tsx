'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const CapacitiveTouchMatrixDemo = dynamic(() => import('./CapacitiveTouchMatrixDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ maxWidth: 420, height: 220 }} />
    </div>
  ),
});

export default function LazyCapacitiveTouchMatrixDemo() {
  return <CapacitiveTouchMatrixDemo />;
}
