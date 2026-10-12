import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import LimeMark from './LimeMark'
import styles from './CaseStudyPullQuote.module.css'

interface Props {
  text?: string
  keyPhrase?: string | null
  attribution?: string | null
  // Authored rich text for a quote block encountered inline in body copy
  // (not a dedicated "Pull Quote" section). Bold runs render as a pink stat
  // emphasis, the underline marker still maps to the lime highlight fill —
  // takes precedence over text/keyPhrase when provided.
  richText?: RichTextItemResponse[]
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

function renderRich(richText: RichTextItemResponse[]) {
  return richText.map((segment, i) => {
    const ann = segment.annotations as { bold?: boolean; underline?: boolean }
    if (ann.underline) return <LimeMark key={i}>{segment.plain_text}</LimeMark>
    if (ann.bold) return <span key={i} className={styles.stat}>{segment.plain_text}</span>
    return <span key={i}>{segment.plain_text}</span>
  })
}

export default function CaseStudyPullQuote({ text, keyPhrase, attribution, richText }: Props) {
  return (
    <figure className={styles.quote}>
      <span className={styles.tape} aria-hidden="true" />
      <blockquote className={styles.text}>
        <span className={styles.mark}>&ldquo;</span>
        {richText ? renderRich(richText) : withHighlight(text ?? '', keyPhrase)}
        <span className={styles.mark}>&rdquo;</span>
      </blockquote>
      {attribution && <figcaption className={styles.attribution}>{attribution}</figcaption>}
    </figure>
  )
}
