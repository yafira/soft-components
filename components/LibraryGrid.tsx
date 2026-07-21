'use client';

import { useRef } from "react";
import Link from "next/link";
import { animate } from "motion";
import { color } from "electrocute-ui";
import { prefersReducedMotion } from "@/lib/spring";

export default function LibraryGrid() {
  const feltRef = useRef<SVGGElement>(null);
  const btnStateRef = useRef<SVGTextElement>(null);

  const wiperRef = useRef<SVGCircleElement>(null);
  const potValueRef = useRef<SVGTextElement>(null);

  const topRef = useRef<SVGRectElement>(null);
  const veloRef = useRef<SVGRectElement>(null);
  const pressValueRef = useRef<SVGTextElement>(null);

  const knitPathRef = useRef<SVGPathElement>(null);

  const matrixPadsRef = useRef<(SVGRectElement | null)[]>([]);
  const bendPathRef = useRef<SVGPathElement>(null);

  const motorRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const thermoPatchRef = useRef<SVGRectElement>(null);

  const einkPanelRef = useRef<SVGRectElement>(null);

  const playButton = () => {
    const felt = feltRef.current;
    const state = btnStateRef.current;
    if (!felt || !state) return;
    const reduced = prefersReducedMotion();
    state.textContent = 'Circuit closed — signal!';
    animate(
      felt,
      { y: 30, scaleX: 1.08, scaleY: 0.55 },
      { type: 'spring', stiffness: 120, damping: 18, duration: reduced ? 0 : undefined }
    ).then(() => {
      setTimeout(() => {
        animate(
          felt,
          { y: 0, scaleX: 1, scaleY: 1 },
          { type: 'spring', stiffness: 170, damping: 14, duration: reduced ? 0 : undefined }
        );
        state.textContent = 'Circuit open';
      }, reduced ? 0 : 320);
    });
  };

  const playPot = () => {
    const wiper = wiperRef.current;
    const value = potValueRef.current;
    if (!wiper || !value) return;
    const reduced = prefersReducedMotion();
    const start = parseFloat(wiper.getAttribute('cx') || '52');
    const end = start < 100 ? 168 : 52;
    if (reduced) {
      wiper.setAttribute('cx', String(end));
      value.textContent = ((end - 52) / 116).toFixed(2);
      return;
    }
    const duration = 480;
    const t0 = performance.now();
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    function frame(now: number) {
      const t = Math.min((now - t0) / duration, 1);
      const eased = easeInOut(t);
      const cx = start + (end - start) * eased;
      wiper!.setAttribute('cx', String(cx));
      value!.textContent = ((cx - 52) / 116).toFixed(2);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  const playPressure = () => {
    const top = topRef.current;
    const velo = veloRef.current;
    const value = pressValueRef.current;
    if (!top || !velo || !value) return;
    const reduced = prefersReducedMotion();
    value.textContent = 'R: low — current flows';
    velo.setAttribute('fill', '#8b857a');
    animate(top, { y: 10 }, { type: 'spring', stiffness: 130, damping: 14, duration: reduced ? 0 : undefined });
    animate(velo, { y: 5, scaleY: 0.6 }, { type: 'spring', stiffness: 130, damping: 14, duration: reduced ? 0 : undefined });
    setTimeout(() => {
      animate(top, { y: 0 }, { type: 'spring', stiffness: 170, damping: 15, duration: reduced ? 0 : undefined });
      animate(velo, { y: 0, scaleY: 1 }, { type: 'spring', stiffness: 170, damping: 15, duration: reduced ? 0 : undefined });
      velo.setAttribute('fill', '#c9c4bb');
      value.textContent = 'R: high';
    }, reduced ? 0 : 550);
  };

  const playKnit = () => {
    const path = knitPathRef.current;
    if (!path) return;
    const reduced = prefersReducedMotion();
    const stretched = 'M 20 60 L 55 44 L 95 76 L 135 44 L 175 76 L 200 60';
    const rest = 'M 20 60 L 40 44 L 60 76 L 80 44 L 100 76 L 120 60';
    path.setAttribute('d', stretched);
    setTimeout(() => path.setAttribute('d', rest), reduced ? 0 : 500);
  };

  const playMatrix = () => {
    const pads = matrixPadsRef.current.filter(Boolean) as SVGRectElement[];
    const reduced = prefersReducedMotion();
    pads.forEach((pad, i) => {
      setTimeout(() => pad.setAttribute('fill', 'var(--wisteria-deep)'), reduced ? 0 : i * 60);
      setTimeout(() => pad.setAttribute('fill', 'var(--card)'), reduced ? 0 : i * 60 + 260);
    });
  };

  const playBend = () => {
    const path = bendPathRef.current;
    if (!path) return;
    const reduced = prefersReducedMotion();
    path.setAttribute('d', 'M 30 60 Q 110 30 190 60');
    setTimeout(() => path.setAttribute('d', 'M 30 60 Q 110 60 190 60'), reduced ? 0 : 480);
  };

  const gridAudioCtxRef = useRef<AudioContext | null>(null);
  const playGridBuzz = () => {
    try {
      if (!gridAudioCtxRef.current) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        gridAudioCtxRef.current = new Ctor();
      }
      const ctx = gridAudioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // silently skip audio if unsupported — the visual still plays
    }
  };

  const playHaptic = () => {
    const motor = motorRef.current;
    const ring = ringRef.current;
    if (!motor || !ring) return;
    const reduced = prefersReducedMotion();
    playGridBuzz();
    animate(motor, { scale: 1.2 }, { type: 'spring', stiffness: 250, damping: 12, duration: reduced ? 0 : undefined });
    ring.setAttribute('r', '34');
    ring.setAttribute('opacity', '0.7');
    ring.style.transition = reduced ? 'none' : 'opacity 480ms ease-out';
    requestAnimationFrame(() => ring.setAttribute('opacity', '0'));
    setTimeout(() => {
      animate(motor, { scale: 1 }, { type: 'spring', stiffness: 200, damping: 10, duration: reduced ? 0 : undefined });
      ring.setAttribute('r', '14');
    }, reduced ? 0 : 480);
  };

  const playThermo = () => {
    const patch = thermoPatchRef.current;
    if (!patch) return;
    const reduced = prefersReducedMotion();
    patch.style.transition = reduced ? 'none' : 'fill 900ms ease-in';
    patch.setAttribute('fill', '#f6c8d8');
    setTimeout(() => {
      patch.style.transition = reduced ? 'none' : 'fill 1800ms ease-out';
      patch.setAttribute('fill', '#cdc1ee');
    }, reduced ? 0 : 900);
  };

  const playEink = () => {
    const panel = einkPanelRef.current;
    if (!panel) return;
    const reduced = prefersReducedMotion();
    if (reduced) return;
    let flashes = 0;
    const flick = () => {
      panel.setAttribute('fill', flashes % 2 === 0 ? '#2a2530' : '#f4f0fb');
      flashes += 1;
      if (flashes < 4) setTimeout(flick, 90);
      else panel.setAttribute('fill', '#f4f0fb');
    };
    flick();
  };

  return (
    <section id="library" className="wrap">
      <div className="category-label category-label--input">input</div>
      <div className="grid">
        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the soft button demo"
            onClick={playButton}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>felt button demo</title>
              <g
                ref={feltRef}
                style={{
                  transformBox: "view-box",
                  transformOrigin: "110px 61px",
                }}
              >
                <rect
                  x="60"
                  y="32"
                  width="100"
                  height="58"
                  rx="18"
                  className="fill-blush stroke-blush"
                />
                <text
                  x="110"
                  y="66"
                  textAnchor="middle"
                  className="label-blush"
                >
                  Felt
                </text>
              </g>
              <rect
                x="72"
                y="102"
                width="76"
                height="11"
                rx="4"
                className="fill-butter stroke-butter"
              />
              <text
                ref={btnStateRef}
                x="110"
                y="138"
                textAnchor="middle"
                className="state"
              >
                Circuit open
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/soft-button">soft button</Link>
            </h2>
            <p>
              A felt dome over a conductive pad. The gentlest possible digital
              input.
            </p>
            <Link className="more" href="/components/soft-button">
              how it works →
            </Link>
          </div>
        </article>

        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the soft potentiometer demo"
            onClick={playPot}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>fabric potentiometer demo</title>
              <rect
                x="30"
                y="62"
                width="160"
                height="18"
                rx="9"
                className="fill-matcha stroke-matcha"
              />
              <circle
                ref={wiperRef}
                cx="52"
                cy="71"
                r="14"
                fill="#fdfbf7"
                stroke="#4f9c74"
                strokeWidth={2}
              />
              <text
                ref={potValueRef}
                x="110"
                y="118"
                textAnchor="middle"
                className="pot-value mono"
              >
                0.14
              </text>
              <text x="110" y="138" textAnchor="middle" className="state">
                Position → value
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/soft-potentiometer">
                soft potentiometer
              </Link>
            </h2>
            <p>
              A wiper gliding along conductive fabric. Where you touch becomes a
              number.
            </p>
            <Link className="more" href="/components/soft-potentiometer">
              how it works →
            </Link>
          </div>
        </article>

        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the pressure sensor demo"
            onClick={playPressure}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>velostat pressure sensor demo</title>
              <rect
                ref={topRef}
                x="58"
                y="36"
                width="104"
                height="16"
                rx="5"
                fill="#cdc1ee"
                stroke="#8a77c4"
              />
              <rect
                ref={veloRef}
                x="58"
                y="60"
                width="104"
                height="16"
                rx="5"
                fill="#c9c4bb"
                stroke="#8b857a"
                style={{
                  transformBox: "view-box",
                  transformOrigin: "110px 68px",
                }}
              />
              <rect
                x="58"
                y="84"
                width="104"
                height="16"
                rx="5"
                fill="#cdc1ee"
                stroke="#8a77c4"
              />
              <text
                ref={pressValueRef}
                x="110"
                y="122"
                textAnchor="middle"
                className="press-value mono"
              >
                R: high
              </text>
              <text x="110" y="140" textAnchor="middle" className="state">
                Squeeze → signal
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/pressure-sensor">pressure sensor</Link>
            </h2>
            <p>
              Velostat between conductive fabric. Squeeze harder, resistance
              falls.
            </p>
            <Link className="more" href="/components/pressure-sensor">
              how it works →
            </Link>
          </div>
        </article>

        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the knit stretch sensor demo"
            onClick={playKnit}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>knit stretch sensor demo</title>
              <path
                ref={knitPathRef}
                d="M 20 60 L 40 44 L 60 76 L 80 44 L 100 76 L 120 60"
                fill="none"
                stroke="var(--wisteria-deep)"
                strokeWidth={3}
                strokeLinecap="round"
                transform="translate(50, 15)"
              />
              <text x="110" y="118" textAnchor="middle" className="mono">
                R rises
              </text>
              <text x="110" y="138" textAnchor="middle" className="state">
                Stretch → resistance
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/knit-stretch-sensor">
                knit stretch sensor
              </Link>
            </h2>
            <p>Conductive knit that reads how far it&apos;s been pulled.</p>
            <Link className="more" href="/components/knit-stretch-sensor">
              how it works →
            </Link>
          </div>
        </article>

        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the capacitive touch matrix demo"
            onClick={playMatrix}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>capacitive touch matrix demo</title>
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  ref={(el) => {
                    matrixPadsRef.current[i] = el;
                  }}
                  x={50 + (i % 3) * 42}
                  y={30 + Math.floor(i / 3) * 24}
                  width="34"
                  height="18"
                  rx="4"
                  fill="var(--card)"
                  stroke="var(--wisteria-deep)"
                  strokeWidth={1.2}
                />
              ))}
              <text x="110" y="118" textAnchor="middle" className="mono">
                Multi-touch
              </text>
              <text x="110" y="138" textAnchor="middle" className="state">
                Grid → independent pads
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/capacitive-touch-matrix">
                capacitive touch matrix
              </Link>
            </h2>
            <p>Copper-tape pads that sense multiple touches at once.</p>
            <Link className="more" href="/components/capacitive-touch-matrix">
              how it works →
            </Link>
          </div>
        </article>

        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the fabric bend sensor demo"
            onClick={playBend}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>fabric bend sensor demo</title>
              <path
                ref={bendPathRef}
                d="M 30 60 Q 110 60 190 60"
                fill="none"
                stroke="var(--matcha-deep)"
                strokeWidth={4}
                strokeLinecap="round"
                transform="translate(0, 15)"
              />
              <text x="110" y="118" textAnchor="middle" className="mono">
                R rises
              </text>
              <text x="110" y="138" textAnchor="middle" className="state">
                Bend → resistance
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/fabric-bend-sensor">
                fabric bend sensor
              </Link>
            </h2>
            <p>Resistive ink that reads how far a joint has bent.</p>
            <Link className="more" href="/components/fabric-bend-sensor">
              how it works →
            </Link>
          </div>
        </article>
      </div>

      <div className="category-label category-label--output">output</div>
      <div className="grid">
        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the haptic motor demo"
            onClick={playHaptic}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>haptic motor demo</title>
              <circle
                ref={ringRef}
                cx="110"
                cy="60"
                r="14"
                fill="none"
                stroke="var(--wisteria-deep)"
                strokeWidth={2}
                opacity={0}
              />
              <circle
                ref={motorRef}
                cx="110"
                cy="60"
                r="16"
                fill="var(--wisteria)"
                stroke="var(--wisteria-deep)"
                strokeWidth={1.5}
              />
              <text x="110" y="118" textAnchor="middle" className="mono">
                Buzz
              </text>
              <text x="110" y="138" textAnchor="middle" className="state">
                Press → felt confirms
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/haptic-motor">haptic motor</Link>
            </h2>
            <p>
              A felt button that talks back with its own vibration signature.
            </p>
            <Link className="more" href="/components/haptic-motor">
              how it works →
            </Link>
          </div>
        </article>

        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the thermochromic reveal demo"
            onClick={playThermo}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>thermochromic reveal demo</title>
              <rect
                ref={thermoPatchRef}
                x="65"
                y="28"
                width="90"
                height="60"
                rx="10"
                fill="#cdc1ee"
                stroke="var(--line)"
              />
              <text x="110" y="118" textAnchor="middle" className="mono">
                Warms · fades
              </text>
              <text x="110" y="138" textAnchor="middle" className="state">
                Heat → color shift
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/thermochromic-reveal">
                thermochromic reveal
              </Link>
            </h2>
            <p>
              A fabric patch that changes color as conductive thread warms it.
            </p>
            <Link className="more" href="/components/thermochromic-reveal">
              how it works →
            </Link>
          </div>
        </article>
      </div>

      <div className="category-label category-label--display">display</div>
      <div className="grid">
        <article className="card">
          <button
            className="demo-trigger"
            aria-label="animate the e-ink refresh demo"
            onClick={playEink}
          >
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>e-ink refresh demo</title>
              <rect
                ref={einkPanelRef}
                x="50"
                y="30"
                width="120"
                height="60"
                rx="8"
                fill="#f4f0fb"
                stroke="var(--line)"
              />
              <text x="110" y="118" textAnchor="middle" className="mono">
                Flash · settle
              </text>
              <text x="110" y="138" textAnchor="middle" className="state">
                Refresh → clears ghosting
              </text>
            </svg>
          </button>
          <div className="card-body">
            <h2>
              <Link href="/components/eink-refresh">e-ink refresh</Link>
            </h2>
            <p>
              The flash-to-black cycle that clears a slow display before it
              settles.
            </p>
            <Link className="more" href="/components/eink-refresh">
              how it works →
            </Link>
          </div>
        </article>
      </div>

      <style>{`
        .category-label {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-display);
          font-size: 1.15rem;
          letter-spacing: 0.02em;
          color: var(--ink);
          border: 2px dashed;
          border-radius: 999px;
          padding: 0.3rem 1.1rem;
          margin: 2.8rem 0 1.2rem;
        }
        .category-label:first-child { margin-top: 0; }
        .category-label--input { background: ${color.lavenderBeamTint}; border-color: var(--wisteria-deep); }
        .category-label--output { background: ${color.blushPowder}; border-color: var(--blush-deep); }
        .category-label--display { background: ${color.butterPuff}; border-color: var(--butter-deep); }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.4rem;
          padding-bottom: 1rem;
        }
        .card {
          background: var(--card);
          border: 2px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
        }
        .card:hover {
          transform: translateY(-5px);
          border-color: var(--wisteria-deep);
          box-shadow: var(--shadow-pop);
        }
        .demo-trigger {
          all: unset;
          cursor: pointer;
          display: block;
          background: #f2eaff;
          border-bottom: 2px dashed var(--line);
        }
        .demo-trigger:focus-visible {
          outline: 3px solid var(--wisteria-deep);
          outline-offset: -3px;
        }
        .thumb { width: 100%; height: auto; display: block; }
        .card-body { padding: 1.2rem 1.3rem 1.5rem; }
        .card-body h2 { font-size: 1.4rem; }
        .card-body h2 a { color: var(--ink); text-decoration: none; }
        .card-body h2 a:hover { color: var(--blush-deep); }
        .card-body p { font-size: 0.86rem; color: var(--ink-soft); margin-bottom: 1.1rem; }
        .more {
          display: inline-flex;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--wisteria-deep);
          background: var(--wisteria);
          border-radius: 999px;
          padding: 0.35rem 0.9rem;
          text-decoration: none;
          transition: background 150ms ease, color 150ms ease;
        }
        .more:hover { background: var(--wisteria-deep); color: #fff; }

        .fill-blush { fill: var(--blush); stroke: var(--blush-deep); }
        .fill-matcha { fill: var(--matcha); stroke: var(--matcha-deep); }
        .fill-butter { fill: var(--butter); stroke: var(--butter-deep); }
        .label-blush { fill: var(--blush-deep); font-family: var(--font-body); font-size: 13px; }
        .state { fill: var(--ink-soft); font-family: var(--font-body); font-size: 10.5px; }
        .mono { font-family: var(--font-body); font-size: 12px; fill: var(--ink); }
      `}</style>
    </section>
  );
}
