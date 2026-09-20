import type { Metadata } from "next";
import LazySoftSpeakerDemo from "../../../components/LazySoftSpeakerDemo";

export const metadata: Metadata = {
  title: "soft speaker",
  description:
    "a stitched coil, a magnet, and a piece of fabric that moves air. quiet on purpose.",
};

const code = `// how far a driven damped oscillator moves, relative to its static deflection
function displacementGain(ratio: number, zeta = 0.22) {
  const stiff = 1 - ratio * ratio;
  return 1 / Math.sqrt(stiff * stiff + (2 * zeta * ratio) ** 2);
}

// a small direct radiator moves air in proportion to acceleration,
// which is displacement times frequency squared
function outputGain(ratio: number) {
  return ratio * ratio * displacementGain(ratio);
}

// the diaphragm is a spring whose target is the drive signal
const target = level * Math.cos(2 * Math.PI * freq * t);
stepSpring(state, target, stiffness, damping, dt);`;

// swap this markup for whatever your entry pages use
export default function SoftSpeakerPage() {
  return (
    <article>
      <h1>soft speaker</h1>
      <p>
        a coil of conductive thread, a magnet, and a piece of fabric that moves air. it is quiet, and that is
        part of what makes it interesting.
      </p>

      <LazySoftSpeakerDemo />

      <h2>the physics</h2>
      <p>
        a speaker is a small motor. current through a coil sitting in a magnetic field feels a force, F = B·I·L,
        and that force pushes a diaphragm back and forth. the diaphragm pushes air, and moving air is sound.
      </p>
      <p>
        the diaphragm is also a spring and a mass, so it has a resonant frequency, f₀ = (1/2π)√(k/m). in the
        simple model used here, output climbs with the square of frequency below f₀ and flattens out above it.
        fabric is lossy, so the peak at f₀ is a soft bump rather than a ring. the damping ratio is fixed at
        0.22 in this demo.
      </p>
      <p>
        the curve is that model, drawn as output relative to its peak in decibels. the picture on top is slowed
        down by a factor of a hundred or more so you can watch the diaphragm lag, overshoot, and settle. the
        tone you hear is not slowed down.
      </p>

      <h2>the material</h2>
      <p>
        thin conductive thread has a lot of resistance for its length, so a stitched coil has few turns and
        takes little current. that is why textile speakers sound quiet next to a paper cone.
      </p>
      <p>
        stiffen the fabric with interfacing or starch and f₀ rises. use something looser and heavier and it
        falls. the tension slider is doing exactly that. a disc magnet under the coil supplies the field, and
        strong magnets pinch fingers and wipe cards, so mind where they land.
      </p>

      <h2>the design context</h2>
      <p>
        a textile speaker puts sound inside the object: a pillow that hums, a sleeve that whispers, a wall
        hanging that answers when you touch it. low volume is a feature when the sound should feel like it
        belongs to the fabric.
      </p>

      <h2>the code</h2>
      <pre>
        <code>{code}</code>
      </pre>
    </article>
  );
}
