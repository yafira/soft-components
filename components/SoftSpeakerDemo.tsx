"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createTone, type Tone } from "../lib/audio";
import {
  dampingFor,
  stepSpring,
  usePrefersReducedMotion,
  type SpringState,
} from "../lib/physics";
import { demoCss } from "./demoStyles";

// fabric is lossy, so the diaphragm thuds more than it rings
const ZETA = 0.22;
const F_MIN = 50;
const F_MAX = 2000;

// the real resonance is hundreds of hz, far too fast to see, so the picture
// runs slowed down until the resonance lands at this many hz on screen
const VIEW_F0 = 2.5;

// diaphragm geometry in svg units, positive displacement moves toward the listener
const REST_Y = 100;
const LEFT_X = 60;
const RIGHT_X = 420;
const MID_X = 240;
const PX_PER_UNIT = 14;
const MAX_DISPLACEMENT = 32;

// chart geometry
const PLOT_L = 34;
const PLOT_R = 464;
const PLOT_T = 14;
const PLOT_B = 108;
const DB_FLOOR = -40;

function frequencyAt(position: number) {
  return F_MIN * Math.pow(F_MAX / F_MIN, position / 100);
}

function resonanceAt(position: number) {
  return 200 + (position / 100) * 600;
}

// how far a driven damped oscillator moves, as a multiple of its static deflection
function displacementGain(ratio: number) {
  const stiff = 1 - ratio * ratio;
  return 1 / Math.sqrt(stiff * stiff + (2 * ZETA * ratio) ** 2);
}

// a small direct radiator pushes air in proportion to its acceleration,
// which is displacement times frequency squared
function outputGain(ratio: number) {
  return ratio * ratio * displacementGain(ratio);
}

function xOfFrequency(hz: number) {
  const span = Math.log(F_MAX / F_MIN);
  return PLOT_L + (Math.log(hz / F_MIN) / span) * (PLOT_R - PLOT_L);
}

function yOfDb(db: number) {
  const clamped = Math.max(DB_FLOOR, Math.min(0, db));
  return PLOT_T + (clamped / DB_FLOOR) * (PLOT_B - PLOT_T);
}

const ink = "var(--scd-ink)";
const paper = "var(--scd-paper)";
const accent = "var(--scd-accent)";
const muted = "var(--scd-muted)";
const fabric = "var(--scd-fabric)";

export default function SoftSpeakerDemo() {
  const reduced = usePrefersReducedMotion();
  const id = useId();

  const [pitch, setPitch] = useState(48);
  const [tension, setTension] = useState(33);
  const [drive, setDrive] = useState(60);
  const [playing, setPlaying] = useState(false);

  const freq = frequencyAt(pitch);
  const f0 = resonanceAt(tension);
  const ratio = freq / f0;

  // the response curve depends only on the resonance, so it is worth caching
  const response = useMemo(() => {
    const samples = 120;
    const values: { hz: number; gain: number }[] = [];
    let peak = 0;
    for (let i = 0; i <= samples; i++) {
      const hz = frequencyAt((i / samples) * 100);
      const gain = outputGain(hz / f0);
      peak = Math.max(peak, gain);
      values.push({ hz, gain });
    }
    const path = values
      .map(({ hz, gain }, i) => {
        const db = 20 * Math.log10(Math.max(gain, 1e-6) / peak);
        return `${i === 0 ? "M" : "L"} ${xOfFrequency(hz).toFixed(1)} ${yOfDb(db).toFixed(1)}`;
      })
      .join(" ");
    return { path, peak };
  }, [f0]);

  const db = 20 * Math.log10(Math.max(outputGain(ratio), 1e-6) / response.peak);

  const tone = useRef<Tone | null>(null);

  // start and stop the oscillator
  useEffect(() => {
    if (!playing) return;
    const created = createTone("sine");
    tone.current = created;
    return () => {
      created?.stop();
      if (tone.current === created) tone.current = null;
    };
  }, [playing]);

  // keep pitch and loudness in step with the sliders
  useEffect(() => {
    if (!playing) return;
    tone.current?.setFrequency(freq);
    tone.current?.setLevel((drive / 100) * Math.pow(10, db / 20));
  }, [playing, freq, drive, db]);

  const diaphragm = useRef<SVGPathElement>(null);
  const weave = useRef<SVGPathElement>(null);
  const coil = useRef<SVGGElement>(null);
  const waves = useRef<SVGGElement>(null);

  const spring = useRef<SpringState>({ x: 0, v: 0 });
  const envelope = useRef(0);
  const clock = useRef(0);
  const live = useRef({ ratio, drive: drive / 100, playing });

  useEffect(() => {
    live.current = { ratio, drive: drive / 100, playing };
  }, [ratio, drive, playing]);

  // draw the diaphragm at a displacement, in units of static deflection
  const paint = useCallback((units: number, glow: number) => {
    const raw = units * PX_PER_UNIT;
    const shift = Math.max(-MAX_DISPLACEMENT, Math.min(MAX_DISPLACEMENT, raw));
    const control = REST_Y - 2 * shift;
    const d = `M ${LEFT_X} ${REST_Y} Q ${MID_X} ${control.toFixed(2)} ${RIGHT_X} ${REST_Y}`;
    diaphragm.current?.setAttribute("d", d);
    weave.current?.setAttribute("d", d);
    coil.current?.setAttribute("transform", `translate(0 ${(-shift).toFixed(2)})`);
    waves.current?.setAttribute("opacity", String(Math.min(1, glow)));
  }, []);

  // reduced motion: hold still at the steady-state deflection
  useEffect(() => {
    if (!reduced) return;
    const steady = playing ? (drive / 100) * displacementGain(ratio) : 0;
    paint(steady, playing ? 1 : 0);
  }, [reduced, playing, drive, ratio, paint]);

  // otherwise simulate: a spring whose target is the drive signal, so the
  // diaphragm lags, overshoots, and rings the way a real one does
  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    let last = performance.now();
    const natural = 2 * Math.PI * VIEW_F0;
    const stiffness = natural * natural;
    const damping = dampingFor(stiffness, ZETA);

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const { ratio: r, drive: level, playing: on } = live.current;
      const omega = natural * r;
      const substeps = 4;
      const h = dt / substeps;

      for (let i = 0; i < substeps; i++) {
        clock.current += h;
        const target = on ? level * Math.cos(omega * clock.current) : 0;
        stepSpring(spring.current, target, stiffness, damping, h);
      }

      envelope.current = Math.max(
        Math.abs(spring.current.x) * 0.9,
        envelope.current * 0.94,
      );
      paint(spring.current.x, envelope.current);
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduced, paint]);

  const slowdown = Math.round(f0 / VIEW_F0);

  return (
    <div className="scd">
      <style>{demoCss}</style>

      <div className="scd-stage">
        <svg
          viewBox="0 0 480 250"
          role="img"
          aria-label="Side view of a soft speaker: a stitched thread coil hangs from a fabric diaphragm above a magnet. The diaphragm moves as the tone plays."
        >
          <line x1={LEFT_X} y1={REST_Y} x2={LEFT_X} y2={222} style={{ stroke: muted }} strokeWidth={2} />
          <line x1={RIGHT_X} y1={REST_Y} x2={RIGHT_X} y2={222} style={{ stroke: muted }} strokeWidth={2} />
          <line x1={LEFT_X} y1={222} x2={RIGHT_X} y2={222} style={{ stroke: muted }} strokeWidth={2} />

          <rect x={180} y={200} width={60} height={22} rx={3} style={{ fill: ink }} />
          <rect x={240} y={200} width={60} height={22} rx={3} style={{ fill: accent }} />
          <text x={210} y={216} textAnchor="middle" fontSize={13} style={{ fill: paper }}>N</text>
          <text x={270} y={216} textAnchor="middle" fontSize={13} style={{ fill: paper }}>S</text>

          <g ref={coil}>
            <line x1={MID_X} y1={REST_Y} x2={MID_X} y2={150} style={{ stroke: muted }} strokeWidth={2} />
            {[190, 210, 230, 250, 270, 290].map((cx) => (
              <ellipse key={cx} cx={cx} cy={156} rx={11} ry={7} fill="none" style={{ stroke: accent }} strokeWidth={2.5} />
            ))}
          </g>

          <path
            ref={diaphragm}
            d={`M ${LEFT_X} ${REST_Y} Q ${MID_X} ${REST_Y} ${RIGHT_X} ${REST_Y}`}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            style={{ stroke: fabric }}
          />
          <path
            ref={weave}
            d={`M ${LEFT_X} ${REST_Y} Q ${MID_X} ${REST_Y} ${RIGHT_X} ${REST_Y}`}
            fill="none"
            strokeWidth={10}
            strokeDasharray="2 5"
            opacity={0.55}
            style={{ stroke: paper }}
          />

          <g ref={waves} opacity={0} fill="none" style={{ stroke: accent }} strokeWidth={2.5} strokeLinecap="round">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M ${190 - i * 18} ${70 - i * 22} Q ${MID_X} ${44 - i * 22} ${290 + i * 18} ${70 - i * 22}`}
                opacity={1 - i * 0.3}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="scd-stage">
        <svg
          viewBox="0 0 480 140"
          role="img"
          aria-label={`Frequency response of the speaker. It resonates near ${Math.round(f0)} hertz. The current tone is ${Math.round(freq)} hertz, ${Math.abs(Math.round(db))} decibels below the peak.`}
        >
          <line x1={PLOT_L} y1={PLOT_B} x2={PLOT_R} y2={PLOT_B} style={{ stroke: muted }} />
          <line x1={PLOT_L} y1={PLOT_T} x2={PLOT_L} y2={PLOT_B} style={{ stroke: muted }} />
          <text x={PLOT_L - 6} y={PLOT_T + 4} textAnchor="end" fontSize={10} style={{ fill: muted }}>0 dB</text>
          <text x={PLOT_L - 6} y={PLOT_B} textAnchor="end" fontSize={10} style={{ fill: muted }}>-40</text>
          {[100, 250, 500, 1000, 2000].map((hz) => (
            <text key={hz} x={xOfFrequency(hz)} y={126} textAnchor="middle" fontSize={10} style={{ fill: muted }}>
              {hz >= 1000 ? `${hz / 1000}k` : hz}
            </text>
          ))}
          <line
            x1={xOfFrequency(f0)}
            y1={PLOT_T}
            x2={xOfFrequency(f0)}
            y2={PLOT_B}
            strokeDasharray="3 4"
            style={{ stroke: accent }}
          />
          <path d={response.path} fill="none" strokeWidth={2} style={{ stroke: ink }} />
          <circle cx={xOfFrequency(freq)} cy={yOfDb(db)} r={5} style={{ fill: accent }} />
        </svg>
      </div>

      <div className="scd-controls">
        <div className="scd-toolbar">
          <button
            type="button"
            className="scd-btn"
            aria-pressed={playing}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? "stop tone" : "play tone"}
          </button>
        </div>

        <div className="scd-row">
          <label htmlFor={`${id}-pitch`}>pitch</label>
          <input
            id={`${id}-pitch`}
            type="range"
            min={0}
            max={100}
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            aria-valuetext={`${Math.round(freq)} hertz`}
          />
          <output htmlFor={`${id}-pitch`}>{Math.round(freq)} hz</output>
        </div>

        <div className="scd-row">
          <label htmlFor={`${id}-tension`}>fabric tension</label>
          <input
            id={`${id}-tension`}
            type="range"
            min={0}
            max={100}
            value={tension}
            onChange={(e) => setTension(Number(e.target.value))}
            aria-valuetext={`resonance at ${Math.round(f0)} hertz`}
          />
          <output htmlFor={`${id}-tension`}>{Math.round(f0)} hz</output>
        </div>

        <div className="scd-row">
          <label htmlFor={`${id}-drive`}>drive current</label>
          <input
            id={`${id}-drive`}
            type="range"
            min={0}
            max={100}
            value={drive}
            onChange={(e) => setDrive(Number(e.target.value))}
          />
          <output htmlFor={`${id}-drive`}>{drive}%</output>
        </div>

        <p className="scd-note">
          resonance at {Math.round(f0)} hz. this tone is {Math.abs(Math.round(db))} db below the loudest the
          fabric can be. the picture is slowed about {slowdown}x so the motion is visible.
          {reduced ? " reduced motion is on, so the diaphragm holds still at its steady deflection." : ""}
        </p>
      </div>
    </div>
  );
}
