# soft components

a digital library of soft electronic components — buttons made of felt,
potentiometers made of fabric, sensors you can squeeze. each entry pairs a
living, tunable demo with the physics, the material science, the design
context, and copy-paste code.

part of my ongoing practice in soft electronics at
[electrocute lab](https://electrocute.io). the broader aesthetic is
_poetronics_: electronics with the sensibility of a poem.

## the library
<table>
  <tr>
    <td><img src="public/screenshots/sc1.gif" width="300"></td>
    <td><img src="public/screenshots/sc2.gif" width="300"></td>
    <td><img src="public/screenshots/sc3.gif" width="300"></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/sc4.gif" width="300"></td>
    <td><img src="public/screenshots/sc5.gif" width="300"></td>
    <td><img src="public/screenshots/sc6.gif" width="300"></td>
  </tr>
</table>

**input** — soft button · soft potentiometer · pressure sensor ·
knit stretch sensor · capacitive touch matrix · fabric bend sensor

**output** — haptic motor (with real web audio buzz) · thermochromic reveal

**display** — e-ink refresh

every demo runs on real simulation, not easing curves. soft materials have
personalities that easing flattens out — fibers relax, they don't ping — so
every squash, glide, and slow color fade is driven by a damped spring.

## how it's built

- **next.js 15** (app router) + **typescript**
- three animation approaches, used deliberately:
- a hand-rolled damped spring (`lib/spring.ts`) — the physics, visible
- [motion](https://motion.dev) — for spring-driven ui transitions
- [gsap](https://gsap.com) — for timeline-sequenced signatures
- **web audio api** for the haptic motor's buzz — a single oscillator whose
  gain follows the same envelope function that drives the visuals
- [electrocute-ui](https://ui.electrocute.io) — my design system, for tokens
  and the inkbloom mark on the about page
- typeface: [jersey 25](https://fonts.google.com/specimen/Jersey+25) for display
  (from sarah cadigan-fried's soft type collection), ibm plex mono for body
- every demo is lazy-loaded (`next/dynamic`, ssr off) behind a skeleton, so
  first-load js stays at the next.js baseline (~103 kb) on every route
- every demo respects `prefers-reduced-motion` and supports keyboard input

## running it

```bash
npm install
npm run dev
```

`npm install` pulls in everything the demos depend on — [motion](https://motion.dev),
[gsap](https://gsap.com), and [electrocute-ui](https://www.npmjs.com/package/electrocute-ui)
are all listed in `package.json`, so there's nothing to install separately.
(if you're wiring these into your own project instead, grab them with
`npm install motion gsap electrocute-ui`.)

open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```

## project structure

```
app/                        routes (app router)
  components/<slug>/        one page per component entry
  about/                    about + why soft electronics matter
  icon.svg                  favicon (the soft chip mark)
  globals.css               design tokens + base styles
components/
  <Name>Demo.tsx            interactive demos ('use client')
  Lazy<Name>Demo.tsx        dynamic import wrappers with skeletons
  LibraryGrid.tsx           homepage grid with animated thumbnails
  SoftChipMark.tsx          the logo mark
lib/
  spring.ts                 damped harmonic oscillator + reduced-motion helper
```

## credits

- [soft type](https://www.soft-type.com) typefaces by sarah cadigan-fried (ofl)
- references for the history section live on the
  [about page](/about) — the apollo core rope memory story is worth your time

---

a poetronics project by [electrocute lab](https://electrocute.io) ·
electronics with the sensibility of a poem
