import Image from 'next/image'
import styles from './FramedImage.module.css'

interface Props {
  src: string
  alt: string
  caption?: string
}

export default function FramedImage({ src, alt, caption }: Props) {
  return (
    <figure className={styles.card}>
      <Image src={src} alt={alt} width={1800} height={836} className={styles.photo} />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
