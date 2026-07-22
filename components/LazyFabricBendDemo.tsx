'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const FabricBendDemo = dynamic(() => import('./FabricBendDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ maxWidth: 400, height: 120 }} />
    </div>
  ),
});

export default function LazyFabricBendDemo() {
  return <FabricBendDemo />;
}
