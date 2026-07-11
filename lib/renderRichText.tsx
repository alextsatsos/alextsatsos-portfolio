import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import LimeMark from '@/components/case-study/LimeMark'

type RichTextAnnotations = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export function renderRichText(richText: RichTextItemResponse[]): React.ReactNode {
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
    // lime highlight treatment, rather than a literal <u> style. Uses a
    // wrap-safe CSS mark (not the SVG LimeUnderline) since body prose can
    // break the marked phrase across multiple lines.
    if (ann.underline) {
      node = <LimeMark key={i}>{node}</LimeMark>
    }
    return node
  })
}
