import type { Metadata } from 'next';
import Link from 'next/link';
import LazyCapacitiveTouchMatrixDemo from '@/components/LazyCapacitiveTouchMatrixDemo';

export const metadata: Metadata = {
  title: 'capacitive touch matrix — soft components',
  description: 'A grid of copper-tape pads that senses multiple touches at once, like a fabric trackpad.',
};

export default function CapacitiveTouchMatrixPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / input</p>
        <h1>capacitive touch matrix</h1>
        <p className="lede">
          A grid of copper-tape or conductive-fabric pads, each sensing touch
          independently. Drag across the grid below — every pad you cross
          lights up on its own.
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
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
        <p className="foot-nav">
          <Link href="/components/knit-stretch-sensor">← knit stretch sensor</Link>
          <span>next: <Link href="/components/fabric-bend-sensor">fabric bend sensor →</Link></span>
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
