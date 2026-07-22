import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import LazyPotentiometerDemo from '@/components/LazyPotentiometerDemo';
import styles from '../entry.module.css';

export const metadata: Metadata = {
  title: 'soft potentiometer — soft components',
  description: 'A fabric potentiometer: drag the wiper along a conductive strip and watch position become a value.',
};

export default function SoftPotentiometerPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}><Link href="/#library">library</Link> / input</p>
        <h1>soft potentiometer</h1>
        <p className={styles.lede}>
          A strip of resistive fabric and something to touch it with. Where you
          press becomes a number. Drag the wiper below.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="demo-h" style={{ '--panel-border': 'var(--matcha-deep)' } as CSSProperties}>
        <h2 id="demo-h">slide it</h2>
        <LazyPotentiometerDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          The strip is a resistor you can touch — carbon-loaded stretch fabric
          or a length of resistive yarn. Wire one end to power, the other to
          ground, and the whole strip becomes a voltage gradient. The wiper (a
          fingertip on conductive fabric, a stitched contact, a bead) taps that
          gradient wherever it touches: the voltage it reads is proportional to
          position. One analog pin, and your microcontroller knows where you
          are.
        </p>
        <p>
          The digital wiper above chases your pointer through the same
          hand-rolled damped spring from the soft button page — but tuned
          looser, because a wiper glides where a button yields.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Continuous, expressive input on textile: volume on a sleeve,
          brightness on a cushion seam, pitch along a scarf. Because the
          reading drifts with pressure and humidity, treat it as a gesture
          instrument rather than a precision dial — smooth the signal, and let
          relative motion matter more than absolute value.
        </p>
        <p className={styles.footNav}>
          <Link href="/components/soft-button">← soft button</Link>
          <span>next: <Link href="/components/pressure-sensor">pressure sensor →</Link></span>
        </p>
      </section>
    </article>
  );
}
