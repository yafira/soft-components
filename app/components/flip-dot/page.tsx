import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import LazyFlipDotDemo from "@/components/LazyFlipDotDemo";
import styles from "../entry.module.css";

export const metadata: Metadata = {
  title: "flip-dot — soft components",
  description:
    "A display of magnetized discs that hold their picture with the power off: the physics, the material, the design thinking, and the code.",
};

export default function FlipDotPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}>
          <Link href="/#library">library</Link> / display
        </p>
        <h1>flip-dot</h1>
        <p className={styles.lede}>
          A display made of magnetized discs. Each one flips between two faces
          and stays put with the power off. Type a message, or flip dots by
          hand — and slow it down to watch a disc land.
        </p>
      </header>

      <section
        className={styles.panel}
        aria-labelledby="demo-h"
        style={{ "--panel-border": "var(--butter)" } as CSSProperties}
      >
        <h2 id="demo-h">flip it</h2>
        <LazyFlipDotDemo />
      </section>

      <section aria-labelledby="inside-h">
        <h2 id="inside-h">what happens inside</h2>
        <p>
          Each dot is a disc with a magnet in it, painted a different color on
          each side. It has two stable positions, one per face, and a coil that
          can kick it from one to the other. Because the magnet holds the disc,
          the display uses no power to keep an image. It is bistable, like
          e-ink, and power only goes in when the picture changes. Many boards
          flip a column at a time, which is the sweep you see when the message
          changes.
        </p>
      </section>

      <section aria-labelledby="physics-h">
        <h2 id="physics-h">the physics (and the code)</h2>
        <p>
          In the model, each disc is a torsion pendulum in a double well. The
          magnet pulls it toward face up or face down, and a short coil pulse
          pushes it over the barrier in between. It flips, hits a hard stop,
          and bounces off it a little. That bounce is the click.
        </p>
        <pre>
          <code>{`// the magnet pulls the disc toward angle 0 or pi,
// and a short coil pulse kicks it over the barrier between them
let torque = -WELL_TORQUE * Math.sin(2 * theta) - DAMPING * omega;
if (pulsing) torque += direction * PULSE_TORQUE;

omega += torque * dt;
theta += omega * dt;

// the hard stop: bounce off it, and click if it hit hard enough
if (theta > Math.PI) {
  theta = Math.PI;
  if (omega > MIN_IMPACT) click(omega);
  omega = -omega * RESTITUTION;
}`}</code>
        </pre>
        <p>
          A real flip takes about ten milliseconds. Slow motion runs the
          simulation at about an eighth of real speed so you can see the disc
          land and rattle.
        </p>
      </section>

      <section aria-labelledby="material-h">
        <h2 id="material-h">the material</h2>
        <p>
          The classic build is a small disc with a magnet on a pin, sitting
          inside a coil. A soft version is an open question. A felt disc with a
          magnet stitched into it would be heavier and quieter, with a softer
          stop. What would it sound like?
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Flip-dots come from transit signs and scoreboards. They are readable
          in sunlight, they hold their message with the power off, and they
          make a sound a screen cannot fake. Reach for one when a display
          should change rarely and be felt as much as read — the same trade the
          e-ink refresh makes.
        </p>
        <p className={styles.footNav}>
          <Link href="/#library">← back to the library</Link>
          <span>
            related: <Link href="/components/eink-refresh">e-ink refresh →</Link>
          </span>
        </p>
      </section>
    </article>
  );
}
