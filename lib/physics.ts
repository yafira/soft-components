import { useEffect, useState } from "react";

// small physics helpers for the newer demos
// these are self-contained on purpose: if you'd rather use lib/spring.ts,
// stepSpring and usePrefersReducedMotion are the two things to swap

export type SpringState = { x: number; v: number };

const MAX_STEP = 1 / 240;

// advance a state by dt seconds, where accel(x, v) returns the acceleration
// semi-implicit euler in small sub-steps keeps stiff springs stable
export function integrate(
  state: SpringState,
  accel: (x: number, v: number) => number,
  dt: number,
) {
  let left = Math.min(dt, 1 / 20);
  while (left > 0) {
    const h = Math.min(MAX_STEP, left);
    state.v += accel(state.x, state.v) * h;
    state.x += state.v * h;
    left -= h;
  }
}

// a damped spring pulling x toward target
export function stepSpring(
  state: SpringState,
  target: number,
  stiffness: number,
  damping: number,
  dt: number,
) {
  integrate(
    state,
    (x, v) => -stiffness * (x - target) - damping * v,
    dt,
  );
}

// damping coefficient for a given damping ratio (1 is critical, under 1 rings)
export function dampingFor(stiffness: number, ratio: number) {
  return 2 * ratio * Math.sqrt(stiffness);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
