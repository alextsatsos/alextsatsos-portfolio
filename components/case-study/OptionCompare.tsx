import type { ReactNode } from 'react'
import styles from './OptionCompare.module.css'

export interface CompareOption {
  label: ReactNode
  body: ReactNode
  chosen: boolean
}

interface Props {
  options: CompareOption[]
}

export default function OptionCompare({ options }: Props) {
  return (
    <div className={styles.grid}>
      {options.map((option, i) => (
        <div key={i} className={option.chosen ? `${styles.card} ${styles.chosen}` : styles.card}>
          {option.chosen && <span className={styles.badge}>✦ Chosen</span>}
          <p className={styles.label}>{option.label}</p>
          <p className={styles.body}>{option.body}</p>
        </div>
      ))}
    </div>
  )
}
