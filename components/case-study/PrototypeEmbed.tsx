import styles from './PrototypeEmbed.module.css'

interface Props {
  embedUrl: string | null
  fallbackUrl?: string | null
  label?: string
  title?: string
  // When set (e.g. "960 / 569" for Google Slides), the iframe sizes to this
  // aspect ratio instead of the Figma-tuned fixed height, so 16:9-ish decks
  // aren't letterboxed or cropped.
  aspectRatio?: string
}

export default function PrototypeEmbed({ embedUrl, fallbackUrl, label = 'Prototype', title, aspectRatio }: Props) {
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
        <iframe
          src={embedUrl}
          title={title || label}
          className={styles.iframe}
          style={aspectRatio ? { height: 'auto', aspectRatio } : undefined}
          allowFullScreen
        />
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
