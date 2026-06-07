import React from 'react'
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

type RichTextAnnotations = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

function renderRichText(richText: RichTextItemResponse[]): React.ReactNode {
  return richText.map((segment, i) => {
    const text = segment.plain_text
    const ann = segment.annotations as RichTextAnnotations
    let node: React.ReactNode = text
    if (ann.code) node = <code key={i}>{text}</code>
    if (ann.bold && ann.italic) node = <strong key={i}><em>{text}</em></strong>
    else if (ann.bold) node = <strong key={i}>{text}</strong>
    else if (ann.italic) node = <em key={i}>{text}</em>
    else node = <span key={i}>{text}</span>
    return node
  })
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
            {paragraphBlocks.map((rt, i) => (
              <p key={i} className={styles.paragraph}>{renderRichText(rt)}</p>
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
