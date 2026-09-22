// flip-dot board model, no react in here
// each disc is a torsion pendulum held in one of two wells by a permanent
// magnet. a short coil pulse kicks it over the barrier, a hard stop ends the
// flip, and the bounce off that stop is the click you hear

export const COLS = 28;
export const ROWS = 7;
export const DOTS = COLS * ROWS;

// angle 0 shows the dark face, angle pi shows the bright face
const WELL_TORQUE = 40000; // magnet strength, sets the ~45 hz wobble in a well
const DAMPING = 68; // light damping, so the disc rings a little after landing
const PULSE_TORQUE = 120000; // coil kick, strong enough to clear the barrier
const PULSE_TIME = 0.006; // seconds
const RESTITUTION = 0.3; // how much speed survives hitting the stop
const SUBSTEP = 0.0005; // seconds of sim time per integration step
const MIN_IMPACT = 60; // rad/s below which a landing makes no click

export const SLOW_MOTION = 0.12; // sim seconds per wall second when slowed
export const COLUMN_DELAY = 0.006; // sim seconds between columns in a sweep

export type Board = {
  theta: Float64Array;
  omega: Float64Array;
  target: Uint8Array;
  pulseAt: Float64Array; // sim time a pulse starts, -1 for none
  pulseDir: Int8Array;
  active: Uint8Array;
  time: number;
};

export function createBoard(): Board {
  return {
    theta: new Float64Array(DOTS),
    omega: new Float64Array(DOTS),
    target: new Uint8Array(DOTS),
    pulseAt: new Float64Array(DOTS).fill(-1),
    pulseDir: new Int8Array(DOTS),
    active: new Uint8Array(DOTS),
    time: 0,
  };
}

// ask the board to show a bitmap. returns how many dots have to flip.
// sweep staggers the pulses column by column, like a real addressed matrix.
// instant skips the physics for people who prefer reduced motion.
export function commandBoard(
  board: Board,
  next: boolean[],
  sweep: boolean,
  instant: boolean,
): number {
  let changed = 0;
  for (let i = 0; i < DOTS; i++) {
    const want = next[i] ? 1 : 0;
    if (board.target[i] === want) continue;
    board.target[i] = want;
    changed++;
    if (instant) {
      board.theta[i] = want ? Math.PI : 0;
      board.omega[i] = 0;
      board.active[i] = 0;
      board.pulseAt[i] = -1;
    } else {
      board.pulseAt[i] = board.time + (sweep ? (i % COLS) * COLUMN_DELAY : 0);
      board.pulseDir[i] = want ? 1 : -1;
      board.active[i] = 1;
    }
  }
  return changed;
}

// advance the whole board by dt seconds of sim time.
// impact speeds (rad/s) are pushed onto impacts. returns true while any dot
// is still moving or waiting for its pulse.
export function simulateBoard(
  board: Board,
  dt: number,
  impacts: number[],
): boolean {
  const { theta, omega, pulseAt, pulseDir, active } = board;
  const steps = Math.max(1, Math.ceil(dt / SUBSTEP));
  const h = dt / steps;
  let anyActive = false;

  for (let i = 0; i < DOTS; i++) {
    if (!active[i]) continue;

    let th = theta[i];
    let w = omega[i];
    let t = board.time;
    const start = pulseAt[i];
    const dir = pulseDir[i];

    for (let s = 0; s < steps; s++) {
      let torque = -WELL_TORQUE * Math.sin(2 * th) - DAMPING * w;
      if (start >= 0 && t >= start && t < start + PULSE_TIME) {
        torque += dir * PULSE_TORQUE;
      }
      w += torque * h;
      th += w * h;
      t += h;

      if (th > Math.PI) {
        th = Math.PI;
        if (w > 0) {
          if (w > MIN_IMPACT) impacts.push(w);
          w = -w * RESTITUTION;
        }
      } else if (th < 0) {
        th = 0;
        if (w < 0) {
          if (-w > MIN_IMPACT) impacts.push(-w);
          w = -w * RESTITUTION;
        }
      }
    }

    theta[i] = th;
    omega[i] = w;

    const pulseDone = start < 0 || t > start + PULSE_TIME;
    const settled = Math.abs(w) < 2 && (th < 0.003 || th > Math.PI - 0.003);
    if (pulseDone && settled) {
      theta[i] = th < Math.PI / 2 ? 0 : Math.PI;
      omega[i] = 0;
      active[i] = 0;
    } else {
      anyActive = true;
    }
  }

  board.time += dt;
  return anyActive;
}

export function hasActive(board: Board): boolean {
  return board.active.some((value) => value === 1);
}

export function bitmapOf(board: Board): boolean[] {
  return Array.from(board.target, (value) => value === 1);
}

export function emptyBitmap(): boolean[] {
  return new Array<boolean>(DOTS).fill(false);
}

export function fullBitmap(): boolean[] {
  return new Array<boolean>(DOTS).fill(true);
}

// 5x7 font, one number per column, lowest bit is the top row
const FONT: Record<string, number[]> = {
  " ": [0x00, 0x00, 0x00, 0x00, 0x00],
  "!": [0x00, 0x00, 0x5f, 0x00, 0x00],
  "-": [0x08, 0x08, 0x08, 0x08, 0x08],
  ".": [0x00, 0x60, 0x60, 0x00, 0x00],
  ":": [0x00, 0x00, 0x14, 0x00, 0x00],
  "?": [0x02, 0x01, 0x59, 0x09, 0x06],
  "*": [0x06, 0x0f, 0x1e, 0x0f, 0x06],
  "0": [0x3e, 0x51, 0x49, 0x45, 0x3e],
  "1": [0x00, 0x42, 0x7f, 0x40, 0x00],
  "2": [0x72, 0x49, 0x49, 0x49, 0x46],
  "3": [0x21, 0x41, 0x49, 0x4d, 0x33],
  "4": [0x18, 0x14, 0x12, 0x7f, 0x10],
  "5": [0x27, 0x45, 0x45, 0x45, 0x39],
  "6": [0x3c, 0x4a, 0x49, 0x49, 0x31],
  "7": [0x41, 0x21, 0x11, 0x09, 0x07],
  "8": [0x36, 0x49, 0x49, 0x49, 0x36],
  "9": [0x46, 0x49, 0x49, 0x29, 0x1e],
  A: [0x7c, 0x12, 0x11, 0x12, 0x7c],
  B: [0x7f, 0x49, 0x49, 0x49, 0x36],
  C: [0x3e, 0x41, 0x41, 0x41, 0x22],
  D: [0x7f, 0x41, 0x41, 0x41, 0x3e],
  E: [0x7f, 0x49, 0x49, 0x49, 0x41],
  F: [0x7f, 0x09, 0x09, 0x09, 0x01],
  G: [0x3e, 0x41, 0x41, 0x51, 0x73],
  H: [0x7f, 0x08, 0x08, 0x08, 0x7f],
  I: [0x00, 0x41, 0x7f, 0x41, 0x00],
  J: [0x20, 0x40, 0x41, 0x3f, 0x01],
  K: [0x7f, 0x08, 0x14, 0x22, 0x41],
  L: [0x7f, 0x40, 0x40, 0x40, 0x40],
  M: [0x7f, 0x02, 0x1c, 0x02, 0x7f],
  N: [0x7f, 0x04, 0x08, 0x10, 0x7f],
  O: [0x3e, 0x41, 0x41, 0x41, 0x3e],
  P: [0x7f, 0x09, 0x09, 0x09, 0x06],
  Q: [0x3e, 0x41, 0x51, 0x21, 0x5e],
  R: [0x7f, 0x09, 0x19, 0x29, 0x46],
  S: [0x26, 0x49, 0x49, 0x49, 0x32],
  T: [0x03, 0x01, 0x7f, 0x01, 0x03],
  U: [0x3f, 0x40, 0x40, 0x40, 0x3f],
  V: [0x1f, 0x20, 0x40, 0x20, 0x1f],
  W: [0x3f, 0x40, 0x38, 0x40, 0x3f],
  X: [0x63, 0x14, 0x08, 0x14, 0x63],
  Y: [0x03, 0x04, 0x78, 0x04, 0x03],
  Z: [0x61, 0x59, 0x49, 0x4d, 0x43],
};

// columns for a string, with a one column gap between letters
export function textColumns(text: string): number[] {
  const columns: number[] = [];
  for (const char of text.toUpperCase()) {
    columns.push(...(FONT[char] ?? FONT[" "]), 0);
  }
  columns.pop();
  return columns;
}

export function blankColumns(count: number): number[] {
  return new Array<number>(count).fill(0);
}

export function centerColumns(columns: number[]): number[] {
  const pad = Math.max(0, Math.floor((COLS - columns.length) / 2));
  return [...blankColumns(pad), ...columns];
}

// fits any set of columns onto the physical board. if it's narrower than the
// board, it's centered as usual. if it's wider, it's shrunk to fit: columns
// that would land on the same physical dot are merged (bitwise or), which
// reads like a bolder, denser version of the same message rather than one
// with letters missing off the end
export function fitToBoard(columns: number[]): boolean[] {
  if (columns.length <= COLS) return columnsToBitmap(centerColumns(columns));

  const bits = emptyBitmap();
  for (let c = 0; c < COLS; c++) {
    const from = Math.floor((c * columns.length) / COLS);
    const to = Math.max(
      from + 1,
      Math.floor(((c + 1) * columns.length) / COLS),
    );
    let merged = 0;
    for (let s = from; s < to; s++) merged |= columns[s] ?? 0;
    for (let r = 0; r < ROWS; r++) {
      bits[r * COLS + c] = ((merged >> r) & 1) === 1;
    }
  }
  return bits;
}

// turns the first COLS columns into a bitmap, row by row
export function columnsToBitmap(columns: number[]): boolean[] {
  const bits = emptyBitmap();
  for (let c = 0; c < COLS; c++) {
    const value = columns[c] ?? 0;
    for (let r = 0; r < ROWS; r++) {
      bits[r * COLS + c] = ((value >> r) & 1) === 1;
    }
  }
  return bits;
}
