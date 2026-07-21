import type { Metadata } from 'next';
import Link from 'next/link';
import LazyHapticMotorDemo from '@/components/LazyHapticMotorDemo';

export const metadata: Metadata = {
  title: 'haptic motor — soft components',
  description: 'A felt button that talks back: three vibration signatures, and the physics of a felt-damped pulse.',
};

export default function HapticMotorPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / output</p>
        <h1>haptic motor</h1>
        <p className="lede">
          The first output in the library. A small vibration motor under felt,
          confirming a press without a sound or a light. Try the three
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
          This demo models an ERM (eccentric rotating mass) motor
          specifically — the small coin-shaped vibration motors in most
          phones and controllers. Inside, an off-center weight spins on a
          shaft; because the mass is lopsided, spinning it fast makes the
          whole housing shake. The dark wedge in the illustration above is
          that eccentric weight, shown at rest — the buzz itself comes
          through the rings and the sound, rather than an animated spin,
          keeping the visual quieter while the signature plays.
        </p>
        <p>
          The buzz is real audio, not a sound effect file — a single Web
          Audio triangle-wave oscillator whose gain is driven by the same
          envelope function as the visuals. Kept deliberately simple: one
          oscillator, one gain node, straight to the speakers — fewer moving
          parts means fewer places for playback to go wrong across
          different browsers.
        </p>
        <pre><code>{`gainNode.gain.setValueAtTime(0.0001, now);
for (let i = 1; i <= samples; i++) {
  const t = (i / samples) * duration;
  gainNode.gain.linearRampToValueAtTime(envelope(t) * 0.4, now + t);
}`}</code></pre>
        <p>
          This is also why a <a href="https://gsap.com">GSAP</a> timeline
          fits the job: a haptic signature is a sequence of timed events — a
          pulse, a pause, a second pulse — exactly what a timeline
          orchestrates, keeping the audio gain and the ring pulses in sync
          with each other.
        </p>
      </section>

      <section aria-labelledby="material-h">
        <h2 id="material-h">the material</h2>
        <p>
          Felt doesn&apos;t just sit on top of the motor — it filters it.
          Thicker or denser felt damps high-frequency buzz into a softer,
          rounder thump; thinner felt lets more of the motor&apos;s raw
          frequency through. The same motor under different felt thicknesses
          feels like a different motor. On the soft computer, each of the four
          felt buttons pairs a distinct signature with its own felt density, so
          the color and the feeling are designed together, not just the
          software pattern.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Anywhere a soft button needs to confirm itself without a click, a
          light, or a screen. A rising ramp reads as building intensity or
          loading; a double tap reads as acknowledgment; a single sharp pulse
          reads as a simple yes. Keep signatures distinct enough to tell apart
          by feel alone — that&apos;s the whole point of a felt object you
          might use without looking at it.
        </p>
        <p className="foot-nav">
          <Link href="/components/fabric-bend-sensor">← fabric bend sensor</Link>
          <span>next: <Link href="/components/thermochromic-reveal">thermochromic reveal →</Link></span>
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
          border: 2px dashed var(--wisteria-deep);
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
