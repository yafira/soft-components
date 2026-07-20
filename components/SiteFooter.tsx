export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>
          a poetronics project by{' '}
          <a href="https://electrocute.io">electrocute lab</a> · electronics
          with the sensibility of a poem
        </p>
      </div>

      <style>{`
        .site-footer {
          border-top: 1px dashed var(--line);
          margin-top: 5rem;
          padding: 2rem 0 3rem;
          color: var(--ink-soft);
          font-size: 0.85rem;
        }
      `}</style>
    </footer>
  );
}
