'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const FeltButtonCutaway = dynamic(() => import('./FeltButtonCutaway'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ maxWidth: 560, height: 240 }} />
    </div>
  ),
});

export default function LazyFeltButtonCutaway() {
  return <FeltButtonCutaway />;
}
