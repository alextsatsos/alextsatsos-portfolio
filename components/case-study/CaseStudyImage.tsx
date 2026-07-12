import Image from 'next/image'
import type { ImageType } from '@/types/notion'
import styles from './CaseStudyImage.module.css'

interface ImageSpec {
  src: string
  alt: string
  caption?: string
  imageType?: ImageType
  width?: number
  height?: number
  docked?: boolean
}

export function CaseStudyImage({ src, alt, caption, imageType, width, height, docked }: ImageSpec) {
  if (imageType === 'gif') {
    return (
      <figure className={docked ? styles.dockedFigure : undefined}>
        {/* Next Image doesn't animate GIFs, so render this one directly.
            width/height attrs reserve aspect-ratio space before it loads. */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={docked ? `${styles.gif} ${styles.docked}` : styles.gif}
        />
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    )
  }

  if (imageType === 'mockup') {
    return (
      <figure className={styles.mockup}>
        <Image src={src} alt={alt} fill sizes="760px" />
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    )
  }

  return (
    <figure>
      <div className={styles.annotated}>
        <Image src={src} alt={alt} fill sizes="760px" />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}

export function ScreenPairGrid({ images, imageType }: { images: Omit<ImageSpec, 'imageType'>[]; imageType?: ImageType }) {
  if (imageType === 'gif') {
    return (
      <div className={styles.screenPairGrid}>
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element -- Next Image doesn't animate GIFs
          <img key={img.src} src={img.src} alt={img.alt} className={styles.gif} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.screenPairGrid}>
      {images.map((img) => (
        <div key={img.src} className={imageType === 'mockup' ? styles.mockup : styles.annotated}>
          <Image src={img.src} alt={img.alt} fill sizes="380px" />
        </div>
      ))}
    </div>
  )
}
