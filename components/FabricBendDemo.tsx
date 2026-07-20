'use client';

import { useRef, useState, useCallback } from 'react';
import { Spring, prefersReducedMotion } from '@/lib/spring';

const REST_R = 9; // kΩ flat
const BEND_GAIN = 27;

function buildBendPath(bend: number) {
  // bend in -1..1: quadratic bezier curving the strip up or down
  const midY = 60 - bend * 42;
  return `M 30 60 Q 200 ${midY.toFixed(1)} 370 60`;
}

export default function FabricBendDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const handleRef = useRef<SVGCircleElement>(null);
  const [bend, setBend] = useState(0); // -1..1
  const springRef = useRef(new Spring({ stiffness: 85, damping: 14, value: 0 }));
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const render = useCallback(() => {
    const b = Math.min(Math.max(springRef.current.value, -1), 1);
    if (pathRef.current) pathRef.current.setAttribute('d', buildBendPath(b));
    const midY = 60 - b * 42;
    if (handleRef.current) {
      handleRef.current.setAttribute('cx', '200');
      handleRef.current.setAttribute('cy', String(midY));
    }
    setBend(b);
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

  const toBend = (clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scale = 120 / rect.height;
    const y = (clientY - rect.top) * scale;
    return Math.min(Math.max((60 - y) / 42, -1), 1);
  };

  const setTarget = (b: number) => {
    springRef.current.target = b;
    if (prefersReducedMotion()) springRef.current.snap();
    render();
    kick();
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    draggingRef.current = true;
    svgRef.current?.setPointerCapture(e.pointerId);
    setTarget(toBend(e.clientY));
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    setTarget(toBend(e.clientY));
  };
  const onPointerUp = () => {
    draggingRef.current = false;
    setTarget(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.2 : 0.04;
    if (e.key === 'ArrowUp') { e.preventDefault(); setTarget(Math.min(springRef.current.target + step, 1)); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setTarget(Math.max(springRef.current.target - step, -1)); }
  };

  const resistance = REST_R + Math.abs(bend) * BEND_GAIN;

  return (
    <div className="bend-demo">
      <svg
        ref={svgRef}
        viewBox="0 0 400 120"
        role="img"
        className="bend-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <title>fabric bend sensor demo</title>
        <desc>a strip that bends up or down when dragged vertically; resistance rises with the bend angle in either direction.</desc>
        <path ref={pathRef} d={buildBendPath(0)} fill="none" stroke="var(--matcha-deep)" strokeWidth={4} strokeLinecap="round" />
        <circle
          ref={handleRef}
          cx="200" cy="60" r="13"
          fill="var(--paper)" stroke="var(--matcha-deep)" strokeWidth={2.5}
          style={{ cursor: 'grab' }}
          tabIndex={0}
          role="slider"
          aria-label="bend angle"
          aria-valuemin={-1}
          aria-valuemax={1}
          aria-valuenow={bend}
          onKeyDown={onKeyDown}
        />
        <text x="200" y="105" textAnchor="middle" className="bend-readout">R ≈ {resistance.toFixed(1)} kΩ</text>
      </svg>
      <p className="hint">drag the handle up or down to bend the strip — release to flatten</p>

      <style>{`
        .bend-demo { text-align: center; }
        .bend-svg { width: 100%; max-width: 400px; height: auto; touch-action: none; }
        .bend-readout { font-family: var(--font-body); font-size: 15px; fill: var(--ink); }
        .hint { font-size: 0.78rem; color: var(--ink-soft); margin: 0.4rem 0 0; }
      `}</style>
    </div>
  );
}
