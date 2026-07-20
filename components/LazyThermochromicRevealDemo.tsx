'use client';

import dynamic from 'next/dynamic';

const ThermochromicRevealDemo = dynamic(() => import('./ThermochromicRevealDemo'), {
  ssr: false,
  loading: () => (
    <div className="thermo-skeleton" aria-hidden="true">
      <div className="skel-patch" />
      <style>{`
        .thermo-skeleton { text-align: center; }
        .skel-patch { width: 180px; height: 120px; margin: 0 auto; background: var(--card); border-radius: var(--radius); opacity: 0.6; }
      `}</style>
    </div>
  ),
});

export default function LazyThermochromicRevealDemo() {
  return <ThermochromicRevealDemo />;
}
