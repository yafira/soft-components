import type { Metadata } from 'next';
import Link from 'next/link';
import LazyEinkRefreshDemo from '@/components/LazyEinkRefreshDemo';

export const metadata: Metadata = {
  title: 'e-ink refresh — soft components',
  description: 'The flash-to-black refresh cycle of an e-ink display, and why the flicker is a feature.',
};

export default function EinkRefreshPage() {
  return (
    <article className="wrap entry">
      <header className="entry-header">
        <p className="crumb"><Link href="/#library">library</Link> / display</p>
        <h1>e-ink refresh</h1>
        <p className="lede">
          The first display in the library. E-ink doesn&apos;t fade between
          states like a screen — it flashes. Try a partial refresh, then a full
          one, and watch the difference.
        </p>
      </header>

      <section className="panel" aria-labelledby="demo-h">
        <h2 id="demo-h">refresh it</h2>
        <LazyEinkRefreshDemo />
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">how it works</h2>
        <p>
          An e-ink pixel is a capsule of charged black and white particles.
          Apply a field and the particles migrate to the surface, flipping the
          pixel&apos;s color. The particles don&apos;t all move cleanly on the
          first pass, though — some lag behind, leaving a faint trace of the
          old image, called ghosting. A full refresh clears it by driving every
          pixel black, then white, several times before settling on the new
          content, forcing every particle to fully migrate at least once. A
          partial refresh skips that and updates only the changed pixels
          directly — fast, but it can accumulate ghosting over many partial
          refreshes.
        </p>
        <p>
          The flicker in this demo is a real <a href="https://gsap.com">GSAP</a>{' '}
          timeline stepping the panel through solid black and white several
          times before revealing new text — not a CSS blink, an actual
          simulation of the clearing pass a real e-ink controller runs.
        </p>
      </section>

      <section aria-labelledby="context-h">
        <h2 id="context-h">when to use it</h2>
        <p>
          Anywhere content changes slowly and battery or calm matters more than
          speed: a bedside reader, a slow-generated text object, a display
          meant to be glanced at rather than watched. The soft computer&apos;s
          10.3&Prime; Waveshare panel runs exactly this tradeoff — full
          refreshes between corpora to stay legible, partial refreshes within a
          generation to stay quiet.
        </p>
        <p className="foot-nav">
          <Link href="/components/thermochromic-reveal">← thermochromic reveal</Link>
          <span><Link href="/#library">back to the library</Link></span>
        </p>
      </section>

      <style>{`
        .entry { padding-top: 3rem; }
        .entry-header { margin-bottom: 2.5rem; }
        .crumb { font-size: 0.78rem; color: var(--ink-soft); margin-bottom: 0.4rem; }
        .lede { max-width: 58ch; color: var(--ink-soft); }
        section { margin-bottom: 3rem; }
        .panel {
          background: var(--card);
          border: 1px dashed var(--wisteria-deep);
          border-radius: var(--radius-lg);
          padding: 1.6rem;
        }
        .foot-nav {
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem;
          font-size: 0.85rem; border-top: 1px dashed var(--line); padding-top: 1.4rem;
        }
      `}</style>
    </article>
  );
}
