import type { Metadata } from 'next';
import { Inkbloom, color } from 'electrocute-ui';

export const metadata: Metadata = {
  title: 'about — soft components',
};

export default function AboutPage() {
  return (
    <article className="wrap about">
      <h1>about</h1>
      <div className="about-panel">
        <p>
          soft components is a digital library of soft electronic components —
          buttons made of felt, potentiometers made of fabric, sensors you can
          squeeze. each entry pairs a living, tunable demo with the physics, the
          material science, the design context, and copy-paste code.
        </p>
        <p>
          the on-screen motion is simulated, not eased: every squash, glide,
          and slow color fade runs on a damped spring, because soft materials
          have personalities that easing curves flatten out. fibers relax.
          they don&apos;t ping.
        </p>
        <p>
          this library is part of my ongoing practice in soft electronics —
          e-textiles, physical computing, and generative text, under the name{' '}
          <a href="https://electrocute.io">electrocute lab</a>. i call the
          broader aesthetic <em>poetronics</em>: electronics with the
          sensibility of a poem. this library grew out of{' '}
          <a href="https://thesoft.computer">the soft computer</a>, a textile
          computing object that asks what a soft computer can do that a hard
          computer never could.
        </p>
        <p className="credit">
          styled with{' '}
          <a href="https://ui.electrocute.io">electrocute-ui</a>, my own
          design system.
        </p>
      </div>

      <Inkbloom size="lg" aria-hidden="true" className="about-mark" />

      <style>{`
        .about { padding-top: 3rem; max-width: 640px; }
        .about-panel {
          background: ${color.wisteriaDust};
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 1.8rem 2rem;
        }
        .about-panel p { color: var(--ink-soft); }
        .about-panel p:last-child { margin-bottom: 0; }
        .credit { font-size: 0.85rem; }
        .about-mark { display: block; margin: 2rem auto 0; }
      `}</style>
    </article>
  );
}
