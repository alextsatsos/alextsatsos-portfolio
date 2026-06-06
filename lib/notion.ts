import { Client } from '@notionhq/client'
import { unstable_cache } from 'next/cache'
import type { CaseStudy, NotionBlock } from '@/types/notion'
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

function richTextToPlain(rich: RichTextItemResponse[]): string {
  return rich.map((r) => r.plain_text).join('')
}

function pageToCase(page: PageObjectResponse): CaseStudy {
  const p = page.properties

  const multiSelect = (key: string): string[] => {
    const prop = p[key]
    if (prop?.type === 'multi_select') return prop.multi_select.map((s) => s.name)
    return []
  }

  const text = (key: string): string => {
    const prop = p[key]
    if (prop?.type === 'rich_text') return richTextToPlain(prop.rich_text)
    if (prop?.type === 'title') return richTextToPlain(prop.title)
    return ''
  }

  const select = (key: string): string => {
    const prop = p[key]
    if (prop?.type === 'select') return prop.select?.name ?? ''
    return ''
  }

  const checkbox = (key: string): boolean => {
    const prop = p[key]
    if (prop?.type === 'checkbox') return prop.checkbox
    return false
  }

  const number = (key: string): number => {
    const prop = p[key]
    if (prop?.type === 'number') return prop.number ?? 0
    return 0
  }

  const url = (key: string): string | null => {
    const prop = p[key]
    if (prop?.type === 'url') return prop.url
    return null
  }

  return {
    pageId: page.id,
    title: text('Title'),
    slug: text('Slug'),
    published: checkbox('Published'),
    order: number('Order'),
    category: select('Category'),
    tagline: text('Tagline'),
    role: text('Role'),
    timeline: text('Timeline'),
    platform: text('Platform'),
    heroOutcome: text('HeroOutcome'),
    skills: multiSelect('Skills'),
    coverColor: text('CoverColor'),
    passwordProtected: checkbox('PasswordProtected'),
    externalLink: url('ExternalLink'),
  }
}

async function _getCaseStudies(): Promise<CaseStudy[]> {
  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DB_ID!,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Order', direction: 'ascending' }],
  })

  return response.results
    .filter((p): p is PageObjectResponse => p.object === 'page' && 'properties' in p)
    .map(pageToCase)
}

async function _getCaseStudyBySlug(slug: string): Promise<{ meta: CaseStudy; blocks: NotionBlock[] }> {
  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DB_ID!,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  })

  const page = response.results.find(
    (p): p is PageObjectResponse => p.object === 'page' && 'properties' in p
  )
  if (!page) throw new Error(`No case study found for slug: ${slug}`)

  const meta = pageToCase(page)
  const blocks = await _getAllBlocks(page.id)

  return { meta, blocks }
}

async function _getAllBlocks(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of response.results) {
      if ('type' in block) {
        blocks.push(block as NotionBlock)
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

async function _getHomePage(): Promise<NotionBlock[]> {
  return _getAllBlocks(process.env.NOTION_HOME_PAGE_ID!)
}

export const getCaseStudies = unstable_cache(
  _getCaseStudies,
  ['case-studies'],
  { revalidate: 3600, tags: ['case-studies'] }
)

export const getCaseStudyBySlug = unstable_cache(
  _getCaseStudyBySlug,
  ['case-study-by-slug'],
  { revalidate: 3600, tags: ['case-studies'] }
)

export const getHomePage = unstable_cache(
  _getHomePage,
  ['home-page'],
  { revalidate: 3600, tags: ['home-page'] }
)
