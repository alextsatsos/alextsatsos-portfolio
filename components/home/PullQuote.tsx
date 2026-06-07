import type { NotionBlock } from '@/types/notion'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import styles from './PullQuote.module.css'

interface Props {
  blocks: NotionBlock[]
}

export default function PullQuote({ blocks }: Props) {
  const quoteBlock = blocks.find((b) => b.type === 'quote')
  if (!quoteBlock) return null

  const qb = quoteBlock as Record<string, unknown>
  const quoteData = qb['quote'] as { rich_text: RichTextItemResponse[] } | undefined
  const lines = (quoteData?.rich_text ?? []).map((r) => r.plain_text).join('').split('\n')

  const attribution = lines.find((l) => l.startsWith('—')) ?? ''
  const quoteText = lines.filter((l) => !l.startsWith('—')).join(' ')

  return (
    <blockquote className={styles.quote}>
      <p className={styles.text}>{quoteText}</p>
      {attribution && <cite className={styles.attribution}>{attribution}</cite>}
    </blockquote>
  )
}
