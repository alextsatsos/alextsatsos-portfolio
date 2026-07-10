import Link from 'next/link'
import type { Section } from '@/types/notion'
import { parseTable, parseBullets } from '@/lib/parseBlocks'
import SkillCheck from '@/components/SkillCheck'
import HeadshotFrame from './HeadshotFrame'
import styles from './HeroSection.module.css'

interface Props {
  heroSection: Section
  pillsSection: Section
}

function tableToMap(rows: string[][]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const row of rows) {
    if (row.length >= 2) map[row[0].trim()] = row[1].trim()
  }
  return map
}

export default function HeroSection({ heroSection, pillsSection }: Props) {
  const rows = parseTable(heroSection.blocks)
  const hero = tableToMap(rows)

  const skills = parseBullets(pillsSection.blocks)

  const eyebrow = hero['Eyebrow annotation'] ?? ''
  const headline = hero['Headline'] ?? ''
  const highlightWord = hero['Highlight word'] ?? ''
  const tagline = hero['Tagline'] ?? ''
  const ctaPrimaryLabel = hero['CTA primary label'] ?? 'See My Work'
  const ctaPrimaryHref = hero['CTA primary href'] ?? '#work'
  const ctaSecondaryLabel = hero['CTA secondary label'] ?? 'About Me'
  const ctaSecondaryHref = hero['CTA secondary href'] ?? '#about'

  const headlineParts = highlightWord
    ? headline.split(new RegExp(`(${highlightWord})`, 'i'))
    : [headline]

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          {eyebrow && (
            <p className={styles.eyebrow}>{eyebrow.startsWith('→') ? eyebrow : `→ ${eyebrow}`}</p>
          )}
          <h1 className={styles.name}>
            Hi! I&apos;m Alex<span className={styles.dot}>.</span>
          </h1>
          <p className={styles.headline}>
            {headlineParts.map((part, i) =>
              part.toLowerCase() === highlightWord.toLowerCase() ? (
                <span key={i} className={styles.highlight}>{part}</span>
              ) : (
                part
              )
            )}
          </p>
          <p className={styles.tagline}>{tagline}</p>
          <div className={styles.ctas}>
            <Link href={ctaPrimaryHref} className={styles.ctaPrimary}>
              {ctaPrimaryLabel}
            </Link>
            <Link href={ctaSecondaryHref} className={styles.ctaGhost}>
              {ctaSecondaryLabel}
            </Link>
          </div>
          {skills.length > 0 && (
            <div className={styles.skills}>
              {skills.map((label, i) => (
                <SkillCheck key={i} label={label} />
              ))}
            </div>
          )}
        </div>
        <HeadshotFrame />
      </div>
    </section>
  )
}
