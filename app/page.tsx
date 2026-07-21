import LazyLibraryGrid from "@/components/LazyLibraryGrid";

export default function HomePage() {
  return (
    <>
      <section className="hero wrap">
        <h1>
          a digital library of
          <br />
          <span className="accent">soft electronic components</span>
        </h1>
        <p className="lede">
          Buttons made of felt. Potentiometers made of fabric. Sensors you can
          squeeze. Each entry shows the component in motion, then explains the
          physics, the engineering, and the design thinking behind it.
        </p>
        <p className="hint" aria-hidden="true">
          ↓ tap a component to press, slide, or squeeze it
        </p>
      </section>

      <LazyLibraryGrid />

      <style>{`
        .hero { padding: 4.5rem 1.25rem 3rem; }
        .hero h1 { color: var(--ink); }
        .hero h1 .accent { color: var(--wisteria-deep); }
        .lede { max-width: 56ch; color: var(--ink-soft); font-size: 1.02rem; }
        .hint {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--ink-soft);
          background: transparent;
          border: 1px dashed var(--wisteria);
          border-radius: 999px;
          padding: 0.3rem 0.95rem;
          margin-top: 2.2rem;
        }
      `}</style>
    </>
  );
}
