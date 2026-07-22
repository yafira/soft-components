import LazyLibraryGrid from '@/components/LazyLibraryGrid';
import styles from './Home.module.css';

export default function HomePage() {
  return (
    <>
      <section className={`${styles.hero} wrap`}>
        <h1>a digital library of<br /><span className={styles.accent}>soft electronic components</span></h1>
        <p className={styles.lede}>
          Buttons made of felt. Potentiometers made of fabric. Sensors you can squeeze.
          Each entry shows the component in motion, then explains the physics,
          the engineering, and the design thinking behind it.
        </p>
        <p className={styles.hint} aria-hidden="true">↓ tap a component to press, slide, or squeeze it</p>
      </section>

      <LazyLibraryGrid />
    </>
  );
}
