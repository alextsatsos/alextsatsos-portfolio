import { Client } from '@notionhq/client'
import type { PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function main() {
  console.log('Fetching case studies from Notion...')

  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DB_ID!,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Order', direction: 'ascending' }],
  })

  const pages = response.results.filter(
    (p): p is PageObjectResponse => p.object === 'page' && 'properties' in p
  )

  console.log(`Found ${pages.length} published case studies:`)
  for (const page of pages) {
    const title = page.properties['Title']
    const slug = page.properties['Slug']
    console.log({
      id: page.id,
      title: title?.type === 'title' ? (title.title as RichTextItemResponse[]).map(r => r.plain_text).join('') : '(no title)',
      slug: slug?.type === 'rich_text' ? (slug.rich_text as RichTextItemResponse[]).map(r => r.plain_text).join('') : '(no slug)',
    })
  }
}

main().catch(console.error)
