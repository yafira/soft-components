'use client';

import { useRef, useState, useCallback } from 'react';
import { Spring, prefersReducedMotion } from '@/lib/spring';

const X0 = 60;
const W = 440;

export default function PotentiometerDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wiperRef = useRef<SVGCircleElement>(null);
  const fillRef = useRef<SVGRectElement>(null);
  const [value, setValue] = useState(0.18);
  const springRef = useRef(new Spring({ stiffness: 90, damping: 13, value: 0.18 }));
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const render = useCallback(() => {
    const spring = springRef.current;
    const t = Math.min(Math.max(spring.value, 0), 1);
    if (wiperRef.current) wiperRef.current.setAttribute('cx', String(X0 + W * t));
    if (fillRef.current) fillRef.current.setAttribute('width', String(Math.max(W * t, 1)));
    setValue(t);
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

  const toValue = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scale = 560 / rect.width;
    const x = (clientX - rect.left) * scale;
    return Math.min(Math.max((x - X0) / W, 0), 1);
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
    setTarget(toValue(e.clientX));
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    setTarget(toValue(e.clientX));
  };
  const onPointerUp = () => { draggingRef.current = false; };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setTarget(Math.min(springRef.current.target + step, 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setTarget(Math.max(springRef.current.target - step, 0));
    }
  };

  return (
    <div className="pot-demo">
      <svg
        ref={svgRef}
        viewBox="0 0 560 140"
        role="img"
        className="pot-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <title>fabric potentiometer demo</title>
        <desc>a draggable wiper on a conductive fabric strip; its position maps to a value between 0 and 1.</desc>
        <rect x={X0} y="52" width={W} height="26" rx="13" fill="var(--matcha)" stroke="var(--matcha-deep)" />
        <rect ref={fillRef} x={X0} y="52" width="80" height="26" rx="13" fill="var(--matcha-deep)" opacity={0.35} />
        <circle
          ref={wiperRef}
          cx={X0 + W * value}
          cy="65"
          r="20"
          fill="var(--paper)"
          stroke="var(--matcha-deep)"
          strokeWidth={2.5}
          style={{ cursor: 'grab' }}
          tabIndex={0}
          role="slider"
          aria-label="wiper position"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={value}
          onKeyDown={onKeyDown}
        />
        <text x="280" y="118" textAnchor="middle" className="pot-readout">{value.toFixed(2)}</text>
      </svg>
      <p className="hint">Drag the wiper, or focus it and use arrow keys</p>

      <style>{`
        .pot-demo { text-align: center; }
        .pot-svg { width: 100%; max-width: 560px; height: auto; touch-action: none; }
        .pot-readout { font-family: var(--font-body); font-size: 17px; fill: var(--matcha-deep); }
        .hint { font-size: 0.78rem; color: var(--ink-soft); margin: 0.4rem 0 0; }
      `}</style>
    </div>
  );
}
