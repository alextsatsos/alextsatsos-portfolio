import Image from 'next/image'
import styles from './BrowserFrame.module.css'

interface Props {
  src: string
  alt: string
  caption?: string
  animated?: boolean
  width?: number
  height?: number
}

export default function BrowserFrame({ src, alt, caption, animated, width, height }: Props) {
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
        {animated ? (
          // GIFs don't animate through Next Image, so render raw. width/height
          // attrs reserve aspect-ratio space to avoid layout shift on load.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} width={width} height={height} className={styles.animatedPhoto} />
        ) : (
          <div className={styles.photoWrap}>
            <Image src={src} alt={alt} fill sizes="1016px" className={styles.photo} />
          </div>
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
