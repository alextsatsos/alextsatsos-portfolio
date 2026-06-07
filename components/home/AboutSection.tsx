import type { Section } from '@/types/notion'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { parseTable, parseBullets } from '@/lib/parseBlocks'
import PullQuote from './PullQuote'
import NotebookTab from './NotebookTab'
import styles from './AboutSection.module.css'

interface Props {
  aboutSection: Section
  pullQuoteSection: Section
  skillsSection: Section
  contactSection: Section
  funFactsSection: Section
  currentlySection: Section
  availabilitySection: Section
}

function tableToMap(rows: string[][]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const row of rows) {
    if (row.length >= 2) map[row[0].trim()] = row[1].trim()
  }
  return map
}

const CHIP_COLORS: Record<string, string> = {
  groove: styles.chipGroove,
  lullaby: styles.chipLullaby,
  cyan: styles.chipCyan,
  lime: styles.chipLime,
}

export default function AboutSection({
  aboutSection,
  pullQuoteSection,
  skillsSection,
  contactSection,
  funFactsSection,
  currentlySection,
  availabilitySection,
}: Props) {
  const paragraphs = aboutSection.blocks
    .filter((b) => b.type === 'paragraph')
    .map((b) => {
      const data = (b as Record<string, unknown>)['paragraph'] as
        | { rich_text: RichTextItemResponse[] }
        | undefined
      return data?.rich_text.map((r) => r.plain_text).join('') ?? ''
    })
    .filter(Boolean)

  const skills = parseBullets(skillsSection.blocks).map((raw) => {
    const [color, ...rest] = raw.split('—')
    return { color: color.trim(), label: rest.join('—').trim() }
  })

  const contactRows = parseTable(contactSection.blocks)
  const contact = tableToMap(contactRows)

  const funFacts = parseBullets(funFactsSection.blocks)
  const currently = parseBullets(currentlySection.blocks)

  const availabilityRows = parseTable(availabilitySection.blocks)
  const availability = tableToMap(availabilityRows)
  const isAvailable = availability['Available']?.toLowerCase() === 'yes'
  const badgeText = availability['Badge text'] ?? 'Open to work'

  return (
    <section className={styles.section} id="about">
      <div className={`container ${styles.inner}`}>
        <div className={styles.main}>
          <NotebookTab label="// about me" variant="pink" />
          <div className={styles.prose}>
            {paragraphs.map((text, i) => (
              <p key={i} className={styles.paragraph}>{text}</p>
            ))}
          </div>
          <PullQuote blocks={pullQuoteSection.blocks} />
          {skills.length > 0 && (
            <div className={styles.chips}>
              {skills.map(({ color, label }, i) => (
                <span
                  key={i}
                  className={`${styles.chip} ${CHIP_COLORS[color] ?? styles.chipLime}`}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          {isAvailable && (
            <div className={styles.availBadge}>
              <span className={styles.pulse} />
              {badgeText}
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.tape} />
            <h3 className={styles.cardTitle}>Contact</h3>
            <ul className={styles.cardList}>
              {contactRows.map(([label, value], i) => (
                <li key={i}>
                  <span className={styles.cardLabel}>{label}</span>
                  <span className={styles.cardValue}>{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.tape} />
            <h3 className={styles.cardTitle}>Fun facts</h3>
            <ul className={styles.cardList}>
              {funFacts.map((fact, i) => (
                <li key={i} className={styles.cardValue}>{fact}</li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.tape} />
            <h3 className={styles.cardTitle}>Currently</h3>
            <ul className={styles.cardList}>
              {currently.map((item, i) => (
                <li key={i} className={styles.cardValue}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
