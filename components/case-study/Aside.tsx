import type { ReactNode } from 'react'
import styles from './Aside.module.css'

interface Props {
  label?: string
  children: ReactNode
}

export default function Aside({ label, children }: Props) {
  return (
    <aside className={styles.aside}>
      {label && <p className={styles.label}>{label}</p>}
      <p className={styles.body}>{children}</p>
    </aside>
  )
}
