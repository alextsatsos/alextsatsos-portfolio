import styles from './PrototypeEmbed.module.css'

interface Props {
  embedUrl: string | null
  fallbackUrl?: string | null
  label?: string
}

export default function PrototypeEmbed({ embedUrl, fallbackUrl, label = 'Prototype' }: Props) {
  return (
    <div className={styles.frame}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </span>
        <span className={styles.label}>{label}</span>
      </div>

      {embedUrl ? (
        <iframe src={embedUrl} className={styles.iframe} allowFullScreen />
      ) : (
        fallbackUrl && (
          <div className={styles.fallback}>
            <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className={styles.fallbackButton}>
              View Prototype ↗
            </a>
          </div>
        )
      )}
    </div>
  )
}
