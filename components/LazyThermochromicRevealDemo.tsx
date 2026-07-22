'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const ThermochromicRevealDemo = dynamic(() => import('./ThermochromicRevealDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ width: 180, height: 120 }} />
    </div>
  ),
});

export default function LazyThermochromicRevealDemo() {
  return <ThermochromicRevealDemo />;
}
