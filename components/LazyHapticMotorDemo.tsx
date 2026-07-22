'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const HapticMotorDemo = dynamic(() => import('./HapticMotorDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ maxWidth: 340, height: 200 }} />
    </div>
  ),
});

export default function LazyHapticMotorDemo() {
  return <HapticMotorDemo />;
}
