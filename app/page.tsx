import { getHomePage } from '@/lib/notion'
import { parseSections } from '@/lib/parseBlocks'
import PageDivider from '@/components/PageDivider'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import NotebookTab from '@/components/home/NotebookTab'
import styles from './page.module.css'

export default async function Home() {
  const blocks = await getHomePage()
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

      <section className={styles.workPlaceholder} id="work">
        <div className="container">
          <NotebookTab label="// case studies" variant="pink" />
          <p className={styles.placeholder}>Case studies load here</p>
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
