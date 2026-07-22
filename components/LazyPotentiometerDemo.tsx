'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const PotentiometerDemo = dynamic(() => import('./PotentiometerDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ maxWidth: 560, height: 140 }} />
    </div>
  ),
});

export default function LazyPotentiometerDemo() {
  return <PotentiometerDemo />;
}
