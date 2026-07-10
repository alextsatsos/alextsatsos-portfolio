import type { ReactNode } from 'react'
import styles from './ReflectionBlock.module.css'

interface Props {
  label?: string
  body: ReactNode
  note?: ReactNode
}

export default function ReflectionBlock({ label = 'Reflection', body, note }: Props) {
  return (
    <div className={styles.reflection}>
      <p className={styles.label}>{label}</p>
      <div className={styles.body}>{body}</div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  )
}
