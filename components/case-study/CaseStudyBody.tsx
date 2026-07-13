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
import DeviceScreens from './DeviceScreens'
import PrototypePair from './PrototypePair'
import { CaseStudyImage, ScreenPairGrid } from './CaseStudyImage'
import styles from './CaseStudyBody.module.css'

interface Props {
  blocks: NotionBlock[]
  caseStudyTitle: string
  prototypeFallbackUrl?: string | null
  imageType?: ImageType
}

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

function embedCaption(block: NotionBlock): string {
  const data = (block as Record<string, unknown>)['embed'] as
    | { caption?: RichTextItemResponse[] }
    | undefined
  return (data?.caption ?? []).map((r) => r.plain_text).join('')
}

function isSlidesUrl(url: string | null): boolean {
  return Boolean(url && url.includes('docs.google.com/presentation'))
}

function renderBlocks(blocks: NotionBlock[], imageType?: ImageType, caseStudyTitle?: string): React.ReactNode {
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

      // "desktop:"/"mobile:" prefixed images group into a natural-aspect device
      // grid (final UI screens). Consecutive same-prefix images collect into one
      // grid, so a desktop pair and a mobile pair render as separate rows.
      if (firstCaption.startsWith('desktop:') || firstCaption.startsWith('mobile:')) {
        const variant = firstCaption.startsWith('mobile:') ? 'mobile' : 'desktop'
        const prefix = `${variant}:`
        const screens: { src: string; alt: string; caption?: string }[] = []
        while (
          i < blocks.length &&
          blocks[i].type === 'image' &&
          imageCaption(blocks[i]).startsWith(prefix)
        ) {
          const src = imageUrl(blocks[i])
          const caption = imageCaption(blocks[i]).slice(prefix.length).trim()
          if (src) screens.push({ src, alt: caption || `${variant} screen`, caption })
          i++
        }
        if (screens.length > 0) {
          nodes.push(<DeviceScreens key={`screens-${nodes.length}`} variant={variant} screens={screens} />)
        }
        continue
      }

      if (firstCaption.startsWith('sketch:')) {
        const src = imageUrl(block)
        const caption = firstCaption.slice('sketch:'.length).trim()
        if (src) nodes.push(<WhiteboardPhoto key={block.id} src={src} alt={caption || 'Whiteboard sketch'} caption={caption} />)
        i++
        continue
      }

      // "shot:" — a single image at its natural aspect, centered and width-capped
      // (for portrait/comparison graphics that neither the 16/10 box nor the wide
      // frame treatment fit).
      if (firstCaption.startsWith('shot:')) {
        const src = imageUrl(block)
        const caption = firstCaption.slice('shot:'.length).trim()
        if (src)
          nodes.push(
            <figure key={block.id} className={styles.shot}>
              {/* eslint-disable-next-line @next/next/no-img-element -- natural aspect, unknown dims */}
              <img src={src} alt={caption || 'Case study screen'} loading="lazy" decoding="async" className={styles.shotImg} />
              {caption && <figcaption className={styles.shotCaption}>{caption}</figcaption>}
            </figure>
          )
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

      if (firstCaption.startsWith('gif:')) {
        // Animated GIF inside browser chrome (same frame as chrome:), rendered
        // as a raw <img> since Next Image can't animate GIFs.
        const src = imageUrl(block)
        const caption = firstCaption.slice('gif:'.length).trim()
        if (src) nodes.push(
          <BrowserFrame
            key={block.id}
            src={src}
            alt={caption || 'Case study screen'}
            caption={caption}
            width={2828}
            height={2135}
            animated
          />
        )
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
      // Consecutive embeds render side by side (e.g. a mobile and a desktop
      // prototype direction). Each embed's Notion caption drives its frame label
      // and accessible title; falls back to device position if uncaptioned.
      const embeds: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === 'embed') {
        embeds.push(blocks[i])
        i++
      }

      if (embeds.length >= 2) {
        nodes.push(
          <PrototypePair
            key={`proto-pair-${nodes.length}`}
            embeds={embeds.map((b, idx) => {
              const caption = embedCaption(b)
              const label = caption || (idx === 0 ? 'Mobile prototype' : 'Desktop prototype')
              return {
                url: embedUrl(b),
                label,
                title: caseStudyTitle ? `${label} for ${caseStudyTitle}` : label,
              }
            })}
          />
        )
        continue
      }

      const block0 = embeds[0]
      const url = embedUrl(block0)
      // Google Slides decks (e.g. a research readout) reuse the same browser
      // chrome as the Figma prototype embed, but need their own ~16:9 aspect
      // ratio, a research-appropriate label, and a data-driven accessible title.
      const slides = isSlidesUrl(url)
      nodes.push(
        <PrototypeEmbed
          key={block0.id}
          embedUrl={url}
          label={slides ? 'Research readout' : 'Prototype'}
          title={slides && caseStudyTitle ? `Research findings slide deck for ${caseStudyTitle}` : undefined}
          aspectRatio={slides ? '960 / 569' : undefined}
        />
      )
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
  // The reflection block sits on a navy background, so lime emphasis inside it
  // must use the SVG underline device (not the light-background highlight fill).
  const dark = { limeVariant: 'underline' as const }
  const paragraphs = section.blocks.filter((b) => b.type === 'paragraph')
  const last = paragraphs[paragraphs.length - 1]
  const lastRich = last ? blockRichText(last) : []
  const lastIsNote = lastRich.length > 0 && lastRich.every((r) => (r.annotations as { italic?: boolean }).italic)

  const withoutNote = lastIsNote ? paragraphs.slice(0, -1) : paragraphs
  const note = lastIsNote ? renderRichText(lastRich, dark) : undefined

  const first = withoutNote[0]
  const firstRich = first ? blockRichText(first) : []
  const firstIsHeadline = firstRich.length > 0 && firstRich.every((r) => (r.annotations as { bold?: boolean }).bold)

  const headline = firstIsHeadline ? renderRichText(firstRich, dark) : undefined
  const bodyParagraphs = firstIsHeadline ? withoutNote.slice(1) : withoutNote

  // A trailing bulleted list (e.g. "what I'd do next") renders with lime arrow
  // markers via ReflectionBlock rather than the standard prose bullet list.
  const bullets = section.blocks
    .filter((b) => b.type === 'bulleted_list_item')
    .map((b) => renderRichText(blockRichText(b), dark))

  return (
    <ReflectionBlock
      headline={headline}
      body={bodyParagraphs.map((p) => (
        <p key={p.id}>{renderRichText(blockRichText(p), dark)}</p>
      ))}
      bullets={bullets.length > 0 ? bullets : undefined}
      note={note}
    />
  )
}

function renderPullQuote(section: Section) {
  const quoteBlock = section.blocks.find((b) => b.type === 'quote')
  if (!quoteBlock) return null
  // The phrase to lime-highlight is authored inline via the same underline
  // annotation used elsewhere for lime emphasis, rather than reusing the
  // hero's unrelated page-level KeyPhrase.
  const emphasis = blockRichText(quoteBlock).find(
    (r) => (r.annotations as { underline?: boolean }).underline
  )
  // Attribution is authored as an all-italic paragraph in the same section.
  const attrBlock = section.blocks.find(
    (b) =>
      b.type === 'paragraph' &&
      blockRichText(b).length > 0 &&
      blockRichText(b).every((r) => (r.annotations as { italic?: boolean }).italic)
  )
  return (
    <CaseStudyPullQuote
      text={blockPlainText(quoteBlock)}
      keyPhrase={emphasis?.plain_text}
      attribution={attrBlock ? blockPlainText(attrBlock) : undefined}
    />
  )
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
  imageType,
}: Props) {
  const sections = parseSections(blocks).filter((s) => s.key)

  // Every section renders full-width in document order (locked layout rule since
  // the two-column zone was removed). Reflection and pull quote drop the H2 and
  // use their own renderers; a prototype section gets the embed treatment.
  return (
    <div className={styles.zone}>
      {sections.map((section) => {
        const key = section.key.toLowerCase()
        const showHeading = key !== 'reflection' && key !== 'pull quote'
        return (
          <section key={section.key} id={slugify(section.key)} className={styles.section}>
            {showHeading && <h2 className={styles.heading}>{section.key}</h2>}
            {key === 'reflection'
              ? renderReflection(section)
              : key === 'pull quote'
                ? renderPullQuote(section)
                : isPrototypeSection(section)
                  ? renderPrototype(section, prototypeFallbackUrl, caseStudyTitle)
                  : renderBlocks(section.blocks, imageType, caseStudyTitle)}
          </section>
        )
      })}
    </div>
  )
}
