import type { Section } from '@/types/notion'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { parseTable, parseBullets, parseSkillGroups } from '@/lib/parseBlocks'
import { renderRichText } from '@/lib/renderRichText'
import SkillCheck from '@/components/SkillCheck'
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

export default function AboutSection({
  aboutSection,
  pullQuoteSection,
  skillsSection,
  contactSection,
  funFactsSection,
  currentlySection,
  availabilitySection,
}: Props) {
  const paragraphBlocks = aboutSection.blocks
    .filter((b) => b.type === 'paragraph')
    .map((b) => {
      const data = (b as Record<string, unknown>)['paragraph'] as
        | { rich_text: RichTextItemResponse[] }
        | undefined
      return data?.rich_text ?? []
    })
    .filter((rt) => {
      const plain = rt.map((r) => r.plain_text).join('')
      // Skip template instruction paragraphs left in the Notion page
      return plain.trim().length > 0 && !plain.includes('Supports bold and italic')
    })

  const skillGroups = parseSkillGroups(skillsSection.blocks)

  const contactRows = parseTable(contactSection.blocks)

  // Turn the email and LinkedIn contact values into real clickable links.
  // Everything else (e.g. Location) stays plain text.
  function contactHref(label: string, value: string): string | null {
    const key = label.trim().toLowerCase()
    if (key === 'email') return `mailto:${value.trim()}`
    if (key === 'linkedin') return 'https://www.linkedin.com/in/alextsatsos'
    return null
  }

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
          <NotebookTab label="// about me" />
          <div className={styles.prose}>
            {paragraphBlocks.map((rt, i) => (
              <p key={i} className={styles.paragraph}>{renderRichText(rt)}</p>
            ))}
          </div>
          <PullQuote blocks={pullQuoteSection.blocks} />
          {skillGroups.length > 0 && (
            <div className={styles.skillGroups}>
              {skillGroups.map((group, i) => (
                <div key={i} className={styles.skillGroup}>
                  <h3 className={styles.skillSubhead}>{group.heading}</h3>
                  <div className={styles.skillList}>
                    {group.items.map((label, j) => (
                      <SkillCheck key={j} label={label} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          {isAvailable && (
            <div className={styles.card}>
              <div className={styles.tape} />
              <div className={styles.availBadge}>
                <span className={styles.pulse} />
                {badgeText}
              </div>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.tape} />
            <h3 className={styles.cardTitle}>Contact</h3>
            <ul className={styles.cardList}>
              {contactRows.map(([label, value], i) => {
                const href = contactHref(label, value)
                const isExternal = href?.startsWith('http')
                return (
                  <li key={i}>
                    <span className={styles.cardLabel}>{label}</span>
                    {href ? (
                      <a
                        className={`${styles.cardValue} ${styles.cardLink}`}
                        href={href}
                        {...(isExternal
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className={styles.cardValue}>{value}</span>
                    )}
                  </li>
                )
              })}
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
