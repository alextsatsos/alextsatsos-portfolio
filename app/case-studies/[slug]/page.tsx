import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/notion'
import PasswordGate from '@/components/PasswordGate'
import CaseStudyHero from '@/components/case-study/CaseStudyHero'
import CaseStudyBody from '@/components/case-study/CaseStudyBody'
import PrevNextNav from '@/components/case-study/PrevNextNav'
import styles from './page.module.css'

export async function generateMetadata(props: PageProps<'/case-studies/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  try {
    const { meta } = await getCaseStudyBySlug(slug)
    return { title: meta.title, description: meta.tagline }
  } catch {
    return {}
  }
}

export default async function CaseStudyPage(props: PageProps<'/case-studies/[slug]'>) {
  const { slug } = await props.params

  const result = await getCaseStudyBySlug(slug).catch(() => null)
  if (!result) notFound()
  const { meta, blocks } = result

  const allCaseStudies = await getCaseStudies()
  const index = allCaseStudies.findIndex((c) => c.slug === slug)
  const prev = index > 0 ? allCaseStudies[index - 1] : null
  const next = index >= 0 && index < allCaseStudies.length - 1 ? allCaseStudies[index + 1] : null

  return (
    <main>
      <div className={`container ${styles.wrap}`}>
        <PasswordGate protected={meta.passwordProtected}>
          <CaseStudyHero meta={meta} />
          <CaseStudyBody
            blocks={blocks}
            caseStudyTitle={meta.title}
            prototypeFallbackUrl={meta.externalLink}
            keyPhrase={meta.keyPhrase}
            imageType={meta.imageType}
          />
          <PrevNextNav
            prev={prev ? { slug: prev.slug, title: prev.title } : null}
            next={next ? { slug: next.slug, title: next.title } : null}
          />
        </PasswordGate>
      </div>
    </main>
  )
}
