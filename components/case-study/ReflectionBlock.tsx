import type { ReactNode } from 'react'
import styles from './ReflectionBlock.module.css'

interface Props {
  label?: string
  headline?: ReactNode
  body: ReactNode
  // Trailing "what I'd do next" list, rendered with lime arrow markers instead
  // of standard bullets — unique to the Admin Area case study's reflection.
  bullets?: ReactNode[]
  note?: ReactNode
}

export default function ReflectionBlock({ label = 'Reflection', headline, body, bullets, note }: Props) {
  return (
    <div className={styles.reflection}>
      <p className={styles.label}>{label}</p>
      {headline && <p className={styles.headline}>{headline}</p>}
      <div className={styles.body}>{body}</div>
      {bullets && bullets.length > 0 && (
        <ul className={styles.arrowList}>
          {bullets.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {note && <p className={styles.note}>{note}</p>}
    </div>
  )
}
