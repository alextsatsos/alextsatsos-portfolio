import type { ImageType, NotionBlock, Section } from '@/types/notion'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { parseSections, blockPlainText } from '@/lib/parseBlocks'
import { renderRichText } from '@/lib/renderRichText'
import CaseStudySidebar from './CaseStudySidebar'
import CalloutBox from './CalloutBox'
import ReflectionBlock from './ReflectionBlock'
import CaseStudyPullQuote from './CaseStudyPullQuote'
import PrototypeEmbed from './PrototypeEmbed'
import { CaseStudyImage, ScreenPairGrid } from './CaseStudyImage'
import type { TocItem } from './TableOfContents'
import styles from './CaseStudyBody.module.css'

interface Props {
  blocks: NotionBlock[]
  skills: string[]
  prototypeFallbackUrl?: string | null
  keyPhrase?: string | null
  imageType?: ImageType
}

const VISUAL_BLOCK_TYPES = new Set(['image', 'embed', 'quote'])
const FORCED_FEATURE_KEYS = new Set(['reflection', 'pull quote', 'prototype'])

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function blockRichText(block: NotionBlock): RichTextItemResponse[] {
  const data = (block as Record<string, unknown>)[block.type] as
    | { rich_text?: RichTextItemResponse[] }
    | undefined
  return data?.rich_text ?? []
}

function imageUrl(block: NotionBlock): string | null {
  const data = (block as Record<string, unknown>)['image'] as
    | { type: 'file' | 'external'; file?: { url: string }; external?: { url: string } }
    | undefined
  if (!data) return null
  return data.type === 'external' ? data.external?.url ?? null : data.file?.url ?? null
}

function imageCaption(block: NotionBlock): string {
  return blockPlainText(block)
}

function embedUrl(block: NotionBlock): string | null {
  const data = (block as Record<string, unknown>)['embed'] as { url?: string } | undefined
  return data?.url ?? null
}

function isFeatureSection(section: Section): boolean {
  if (FORCED_FEATURE_KEYS.has(section.key.toLowerCase())) return true
  return section.blocks.some((b) => VISUAL_BLOCK_TYPES.has(b.type))
}

function renderBlocks(blocks: NotionBlock[], imageType?: ImageType): React.ReactNode {
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const items: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === block.type) {
        items.push(blocks[i])
        i++
      }
      const Tag = block.type === 'bulleted_list_item' ? 'ul' : 'ol'
      nodes.push(
        <Tag key={`list-${nodes.length}`} className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>{renderRichText(blockRichText(item))}</li>
          ))}
        </Tag>
      )
      continue
    }

    if (block.type === 'image') {
      const images: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === 'image') {
        images.push(blocks[i])
        i++
      }
      if (images.length >= 2) {
        nodes.push(
          <ScreenPairGrid
            key={`pair-${nodes.length}`}
            imageType={imageType}
            images={images
              .map((img) => ({ src: imageUrl(img), alt: imageCaption(img) || 'Case study screen' }))
              .filter((img): img is { src: string; alt: string } => Boolean(img.src))}
          />
        )
      } else {
        const src = imageUrl(images[0])
        if (src) {
          const caption = imageCaption(images[0])
          nodes.push(
            <CaseStudyImage
              key={images[0].id}
              src={src}
              alt={caption || 'Case study image'}
              caption={caption}
              imageType={imageType}
            />
          )
        }
      }
      continue
    }

    if (block.type === 'callout') {
      const rich = blockRichText(block)
      const first = rich[0]
      const hasLabel = first && (first.annotations as { bold?: boolean }).bold && first.plain_text.includes(':')
      const labelText = hasLabel ? first.plain_text.split(':')[0].trim() : undefined
      const bodyRich = hasLabel
        ? [{ ...first, plain_text: first.plain_text.slice(first.plain_text.indexOf(':') + 1).trim() }, ...rich.slice(1)]
        : rich
      nodes.push(
        <CalloutBox key={block.id} label={labelText}>
          {renderRichText(bodyRich as RichTextItemResponse[])}
        </CalloutBox>
      )
      i++
      continue
    }

    if (block.type === 'heading_3') {
      nodes.push(
        <h3 key={block.id} className={styles.subheading}>
          {renderRichText(blockRichText(block))}
        </h3>
      )
      i++
      continue
    }

    if (block.type === 'quote') {
      nodes.push(
        <blockquote key={block.id} className={styles.quote}>
          {renderRichText(blockRichText(block))}
        </blockquote>
      )
      i++
      continue
    }

    if (block.type === 'embed') {
      const url = embedUrl(block)
      nodes.push(<PrototypeEmbed key={block.id} embedUrl={url} />)
      i++
      continue
    }

    if (block.type === 'paragraph') {
      const rich = blockRichText(block)
      if (rich.length > 0) {
        nodes.push(
          <p key={block.id} className={styles.paragraph}>
            {renderRichText(rich)}
          </p>
        )
      }
      i++
      continue
    }

    i++
  }

  return nodes
}

function renderReflection(section: Section) {
  const paragraphs = section.blocks.filter((b) => b.type === 'paragraph')
  const last = paragraphs[paragraphs.length - 1]
  const lastRich = last ? blockRichText(last) : []
  const lastIsNote = lastRich.length > 0 && lastRich.every((r) => (r.annotations as { italic?: boolean }).italic)

  const bodyParagraphs = lastIsNote ? paragraphs.slice(0, -1) : paragraphs
  const note = lastIsNote ? renderRichText(lastRich) : undefined

  return (
    <ReflectionBlock
      body={bodyParagraphs.map((p) => (
        <p key={p.id}>{renderRichText(blockRichText(p))}</p>
      ))}
      note={note}
    />
  )
}

function renderPullQuote(section: Section, keyPhrase?: string | null) {
  const quoteBlock = section.blocks.find((b) => b.type === 'quote')
  if (!quoteBlock) return null
  return <CaseStudyPullQuote text={blockPlainText(quoteBlock)} keyPhrase={keyPhrase} />
}

function renderPrototype(section: Section, fallbackUrl?: string | null) {
  const embedBlock = section.blocks.find((b) => b.type === 'embed')
  return <PrototypeEmbed embedUrl={embedBlock ? embedUrl(embedBlock) : null} fallbackUrl={fallbackUrl} />
}

export default function CaseStudyBody({ blocks, skills, prototypeFallbackUrl, keyPhrase, imageType }: Props) {
  const sections = parseSections(blocks).filter((s) => s.key)

  const tocItems: TocItem[] = sections.map((s) => ({ id: slugify(s.key), label: s.key }))
  const narrativeSections = sections.filter((s) => !isFeatureSection(s))
  const featureSections = sections.filter(isFeatureSection)

  return (
    <>
      {narrativeSections.length > 0 && (
        <div className={styles.twoColZone}>
          <div className={styles.main}>
            {narrativeSections.map((section) => (
              <section key={section.key} id={slugify(section.key)} className={styles.section}>
                <h2 className={styles.heading}>{section.key}</h2>
                {renderBlocks(section.blocks, imageType)}
              </section>
            ))}
          </div>
          <CaseStudySidebar tocItems={tocItems} skills={skills} />
        </div>
      )}

      {featureSections.length > 0 && (
        <div className={styles.fullWidthZone}>
          {featureSections.map((section) => {
            const key = section.key.toLowerCase()
            return (
              <section key={section.key} id={slugify(section.key)} className={styles.section}>
                {key !== 'reflection' && key !== 'pull quote' && (
                  <h2 className={styles.heading}>{section.key}</h2>
                )}
                {key === 'reflection'
                  ? renderReflection(section)
                  : key === 'pull quote'
                    ? renderPullQuote(section, keyPhrase)
                    : key === 'prototype'
                      ? renderPrototype(section, prototypeFallbackUrl)
                      : renderBlocks(section.blocks, imageType)}
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
