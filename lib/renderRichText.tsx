import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

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
    if (ann.bold && ann.italic) node = <strong key={i}><em>{text}</em></strong>
    else if (ann.bold) node = <strong key={i}>{text}</strong>
    else if (ann.italic) node = <em key={i}>{text}</em>
    else node = <span key={i}>{text}</span>
    return node
  })
}
