'use client';

// electrocute-ui components use React hooks internally but the published
// bundle has no 'use client' directive, so importing them directly into a
// server component page throws at runtime. This thin client wrapper is the
// standard fix. (Long-term: add a 'use client' banner to electrocute-ui's
// build output and this file can go away.)
import { Inkbloom } from 'electrocute-ui';

export default function AboutMark({ className }: { className?: string }) {
  return <Inkbloom size="lg" aria-hidden="true" className={className} />;
}
