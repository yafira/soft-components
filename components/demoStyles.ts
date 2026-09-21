// shared styles for the soft speaker, zipper sensor, and flip-dot demos
// the --scd-* tokens below point at the site palette (--ink, --blush-deep,
// --wisteria and friends), so recoloring the site recolors these demos

export const demoCss = `
.scd {
  --scd-ink: var(--ink, #3d3548);
  --scd-paper: var(--card, #ffffff);
  --scd-accent: var(--blush-deep, #c46a8c);
  --scd-accent-soft: var(--blush, #f6c8d8);
  --scd-muted: var(--ink-soft, #6f6580);
  --scd-line: var(--line, #ddd0f0);
  --scd-surface: #f7f4fd;
  --scd-fabric: var(--wisteria, #cdc1ee);
  --scd-flip: var(--butter, #fbe7ae);
  display: grid;
  gap: 1rem;
  width: 100%;
  color: var(--scd-ink);
  font-size: 0.95rem;
  line-height: 1.6;
}

.scd-stage {
  border: 2px solid var(--scd-line);
  border-radius: var(--radius, 14px);
  padding: 0.5rem;
  background: var(--scd-surface);
}

.scd-stage svg {
  display: block;
  width: 100%;
  height: auto;
}

.scd-split {
  display: grid;
  grid-template-columns: minmax(0, 15rem) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

@media (max-width: 34rem) {
  .scd-split {
    grid-template-columns: minmax(0, 1fr);
  }
}

.scd-side {
  display: grid;
  gap: 1rem;
}

.scd-controls {
  display: grid;
  gap: 0.75rem;
}

.scd-row {
  display: grid;
  grid-template-columns: 8.5rem minmax(0, 1fr) 5rem;
  align-items: center;
  gap: 0.75rem;
}

.scd-row output {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--scd-muted);
}

@media (max-width: 30rem) {
  .scd-row {
    grid-template-columns: minmax(0, 1fr) 4.5rem;
  }
  .scd-row label {
    grid-column: 1 / -1;
  }
}

.scd input[type="range"] {
  width: 100%;
  accent-color: var(--scd-accent);
}

.scd-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.scd-btn {
  font: inherit;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 2px dashed var(--scd-line);
  background: transparent;
  color: var(--scd-ink);
  cursor: pointer;
}

.scd-btn:hover:not(:disabled) {
  border-color: var(--scd-ink);
}

.scd-btn[aria-pressed="true"] {
  background: var(--scd-accent-soft);
  border: 2px solid var(--scd-accent);
  color: var(--scd-ink);
}

.scd-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.scd-input {
  font: inherit;
  flex: 1 1 10rem;
  min-width: 0;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  border: 2px solid var(--scd-line);
  background: var(--scd-paper);
  color: var(--scd-ink);
}

.scd-btn:focus-visible,
.scd-input:focus-visible,
.scd input[type="range"]:focus-visible,
.scd [role="slider"]:focus-visible {
  outline: 2px solid var(--scd-accent);
  outline-offset: 3px;
}

.scd-readout {
  display: grid;
  gap: 0.35rem;
  margin: 0;
}

.scd-readout div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--scd-line);
  padding-bottom: 0.25rem;
}

.scd-readout dt {
  color: var(--scd-muted);
}

.scd-readout dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.scd-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--scd-muted);
}

.scd-board {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  touch-action: none;
  cursor: crosshair;
}
`;
