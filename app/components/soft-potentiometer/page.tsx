import type { Metadata } from 'next';
import Link from 'next/link';
import LazyPotentiometerDemo from '@/components/LazyPotentiometerDemo';

export const metadata: Metadata = {
  title: 'soft potentiometer — soft components',
  description: 'a fabric potentiometer: drag the wiper along a conductive strip and watch position become a value.',
};

export default function SoftPotentiometerPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / input</p>
        <h1>soft potentiometer</h1>
        <p className="lede">
          a strip of resistive fabric and something to touch it with. where you
          press becomes a number. drag the wiper below.
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
        <h2 id="demo-h">slide it</h2>
        <LazyPotentiometerDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          the strip is a resistor you can touch — carbon-loaded stretch fabric
          or a length of resistive yarn. wire one end to power, the other to
          ground, and the whole strip becomes a voltage gradient. the wiper (a
          fingertip on conductive fabric, a stitched contact, a bead) taps that
          gradient wherever it touches: the voltage it reads is proportional to
          position. one analog pin, and your microcontroller knows where you
          are.
        </p>
        <p>
          the digital wiper above chases your pointer through the same
          hand-rolled damped spring from the soft button page — but tuned
          looser, because a wiper glides where a button yields.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          continuous, expressive input on textile: volume on a sleeve,
          brightness on a cushion seam, pitch along a scarf. because the
          reading drifts with pressure and humidity, treat it as a gesture
          instrument rather than a precision dial — smooth the signal, and let
          relative motion matter more than absolute value.
        </p>
        <p className="foot-nav">
          <Link href="/components/soft-button">← soft button</Link>
          <span>next: <Link href="/components/pressure-sensor">pressure sensor →</Link></span>
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
          border: 1px dashed var(--matcha-deep);
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
