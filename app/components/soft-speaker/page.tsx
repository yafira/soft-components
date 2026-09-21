import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import LazySoftSpeakerDemo from "@/components/LazySoftSpeakerDemo";
import styles from "../entry.module.css";

export const metadata: Metadata = {
  title: "soft speaker — soft components",
  description:
    "A stitched coil, a magnet, and a piece of fabric that moves air: the physics, the material, the design thinking, and the code.",
};

export default function SoftSpeakerPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}>
          <Link href="/#library">library</Link> / output
        </p>
        <h1>soft speaker</h1>
        <p className={styles.lede}>
          A coil of conductive thread, a magnet, and a piece of fabric that
          moves air. It is quiet, and that is part of what makes it
          interesting. Play a tone below — and tune how tight the fabric is
          stretched.
        </p>
      </header>

      <section
        className={styles.panel}
        aria-labelledby="demo-h"
        style={{ "--panel-border": "var(--blush)" } as CSSProperties}
      >
        <h2 id="demo-h">play a tone</h2>
        <LazySoftSpeakerDemo />
      </section>

      <section aria-labelledby="inside-h">
        <h2 id="inside-h">what happens inside</h2>
        <p>
          A speaker is a small motor. Current through a coil sitting in a
          magnetic field feels a force, F = B·I·L, and that force pushes a
          diaphragm back and forth. The diaphragm pushes air, and moving air is
          sound. In a soft speaker the coil is conductive thread stitched into
          a spiral, and the diaphragm is the fabric it is stitched to.
        </p>
      </section>

      <section aria-labelledby="physics-h">
        <h2 id="physics-h">the physics (and the code)</h2>
        <p>
          The diaphragm is also a spring and a mass, so it has a resonant
          frequency, f₀ = (1/2π)√(k/m). In the simple model behind the curve
          above, output climbs with the square of frequency below f₀ and
          levels off above it. Fabric is lossy, so the peak at f₀ is a soft
          bump rather than a ring. The damping ratio is fixed at 0.22 here.
        </p>
        <pre>
          <code>{`// how far a driven damped oscillator moves, relative to its static deflection
function displacementGain(ratio: number, zeta = 0.22) {
  const stiff = 1 - ratio * ratio;
  return 1 / Math.sqrt(stiff * stiff + (2 * zeta * ratio) ** 2);
}

// a small direct radiator moves air in proportion to acceleration,
// which is displacement times frequency squared
function outputGain(ratio: number) {
  return ratio * ratio * displacementGain(ratio);
}`}</code>
        </pre>
        <p>
          The picture on top runs the same kind of spring the rest of the
          library does: the drive signal is the target, and the diaphragm
          chases it, lagging, overshooting, and settling. It is slowed down by
          a factor of a hundred or more so you can watch it. The tone you hear
          is not slowed down.
        </p>
        <pre>
          <code>{`const target = level * Math.cos(2 * Math.PI * freq * t);
stepSpring(state, target, stiffness, damping, dt);`}</code>
        </pre>
      </section>

      <section aria-labelledby="material-h">
        <h2 id="material-h">the material</h2>
        <p>
          Thin conductive thread has a lot of resistance for its length, so a
          stitched coil has few turns and takes little current. That is why
          textile speakers sound quiet next to a paper cone.
        </p>
        <p>
          Stiffen the fabric with interfacing or starch and f₀ rises. Use
          something looser and heavier and it falls. The tension slider is
          doing exactly that. A disc magnet under the coil supplies the field,
          and strong magnets pinch fingers and wipe cards, so mind where they
          land.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          When the sound should feel like it belongs to the object: a pillow
          that hums, a sleeve that whispers, a wall hanging that answers when
          you touch it. Low volume is a feature there. It pairs well with the
          haptic motor — one confirms with touch, the other with sound.
        </p>
        <p className={styles.footNav}>
          <Link href="/#library">← back to the library</Link>
          <span>
            related:{" "}
            <Link href="/components/haptic-motor">haptic motor →</Link>
          </span>
        </p>
      </section>
    </article>
  );
}
