import SkillCheck from '@/components/SkillCheck'
import TableOfContents, { type TocItem } from './TableOfContents'
import styles from './CaseStudySidebar.module.css'

interface Props {
  tocItems: TocItem[]
  skills: string[]
}

export default function CaseStudySidebar({ tocItems, skills }: Props) {
  if (tocItems.length === 0 && skills.length === 0) return null

  return (
    <aside className={styles.sidebar}>
      {tocItems.length > 0 && (
        <div className={styles.card}>
          <div className={styles.tape} />
          <p className={styles.cardTitle}>On this page</p>
          <TableOfContents items={tocItems} />
        </div>
      )}

      {skills.length > 0 && (
        <div className={styles.card}>
          <div className={styles.tape} />
          <p className={styles.cardTitle}>Skills</p>
          <div className={styles.skillList}>
            {skills.map((label) => (
              <SkillCheck key={label} label={label} />
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
