import type { CaseStudy } from '@/types/notion'
import { TextWithKeyPhrase } from './LimeUnderline'
import SkillCheck from '@/components/SkillCheck'
import styles from './CaseStudyHero.module.css'

interface Props {
  meta: CaseStudy
}

function splitLastWord(title: string): [string, string] {
  const i = title.lastIndexOf(' ')
  if (i === -1) return ['', title]
  return [title.slice(0, i + 1), title.slice(i + 1)]
}

export default function CaseStudyHero({ meta }: Props) {
  const [lead, lastWord] = splitLastWord(meta.title)

  const infoColumns = [
    { label: 'Role', value: meta.role },
    meta.company
      ? { label: 'Company', value: meta.company }
      : { label: 'Timeline', value: meta.timeline },
    { label: 'Platform', value: meta.platform },
    { label: 'Outcome', value: meta.heroOutcome },
  ].filter((col) => col.value)

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        {(meta.eyebrow || meta.category) && (
          <p className={styles.eyebrow}>{meta.eyebrow || meta.category}</p>
        )}
        <h1 className={styles.title}>
          {lead}
          <span className={styles.pink}>{lastWord}</span>
        </h1>
        {meta.tagline && (
          <p className={styles.subtitle}>
            <TextWithKeyPhrase text={meta.tagline} keyPhrase={meta.keyPhrase} />
          </p>
        )}
      </div>

      <div className={styles.seam} />

      {(infoColumns.length > 0 || meta.skills.length > 0) && (
        <div className={styles.infoBar}>
          {infoColumns.length > 0 && (
            <div className={styles.infoRow}>
              {infoColumns.map((col) => (
                <div key={col.label} className={styles.infoColumn}>
                  <p className={styles.infoLabel}>{col.label}</p>
                  <p className={styles.infoValue}>{col.value}</p>
                </div>
              ))}
            </div>
          )}

          {meta.skills.length > 0 && (
            <div className={styles.skillsRow}>
              <p className={styles.infoLabel}>Skills applied</p>
              <div className={styles.skillList}>
                {meta.skills.map((label) => (
                  <SkillCheck key={label} label={label} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
