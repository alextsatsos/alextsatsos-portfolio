import { getHomePage, getCaseStudies } from '@/lib/notion'
import { parseSections } from '@/lib/parseBlocks'
import PageDivider from '@/components/PageDivider'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import NotebookTab from '@/components/home/NotebookTab'
import CaseStudyCards from '@/components/home/CaseStudyCards'
import styles from './page.module.css'

export default async function Home() {
  const [blocks, caseStudies] = await Promise.all([getHomePage(), getCaseStudies()])
  const sections = parseSections(blocks)

  function getSection(key: string) {
    return sections.find((s) => s.key === key) ?? { key, blocks: [], index: -1 }
  }

  const heroSection = getSection('Hero')
  const pillsSection = getSection('Pills')
  const aboutSection = getSection('About')
  const pullQuoteSection = getSection('Pull Quote')
  const skillsSection = getSection('Skills')
  const contactSection = getSection('Contact')
  const funFactsSection = getSection('Fun Facts')
  const currentlySection = getSection('Currently')
  const availabilitySection = getSection('Availability')

  return (
    <main>
      <HeroSection
        heroSection={heroSection}
        pillsSection={pillsSection}
      />

      <PageDivider />

      <section className={styles.work} id="work">
        <div className="container">
          <NotebookTab label="// case studies" />
          <CaseStudyCards studies={caseStudies} />
        </div>
      </section>

      <PageDivider />

      <AboutSection
        aboutSection={aboutSection}
        pullQuoteSection={pullQuoteSection}
        skillsSection={skillsSection}
        contactSection={contactSection}
        funFactsSection={funFactsSection}
        currentlySection={currentlySection}
        availabilitySection={availabilitySection}
      />
    </main>
  )
}
