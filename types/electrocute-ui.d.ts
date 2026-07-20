// electrocute-ui doesn't publish its own type declarations yet — this is a
// minimal ambient declaration covering the exports this project uses.
// Safe to delete once the package ships real types.
declare module 'electrocute-ui' {
  import type { ComponentPropsWithoutRef, ForwardRefExoticComponent, RefAttributes } from 'react';

  type Tone =
    | 'lavender-beam'
    | 'peony-fizz'
    | 'marzipan-cloud'
    | 'pistachio-swirl'
    | 'glacier-mist'
    | 'mochi-cream';

  type Size = 'sm' | 'md' | 'lg';

  export const Button: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'button'> & {
      tone?: Tone;
      variant?: 'solid' | 'outline' | 'pill';
      size?: Size;
    } & RefAttributes<HTMLButtonElement>
  >;

  export const Card: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'div'> & {
      tone?: Tone;
      hoverAccent?: boolean;
    } & RefAttributes<HTMLDivElement>
  >;

  export const Nav: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'nav'> & {
      theme?: 'light' | 'outline' | 'dark';
    } & RefAttributes<HTMLElement>
  >;

  export const Input: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'input'> & RefAttributes<HTMLInputElement>
  >;

  export const Toggle: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'button'> & { on?: boolean } & RefAttributes<HTMLButtonElement>
  >;

  export const Badge: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'span'> & { tone?: Tone | 'gray' } & RefAttributes<HTMLSpanElement>
  >;

  export const Avatar: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'div'> & { tone?: Tone; size?: Size } & RefAttributes<HTMLDivElement>
  >;

  export const Inkbloom: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'img'> & { size?: Size } & RefAttributes<HTMLImageElement>
  >;

  export const BloomOutline: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<'span'> & { size?: Size; color?: string } & RefAttributes<HTMLSpanElement>
  >;

  export const color: Record<string, string>;
  export const fontFamily: { display: string; body: string; mono: string };
  export const radius: { sm: string; md: string; lg: string; xl: string };
  export const type: Record<string, { fontSize: string; fontWeight: number; lineHeight: number }>;
  export const palettes: Record<string, Record<string, string>>;
  export const gothGrunge: Record<string, string>;
  export const digitalPurple: Record<string, string>;
  export const sweetMochi: Record<string, string>;
  export const jazzBlues: Record<string, string>;
  export const springGreens: Record<string, string>;
  export const citrus: Record<string, string>;
}
