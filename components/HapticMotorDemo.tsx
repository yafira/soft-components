'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/spring';
import styles from './HapticMotorDemo.module.css';

type Signature = 'pulse' | 'double' | 'ramp';

const SIGNATURES: { id: Signature; label: string; color: string }[] = [
  { id: 'pulse', label: 'Single pulse — blush', color: 'var(--blush-deep)' },
  { id: 'double', label: 'Double tap — matcha', color: 'var(--matcha-deep)' },
  { id: 'ramp', label: 'Rising ramp — wisteria', color: 'var(--wisteria-deep)' },
];

const RING_COUNT = 3;

// envelope(t) -> intensity 0..1, and total duration per signature.
// shared by the visuals (rings, weight spin speed) and the audio gain.
function envelopeFor(sig: Signature): { fn: (t: number) => number; duration: number } {
  if (sig === 'pulse') {
    return { fn: (t) => (t < 0.15 ? t / 0.15 : Math.max(0, 1 - (t - 0.15) / 0.4)), duration: 0.7 };
  }
  if (sig === 'double') {
    return {
      fn: (t) => {
        const a = t < 0.12 ? t / 0.12 : Math.max(0, 1 - (t - 0.12) / 0.18);
        const t2 = t - 0.4;
        const b = t2 >= 0 && t2 < 0.12 ? t2 / 0.12 : t2 >= 0.12 ? Math.max(0, 1 - (t2 - 0.12) / 0.18) : 0;
        return Math.max(a, b);
      },
      duration: 0.9,
    };
  }
  return { fn: (t) => Math.min(1, t / 0.85), duration: 0.95 };
}

export default function HapticMotorDemo() {
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const traceRef = useRef<SVGPolylineElement>(null);
  const [playing, setPlaying] = useState<Signature | null>(null);
  const [muted, setMuted] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Not started yet');
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        setAudioStatus('Web Audio API not available in this browser');
        return null;
      }
      audioCtxRef.current = new Ctor();
    }
    return audioCtxRef.current;
  };

  useEffect(() => () => { audioCtxRef.current?.close(); }, []);

  // isolated sanity check: a single plain sine tone, no envelope, no
  // filter, no second oscillator — if this is silent, the problem is
  // browser/OS audio, not the signature logic below.
  const testTone = useCallback(async () => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      setAudioStatus(`Context state before resume: ${ctx.state}`);
      if (ctx.state === 'suspended') await ctx.resume();
      setAudioStatus(`Context state after resume: ${ctx.state}`);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 440;
      gain.gain.value = 0.25;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + 0.4);
      setAudioStatus(`Playing test tone — context state: ${ctx.state}`);
    } catch (err) {
      setAudioStatus(`Test tone failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  const drawTrace = useCallback((points: [number, number][]) => {
    if (!traceRef.current) return;
    traceRef.current.setAttribute('points', points.map(([x, y]) => `${x},${y}`).join(' '));
  }, []);

  const playBuzz = useCallback(async (fn: (t: number) => number, duration: number) => {
    if (muted) { setAudioStatus('Muted — unmute to hear it'); return; }
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') await ctx.resume();
      setAudioStatus(`Context state: ${ctx.state}`);
      const now = ctx.currentTime;

      // deliberately as simple as possible: one oscillator, one gain
      // node, straight to the destination. No filter, no second
      // oscillator — minimal surface area for anything to go wrong.
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);

      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const samples = 30;
      gain.gain.setValueAtTime(0.0001, now);
      for (let i = 1; i <= samples; i++) {
        const t = (i / samples) * duration;
        const value = Math.max(fn(t) * 0.4, 0.0001);
        gain.gain.linearRampToValueAtTime(value, now + t);
      }
      gain.gain.linearRampToValueAtTime(0.0001, now + duration + 0.05);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[haptic demo] Web Audio playback failed:', err);
      setAudioStatus(`Error: ${msg}`);
    }
  }, [muted]);

  const play = useCallback((sig: Signature) => {
    tlRef.current?.kill();
    setPlaying(sig);
    const reduced = prefersReducedMotion();
    const rings = ringRefs.current.filter(Boolean) as SVGCircleElement[];

    gsap.set(rings, { attr: { r: 14, opacity: 0 } });

    const { fn, duration } = envelopeFor(sig);
    playBuzz(fn, reduced ? 0.05 : duration);

    const tl = gsap.timeline({ onComplete: () => setPlaying(null), defaults: { ease: 'power2.out' } });
    tlRef.current = tl;

    const fireRing = (delay: number, ringDuration: number, maxR: number) => {
      tl.to(rings, {
        attr: { r: maxR, opacity: 0 },
        duration: reduced ? 0.01 : ringDuration,
        ease: 'power1.out',
        startAt: { attr: { r: 14, opacity: 0.7 } },
      }, delay);
    };

    const samples = 40;
    const pts: [number, number][] = [];
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * duration;
      pts.push([20 + (i / samples) * 300, 70 - fn(t) * 55]);
    }
    drawTrace(pts);

    if (sig === 'pulse') fireRing(0, reduced ? 0.01 : 0.55, 46);
    else if (sig === 'double') { fireRing(0, reduced ? 0.01 : 0.5, 40); fireRing(0.4, reduced ? 0.01 : 0.5, 40); }
    else fireRing(0.5, reduced ? 0.01 : 0.45, 44);
  }, [drawTrace, playBuzz]);

  const activeColor = SIGNATURES.find((s) => s.id === playing)?.color || 'var(--ink-soft)';

  return (
    <div className={styles.demo}>
      <svg viewBox="0 0 340 160" role="img" className={styles.svg}>
        <title>haptic motor signature demo</title>
        <desc>a coin-style vibration motor spins an off-center weight in one of three patterns; rings show the vibration and a trace plots the intensity over time.</desc>

        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { ringRefs.current[i] = el; }}
            cx="90" cy="60" r="14"
            fill="none" stroke={activeColor} strokeWidth={2} opacity={0}
          />
        ))}

        {/* two wire leads */}
        <path d="M 66 68 L 50 82" stroke="#9a948e" strokeWidth={2.5} strokeLinecap="round" fill="none" />
        <path d="M 66 74 L 52 92" stroke="#9a948e" strokeWidth={2.5} strokeLinecap="round" fill="none" />

        {/* motor casing — a coin */}
        <circle cx="90" cy="60" r="19" fill="#d8d5cf" stroke="#8f8a82" strokeWidth={1.5} />
        <circle cx="90" cy="60" r="15.5" fill="#c7c3bb" stroke="#a49e94" strokeWidth={0.75} />

        {/* eccentric rotating weight — off-center mass that makes it buzz */}
        <g style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
          <path
            d="M 90 60 m -9 0 a 9 9 0 0 1 9 -9 a 9 9 0 0 1 6.36 15.36 z"
            fill="#6b665f"
          />
          <circle cx="90" cy="60" r="2.4" fill="#4a463f" />
        </g>

        <text x="90" y="102" textAnchor="middle" className={styles.caption}>Coin motor + eccentric weight</text>

        <line x1="20" y1="70" x2="320" y2="70" stroke="var(--line)" strokeDasharray="3 3" />
        <polyline ref={traceRef} points="" fill="none" stroke="var(--blush-deep)" strokeWidth={2} />
        <text x="20" y="148" className={`${styles.caption} ${styles.small}`}>Intensity over time →</text>
      </svg>

      <div className={styles.signatureRow}>
        <div className={styles.signatureButtons}>
          {SIGNATURES.map((s) => (
            <button
              key={s.id}
              className={styles.sigBtn}
              style={{ borderColor: s.color, color: playing === s.id ? '#fff' : s.color, background: playing === s.id ? s.color : 'transparent' }}
              onClick={() => play(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          className={styles.muteBtn}
          aria-pressed={muted}
          aria-label={muted ? 'unmute buzz sound' : 'mute buzz sound'}
          onClick={() => setMuted((m) => !m)}
        >
          {muted ? '🔇 Sound off' : '🔊 Sound on'}
        </button>
      </div>

      <details className={styles.audioDebug}>
        <summary>Sound not working? Diagnostics</summary>
        <button className={styles.testToneBtn} onClick={testTone}>▶ Play isolated test tone</button>
        <p className={styles.audioStatus}>Audio status: {audioStatus}</p>
        <p className={styles.audioHint}>
          If the test tone above is silent, the issue is your browser/OS
          audio setup, not this demo — check the tab isn&apos;t muted
          (right-click the tab), your system volume, and (on iPhone) that
          the hardware silent switch is off.
        </p>
      </details>
    </div>
  );
}
