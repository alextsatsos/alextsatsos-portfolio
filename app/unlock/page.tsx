import type { Metadata } from 'next'
import { sanitizeNext } from '@/lib/access'
import styles from './unlock.module.css'

export const metadata: Metadata = {
  title: 'Unlock case study',
  description: 'Enter the password to view this protected case study.',
  robots: { index: false, follow: false },
}

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams
  const next = sanitizeNext(params.next)
  const hasError = params.error === '1'

  return (
    <main className={styles.gate}>
      <div className={styles.card}>
        <div className={styles.iconCircle} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect
              x="5"
              y="11"
              width="14"
              height="10"
              rx="2"
              fill="none"
              stroke="var(--navy)"
              strokeWidth="1.8"
            />
            <path
              d="M8 11V7a4 4 0 018 0v4"
              fill="none"
              stroke="var(--navy)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className={styles.heading}>This case study is password protected.</h1>

        <p className={styles.subtext}>
          Enter the password to view. Don&apos;t have it? Reach out and I&apos;ll share it
          with you.
        </p>

        <form className={styles.form} method="post" action="/api/unlock">
          <input type="hidden" name="next" value={next} />

          <label htmlFor="case-study-password" className={styles.srOnly}>
            Password
          </label>
          <input
            id="case-study-password"
            name="password"
            type="password"
            className={hasError ? `${styles.input} ${styles.inputError}` : styles.input}
            placeholder="Enter password"
            autoComplete="off"
            autoFocus
            required
          />

          {hasError && (
            <p className={styles.error} role="alert">
              Incorrect password — try again or get in touch.
            </p>
          )}

          <button type="submit" className={styles.submit}>
            View Case Study
          </button>
        </form>

        <p className={styles.contact}>
          Need access?{' '}
          <a href="mailto:alex@alextsatsos.com" className={styles.contactLink}>
            alex@alextsatsos.com
          </a>
        </p>
      </div>
    </main>
  )
}
