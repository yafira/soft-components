"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getAudioContext, playClick } from "../lib/audio";
import {
  COLS,
  DOTS,
  ROWS,
  SLOW_MOTION,
  bitmapOf,
  blankColumns,
  centerColumns,
  columnsToBitmap,
  commandBoard,
  createBoard,
  emptyBitmap,
  fullBitmap,
  hasActive,
  simulateBoard,
  textColumns,
  type Board,
} from "../lib/flipdot";
import { usePrefersReducedMotion } from "../lib/physics";
import { demoCss } from "./demoStyles";

const PITCH = 22;
const RADIUS = 9.5;
const PAD = 12;
const WIDTH = PAD * 2 + COLS * PITCH;
const HEIGHT = PAD * 2 + ROWS * PITCH;

const BOARD_COLOR = "#15121a";
const OFF_COLOR = "#2b2731";
const MAX_CLICKS_PER_FRAME = 12;

function drawBoard(canvas: HTMLCanvasElement, board: Board, onColor: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scale = canvas.width / WIDTH;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = BOARD_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const facing = Math.cos(board.theta[i]);
      const cx = PAD + c * PITCH + PITCH / 2;
      const cy = PAD + r * PITCH + PITCH / 2;

      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(0.6, RADIUS * Math.abs(facing)), RADIUS, 0, 0, Math.PI * 2);
      ctx.fillStyle = facing >= 0 ? OFF_COLOR : onColor;
      ctx.fill();
      ctx.stroke();
    }
  }
}

// turn impact speeds into a handful of clicks, so a full-board flip sounds
// like a rattle and not a wall of noise
function playImpacts(speeds: number[]) {
  if (speeds.length === 0) return;
  const count = Math.min(speeds.length, MAX_CLICKS_PER_FRAME);
  for (let k = 0; k < count; k++) {
    const speed = speeds[Math.floor((k * speeds.length) / count)];
    playClick({
      pitch: 1300 + Math.random() * 1500,
      gain: (Math.min(1, speed / 600) * 0.16) / Math.sqrt(count),
      delay: Math.random() * 0.016,
    });
  }
}

export default function FlipDotDemo() {
  const reduced = usePrefersReducedMotion();
  const id = useId();

  const [text, setText] = useState("SOFT");
  const [caption, setCaption] = useState("SOFT");
  const [slow, setSlow] = useState(true);
  const [sound, setSound] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<Board | null>(null);
  const onColor = useRef("#fbe7ae");
  const start = useRef<() => void>(() => {});
  const redraw = useRef<() => void>(() => {});
  const slowRef = useRef(slow);
  const soundRef = useRef(sound);
  const painting = useRef(false);
  const paintValue = useRef(true);

  useEffect(() => {
    slowRef.current = slow;
  }, [slow]);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  const getBoard = useCallback(() => {
    if (!boardRef.current) boardRef.current = createBoard();
    return boardRef.current;
  }, []);

  // set up the canvas, the animation loop, and the first message
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const board = getBoard();

    const density = Math.min(window.devicePixelRatio || 1, 2);
    el.width = Math.round(WIDTH * density);
    el.height = Math.round(HEIGHT * density);

    if (root.current) {
      const accent = getComputedStyle(root.current).getPropertyValue("--scd-flip").trim();
      if (accent) onColor.current = accent;
    }

    let frame = 0;
    let running = false;
    let last = 0;

    const draw = () => drawBoard(el, board, onColor.current);

    const tick = (now: number) => {
      const wall = Math.min((now - last) / 1000, 0.05);
      last = now;

      const impacts: number[] = [];
      const moving = simulateBoard(board, wall * (slowRef.current ? SLOW_MOTION : 1), impacts);
      draw();
      if (soundRef.current) playImpacts(impacts);

      if (moving) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    start.current = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    redraw.current = draw;

    // the first message flips in once, unless motion is reduced
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    commandBoard(board, columnsToBitmap(centerColumns(textColumns("SOFT"))), true, instant);

    draw();
    if (hasActive(board)) start.current();

    return () => {
      cancelAnimationFrame(frame);
      running = false;
    };
  }, [getBoard]);

  // show a bitmap on the board, sweeping column by column if asked
  const show = useCallback(
    (next: boolean[], sweep: boolean) => {
      const board = getBoard();
      const changed = commandBoard(board, next, sweep && !reduced, reduced);
      if (changed === 0) return;
      if (reduced) {
        redraw.current();
        if (soundRef.current) playImpacts(new Array<number>(changed).fill(450));
      } else {
        start.current();
      }
    },
    [getBoard, reduced],
  );

  const showText = useCallback(
    (value: string) => {
      setScrolling(false);
      show(columnsToBitmap(centerColumns(textColumns(value))), true);
      setCaption(value.trim() || "a blank board");
    },
    [show],
  );

  // scrolling ticker: one column per step, with the board waiting for each
  // flip to settle before the next
  useEffect(() => {
    if (!scrolling || reduced) return;
    const columns = [...blankColumns(COLS), ...textColumns(text || " "), ...blankColumns(COLS)];
    const windows = columns.length - COLS + 1;
    let offset = 0;
    const interval = window.setInterval(
      () => {
        offset = (offset + 1) % windows;
        show(columnsToBitmap(columns.slice(offset, offset + COLS)), false);
      },
      slow ? 900 : 130,
    );
    return () => window.clearInterval(interval);
  }, [scrolling, reduced, text, slow, show]);

  const cellAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * HEIGHT;
    const c = Math.floor((x - PAD) / PITCH);
    const r = Math.floor((y - PAD) / PITCH);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return -1;
    return r * COLS + c;
  };

  const paintCell = (i: number) => {
    if (i < 0) return;
    const board = getBoard();
    if (board.target[i] === (paintValue.current ? 1 : 0)) return;
    const next = bitmapOf(board);
    next[i] = paintValue.current;
    setScrolling(false);
    setCaption("your own pattern");
    show(next, false);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const i = cellAt(e);
    if (i < 0) return;
    paintValue.current = getBoard().target[i] === 0;
    painting.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    paintCell(i);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (painting.current) paintCell(cellAt(e));
  };

  const onPointerEnd = () => {
    painting.current = false;
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    if (next) {
      // wake the audio context inside the click, then confirm with a tick
      getAudioContext();
      playClick({ gain: 0.08 });
    }
  };

  return (
    <div className="scd" ref={root}>
      <style>{demoCss}</style>

      <div className="scd-stage">
        <canvas
          ref={canvas}
          className="scd-board"
          role="img"
          aria-label={`Flip-dot display showing ${caption}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        />
      </div>

      <div className="scd-controls">
        <form
          className="scd-toolbar"
          onSubmit={(e) => {
            e.preventDefault();
            showText(text);
          }}
        >
          <label htmlFor={`${id}-text`} className="scd-note">
            message
          </label>
          <input
            id={`${id}-text`}
            className="scd-input"
            type="text"
            value={text}
            maxLength={24}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="scd-btn">
            show
          </button>
        </form>

        <div className="scd-toolbar">
          <button
            type="button"
            className="scd-btn"
            aria-pressed={scrolling}
            disabled={reduced}
            onClick={() => setScrolling((value) => !value)}
          >
            scroll
          </button>
          <button
            type="button"
            className="scd-btn"
            onClick={() => {
              setScrolling(false);
              setCaption("a blank board");
              show(emptyBitmap(), true);
            }}
          >
            clear
          </button>
          <button
            type="button"
            className="scd-btn"
            onClick={() => {
              setScrolling(false);
              setCaption("every dot flipped");
              show(fullBitmap(), true);
            }}
          >
            fill
          </button>
          <button
            type="button"
            className="scd-btn"
            aria-pressed={slow}
            disabled={reduced}
            onClick={() => setSlow((value) => !value)}
          >
            slow motion
          </button>
          <button type="button" className="scd-btn" aria-pressed={sound} onClick={toggleSound}>
            sound
          </button>
        </div>

        <p className="scd-note">
          {DOTS} discs, each held in place by a magnet. click or drag on the board to flip dots by hand. a real dot
          flips in about ten milliseconds, so slow motion is on to let you watch the disc hit its stop and rattle.
          {reduced ? " reduced motion is on, so dots flip instantly and scrolling is off." : ""}
        </p>
      </div>
    </div>
  );
}
