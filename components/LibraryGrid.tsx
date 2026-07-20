'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { animate } from 'motion';
import { prefersReducedMotion } from '@/lib/spring';

export default function LibraryGrid() {
  const feltRef = useRef<SVGGElement>(null);
  const btnStateRef = useRef<SVGTextElement>(null);

  const wiperRef = useRef<SVGCircleElement>(null);
  const potValueRef = useRef<SVGTextElement>(null);

  const topRef = useRef<SVGRectElement>(null);
  const veloRef = useRef<SVGRectElement>(null);
  const pressValueRef = useRef<SVGTextElement>(null);

  const playButton = () => {
    const felt = feltRef.current;
    const state = btnStateRef.current;
    if (!felt || !state) return;
    const reduced = prefersReducedMotion();
    state.textContent = 'circuit closed — signal!';
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
        state.textContent = 'circuit open';
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

  return (
    <section id="library" className="wrap">
      <div className="grid">

        {/* soft button */}
        <article className="card">
          <button className="demo-trigger" aria-label="animate the soft button demo" onClick={playButton}>
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>felt button demo</title>
              <g ref={feltRef} style={{ transformBox: 'view-box', transformOrigin: '110px 61px' }}>
                <rect x="60" y="32" width="100" height="58" rx="18" className="fill-blush stroke-blush" />
                <text x="110" y="66" textAnchor="middle" className="label-blush">felt</text>
              </g>
              <rect x="72" y="102" width="76" height="11" rx="4" className="fill-butter stroke-butter" />
              <text ref={btnStateRef} x="110" y="138" textAnchor="middle" className="state">circuit open</text>
            </svg>
          </button>
          <div className="card-body">
            <h2><Link href="/components/soft-button">soft button</Link></h2>
            <p>a felt dome over a conductive pad. press down, the circuit closes.
               the gentlest possible digital input.</p>
            <Link className="more" href="/components/soft-button">how it works →</Link>
          </div>
        </article>

        {/* soft potentiometer */}
        <article className="card">
          <button className="demo-trigger" aria-label="animate the soft potentiometer demo" onClick={playPot}>
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>fabric potentiometer demo</title>
              <rect x="30" y="62" width="160" height="18" rx="9" className="fill-matcha stroke-matcha" />
              <circle ref={wiperRef} cx="52" cy="71" r="14" fill="#fdfbf7" stroke="#4f9c74" strokeWidth={2} />
              <text ref={potValueRef} x="110" y="118" textAnchor="middle" className="pot-value mono">0.14</text>
              <text x="110" y="138" textAnchor="middle" className="state">position → value</text>
            </svg>
          </button>
          <div className="card-body">
            <h2><Link href="/components/soft-potentiometer">soft potentiometer</Link></h2>
            <p>a wiper gliding along conductive fabric. where you touch becomes
               a number your circuit can read.</p>
            <Link className="more" href="/components/soft-potentiometer">how it works →</Link>
          </div>
        </article>

        {/* pressure sensor */}
        <article className="card">
          <button className="demo-trigger" aria-label="animate the pressure sensor demo" onClick={playPressure}>
            <svg viewBox="0 0 220 150" role="img" className="thumb">
              <title>velostat pressure sensor demo</title>
              <rect ref={topRef} x="58" y="36" width="104" height="16" rx="5" fill="#cdc1ee" stroke="#8a77c4" />
              <rect ref={veloRef} x="58" y="60" width="104" height="16" rx="5" fill="#c9c4bb" stroke="#8b857a"
                    style={{ transformBox: 'view-box', transformOrigin: '110px 68px' }} />
              <rect x="58" y="84" width="104" height="16" rx="5" fill="#cdc1ee" stroke="#8a77c4" />
              <text ref={pressValueRef} x="110" y="122" textAnchor="middle" className="press-value mono">R: high</text>
              <text x="110" y="140" textAnchor="middle" className="state">squeeze → signal</text>
            </svg>
          </button>
          <div className="card-body">
            <h2><Link href="/components/pressure-sensor">pressure sensor</Link></h2>
            <p>velostat between two conductive layers. squeeze harder and
               resistance falls. force becomes an analog signal.</p>
            <Link className="more" href="/components/pressure-sensor">how it works →</Link>
          </div>
        </article>

      </div>

      <style>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.4rem;
          padding-bottom: 2rem;
        }
        .card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 200ms ease, border-color 200ms ease;
        }
        .card:hover { transform: translateY(-3px); border-color: var(--wisteria); }
        .demo-trigger {
          all: unset;
          cursor: pointer;
          display: block;
          background: #faf7ff;
          border-bottom: 1px dashed var(--line);
        }
        .demo-trigger:focus-visible {
          outline: 3px solid var(--wisteria-deep);
          outline-offset: -3px;
        }
        .thumb { width: 100%; height: auto; display: block; }
        .card-body { padding: 1.1rem 1.3rem 1.4rem; }
        .card-body h2 { font-size: 1.25rem; }
        .card-body h2 a { color: var(--ink); text-decoration: none; }
        .card-body h2 a:hover { color: var(--blush-deep); }
        .card-body p { font-size: 0.86rem; color: var(--ink-soft); margin-bottom: 0.9rem; }
        .more { font-size: 0.84rem; }

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
