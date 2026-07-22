import Link from "next/link";
import SoftChipMark from "./SoftChipMark";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link
          href="/"
          className={styles.wordmark}
          aria-label="Soft Components home"
        >
          <SoftChipMark size={28} />
          soft components
        </Link>
        <nav className={styles.nav}>
          <Link href="/#library">library</Link>
          <Link href="/about">about</Link>
        </nav>
      </div>
    </header>
  );
}
