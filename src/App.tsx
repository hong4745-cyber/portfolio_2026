import InversionCircleScrollAnimation from '@/components/ui/inversion-circle-scroll-animation'
import AboutSection from '@/components/about-section'
import EducationCareerSection from '@/components/education-career-section'
import { Skiper31 } from '@/components/ui/text-scroll-animation'
import WorkSection from '@/components/work-section'
import ProjectsShowcaseSection from '@/components/projects-showcase-section'
import FooterSection from '@/components/footer-section'

export default function App() {
  return (
    <InversionCircleScrollAnimation>
      <AboutSection />
      <EducationCareerSection />
      <Skiper31 />
      <WorkSection />
      <ProjectsShowcaseSection />
      <FooterSection />
    </InversionCircleScrollAnimation>
  )
}
