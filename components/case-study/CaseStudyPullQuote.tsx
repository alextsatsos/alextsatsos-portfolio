import LimeMark from './LimeMark'
import styles from './CaseStudyPullQuote.module.css'

interface Props {
  text: string
  keyPhrase?: string | null
  attribution?: string | null
}

// The card sits on a light (cream) background, so the emphasized phrase gets
// the lime highlight FILL treatment (LimeMark), not the navy-background SVG
// underline — per the locked lime rule.
function withHighlight(text: string, phrase?: string | null) {
  const index = phrase ? text.indexOf(phrase) : -1
  if (!phrase || index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <LimeMark>{phrase}</LimeMark>
      {text.slice(index + phrase.length)}
    </>
  )
}

export default function CaseStudyPullQuote({ text, keyPhrase, attribution }: Props) {
  return (
    <figure className={styles.quote}>
      <span className={styles.tape} aria-hidden="true" />
      <blockquote className={styles.text}>
        <span className={styles.mark}>&ldquo;</span>
        {withHighlight(text, keyPhrase)}
        <span className={styles.mark}>&rdquo;</span>
      </blockquote>
      {attribution && <figcaption className={styles.attribution}>{attribution}</figcaption>}
    </figure>
  )
}
