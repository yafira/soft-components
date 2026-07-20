import type { Metadata } from 'next';
import Link from 'next/link';
import LazyPressureSensorDemo from '@/components/LazyPressureSensorDemo';

export const metadata: Metadata = {
  title: 'pressure sensor — soft components',
  description: 'a velostat pressure sensor: squeeze harder, resistance falls, force becomes an analog signal.',
};

export default function PressureSensorPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / input</p>
        <h1>pressure sensor</h1>
        <p className="lede">
          velostat between two layers of conductive fabric. squeeze harder and
          resistance drops. press and hold the stack below — the longer you
          hold, the harder you&apos;re &ldquo;squeezing.&rdquo;
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
        <h2 id="demo-h">squeeze it</h2>
        <LazyPressureSensorDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          velostat is a polymer film loaded with carbon particles. relaxed, the
          particles sit apart and current struggles across — high resistance.
          squeeze, and particles crowd into contact, opening more conductive
          paths — resistance falls, roughly with the inverse of force. put the
          sensor in a voltage divider and one analog pin reads how hard
          you&apos;re pressing, not just whether you are.
        </p>
        <p>
          the response is nonlinear and it drifts — velostat creeps under
          sustained load and remembers being folded. calibrate per sensor,
          smooth the reading, and design for gestures (&ldquo;light / firm /
          squeeze&rdquo;) rather than newtons.
        </p>
        <p>
          this demo runs on <a href="https://gsap.com">GSAP</a> rather than a
          position spring: force builds on a quick ease-in while held, then
          decays on a slower ease-out after release — asymmetric timing tuned
          to feel like load building up and then a stack of fabric settling,
          rather than a spring snapping back to zero.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          anywhere force is the message: a plush object that responds to how
          it&apos;s hugged, a pressure map under a sock, expressive velocity
          for a fabric instrument. it&apos;s the workhorse of soft circuits —
          cheap, cuttable with scissors, sewable into almost anything.
        </p>
        <p className="foot-nav">
          <Link href="/components/soft-potentiometer">← soft potentiometer</Link>
          <span><Link href="/#library">back to the library</Link></span>
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
