import type { Metadata } from 'next';
import Link from 'next/link';
import LazyKnitStretchDemo from '@/components/LazyKnitStretchDemo';

export const metadata: Metadata = {
  title: 'knit stretch sensor — soft components',
  description: 'a conductive knit swatch: stretch it and resistance rises as the loops pull apart.',
};

export default function KnitStretchPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / input</p>
        <h1>knit stretch sensor</h1>
        <p className="lede">
          conductive yarn, knit into a swatch. pull it and the loops spread
          apart, resistance climbing as they go. drag the handle below.
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
        <h2 id="demo-h">stretch it</h2>
        <LazyKnitStretchDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          knit a swatch with yarn plied from stainless steel or silver-coated
          conductive fiber, and every loop touches its neighbors — a dense mesh
          of tiny contact points conducting current across the fabric. stretch
          the swatch and the loops elongate and pull apart, contact points
          breaking one by one. fewer contacts means a longer, thinner path for
          current, so resistance rises with stretch — the opposite direction
          from the pressure sensor, where squeezing closes contacts. same
          principle, opposite sign.
        </p>
        <p>
          this is the one place in the library where machine-knitting
          knowledge directly shapes the sensor&apos;s behavior: a weft-knit
          swatch (like the ones off a Brother KH-930) stretches far more in
          the course direction than the wale direction, so orientation on the
          machine bed decides whether you get a subtle sensor or a dramatic
          one before a single circuit is wired.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          garment-integrated gesture input — a stretch at the elbow, a cuff
          that senses how far a wrist has bent, a hem that reads how snug it&apos;s
          pulled. like the pressure sensor, expect drift and hysteresis: knit
          doesn&apos;t fully recover its resting shape instantly, so calibrate
          per-wear rather than assuming a fixed zero point.
        </p>
        <p className="foot-nav">
          <Link href="/components/pressure-sensor">← pressure sensor</Link>
          <span>next: <Link href="/components/capacitive-touch-matrix">capacitive touch matrix →</Link></span>
        </p>
      </section>

      <style>{`
        .entry { padding-top: 3rem; }
        .entry-header { margin-bottom: 2.5rem; }
        .crumb { font-size: 0.78rem; color: var(--ink-soft); margin-bottom: 0.4rem; }
        .lede { max-width: 58ch; color: var(--ink-soft); }
        section { margin-bottom: 3rem; }
        .panel {
          background: var(--card);
          border: 1px dashed var(--wisteria-deep);
          border-radius: var(--radius-lg);
          padding: 1.6rem;
        }
        .foot-nav {
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem;
          font-size: 0.85rem; border-top: 1px dashed var(--line); padding-top: 1.4rem;
        }
      `}</style>
    </article>
  );
}
