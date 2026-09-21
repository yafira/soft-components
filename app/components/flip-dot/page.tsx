import type { Metadata } from "next";
import LazyFlipDotDemo from "../../../components/LazyFlipDotDemo";

export const metadata: Metadata = {
  title: "flip-dot",
  description:
    "a display made of magnetized discs that flip between two faces and stay put with the power off.",
};

const code = `// the magnet pulls the disc toward angle 0 or pi,
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
}`;

// swap this markup for whatever your entry pages use
export default function FlipDotPage() {
  return (
    <article>
      <h1>flip-dot</h1>
      <p>
        a display made of magnetized discs. each one flips between two faces and stays put with the power off.
      </p>

      <LazyFlipDotDemo />

      <h2>the physics</h2>
      <p>
        each dot is a disc with a magnet in it, painted a different color on each side. it has two stable
        positions, one per face, and a coil that can kick it from one to the other.
      </p>
      <p>
        in the model, each disc is a torsion pendulum in a double well. the magnet pulls it toward face up or
        face down, and a short coil pulse pushes it over the barrier in between. it flips, hits a hard stop,
        and bounces off it a little. that bounce is the click.
      </p>
      <p>
        because the magnet holds the disc, the display uses no power to keep an image. it is bistable, like
        e-ink, and power only goes in when the picture changes. many boards flip a column at a time, which is
        the sweep you see when the message changes.
      </p>
      <p>
        a real flip takes about ten milliseconds. slow motion runs the simulation at about an eighth of real
        speed so you can see the disc land and rattle.
      </p>

      <h2>the material</h2>
      <p>
        the classic build is a small disc with a magnet on a pin, sitting inside a coil. a soft version is an
        open question. a felt disc with a magnet stitched into it would be heavier and quieter, with a softer
        stop. what would it sound like?
      </p>

      <h2>the design context</h2>
      <p>
        flip-dots come from transit signs and scoreboards. they are readable in sunlight, they hold their
        message with the power off, and they make a sound a screen cannot fake.
      </p>

      <h2>the code</h2>
      <pre>
        <code>{code}</code>
      </pre>
    </article>
  );
}
