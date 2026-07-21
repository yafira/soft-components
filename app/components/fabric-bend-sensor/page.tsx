import type { Metadata } from 'next';
import Link from 'next/link';
import LazyFabricBendDemo from '@/components/LazyFabricBendDemo';

export const metadata: Metadata = {
  title: 'fabric bend sensor — soft components',
  description: 'A flex sensor sewn into a hem or cuff: resistive ink cracks as it bends, resistance rising with the angle.',
};

export default function FabricBendSensorPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / input</p>
        <h1>fabric bend sensor</h1>
        <p className="lede">
          A strip printed with resistive ink, or laminated with a
          strain-sensitive film. Bend it either direction and resistance
          rises. Drag the handle up or down below.
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
        <h2 id="demo-h">bend it</h2>
        <LazyFabricBendDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          A thin layer of conductive or resistive ink sits on a flexible
          substrate. Flat, its conductive particles form a continuous network
          — low resistance. Bend the strip and the ink&apos;s outer face
          stretches, hairline cracks forming in the particle network, so
          resistance climbs. Bend it the other way and the same face
          compresses instead of stretching, so a single sensor generally reads
          bend <em>magnitude</em> rather than direction unless you add a
          second sensor on the opposite face to distinguish them.
        </p>
        <p>
          Unlike the knit stretch sensor&apos;s elastic recovery, resistive
          ink can develop permanent microcracks over many bend cycles —
          expect the resting resistance to drift upward over the sensor&apos;s
          life, which is worth designing around rather than calibrating away
          once.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Joint angle sensing on a garment: an elbow, a knuckle, a knee. Good
          for coarse gesture recognition (bent / straight / how far) rather
          than fine measurement, and best paired with a design that expects
          drift rather than one that depends on a stable zero point.
        </p>
        <p className="foot-nav">
          <Link href="/components/capacitive-touch-matrix">← capacitive touch matrix</Link>
          <span>next: <Link href="/components/haptic-motor">haptic motor →</Link></span>
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
