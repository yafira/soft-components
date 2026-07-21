import type { Metadata } from 'next';
import { color } from 'electrocute-ui';
import AboutMark from '@/components/AboutMark';

export const metadata: Metadata = {
  title: 'about — soft components',
};

export default function AboutPage() {
  return (
    <article className="wrap about">
      <h1>about</h1>
      <div className="about-panel">
        <p>
          Soft components is a digital library of soft electronic components —
          buttons made of felt, potentiometers made of fabric, sensors you can
          squeeze. Each entry pairs a living, tunable demo with the physics, the
          material science, the design context, and copy-paste code.
        </p>
        <p>
          The on-screen motion is simulated, not eased: every squash, glide,
          and slow color fade runs on a damped spring, because soft materials
          have personalities that easing curves flatten out. Fibers relax.
          They don&apos;t ping.
        </p>
        <p>
          This library is part of my ongoing practice in soft electronics —
          e-textiles, physical computing, and generative text, under the name{' '}
          <a href="https://electrocute.io">electrocute lab</a>. I call the
          broader aesthetic <em>poetronics</em>: electronics with the
          sensibility of a poem. This library grew out of{' '}
          <a href="https://thesoft.computer">the soft computer</a>, a textile
          computing object that asks what a soft computer can do that a hard
          computer never could.
        </p>
        <p className="credit">
          Styled with{' '}
          <a href="https://ui.electrocute.io">electrocute-ui</a>, my own
          design system.
        </p>
      </div>

      <section className="why" aria-labelledby="why-h">
        <h2 id="why-h">why soft electronics matter</h2>
        <p>
          Textiles and computing have been entangled from the very beginning.
          The Jacquard loom of 1804 used chains of punched cards to control
          which threads lifted on each pass of the shuttle — programmable
          pattern, decades before programmable computation — and those same
          punched cards later shaped how early computing pioneers, including
          Charles Babbage and Ada Lovelace, imagined feeding instructions to a
          machine. Lovelace herself described the Analytical Engine as weaving
          algebraical patterns &ldquo;just as the Jacquard-loom weaves flowers
          and leaves.&rdquo;
        </p>
        <p>
          The entanglement runs deeper than metaphor. When the Apollo program
          needed to store flight software that could survive a trip to the
          moon, the Apollo Guidance Computer&apos;s programs were physically
          woven into core rope memory: wires threaded by hand through tiny
          ferrite rings, where passing through a core meant a one and passing
          around it meant a zero. That weaving was done largely by women at
          Raytheon&apos;s plant in Waltham, Massachusetts — many hired from
          the local textile industry specifically for their needlework skill.
          The software that landed humans on the moon was, in the most literal
          sense, a textile.
        </p>
        <p>
          The modern field of soft electronics picks that thread back up with
          new materials. A landmark 2011 paper in <em>Science</em> introduced
          &ldquo;epidermal electronics&rdquo; — circuits with thickness,
          stiffness, and mass matched to human skin, so they laminate on like
          a temporary tattoo and move with the body instead of fighting it.
          That mechanical matching is the core argument for the whole field:
          bodies, garments, and everyday objects are soft, and electronics
          that share their mechanics can go places rigid boards never could —
          continuous health monitoring, prosthetics that sense, garments that
          respond.
        </p>
        <p>
          Just as important is who gets to build. Leah Buechley&apos;s LilyPad
          Arduino — a microcontroller and sensors in sewable packages,
          commercialized in 2007 — reframed electronics as a craft material,
          and her research found that it drew in exactly the people
          traditional electronics culture had been losing, particularly women
          and girls, by meeting them inside craft traditions that were already
          theirs. Soft electronics isn&apos;t just a materials question;
          it&apos;s a question of what counts as engineering, and whose hands
          count as engineers&apos; hands. This library is written in that
          spirit: the felt, the thread, and the physics all taken equally
          seriously.
        </p>

        <h3 id="refs-h">references &amp; further reading</h3>
        <ul className="refs">
          <li>
            Kim, D.-H. Et al. &ldquo;Epidermal Electronics.&rdquo;{' '}
            <em>Science</em> 333, 838–843 (2011).{' '}
            <a href="https://www.science.org/doi/10.1126/science.1206157">Science.Org</a>
          </li>
          <li>
            Buechley, L., Eisenberg, M., Catchen, J. &amp; Crockett, A.
            &ldquo;The LilyPad Arduino: Using Computational Textiles to
            Investigate Engagement, Aesthetics, and Diversity in Computer
            Science Education.&rdquo; <em>Proceedings of CHI</em> (2008).{' '}
            <a href="https://dl.acm.org/doi/10.1145/1357054.1357123">Dl.Acm.Org</a>
          </li>
          <li>
            &ldquo;Core memory weavers and Navajo women made the Apollo
            missions possible.&rdquo; <em>Science News</em> (2022).{' '}
            <a href="https://www.sciencenews.org/article/core-memory-weavers-navajo-apollo-raytheon-computer-nasa">Sciencenews.Org</a>
          </li>
          <li>
            Shirriff, K. &ldquo;Software woven into wire: Core rope and the
            Apollo Guidance Computer.&rdquo;{' '}
            <a href="http://www.righto.com/2019/07/software-woven-into-wire-core-rope-and.html">Righto.Com</a>
          </li>
          <li>
            Buechley, L. &amp; Eisenberg, M. &ldquo;The LilyPad Arduino:
            Toward Wearable Engineering for Everyone.&rdquo;{' '}
            <em>IEEE Pervasive Computing</em> 7 (2008).{' '}
            <a href="https://www.semanticscholar.org/paper/The-LilyPad-Arduino:-Toward-Wearable-Engineering-Buechley-Eisenberg/14cf4277888a586d1536c88ecad76e2a12e0fb66">Semanticscholar.Org</a>
          </li>
        </ul>
      </section>

      <AboutMark />

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
        .why { margin-top: 3rem; }
        .why p { color: var(--ink-soft); }
        .why h3 { margin-top: 2.2rem; font-size: 1rem; }
        .refs { padding-left: 1.2rem; }
        .refs li { font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 0.8rem; line-height: 1.55; }
        .about-mark { display: block; margin: 2.5rem auto 0; }
      `}</style>
    </article>
  );
}
