import type { ReactNode } from 'react'
import styles from './CalloutBox.module.css'

interface Props {
  label?: string
  children: ReactNode
}

export default function CalloutBox({ label, children }: Props) {
  return (
    <div className={styles.callout}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.body}>{children}</div>
    </div>
  )
}
