import type { Metadata } from 'next';
import Link from 'next/link';
import LazyHapticMotorDemo from '@/components/LazyHapticMotorDemo';

export const metadata: Metadata = {
  title: 'haptic motor — soft components',
  description: 'a felt button that talks back: three vibration signatures, and the physics of a felt-damped pulse.',
};

export default function HapticMotorPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / output</p>
        <h1>haptic motor</h1>
        <p className="lede">
          the first output in the library. a small vibration motor under felt,
          confirming a press without a sound or a light. try the three
          signatures below.
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
        <h2 id="demo-h">feel it</h2>
        <LazyHapticMotorDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          a small ERM (eccentric rotating mass) or LRA (linear resonant
          actuator) motor sits just under the felt. drive it and it vibrates;
          vary the drive signal&apos;s timing and you get a different feeling
          &mdash; a single tap, a double tap, a rising buzz. the waveform below
          the motor is the <em>envelope</em>: how strongly it&apos;s driven at
          each instant. that shape is the whole signature.
        </p>
        <p>
          this demo runs the three envelopes as <a href="https://gsap.com">GSAP</a>{' '}
          timelines rather than single tweens, because a haptic signature is
          inherently a sequence of timed events — a pulse, a pause, a second
          pulse — which is exactly what a timeline is for. the motor&apos;s
          scale bounce after each pulse uses an elastic ease, echoing how a
          real ERM motor keeps spinning briefly after power cuts.
        </p>
        <pre><code>{`const tl = gsap.timeline();
tl.to(motor, { scale: 1.18, duration: 0.12 })
  .to(motor, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }, 0.12);`}</code></pre>
      </section>

      <section aria-labelledby="material-h">
        <h2 id="material-h">the material</h2>
        <p>
          felt doesn&apos;t just sit on top of the motor — it filters it.
          thicker or denser felt damps high-frequency buzz into a softer,
          rounder thump; thinner felt lets more of the motor&apos;s raw
          frequency through. the same motor under different felt thicknesses
          feels like a different motor. on the soft computer, each of the four
          felt buttons pairs a distinct signature with its own felt density, so
          the color and the feeling are designed together, not just the
          software pattern.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          anywhere a soft button needs to confirm itself without a click, a
          light, or a screen. a rising ramp reads as building intensity or
          loading; a double tap reads as acknowledgment; a single sharp pulse
          reads as a simple yes. keep signatures distinct enough to tell apart
          by feel alone — that&apos;s the whole point of a felt object you
          might use without looking at it.
        </p>
        <p className="foot-nav">
          <Link href="/components/pressure-sensor">← pressure sensor</Link>
          <span>next: <Link href="/components/knit-stretch-sensor">knit stretch sensor →</Link></span>
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
