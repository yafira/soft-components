import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'about — soft components',
};

export default function AboutPage() {
  return (
    <article className="wrap about">
      <h1>about</h1>
      <p>
        soft components is a digital library of soft electronic components —
        buttons made of felt, potentiometers made of fabric, sensors you can
        squeeze. each entry pairs a living, tunable demo with the physics, the
        material science, the design context, and copy-paste code.
      </p>
      <p>
        the on-screen motion is simulated, not eased: every squash and glide
        runs on a damped spring, because soft materials have personalities
        that easing curves flatten out. fibers relax. they don&apos;t ping.
      </p>
      <p>
        this is a <a href="https://electrocute.io">electrocute lab</a>{' '}
        project, part of an ongoing practice of poetronics — electronics with
        the sensibility of a poem. it grew out of{' '}
        <a href="https://thesoft.computer">the soft computer</a>, a textile
        computing object that asks: what can a soft computer do that a hard
        computer never could?
      </p>
      <p>✿</p>

      <style>{`
        .about { padding-top: 3rem; max-width: 640px; }
        .about p { color: var(--ink-soft); }
        .about p:last-child { color: var(--blush-deep); font-size: 1.2rem; }
      `}</style>
    </article>
  );
}
