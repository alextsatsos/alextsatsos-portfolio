import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.logo}>
          <span className={styles.logoAt}>@</span>
          <span className={styles.logoName}>alextsatsos</span>
        </p>
        <p className={styles.subtitle}>
          Senior UX &amp; Product Designer · alextsatsos.com
        </p>
        <p className={styles.handNote}>
          made with care &amp; too much tea ✦
        </p>
      </div>
    </footer>
  );
}
