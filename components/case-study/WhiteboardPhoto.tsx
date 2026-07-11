import Image from 'next/image'
import styles from './WhiteboardPhoto.module.css'

interface Props {
  src: string
  alt: string
  caption?: string
}

export default function WhiteboardPhoto({ src, alt, caption }: Props) {
  return (
    <figure className={styles.card}>
      <span className={styles.tape} aria-hidden="true" />
      <div className={styles.inner}>
        <Image src={src} alt={alt} width={1200} height={794} className={styles.photo} />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
