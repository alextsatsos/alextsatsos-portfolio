import type { ReactNode } from 'react'
import styles from './NumberedCards.module.css'

interface CardSpec {
  id: string
  number: number
  title: ReactNode
  body: ReactNode
}

export default function NumberedCards({ cards }: { cards: CardSpec[] }) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.id} className={styles.card}>
          <span className={styles.number} aria-hidden="true">
            {card.number}
          </span>
          <h4 className={styles.title}>{card.title}</h4>
          <p className={styles.body}>{card.body}</p>
        </div>
      ))}
    </div>
  )
}
