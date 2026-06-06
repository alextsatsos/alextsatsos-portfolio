import type { NotionBlock, Section } from '@/types/notion'
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

function blockPlainText(block: NotionBlock): string {
  const b = block as Record<string, unknown>
  const typeData = b[block.type] as { rich_text?: RichTextItemResponse[] } | undefined
  return (typeData?.rich_text ?? []).map((r) => r.plain_text).join('')
}

export function parseSections(blocks: NotionBlock[]): Section[] {
  const sections: Section[] = []
  let current: Section | null = null

  for (const block of blocks) {
    if (block.type === 'heading_2') {
      if (current) sections.push(current)
      current = {
        key: blockPlainText(block),
        blocks: [],
        index: sections.length,
      }
    } else if (current) {
      current.blocks.push(block)
    }
  }

  if (current) sections.push(current)
  return sections
}

export function parseTable(blocks: NotionBlock[]): string[][] {
  const tableBlock = blocks.find((b) => b.type === 'table')
  if (!tableBlock) return []

  // Table rows are children of the table block — caller must pass children blocks
  return blocks
    .filter((b) => b.type === 'table_row')
    .map((b) => {
      const row = b as Record<string, unknown>
      const rowData = row['table_row'] as { cells: RichTextItemResponse[][] } | undefined
      return (rowData?.cells ?? []).map((cell) => cell.map((r) => r.plain_text).join(''))
    })
}

export function parseBullets(blocks: NotionBlock[]): string[] {
  return blocks
    .filter((b) => b.type === 'bulleted_list_item')
    .map(blockPlainText)
}

export function parseNumberedList(blocks: NotionBlock[]): string[] {
  return blocks
    .filter((b) => b.type === 'numbered_list_item')
    .map(blockPlainText)
}
