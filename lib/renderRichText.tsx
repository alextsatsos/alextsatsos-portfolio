import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import LimeMark from '@/components/case-study/LimeMark'
import LimeUnderline from '@/components/case-study/LimeUnderline'

type RichTextAnnotations = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

interface RenderOptions {
  // Which lime-emphasis treatment the `underline` authoring marker maps to.
  // 'mark' (default) = highlight fill, for light backgrounds. 'underline' =
  // the SVG stroke device, for navy backgrounds (e.g. the reflection block) —
  // per the locked rule: fill on light, underline on navy.
  limeVariant?: 'mark' | 'underline'
}

export function renderRichText(
  richText: RichTextItemResponse[],
  options: RenderOptions = {}
): React.ReactNode {
  const { limeVariant = 'mark' } = options
  return richText.map((segment, i) => {
    const text = segment.plain_text
    const ann = segment.annotations as RichTextAnnotations
    let node: React.ReactNode = text
    if (ann.code) node = <code key={i}>{text}</code>
    else if (ann.bold && ann.italic) node = <strong key={i}><em>{text}</em></strong>
    else if (ann.bold) node = <strong key={i}>{text}</strong>
    else if (ann.italic) node = <em key={i}>{text}</em>
    else node = <span key={i}>{text}</span>
    // Underline is repurposed as a content-authoring marker for the brand's
    // lime emphasis. On light backgrounds it renders as a wrap-safe CSS
    // highlight fill (LimeMark); on navy it renders as the SVG underline
    // stroke (LimeUnderline), which keeps the text its inherited light color.
    if (ann.underline) {
      node =
        limeVariant === 'underline' ? (
          <LimeUnderline key={i} width={Math.min(text.length * 6.2, 420)}>
            {node}
          </LimeUnderline>
        ) : (
          <LimeMark key={i}>{node}</LimeMark>
        )
    }
    return node
  })
}
