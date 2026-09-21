import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import LazyZipperSensorDemo from "@/components/LazyZipperSensorDemo";
import styles from "../entry.module.css";

export const metadata: Metadata = {
  title: "zipper sensor — soft components",
  description:
    "A zipper read as a position sensor, two ways: the physics, the material, the design thinking, and the code.",
};

export default function ZipperSensorPage() {
  return (
    <article className={`wrap ${styles.entry}`}>
      <header className={styles.entryHeader}>
        <p className={styles.crumb}>
          <Link href="/#library">library</Link> / input
        </p>
        <h1>zipper sensor</h1>
        <p className={styles.lede}>
          A linear position sensor people already know how to use. Pull the
          slider and more pairs of teeth interlock. Read it as resistance or as
          capacitance below, and feel it catch on the way.
        </p>
      </header>

      <section
        className={styles.panel}
        aria-labelledby="demo-h"
        style={{ "--panel-border": "var(--wisteria)" } as CSSProperties}
      >
        <h2 id="demo-h">pull it</h2>
        <LazyZipperSensorDemo />
      </section>

      <section aria-labelledby="inside-h">
        <h2 id="inside-h">what happens inside</h2>
        <p>
          There are two easy ways to read a zipper. In the resistive mode,
          every engaged pair of teeth is a contact between the two rows.
          Contacts in parallel share the current, so resistance falls roughly
          as 1/n, plus a fixed amount for the rows themselves. That curve is
          steep near open and flat near closed, so most of the resolution sits
          at the open end.
        </p>
        <p>
          In the capacitive mode, each engaged pair adds a little capacitance
          between the rows, and capacitances in parallel add. The reading grows
          in a straight line with the number of teeth, plus some stray
          capacitance. The dashed curve on the graph is the mode you are not
          using, so you can compare the two.
        </p>
        <p>
          The numbers come from a simple model, not a measurement. Real values
          depend on the teeth, the thread, and how the wires attach.
        </p>
      </section>

      <section aria-labelledby="physics-h">
        <h2 id="physics-h">the physics (and the code)</h2>
        <p>
          The catch is stick-slip friction. Static friction is higher than
          sliding friction, so the slider sticks, then lurches once it is
          pulled over the hill. It is the same effect that makes a violin
          string sing. Here each snag is a small hill in the slider&apos;s
          path, and the pull from your cursor is a damped spring:
        </p>
        <pre>
          <code>{`// engaged teeth are contacts in parallel between the two rows
const resistance = (n: number) =>
  n === 0 ? Infinity : R_RAIL + R_TOOTH / n;

// engaged teeth are plates in parallel, and capacitances add
const capacitance = (n: number) => C_STRAY + C_TOOTH * n;

// each snag is a small gaussian hill the slider has to be pulled over
const u = (x - snag) / SNAG_WIDTH;
accel += SNAG_FORCE * u * Math.exp(-u * u);`}</code>
        </pre>
        <p>
          The pull tab swings behind the slider on its own small spring, driven
          by how fast the slider is moving.
        </p>
      </section>

      <section aria-labelledby="material-h">
        <h2 id="material-h">the material</h2>
        <p>
          Metal teeth conduct. Coil and molded plastic teeth do not, until you
          coat them or sew conductive thread along them.
        </p>
        <p>
          Wear and oxidation raise contact resistance over time, so a resistive
          zipper drifts. A capacitive one tends to be less sensitive to contact
          wear. Either way, plan for lint and moisture.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          When the gesture is already in people&apos;s hands: opening a bag,
          closing a jacket. Reading it as data lets a garment know when it is
          open, or lets you play something by zipping. It pairs well with the
          fabric bend sensor for anything that folds and closes.
        </p>
        <p className={styles.footNav}>
          <Link href="/#library">← back to the library</Link>
          <span>
            related:{" "}
            <Link href="/components/fabric-bend-sensor">
              fabric bend sensor →
            </Link>
          </span>
        </p>
      </section>
    </article>
  );
}
