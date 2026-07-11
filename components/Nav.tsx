'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoAt}>@</span>
          <span className={styles.logoName}>alextsatsos</span>
        </Link>

        <ul className={styles.links}>
          <li>
            <a
              href="#work"
              className={pathname === '/' ? styles.active : undefined}
            >
              Work
            </a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="mailto:alex@alextsatsos.com">Contact</a>
          </li>
          <li>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeBtn}
            >
              Resume ↗
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
