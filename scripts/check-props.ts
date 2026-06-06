import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function main() {
  const r = await notion.dataSources.query({ data_source_id: process.env.NOTION_DB_ID! })
  const page = r.results.find((p): p is PageObjectResponse => p.object === 'page' && 'properties' in p)
  if (page) console.log(Object.keys(page.properties))
}

main().catch(console.error)
