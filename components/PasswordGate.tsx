'use client'

import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react'
import styles from './PasswordGate.module.css'

const STORAGE_KEY = 'portfolio_unlocked'
const UNLOCK_EVENT = 'portfolio_unlocked_change'

function subscribe(callback: () => void) {
  window.addEventListener(UNLOCK_EVENT, callback)
  return () => window.removeEventListener(UNLOCK_EVENT, callback)
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY) === 'true'
}

function getServerSnapshot() {
  return false
}

function unlock() {
  sessionStorage.setItem(STORAGE_KEY, 'true')
  window.dispatchEvent(new Event(UNLOCK_EVENT))
}

interface PasswordGateProps {
  protected: boolean
  children: ReactNode
}

export default function PasswordGate({ protected: isProtected, children }: PasswordGateProps) {
  const unlocked = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (!isProtected || unlocked) return <>{children}</>

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password === process.env.NEXT_PUBLIC_PORTFOLIO_PASSWORD) {
      unlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className={styles.gate}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
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

        <h2 className={styles.heading}>This case study is password protected.</h2>

        <p className={styles.subtext}>
          Enter the password to view. Don&apos;t have it? Reach out and I&apos;ll share it
          with you.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={error ? `${styles.input} ${styles.inputError}` : styles.input}
            placeholder="Enter password"
            autoFocus
          />

          {error && (
            <p className={styles.error}>Incorrect password — try again or get in touch.</p>
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
    </div>
  )
}
