import Image from 'next/image'
import { cloudinaryUrl } from '@/lib/cloudinary'
import styles from './HeadshotFrame.module.css'

export default function HeadshotFrame() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.handNote}>↓ that&apos;s me!</span>
      <div className={styles.frame}>
        <div className={styles.card}>
          <Image
            src={cloudinaryUrl('portfolio/headshots/alex-tsatsos--headshot-hero.jpg')}
            alt="Alex Tsatsos — Senior UX & Product Designer"
            fill
            sizes="260px"
            className={styles.photo}
            style={{ objectPosition: '50% 28%' }}
          />
        </div>
      </div>
    </div>
  )
}
