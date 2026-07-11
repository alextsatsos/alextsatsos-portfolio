import Image from 'next/image'
import styles from './WhiteboardPhoto.module.css'

interface Props {
  src: string
  alt: string
  caption?: string
}

export default function WhiteboardPhoto({ src, alt, caption }: Props) {
  return (
    <figure className={styles.wrap}>
      <span className={styles.tape} aria-hidden="true" />
      <Image src={src} alt={alt} width={1200} height={794} className={styles.photo} />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
