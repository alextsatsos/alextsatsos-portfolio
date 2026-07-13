import styles from './DeviceScreens.module.css'

export interface Screen {
  src: string
  alt: string
  caption?: string
}

interface Props {
  screens: Screen[]
  variant: 'desktop' | 'mobile'
}

// Final UI screens render at their natural aspect ratio — these are tall
// full-page desktop captures and phone-width mobile screens, so the fixed
// 16/10 mockup box (CaseStudyImage/ScreenPairGrid) would distort them. Desktop
// screens sit in a wide two-up; mobile screens display at phone width so they
// aren't stretched. Cloudinary f_auto,q_auto in the URL keeps payload down, so
// a plain <img> at natural aspect is fine here (Next Image needs fixed dims).
export default function DeviceScreens({ screens, variant }: Props) {
  return (
    <div className={`${styles.grid} ${variant === 'mobile' ? styles.mobile : styles.desktop}`}>
      {screens.map((screen) => (
        <figure key={screen.src} className={styles.item}>
          {/* eslint-disable-next-line @next/next/no-img-element -- natural aspect, unknown dims */}
          <img
            src={screen.src}
            alt={screen.alt}
            loading="lazy"
            decoding="async"
            className={styles.img}
          />
          {screen.caption && <figcaption className={styles.caption}>{screen.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}
