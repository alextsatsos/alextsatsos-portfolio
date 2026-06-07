import Image from 'next/image'
import type { NotionBlock } from '@/types/notion'
import styles from './HeadshotFrame.module.css'

interface Props {
  blocks: NotionBlock[]
}

function getImageUrl(block: NotionBlock): string | null {
  const b = block as Record<string, unknown>
  const img = b['image'] as
    | { type: 'file'; file: { url: string } }
    | { type: 'external'; external: { url: string } }
    | undefined
  if (!img) return null
  if (img.type === 'file') return img.file.url
  if (img.type === 'external') return img.external.url
  return null
}

export default function HeadshotFrame({ blocks }: Props) {
  const imageBlock = blocks.find((b) => b.type === 'image')
  const paragraphs = blocks.filter((b) => b.type === 'paragraph')

  const badgeText = (() => {
    const p = paragraphs[1] as Record<string, unknown> | undefined
    if (!p) return ''
    const data = p['paragraph'] as { rich_text: Array<{ plain_text: string }> } | undefined
    return data?.rich_text.map((r) => r.plain_text).join('') ?? ''
  })()

  const imageUrl = imageBlock ? getImageUrl(imageBlock) : null

  return (
    <div className={styles.wrapper}>
      <span className={styles.handNote}>↓ that&apos;s me!</span>
      <div className={styles.frame}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Alex Tsatsos headshot"
            width={200}
            height={200}
            className={styles.photo}
            unoptimized
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>your photo here</span>
          </div>
        )}
        {badgeText && (
          <div className={styles.badge}>
            <span>{badgeText}</span>
          </div>
        )}
      </div>
    </div>
  )
}
