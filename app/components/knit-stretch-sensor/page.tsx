import type { Metadata } from 'next';
import Link from 'next/link';
import LazyKnitStretchDemo from '@/components/LazyKnitStretchDemo';
import styles from '../entry.module.css';

export const metadata: Metadata = {
  title: 'knit stretch sensor — soft components',
  description: 'A conductive knit swatch: stretch it and resistance rises as the loops pull apart.',
};

export default function KnitStretchPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}><Link href="/#library">library</Link> / input</p>
        <h1>knit stretch sensor</h1>
        <p className={styles.lede}>
          Conductive yarn, knit into a swatch. Pull it and the loops spread
          apart, resistance climbing as they go. Drag the handle below.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="demo-h">
        <h2 id="demo-h">stretch it</h2>
        <LazyKnitStretchDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          Knit a swatch with yarn plied from stainless steel or silver-coated
          conductive fiber, and every loop touches its neighbors — a dense mesh
          of tiny contact points conducting current across the fabric. Stretch
          the swatch and the loops elongate and pull apart, contact points
          breaking one by one. Fewer contacts means a longer, thinner path for
          current, so resistance rises with stretch — the opposite direction
          from the pressure sensor, where squeezing closes contacts. Same
          principle, opposite sign.
        </p>
        <p>
          This is the one place in the library where machine-knitting
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
          Garment-integrated gesture input — a stretch at the elbow, a cuff
          that senses how far a wrist has bent, a hem that reads how snug it&apos;s
          pulled. Like the pressure sensor, expect drift and hysteresis: knit
          doesn&apos;t fully recover its resting shape instantly, so calibrate
          per-wear rather than assuming a fixed zero point.
        </p>
        <p className={styles.footNav}>
          <Link href="/components/pressure-sensor">← pressure sensor</Link>
          <span>next: <Link href="/components/capacitive-touch-matrix">capacitive touch matrix →</Link></span>
        </p>
      </section>
    </article>
  );
}
