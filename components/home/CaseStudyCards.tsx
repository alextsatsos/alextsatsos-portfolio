import Link from 'next/link'
import type { CaseStudy } from '@/types/notion'
import { highlightPhrase } from '@/lib/highlightPhrase'
import styles from './CaseStudyCards.module.css'

// Card label under the number. The retail studies carry an anonymized
// "Enterprise Retail" in Company (NDA); the nCino studies are shown by
// category ("Fintech") to keep the label consistent — a card-only display
// swap, so the case study page hero still shows the real "nCino".
function clientLabel(company: string): string {
  return company === 'nCino' ? 'Fintech' : company
}

function LockIcon() {
  return (
    <svg
      className={styles.lockIcon}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="var(--pink)" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="var(--pink)" strokeWidth="2" />
    </svg>
  )
}

export default function CaseStudyCards({ studies }: { studies: CaseStudy[] }) {
  return (
    <ul className={styles.grid}>
      {studies.map((study) => {
        // Always link to the internal case study page, never the Notion
        // ExternalLink — some studies (e.g. Split Tender) point that at a raw
        // Figma prototype, which would bypass the page's password gate.
        const href = `/case-studies/${study.slug}`
        const number = String(study.order).padStart(2, '0')

        return (
          <li key={study.pageId} className={styles.item}>
            <Link href={href} className={styles.card} aria-label={`${study.title} case study`}>
              <div className={styles.left}>
                <span className={styles.number}>{number}</span>
                <span className={styles.title}>{study.title}</span>
                {study.company && (
                  <span className={styles.client}>{clientLabel(study.company)}</span>
                )}
              </div>

              <p className={styles.quote}>
                {highlightPhrase(study.cardSummary, study.keyPhrase, styles.summaryMark)}
              </p>

              <div className={styles.right}>
                <div className={styles.tags}>
                  {study.cardTag && <span className={styles.tag}>{study.cardTag}</span>}
                  {study.passwordProtected && (
                    <span className={styles.lockTag}>
                      <LockIcon />
                      Password protected
                    </span>
                  )}
                </div>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
