"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  clamp,
  dampingFor,
  integrate,
  stepSpring,
  usePrefersReducedMotion,
  type SpringState,
} from "../lib/physics";
import { demoCss } from "./demoStyles";

const TEETH = 34;
const PITCH = 10;
const TOP = 30;
const BOTTOM = TOP + TEETH * PITCH;
const CX = 120;
const VIEW_W = 240;
const VIEW_H = 430;
const MAX_GAP = 44;
const TAPE = 30;

// places where the slider catches, as a fraction of the zipper's length
// each one is a small hill the slider has to be pulled over
const SNAGS = [0.19, 0.44, 0.68, 0.87];
const SNAG_WIDTH = 0.012;
const SNAG_FORCE = 18;

// a simple model of the two ways to read a zipper
const R_RAIL = 25; // ohms along the two tooth rows
const R_TOOTH = 120; // ohms through one engaged pair of teeth
const R_PULLUP = 100; // ohms, the fixed half of the divider
const C_STRAY = 4; // pf with the zipper open
const C_TOOTH = 1.1; // pf added by each engaged pair

type Mode = "resistive" | "capacitive";

function resistance(engaged: number) {
  return engaged === 0 ? Infinity : R_RAIL + R_TOOTH / engaged;
}

function adcResistive(engaged: number) {
  if (engaged === 0) return 1023;
  const r = resistance(engaged);
  return Math.round((1023 * r) / (r + R_PULLUP));
}

function capacitance(engaged: number) {
  return C_STRAY + C_TOOTH * engaged;
}

function adcCapacitive(engaged: number) {
  return Math.round((1023 * capacitance(engaged)) / (capacitance(TEETH) * 1.1));
}

function adcFor(mode: Mode, engaged: number) {
  return mode === "resistive" ? adcResistive(engaged) : adcCapacitive(engaged);
}

// how far the teeth have splayed apart at a given height
function gapAt(y: number, sliderY: number) {
  if (y >= sliderY) return 0;
  return MAX_GAP * (1 - Math.exp(-(sliderY - y) / 45));
}

// the plot for the transfer curve
const PLOT = { l: 36, r: 248, t: 10, b: 126 };

function curvePath(mode: Mode) {
  const points: string[] = [];
  for (let n = 0; n <= TEETH; n++) {
    const x = PLOT.l + (n / TEETH) * (PLOT.r - PLOT.l);
    const y = PLOT.b - (adcFor(mode, n) / 1023) * (PLOT.b - PLOT.t);
    points.push(`${n === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

const ink = "var(--scd-ink)";
const paper = "var(--scd-paper)";
const accent = "var(--scd-accent)";
const muted = "var(--scd-muted)";
const fabric = "var(--scd-fabric)";

export default function ZipperSensorDemo() {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>("resistive");
  const [view, setView] = useState({ p: 0.5, tab: 0 });

  const svg = useRef<SVGSVGElement>(null);
  const slider = useRef<SpringState>({ x: 0.5, v: 0 });
  const tab = useRef<SpringState>({ x: 0, v: 0 });
  const target = useRef(0.5);
  const dragging = useRef(false);
  const grab = useRef(0);
  const keyboard = useRef(false);
  const shown = useRef({ p: 0.5, tab: 0 });

  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const s = slider.current;
      const t = tab.current;

      if (reduced) {
        s.x = target.current;
        s.v = 0;
        t.x = 0;
        t.v = 0;
      } else {
        // the pull is a spring toward the cursor, and each snag is a small
        // hill that pushes back until the slider is dragged over its top
        const stiffness = keyboard.current ? 320 : 140;
        const damping = dampingFor(stiffness, 0.9);
        integrate(
          s,
          (x, v) => {
            let a = -stiffness * (x - target.current) - damping * v;
            for (const snag of SNAGS) {
              const u = (x - snag) / SNAG_WIDTH;
              a += SNAG_FORCE * u * Math.exp(-u * u);
            }
            return a;
          },
          dt,
        );
        if (s.x < 0) {
          s.x = 0;
          s.v = 0;
        } else if (s.x > 1) {
          s.x = 1;
          s.v = 0;
        }

        // the pull tab swings behind the slider like a small pendulum
        stepSpring(t, clamp(-s.v * 14, -30, 30), 180, dampingFor(180, 0.35), dt);
      }

      if (
        Math.abs(s.x - shown.current.p) > 1e-4 ||
        Math.abs(t.x - shown.current.tab) > 0.02
      ) {
        shown.current = { p: s.x, tab: t.x };
        setView({ p: s.x, tab: t.x });
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  const pointerY = (clientY: number) => {
    const el = svg.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return ((clientY - rect.top) / rect.height) * VIEW_H;
  };

  const positionAt = (y: number) => clamp((BOTTOM - y) / (BOTTOM - TOP), 0, 1);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const y = pointerY(e.clientY);
    const sliderY = BOTTOM - slider.current.x * (BOTTOM - TOP);
    grab.current = Math.abs(y - sliderY) < 30 ? y - sliderY : 0;
    dragging.current = true;
    keyboard.current = false;
    target.current = positionAt(y - grab.current);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    target.current = positionAt(pointerY(e.clientY) - grab.current);
  };

  const onPointerEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    // let go where the slider is, friction holds it there
    target.current = slider.current.x;
  };

  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    let next = target.current;
    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        next += 0.05;
        break;
      case "ArrowDown":
      case "ArrowLeft":
        next -= 0.05;
        break;
      case "PageUp":
        next += 0.2;
        break;
      case "PageDown":
        next -= 0.2;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    keyboard.current = true;
    target.current = clamp(next, 0, 1);
  };

  const { p, tab: tabAngle } = view;
  const engaged = Math.floor(p * TEETH + 1e-6);
  const sliderY = BOTTOM - p * (BOTTOM - TOP);

  const teeth: { key: string; x: number; y: number }[] = [];
  for (let i = 0; i < TEETH; i++) {
    const cellTop = BOTTOM - (i + 1) * PITCH;
    const gap = i < engaged ? 0 : gapAt(cellTop + PITCH / 2, sliderY);
    teeth.push({ key: `l${i}`, x: CX - 8 - gap, y: cellTop + 0.5 });
    teeth.push({ key: `r${i}`, x: CX - 1 + gap, y: cellTop + 5.5 });
  }

  const tapeEdge = (side: -1 | 1) => {
    const inner: string[] = [];
    const outer: string[] = [];
    for (let y = TOP; y <= BOTTOM; y += PITCH) {
      const gap = y >= sliderY ? 0 : gapAt(y, sliderY);
      const edge = side === -1 ? CX - 8 - gap : CX + 8 + gap;
      inner.push(`${edge.toFixed(1)} ${y}`);
      outer.push(`${(edge + side * TAPE).toFixed(1)} ${y}`);
    }
    return `M ${inner.join(" L ")} L ${outer.reverse().join(" L ")} Z`;
  };

  const adc = adcFor(mode, engaged);
  const reading =
    mode === "resistive"
      ? engaged === 0
        ? "open circuit"
        : `${resistance(engaged).toFixed(0)} ohms`
      : `${capacitance(engaged).toFixed(1)} pf`;

  const curves = useMemo(
    () => ({ resistive: curvePath("resistive"), capacitive: curvePath("capacitive") }),
    [],
  );

  const markerX = PLOT.l + (engaged / TEETH) * (PLOT.r - PLOT.l);
  const markerY = PLOT.b - (adc / 1023) * (PLOT.b - PLOT.t);
  const other: Mode = mode === "resistive" ? "capacitive" : "resistive";

  return (
    <div className="scd">
      <style>{demoCss}</style>

      <div className="scd-split">
        <div className="scd-stage">
          <svg
            ref={svg}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            role="slider"
            tabIndex={0}
            aria-label="zipper position"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={TEETH}
            aria-valuenow={engaged}
            aria-valuetext={`${engaged} of ${TEETH} teeth engaged`}
            style={{ touchAction: "none", cursor: "grab", userSelect: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onKeyDown={onKeyDown}
          >
            <path d={tapeEdge(-1)} style={{ fill: fabric }} />
            <path d={tapeEdge(1)} style={{ fill: fabric }} />
            <path
              d={tapeEdge(-1)}
              fill="none"
              strokeDasharray="2 5"
              opacity={0.5}
              style={{ stroke: paper }}
              strokeWidth={1.5}
            />
            <path
              d={tapeEdge(1)}
              fill="none"
              strokeDasharray="2 5"
              opacity={0.5}
              style={{ stroke: paper }}
              strokeWidth={1.5}
            />

            {teeth.map((tooth) => (
              <rect
                key={tooth.key}
                x={tooth.x}
                y={tooth.y}
                width={9}
                height={4.5}
                rx={1.5}
                style={{ fill: ink }}
              />
            ))}

            <rect x={CX - 12} y={TOP - 10} width={24} height={7} rx={3} style={{ fill: muted }} />
            <rect x={CX - 12} y={BOTTOM + 3} width={24} height={7} rx={3} style={{ fill: muted }} />

            <g transform={`translate(${CX} ${sliderY + 13}) rotate(${tabAngle.toFixed(1)})`}>
              <rect x={-8} y={0} width={16} height={34} rx={8} style={{ fill: ink }} />
              <rect x={-3} y={6} width={6} height={22} rx={3} style={{ fill: paper }} />
            </g>
            <rect x={CX - 20} y={sliderY - 13} width={40} height={26} rx={7} style={{ fill: accent }} />
            <line x1={CX - 10} y1={sliderY} x2={CX + 10} y2={sliderY} strokeWidth={2} strokeLinecap="round" style={{ stroke: paper }} />
          </svg>
        </div>

        <div className="scd-side">
          <div className="scd-toolbar" role="group" aria-label="sensing mode">
            <button
              type="button"
              className="scd-btn"
              aria-pressed={mode === "resistive"}
              onClick={() => setMode("resistive")}
            >
              resistive
            </button>
            <button
              type="button"
              className="scd-btn"
              aria-pressed={mode === "capacitive"}
              onClick={() => setMode("capacitive")}
            >
              capacitive
            </button>
          </div>

          <dl className="scd-readout">
            <div>
              <dt>teeth engaged</dt>
              <dd>
                {engaged} of {TEETH}
              </dd>
            </div>
            <div>
              <dt>{mode === "resistive" ? "resistance" : "capacitance"}</dt>
              <dd>{reading}</dd>
            </div>
            <div>
              <dt>adc reading</dt>
              <dd>{adc} / 1023</dd>
            </div>
          </dl>

          <svg
            viewBox="0 0 260 150"
            role="img"
            aria-label={`Transfer curve: adc reading against teeth engaged for the ${mode} sensing mode. Right now ${engaged} teeth give a reading of ${adc}.`}
          >
            <line x1={PLOT.l} y1={PLOT.b} x2={PLOT.r} y2={PLOT.b} style={{ stroke: muted }} />
            <line x1={PLOT.l} y1={PLOT.t} x2={PLOT.l} y2={PLOT.b} style={{ stroke: muted }} />
            <text x={PLOT.l - 5} y={PLOT.t + 4} textAnchor="end" fontSize={10} style={{ fill: muted }}>1023</text>
            <text x={PLOT.l - 5} y={PLOT.b} textAnchor="end" fontSize={10} style={{ fill: muted }}>0</text>
            <text x={PLOT.l} y={142} fontSize={10} style={{ fill: muted }}>open</text>
            <text x={PLOT.r} y={142} textAnchor="end" fontSize={10} style={{ fill: muted }}>closed</text>
            <path d={curves[other]} fill="none" strokeWidth={1.5} strokeDasharray="3 4" style={{ stroke: muted }} />
            <path d={curves[mode]} fill="none" strokeWidth={2.5} style={{ stroke: accent }} />
            <circle cx={markerX} cy={markerY} r={5} style={{ fill: ink }} />
          </svg>
        </div>
      </div>

      <p className="scd-note">
        drag the pull tab, click anywhere on the track, or focus the zipper and use the arrow keys. the slider
        catches on a few snags, so pull past them.
        {reduced ? " reduced motion is on, so the slider moves straight to where you point." : ""}
      </p>
    </div>
  );
}
