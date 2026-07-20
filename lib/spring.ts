// a tiny damped spring — the hand-rolled reference implementation.
// kept around for the "see the raw integration" deep-dive on the
// soft button page, and for the prefersReducedMotion helper used
// across every demo regardless of which animation library drives it.

export interface SpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  value?: number;
}

export class Spring {
  stiffness: number;
  damping: number;
  mass: number;
  value: number;
  target: number;
  velocity: number;

  constructor({ stiffness = 170, damping = 16, mass = 1, value = 1 }: SpringOptions = {}) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  step(dt: number) {
    const displacement = this.value - this.target;
    const springForce = -this.stiffness * displacement;
    const dampingForce = -this.damping * this.velocity;
    const acceleration = (springForce + dampingForce) / this.mass;
    this.velocity += acceleration * dt;
    this.value += this.velocity * dt;
  }

  get settled() {
    return (
      Math.abs(this.velocity) < 0.001 &&
      Math.abs(this.value - this.target) < 0.001
    );
  }

  snap() {
    this.value = this.target;
    this.velocity = 0;
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
