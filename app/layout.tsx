import type { Metadata } from 'next';
import 'electrocute-ui/dist/index.css';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'soft components',
  description: 'A digital library of soft electronic components',
  metadataBase: new URL('https://soft.electrocute.io'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font --
            this rule targets the pages-router _document pattern; in the app
            router, next/font/google is the recommended alternative — worth
            switching to once you have normal network access to verify the
            build (this sandbox's egress allowlist doesn't include Google
            Fonts, so it couldn't be tested here). */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=Pixelify+Sans:wght@400;500&family=Jersey+25&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (password managers,
          clipboard tools, etc.) sometimes inject attributes like
          cz-shortcut-listen onto <body> before React hydrates. That's a
          real DOM difference but a harmless one — this tells React not
          to warn about it specifically, without hiding real mismatches
          elsewhere in the tree. */}
      <body suppressHydrationWarning>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
