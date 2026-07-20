'use client';

import dynamic from 'next/dynamic';

const HapticMotorDemo = dynamic(() => import('./HapticMotorDemo'), {
  ssr: false,
  loading: () => (
    <div className="haptic-skeleton" aria-hidden="true">
      <div className="skel-motor" />
      <style>{`
        .haptic-skeleton { text-align: center; }
        .skel-motor { max-width: 340px; height: 200px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyHapticMotorDemo() {
  return <HapticMotorDemo />;
}
