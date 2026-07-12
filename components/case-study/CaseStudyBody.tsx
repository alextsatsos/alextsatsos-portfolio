import type { ImageType, NotionBlock, Section } from '@/types/notion'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { parseSections, blockPlainText } from '@/lib/parseBlocks'
import { renderRichText } from '@/lib/renderRichText'
import CalloutBox from './CalloutBox'
import ReflectionBlock from './ReflectionBlock'
import CaseStudyPullQuote from './CaseStudyPullQuote'
import PrototypeEmbed from './PrototypeEmbed'
import OptionCompare from './OptionCompare'
import WhiteboardPhoto from './WhiteboardPhoto'
import FramedImage from './FramedImage'
import BrowserFrame from './BrowserFrame'
import { CaseStudyImage, ScreenPairGrid } from './CaseStudyImage'
import styles from './CaseStudyBody.module.css'

interface Props {
  blocks: NotionBlock[]
  caseStudyTitle: string
  prototypeFallbackUrl?: string | null
  keyPhrase?: string | null
  imageType?: ImageType
}

const VISUAL_BLOCK_TYPES = new Set(['image', 'embed', 'quote'])
const FORCED_FEATURE_KEYS = new Set(['reflection', 'pull quote'])

// Matches "Prototype", "Interactive Prototype", etc. — the section may have
// no embed block yet (e.g. link not added), so it can't rely on
// VISUAL_BLOCK_TYPES alone to be classified as a full-width feature section.
function isPrototypeSection(section: Section): boolean {
  return section.key.toLowerCase().includes('prototype')
}

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
  // Image blocks store caption text under `image.caption`, not `image.rich_text`
  // (unlike text blocks), so blockPlainText() can't be reused here.
  const data = (block as Record<string, unknown>)['image'] as
    | { caption?: RichTextItemResponse[] }
    | undefined
  return (data?.caption ?? []).map((r) => r.plain_text).join('')
}

function splitCalloutLabel(
  rich: RichTextItemResponse[]
): { label: RichTextItemResponse[]; body: RichTextItemResponse[] } {
  const first = rich[0]
  const hasLabel = first && (first.annotations as { bold?: boolean }).bold && first.plain_text.includes(':')
  if (!hasLabel) return { label: [], body: rich }
  const idx = first.plain_text.indexOf(':')
  return {
    label: [{ ...first, plain_text: first.plain_text.slice(0, idx) }],
    body: [{ ...first, plain_text: first.plain_text.slice(idx + 1).trim() }, ...rich.slice(1)],
  }
}

function embedUrl(block: NotionBlock): string | null {
  const data = (block as Record<string, unknown>)['embed'] as { url?: string } | undefined
  return data?.url ?? null
}

// Two consecutive callouts render as a side-by-side card pair (OptionCompare),
// which needs full-width room — unlike a single inline callout, which reads
// fine in the narrower two-column zone.
function hasCalloutPair(section: Section): boolean {
  return section.blocks.some(
    (b, i) => b.type === 'callout' && section.blocks[i + 1]?.type === 'callout'
  )
}

function isFeatureSection(section: Section): boolean {
  if (FORCED_FEATURE_KEYS.has(section.key.toLowerCase())) return true
  if (isPrototypeSection(section)) return true
  if (hasCalloutPair(section)) return true
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
      const firstCaption = imageCaption(block)

      if (firstCaption.startsWith('sketch:')) {
        const src = imageUrl(block)
        const caption = firstCaption.slice('sketch:'.length).trim()
        if (src) nodes.push(<WhiteboardPhoto key={block.id} src={src} alt={caption || 'Whiteboard sketch'} caption={caption} />)
        i++
        continue
      }

      if (firstCaption.startsWith('frame:')) {
        const src = imageUrl(block)
        const caption = firstCaption.slice('frame:'.length).trim()
        if (src) nodes.push(<FramedImage key={block.id} src={src} alt={caption || 'Case study screens'} caption={caption} />)
        i++
        continue
      }

      if (firstCaption.startsWith('chrome:')) {
        const src = imageUrl(block)
        const caption = firstCaption.slice('chrome:'.length).trim()
        if (src) nodes.push(<BrowserFrame key={block.id} src={src} alt={caption || 'Case study screen'} caption={caption} />)
        i++
        continue
      }

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
      // Two callouts back-to-back render side by side. If both labels start
      // with "Option" it's an ideation comparison — the second is chosen.
      // Otherwise (e.g. two parallel definitions) neither gets a badge.
      if (i + 1 < blocks.length && blocks[i + 1].type === 'callout') {
        const pair = [block, blocks[i + 1]]
        const isOptionPair = pair.every((b) => {
          const { label } = splitCalloutLabel(blockRichText(b))
          return /^option\b/i.test(label.map((r) => r.plain_text).join(''))
        })
        nodes.push(
          <OptionCompare
            key={`compare-${nodes.length}`}
            options={pair.map((b, idx) => {
              const { label, body } = splitCalloutLabel(blockRichText(b))
              return { label: renderRichText(label), body: renderRichText(body), chosen: isOptionPair && idx === 1 }
            })}
          />
        )
        i += 2
        continue
      }

      const { label, body } = splitCalloutLabel(blockRichText(block))
      nodes.push(
        <CalloutBox key={block.id} label={label.length > 0 ? label.map((r) => r.plain_text).join('') : undefined}>
          {renderRichText(body)}
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

  const withoutNote = lastIsNote ? paragraphs.slice(0, -1) : paragraphs
  const note = lastIsNote ? renderRichText(lastRich) : undefined

  const first = withoutNote[0]
  const firstRich = first ? blockRichText(first) : []
  const firstIsHeadline = firstRich.length > 0 && firstRich.every((r) => (r.annotations as { bold?: boolean }).bold)

  const headline = firstIsHeadline ? renderRichText(firstRich) : undefined
  const bodyParagraphs = firstIsHeadline ? withoutNote.slice(1) : withoutNote

  return (
    <ReflectionBlock
      headline={headline}
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

function renderPrototype(section: Section, fallbackUrl?: string | null, caseStudyTitle?: string) {
  const embedBlock = section.blocks.find((b) => b.type === 'embed')
  const introBlocks = section.blocks.filter((b) => b.type !== 'embed')
  return (
    <>
      {renderBlocks(introBlocks)}
      <PrototypeEmbed
        embedUrl={embedBlock ? embedUrl(embedBlock) : null}
        fallbackUrl={fallbackUrl}
        title={caseStudyTitle ? `Interactive prototype of the ${caseStudyTitle} flow` : undefined}
      />
    </>
  )
}

export default function CaseStudyBody({
  blocks,
  caseStudyTitle,
  prototypeFallbackUrl,
  keyPhrase,
  imageType,
}: Props) {
  const sections = parseSections(blocks).filter((s) => s.key)

  const narrativeSections = sections.filter((s) => !isFeatureSection(s))
  const featureSections = sections.filter(isFeatureSection)

  return (
    <>
      {narrativeSections.length > 0 && (
        <div className={styles.narrativeZone}>
          {narrativeSections.map((section) => (
            <section key={section.key} id={slugify(section.key)} className={styles.section}>
              <h2 className={styles.heading}>{section.key}</h2>
              {renderBlocks(section.blocks, imageType)}
            </section>
          ))}
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
                    : isPrototypeSection(section)
                      ? renderPrototype(section, prototypeFallbackUrl, caseStudyTitle)
                      : renderBlocks(section.blocks, imageType)}
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
