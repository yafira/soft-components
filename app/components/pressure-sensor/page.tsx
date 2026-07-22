import type { Metadata } from 'next';
import Link from 'next/link';
import LazyPressureSensorDemo from '@/components/LazyPressureSensorDemo';
import styles from '../entry.module.css';

export const metadata: Metadata = {
  title: 'pressure sensor — soft components',
  description: 'A velostat pressure sensor: squeeze harder, resistance falls, force becomes an analog signal.',
};

export default function PressureSensorPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}><Link href="/#library">library</Link> / input</p>
        <h1>pressure sensor</h1>
        <p className={styles.lede}>
          Velostat between two layers of conductive fabric. Squeeze harder and
          resistance drops. Press and hold the stack below — the longer you
          hold, the harder you&apos;re &ldquo;squeezing.&rdquo;
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="demo-h">
        <h2 id="demo-h">squeeze it</h2>
        <LazyPressureSensorDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          Velostat is a polymer film loaded with carbon particles. Relaxed, the
          particles sit apart and current struggles across — high resistance.
          Squeeze, and particles crowd into contact, opening more conductive
          paths — resistance falls, roughly with the inverse of force. Put the
          sensor in a voltage divider and one analog pin reads how hard
          you&apos;re pressing, not just whether you are.
        </p>
        <p>
          The response is nonlinear and it drifts — velostat creeps under
          sustained load and remembers being folded. Calibrate per sensor,
          smooth the reading, and design for gestures (&ldquo;light / firm /
          squeeze&rdquo;) rather than newtons.
        </p>
        <p>
          This demo runs on <a href="https://gsap.com">GSAP</a> rather than a
          position spring: force builds on a quick ease-in while held, then
          decays on a slower ease-out after release — asymmetric timing tuned
          to feel like load building up and then a stack of fabric settling,
          rather than a spring snapping back to zero.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Anywhere force is the message: a plush object that responds to how
          it&apos;s hugged, a pressure map under a sock, expressive velocity
          for a fabric instrument. It&apos;s the workhorse of soft circuits —
          cheap, cuttable with scissors, sewable into almost anything.
        </p>
        <p className={styles.footNav}>
          <Link href="/components/soft-potentiometer">← soft potentiometer</Link>
          <span>next: <Link href="/components/knit-stretch-sensor">knit stretch sensor →</Link></span>
        </p>
      </section>
    </article>
  );
}
