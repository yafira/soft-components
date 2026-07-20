'use client';

import { useRef, useState, useCallback } from 'react';
import { Spring, prefersReducedMotion } from '@/lib/spring';

const REST_R = 12; // kΩ at rest
const STRETCH_GAIN = 38; // kΩ added at full stretch

function buildZigzag(stretch: number) {
  // 8 loops across a 300-wide swatch; stretch (0..1) spreads them horizontally
  // and thins the loop width slightly, echoing real knit behavior.
  const loops = 8;
  const baseSpacing = 300 / loops;
  const spacing = baseSpacing * (1 + stretch * 0.55);
  const amp = 16 * (1 - stretch * 0.35);
  let d = `M 20 60`;
  for (let i = 1; i <= loops * 2; i++) {
    const x = 20 + i * (spacing / 2);
    const y = i % 2 === 0 ? 60 - amp : 60 + amp;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export default function KnitStretchDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const handleRef = useRef<SVGCircleElement>(null);
  const [stretch, setStretch] = useState(0);
  const springRef = useRef(new Spring({ stiffness: 70, damping: 12, value: 0 }));
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const render = useCallback(() => {
    const s = Math.min(Math.max(springRef.current.value, 0), 1);
    if (pathRef.current) pathRef.current.setAttribute('d', buildZigzag(s));
    const handleX = 20 + s * 200; // rest at x=20, full stretch at x=220
    if (handleRef.current) handleRef.current.setAttribute('cx', String(handleX));
    setStretch(s);
  }, []);

  const kick = useCallback(() => {
    if (rafRef.current) return;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      springRef.current.step(dt);
      render();
      if (!springRef.current.settled) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        springRef.current.snap();
        render();
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [render]);

  const toStretch = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scale = 400 / rect.width;
    const x = (clientX - rect.left) * scale;
    return Math.min(Math.max((x - 20) / 200, 0), 1);
  };

  const setTarget = (t: number) => {
    springRef.current.target = t;
    if (prefersReducedMotion()) springRef.current.snap();
    render();
    kick();
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    draggingRef.current = true;
    svgRef.current?.setPointerCapture(e.pointerId);
    setTarget(toStretch(e.clientX));
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    setTarget(toStretch(e.clientX));
  };
  const onPointerUp = () => {
    draggingRef.current = false;
    setTarget(0); // releases back to rest, like relaxed knit
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.15 : 0.03;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setTarget(Math.min(springRef.current.target + step, 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setTarget(Math.max(springRef.current.target - step, 0));
    }
  };

  const resistance = REST_R + stretch * STRETCH_GAIN;

  return (
    <div className="knit-demo">
      <svg
        ref={svgRef}
        viewBox="0 0 400 120"
        role="img"
        className="knit-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <title>knit stretch sensor demo</title>
        <desc>a conductive knit swatch that can be dragged and stretched; a handle drags the fabric while resistance rises with stretch.</desc>
        <path ref={pathRef} d={buildZigzag(0)} fill="none" stroke="var(--wisteria-deep)" strokeWidth={3} strokeLinecap="round" />
        <circle
          ref={handleRef}
          cx="20" cy="60" r="13"
          fill="var(--paper)" stroke="var(--wisteria-deep)" strokeWidth={2.5}
          style={{ cursor: 'grab' }}
          tabIndex={0}
          role="slider"
          aria-label="stretch amount"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={stretch}
          onKeyDown={onKeyDown}
        />
        <text x="200" y="105" textAnchor="middle" className="knit-readout">R ≈ {resistance.toFixed(1)} kΩ</text>
      </svg>
      <p className="hint">drag the handle to stretch the swatch — release to relax</p>

      <style>{`
        .knit-demo { text-align: center; }
        .knit-svg { width: 100%; max-width: 400px; height: auto; touch-action: none; }
        .knit-readout { font-family: var(--font-body); font-size: 15px; fill: var(--ink); }
        .hint { font-size: 0.78rem; color: var(--ink-soft); margin: 0.4rem 0 0; }
      `}</style>
    </div>
  );
}
