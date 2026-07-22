'use client';

import dynamic from 'next/dynamic';
import styles from './Skeleton.module.css';

const PressureSensorDemo = dynamic(() => import('./PressureSensorDemo'), {
  ssr: false,
  loading: () => (
    <div className={styles.center} aria-hidden="true">
      <div className={styles.box} style={{ maxWidth: 560, height: 230 }} />
    </div>
  ),
});

export default function LazyPressureSensorDemo() {
  return <PressureSensorDemo />;
}
