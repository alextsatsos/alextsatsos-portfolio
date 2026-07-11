import Link from 'next/link'
import styles from './PrevNextNav.module.css'

interface Neighbor {
  slug: string
  title: string
}

interface Props {
  prev: Neighbor | null
  next: Neighbor | null
}

export default function PrevNextNav({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <nav className={styles.nav} aria-label="Case study navigation">
      {prev && (
        <Link href={`/case-studies/${prev.slug}`} className={styles.link}>
          <span className={styles.direction}>← Previous</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link href={`/case-studies/${next.slug}`} className={`${styles.link} ${styles.next}`}>
          <span className={styles.direction}>Next →</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
