'use client';

import dynamic from 'next/dynamic';

const PressureSensorDemo = dynamic(() => import('./PressureSensorDemo'), {
  ssr: false,
  loading: () => (
    <div className="press-skeleton" aria-hidden="true">
      <div className="skel-stack" />
      <style>{`
        .press-skeleton { text-align: center; }
        .skel-stack { max-width: 560px; height: 230px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyPressureSensorDemo() {
  return <PressureSensorDemo />;
}
