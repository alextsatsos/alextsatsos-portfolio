'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === '/';

  // On the homepage, smooth-scroll to the section instead of doing a fragment
  // navigation (which the browser won't always re-trigger for same-page clicks).
  // The href stays "/#id" so it still works from other pages and on
  // right-click / open-in-new-tab.
  function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    if (!onHome) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `/#${id}`);
  }

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
              href="/#work"
              className={onHome ? styles.active : undefined}
              onClick={(e) => scrollToSection(e, 'work')}
            >
              Work
            </a>
          </li>
          <li>
            <a href="/#about" onClick={(e) => scrollToSection(e, 'about')}>
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
