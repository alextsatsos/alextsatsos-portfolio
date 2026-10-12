import Image from 'next/image'
import styles from './PersonaLineup.module.css'

interface Persona {
  src: string
  name: string
  meta?: string
  badge?: string
}

interface Props {
  lead: Persona
  others: Persona[]
}

export default function PersonaLineup({ lead, others }: Props) {
  return (
    <div className={styles.lineup}>
      <figure className={styles.lead}>
        <div className={styles.leadPhoto}>
          <Image src={lead.src} alt={lead.name} fill sizes="340px" />
        </div>
        <figcaption className={styles.leadCaption}>
          <span className={styles.leadName}>{lead.name}</span>
          {lead.meta && <span className={styles.leadMeta}>{lead.meta}</span>}
          {lead.badge && <span className={styles.badge}>{lead.badge}</span>}
        </figcaption>
      </figure>

      <div className={styles.others}>
        {others.map((p) => (
          <figure key={p.name} className={styles.other}>
            <div className={styles.otherPhoto}>
              <Image src={p.src} alt={p.name} fill sizes="160px" />
            </div>
            <figcaption className={styles.otherName}>{p.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
