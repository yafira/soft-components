import type { Metadata } from 'next';
import Link from 'next/link';
import LazyCapacitiveTouchMatrixDemo from '@/components/LazyCapacitiveTouchMatrixDemo';
import styles from '../entry.module.css';

export const metadata: Metadata = {
  title: 'capacitive touch matrix — soft components',
  description: 'A grid of copper-tape pads that senses multiple touches at once, like a fabric trackpad.',
};

export default function CapacitiveTouchMatrixPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}><Link href="/#library">library</Link> / input</p>
        <h1>capacitive touch matrix</h1>
        <p className={styles.lede}>
          A grid of copper-tape or conductive-fabric pads, each sensing touch
          independently. Drag across the grid below — every pad you cross
          lights up on its own.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="demo-h">
        <h2 id="demo-h">touch it</h2>
        <LazyCapacitiveTouchMatrixDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          Each pad is one plate of a capacitor; your finger, grounded through
          your body, is the other. Touching a pad changes its capacitance, and
          a microcontroller measuring charge time on each pad&apos;s pin
          notices the shift. Scan every pad in a fast loop and you get
          independent touch detection across the whole grid — a fabric
          trackpad, in effect, without a single moving part.
        </p>
        <p>
          Real capacitive sensing needs some debouncing and a baseline
          calibration (fabric capacitance drifts with humidity and how the
          textile is worn), which this demo skips for clarity — but the core
          idea, one measurement per pad, independent of its neighbors, is
          exactly what&apos;s running here.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Multi-point gesture surfaces on soft objects: a swipe-to-scroll
          panel on a sleeve, a grid that reads which finger pressed where, a
          textile instrument with several simultaneous keys. Compared to a
          single potentiometer, a matrix trades simplicity for genuinely
          parallel input — worth it only when more than one touch actually
          matters to the design.
        </p>
        <p className={styles.footNav}>
          <Link href="/components/knit-stretch-sensor">← knit stretch sensor</Link>
          <span>next: <Link href="/components/fabric-bend-sensor">fabric bend sensor →</Link></span>
        </p>
      </section>
    </article>
  );
}
