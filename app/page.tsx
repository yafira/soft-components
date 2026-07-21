import LazyLibraryGrid from '@/components/LazyLibraryGrid';

export default function HomePage() {
  return (
    <>
      <section className="hero wrap">
        <h1>a digital library of<br />soft electronic components</h1>
        <p className="lede">
          Buttons made of felt. Potentiometers made of fabric. Sensors you can squeeze.
          Each entry shows the component in motion, then explains the physics,
          the engineering, and the design thinking behind it.
        </p>
        <p className="hint" aria-hidden="true">↓ Tap a component to press, slide, or squeeze it</p>
      </section>

      <LazyLibraryGrid />

      <style>{`
        .hero { padding: 4rem 1.25rem 2.5rem; }
        .hero h1 { color: var(--ink); }
        .lede { max-width: 56ch; color: var(--ink-soft); }
        .hint {
          font-size: 0.8rem;
          color: var(--wisteria-deep);
          margin-top: 2rem;
        }
      `}</style>
    </>
  );
}
