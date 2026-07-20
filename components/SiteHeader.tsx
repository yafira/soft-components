import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="wordmark" aria-label="soft components home">
          <span className="stitch" aria-hidden="true" />
          soft components
        </Link>
        <nav>
          <Link href="/#library">library</Link>
          <Link href="/about">about</Link>
        </nav>
      </div>

      <style>{`
        .site-header {
          border-bottom: 1px dashed var(--line);
          padding: 1.1rem 0;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .wordmark {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--ink);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
        }
        .stitch {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--blush);
          border: 2px solid var(--blush-deep);
          display: inline-block;
        }
        nav { display: flex; gap: 1.4rem; }
        nav a { color: var(--ink-soft); text-decoration: none; font-size: 0.9rem; }
        nav a:hover { color: var(--blush-deep); text-decoration: underline; }
      `}</style>
    </header>
  );
}
