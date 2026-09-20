import type { Metadata } from "next";
import LazyZipperSensorDemo from "../../../components/LazyZipperSensorDemo";

export const metadata: Metadata = {
  title: "zipper sensor",
  description:
    "a zipper as a position sensor, read two ways: as resistance and as capacitance.",
};

const code = `// engaged teeth are contacts in parallel between the two rows
const resistance = (n: number) =>
  n === 0 ? Infinity : R_RAIL + R_TOOTH / n;

// engaged teeth are plates in parallel, and capacitances add
const capacitance = (n: number) => C_STRAY + C_TOOTH * n;

// each snag is a small gaussian hill the slider has to be pulled over
const u = (x - snag) / SNAG_WIDTH;
accel += SNAG_FORCE * u * Math.exp(-u * u);`;

// swap this markup for whatever your entry pages use
export default function ZipperSensorPage() {
  return (
    <article>
      <h1>zipper sensor</h1>
      <p>
        a linear position sensor that people already know how to use. pull the slider and more pairs of teeth
        interlock.
      </p>

      <LazyZipperSensorDemo />

      <h2>the physics</h2>
      <p>
        there are two easy ways to read a zipper. in the resistive mode, every engaged pair of teeth is a
        contact between the two rows. contacts in parallel share the current, so resistance falls roughly as
        1/n, plus a fixed amount for the rows themselves. that curve is steep near open and flat near closed,
        so most of the resolution sits at the open end.
      </p>
      <p>
        in the capacitive mode, each engaged pair adds a little capacitance between the rows, and capacitances
        in parallel add. the reading grows in a straight line with the number of teeth, plus some stray
        capacitance. the dashed curve on the graph is the mode you are not using, so you can compare.
      </p>
      <p>
        the numbers here come from a simple model, not a measurement. real values depend on the teeth, the
        thread, and how the wires attach.
      </p>
      <p>
        the snags are stick-slip friction. static friction is higher than sliding friction, so the slider
        sticks, then lurches once it is pulled over the hill. it is the same effect that makes a violin string
        sing.
      </p>

      <h2>the material</h2>
      <p>
        metal teeth conduct. coil and molded plastic teeth do not, until you coat them or sew conductive thread
        along them.
      </p>
      <p>
        wear and oxidation raise contact resistance over time, so a resistive zipper drifts. a capacitive one
        tends to be less sensitive to contact wear. either way, plan for lint and moisture.
      </p>

      <h2>the design context</h2>
      <p>
        the gesture is already in people&apos;s hands: opening a bag, closing a jacket. reading it as data lets
        a garment know when it is open, or lets you play something by zipping.
      </p>

      <h2>the code</h2>
      <pre>
        <code>{code}</code>
      </pre>
    </article>
  );
}
