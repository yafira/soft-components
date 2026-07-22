import type { Metadata } from 'next';
import Link from 'next/link';
import LazyThermochromicRevealDemo from '@/components/LazyThermochromicRevealDemo';
import styles from '../entry.module.css';

export const metadata: Metadata = {
  title: 'thermochromic reveal — soft components',
  description: 'Conductive thread heats a thermochromic patch until it changes color, then fades slowly as it cools.',
};

export default function ThermochromicRevealPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}><Link href="/#library">library</Link> / output</p>
        <h1>thermochromic reveal</h1>
        <p className={styles.lede}>
          Conductive thread stitched behind a patch of thermochromic ink. Run
          current through the thread, the patch warms, and the color shifts —
          slowly, the way heat actually moves through fabric.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="demo-h">
        <h2 id="demo-h">warm it</h2>
        <LazyThermochromicRevealDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          Thermochromic ink contains microcapsules of leuco dye that shift
          between colored and clear (or between two colors) at a specific
          activation temperature. Stitch conductive thread in a dense zigzag
          behind the ink and drive current through it — resistive heating
          warms the patch, crossing the activation threshold and revealing the
          color underneath.
        </p>
        <p>
          The demo drives its color transition through the same spring math
          used everywhere else in this library, but tuned into an{' '}
          <strong>overdamped</strong> regime — a damping ratio above 1, so the
          value approaches its target with a lag but no overshoot or
          oscillation. That&apos;s a reasonable stand-in for heat diffusing
          through fabric: it climbs quickly while thread is driven, then
          fades slowly once power cuts, because losing heat to open air is
          slower than gaining it from a direct current source.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          A display with no pixels: a garment patch that reveals a message
          when worn against skin, a color that confirms &ldquo;this circuit
          has been active&rdquo; without any screen at all. Slow by design —
          not suited to anything needing quick feedback, but well suited to
          objects meant to be lived with rather than glanced at.
        </p>
        <p className={styles.footNav}>
          <Link href="/components/haptic-motor">← haptic motor</Link>
          <span>next: <Link href="/components/eink-refresh">e-ink refresh →</Link></span>
        </p>
      </section>
    </article>
  );
}
