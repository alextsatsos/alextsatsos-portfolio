import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export type NotionBlock = BlockObjectResponse

export interface CaseStudy {
  pageId: string
  title: string
  slug: string
  published: boolean
  order: number
  category: string
  tagline: string
  role: string
  timeline: string
  platform: string
  heroOutcome: string
  skills: string[]
  coverColor: string
  passwordProtected: boolean
  externalLink: string | null
}

export interface Section {
  key: string
  blocks: NotionBlock[]
  index: number
}
