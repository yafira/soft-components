import type { Metadata } from 'next';
import Link from 'next/link';
import LazyFeltButtonDemo from '@/components/LazyFeltButtonDemo';
import LazyFeltButtonCutaway from '@/components/LazyFeltButtonCutaway';

export const metadata: Metadata = {
  title: 'soft button — soft components',
  description: 'A felt button you can press: the physics, the material, the design thinking, and the code.',
};

export default function SoftButtonPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / input</p>
        <h1>soft button</h1>
        <p className="lede">
          A dome of felt over a conductive pad. The gentlest possible way to say
          &ldquo;yes&rdquo; to a circuit. Press it below — and tune how soft it feels.
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
        <h2 id="demo-h">press it</h2>
        <LazyFeltButtonDemo />
      </section>

      <section aria-labelledby="inside-h">
        <h2 id="inside-h">what happens inside</h2>
        <p>
          A soft button is a sandwich. Felt on top, an air gap in the middle,
          conductive fabric below. At rest the gap keeps the circuit open. Press,
          and the felt carries your fingertip down until the two conductive layers
          touch — the circuit closes, current flows, your microcontroller sees a
          HIGH. Let go, and the felt&apos;s fibers push everything back apart.
        </p>
        <div className="panel">
          <LazyFeltButtonCutaway />
        </div>
      </section>

      <section aria-labelledby="physics-h">
        <h2 id="physics-h">the physics (and the code)</h2>
        <p>
          The on-screen squash isn&apos;t an easing curve. It&apos;s a simulation:
          the button&apos;s scale is a mass on a damped spring, integrated every
          frame. This page runs on <a href="https://motion.dev">motion</a>&apos;s
          spring engine rather than a hand-rolled loop — same underlying math,
          but tuned and battle-tested:
        </p>
        <pre><code>{`import { animate } from "motion";

animate(
  feltFace,
  { scaleY: [1, 0.78], scaleX: [1, 1.1] },
  { type: "spring", stiffness: 140, damping: 14 }
);`}</code></pre>
        <p>
          Underneath, it&apos;s the same integration a hand-rolled version would
          do — displacement, spring force, damping force, velocity, position,
          every frame — but Motion adds things worth not reinventing: velocity
          carries over correctly when you retarget mid-motion (press again
          before it settles and it doesn&apos;t jump), and it auto-stops once the
          spring settles rather than running an idle rAF loop forever.
        </p>
        <p>
          The character still lives in the <strong>damping ratio</strong> —
          damping / (2 · √(stiffness · mass)). At 1.0 the button settles with no
          bounce (rubbery, dead). Below 1.0 it overshoots and oscillates. Felt
          wants asymmetry: a yielding, over-damped press (fibers compress
          gradually, they don&apos;t click) and a lazily under-damped release,
          around 0.8–0.9 — one gentle overshoot, then rest. Fibers relax; they
          don&apos;t ping. The knobs above are wired directly to Motion&apos;s
          parameters, so you&apos;re tuning the real thing.
        </p>
        <p>
          Squash and stretch are derived from each other, not animated
          separately — when y compresses, x widens, like a material conserving
          volume. That single constraint is most of why it reads as
          &ldquo;soft.&rdquo;
        </p>
        <details className="deep-dive">
          <summary>See the raw integration Motion is doing for you</summary>
          <pre><code>{`const displacement = value - target;
const springForce  = -stiffness * displacement;
const dampingForce = -damping * velocity;
const acceleration = (springForce + dampingForce) / mass;

velocity += acceleration * dt;
value    += velocity * dt;`}</code></pre>
        </details>
      </section>

      <section aria-labelledby="material-h">
        <h2 id="material-h">the material</h2>
        <p>
          Wool felt is a nonwoven: fibers tangled in every direction, held by
          friction rather than structure. That&apos;s why the first millimeter
          of a press is easy and it firms up as fibers pack together —
          compression resistance rises with depth. It&apos;s also why felt
          recovers slowly and quietly instead of snapping back. A good digital
          felt button borrows both behaviors: progressive stiffness on the way
          down, damped patience on the way up.
        </p>
        <p>
          In fabrication: 3–5mm wool felt over conductive fabric (or conductive
          thread stitched in a spiral), with a foam or felt spacer ring creating
          the air gap. The spacer&apos;s thickness sets the actuation force —
          thicker gap, firmer press.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Anywhere a click would be too loud. Soft buttons suit calm technology:
          bedside objects, wearables, textile interfaces, anything meant to be
          touched slowly. They trade precision for warmth — no tactile click
          means you confirm the press some other way (a haptic pulse, a light,
          a change on screen). On the soft computer, each of the four felt
          buttons has its own haptic motor with a distinct signature, so your
          fingertip learns which corpus it pressed without looking.
        </p>
      </section>

      <section aria-labelledby="code-h">
        <h2 id="code-h">take the code</h2>
        <p>
          The FeltButtonDemo component powering this page, ready to drop into a
          React project.
        </p>
        <pre><code>{`import { animate } from "motion";

function press(face: HTMLElement, stiffness: number, damping: number, depth: number) {
  animate(
    face,
    { scaleY: 1 - depth, scaleX: 1 + depth * 0.6 },
    { type: "spring", stiffness: stiffness * 0.85, damping: damping * 1.35 }
  );
}

function release(face: HTMLElement, stiffness: number, damping: number) {
  animate(face, { scaleY: 1, scaleX: 1 }, { type: "spring", stiffness, damping });
}`}</code></pre>
        <p className="foot-nav">
          <Link href="/#library">← back to the library</Link>
          <span>next: <Link href="/components/soft-potentiometer">soft potentiometer →</Link></span>
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
          border: 2px dashed var(--wisteria);
          border-radius: var(--radius-lg);
          padding: 1.6rem;
        }

        .foot-nav {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
          font-size: 0.85rem;
          border-top: 1px dashed var(--line);
          padding-top: 1.4rem;
        }

        .deep-dive {
          margin-top: 1rem;
          border: 2px dashed var(--line);
          border-radius: var(--radius);
          padding: 0.2rem 1rem 0.9rem;
        }
        .deep-dive summary {
          cursor: pointer;
          padding: 0.8rem 0;
          font-size: 0.85rem;
          color: var(--wisteria-deep);
        }
        .deep-dive summary:hover { color: var(--blush-deep); }
      `}</style>
    </article>
  );
}
