import Image from 'next/image'
import styles from './BrowserFrame.module.css'

interface Props {
  src: string
  alt: string
  caption?: string
}

export default function BrowserFrame({ src, alt, caption }: Props) {
  return (
    <figure>
      <div className={styles.frame}>
        <span className={styles.bar} aria-hidden="true">
          <span className={styles.dots}>
            <span className={`${styles.dot} ${styles.red}`} />
            <span className={`${styles.dot} ${styles.yellow}`} />
            <span className={`${styles.dot} ${styles.green}`} />
          </span>
        </span>
        <div className={styles.photoWrap}>
          <Image src={src} alt={alt} fill sizes="1016px" className={styles.photo} />
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
