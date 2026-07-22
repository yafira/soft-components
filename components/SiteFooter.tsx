import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <p>
          A poetronics project by{' '}
          <a href="https://electrocute.io">Electrocute Lab</a> · Electronics
          with the sensibility of a poem
        </p>
      </div>
    </footer>
  );
}
