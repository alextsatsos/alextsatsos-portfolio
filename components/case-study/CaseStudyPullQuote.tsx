import { TextWithKeyPhrase } from './LimeUnderline'
import styles from './CaseStudyPullQuote.module.css'

interface Props {
  text: string
  keyPhrase?: string | null
}

export default function CaseStudyPullQuote({ text, keyPhrase }: Props) {
  return (
    <blockquote className={styles.quote}>
      <p className={styles.text}>
        <span className={styles.mark}>&ldquo;</span>
        <TextWithKeyPhrase text={text} keyPhrase={keyPhrase} />
        <span className={styles.mark}>&rdquo;</span>
      </p>
    </blockquote>
  )
}
