'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const FeltButtonDemo = dynamic(() => import('./FeltButtonDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.flexRow} aria-hidden="true">
      <div className={styles.feltBox} />
      <div className={styles.knobsBox} />
    </div>
  ),
});

export default function LazyFeltButtonDemo() {
  return <FeltButtonDemo />;
}
