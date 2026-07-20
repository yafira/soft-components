'use client';

import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/spring';

type Signature = 'pulse' | 'double' | 'ramp';

const SIGNATURES: { id: Signature; label: string; color: string }[] = [
  { id: 'pulse', label: 'single pulse — blush', color: 'var(--blush-deep)' },
  { id: 'double', label: 'double tap — matcha', color: 'var(--matcha-deep)' },
  { id: 'ramp', label: 'rising ramp — wisteria', color: 'var(--wisteria-deep)' },
];

const RING_COUNT = 3;

export default function HapticMotorDemo() {
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const motorRef = useRef<SVGCircleElement>(null);
  const traceRef = useRef<SVGPolylineElement>(null);
  const [playing, setPlaying] = useState<Signature | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const drawTrace = useCallback((points: [number, number][]) => {
    if (!traceRef.current) return;
    const str = points.map(([x, y]) => `${x},${y}`).join(' ');
    traceRef.current.setAttribute('points', str);
  }, []);

  const play = useCallback((sig: Signature) => {
    tlRef.current?.kill();
    setPlaying(sig);
    const reduced = prefersReducedMotion();
    const rings = ringRefs.current.filter(Boolean) as SVGCircleElement[];
    const motor = motorRef.current;
    if (!motor) return;

    gsap.set(rings, { attr: { r: 14, opacity: 0 } });
    gsap.set(motor, { scale: 1 });

    const tl = gsap.timeline({
      onComplete: () => setPlaying(null),
      defaults: { ease: 'power2.out' },
    });
    tlRef.current = tl;

    const fireRing = (delay: number, duration: number, maxR: number) => {
      const trace: [number, number][] = [];
      tl.to(rings, {
        attr: { r: maxR, opacity: 0 },
        duration: reduced ? 0.01 : duration,
        ease: 'power1.out',
        startAt: { attr: { r: 14, opacity: 0.7 } },
      }, delay);
      return trace;
    };

    // envelope trace: sample intensity(t) into a waveform below
    const envelopeFor = (sig: Signature): (t: number) => number => {
      if (sig === 'pulse') return (t) => (t < 0.15 ? t / 0.15 : Math.max(0, 1 - (t - 0.15) / 0.4));
      if (sig === 'double') {
        return (t) => {
          const a = t < 0.12 ? t / 0.12 : Math.max(0, 1 - (t - 0.12) / 0.18);
          const t2 = t - 0.4;
          const b = t2 >= 0 && t2 < 0.12 ? t2 / 0.12 : t2 >= 0.12 ? Math.max(0, 1 - (t2 - 0.12) / 0.18) : 0;
          return Math.max(a, b);
        };
      }
      // ramp
      return (t) => Math.min(1, t / 0.85);
    };

    const totalDuration = sig === 'double' ? 0.9 : sig === 'ramp' ? 0.95 : 0.7;
    const envelope = envelopeFor(sig);
    const samples = 40;
    const pts: [number, number][] = [];
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * totalDuration;
      const v = envelope(t);
      pts.push([20 + (i / samples) * 300, 70 - v * 55]);
    }
    drawTrace(pts);

    if (sig === 'pulse') {
      tl.to(motor, { scale: 1.18, duration: reduced ? 0.01 : 0.12 }, 0)
        .to(motor, { scale: 1, duration: reduced ? 0.01 : 0.4, ease: 'elastic.out(1, 0.5)' }, 0.12);
      fireRing(0, reduced ? 0.01 : 0.55, 46);
    } else if (sig === 'double') {
      tl.to(motor, { scale: 1.15, duration: reduced ? 0.01 : 0.1 }, 0)
        .to(motor, { scale: 1, duration: reduced ? 0.01 : 0.2 }, 0.1)
        .to(motor, { scale: 1.15, duration: reduced ? 0.01 : 0.1 }, 0.4)
        .to(motor, { scale: 1, duration: reduced ? 0.01 : 0.3, ease: 'elastic.out(1, 0.5)' }, 0.5);
      fireRing(0, reduced ? 0.01 : 0.5, 40);
      fireRing(0.4, reduced ? 0.01 : 0.5, 40);
    } else {
      tl.to(motor, { scale: 1.22, duration: reduced ? 0.01 : 0.85, ease: 'power2.in' }, 0)
        .to(motor, { scale: 1, duration: reduced ? 0.01 : 0.25 }, 0.85);
      fireRing(0.5, reduced ? 0.01 : 0.45, 44);
    }
  }, [drawTrace]);

  return (
    <div className="haptic-demo">
      <svg viewBox="0 0 340 160" role="img" className="haptic-svg">
        <title>haptic motor signature demo</title>
        <desc>a felt button&apos;s motor pulses in one of three patterns; rings show the vibration and a trace plots the intensity over time.</desc>
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { ringRefs.current[i] = el; }}
            cx="90" cy="60" r="14"
            fill="none"
            stroke={SIGNATURES.find((s) => s.id === playing)?.color || 'var(--wisteria-deep)'}
            strokeWidth={2}
            opacity={0}
          />
        ))}
        <circle ref={motorRef} cx="90" cy="60" r="16" fill="var(--wisteria)" stroke="var(--wisteria-deep)" strokeWidth={1.5} />
        <text x="90" y="105" textAnchor="middle" className="haptic-caption">felt button + motor</text>

        <line x1="20" y1="70" x2="320" y2="70" stroke="var(--line)" strokeDasharray="3 3" />
        <polyline ref={traceRef} points="" fill="none" stroke="var(--blush-deep)" strokeWidth={2} />
        <text x="20" y="148" className="haptic-caption small">intensity over time →</text>
      </svg>

      <div className="signature-buttons">
        {SIGNATURES.map((s) => (
          <button
            key={s.id}
            className="sig-btn"
            style={{ borderColor: s.color, color: playing === s.id ? '#fff' : s.color, background: playing === s.id ? s.color : 'transparent' }}
            onClick={() => play(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <style>{`
        .haptic-demo { text-align: center; }
        .haptic-svg { width: 100%; max-width: 340px; height: auto; }
        .haptic-caption { font-family: var(--font-body); font-size: 11px; fill: var(--ink-soft); }
        .haptic-caption.small { font-size: 10px; }
        .signature-buttons { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; margin-top: 1rem; }
        .sig-btn {
          font-family: var(--font-body);
          font-size: 0.78rem;
          border: 1.5px solid;
          border-radius: 999px;
          padding: 0.45rem 1rem;
          cursor: pointer;
          transition: background 150ms ease, color 150ms ease;
        }
      `}</style>
    </div>
  );
}
