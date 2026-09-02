import InversionCircleScrollAnimation from '@/components/ui/inversion-circle-scroll-animation'
import AboutSection from '@/components/about-section'
import EducationCareerSection from '@/components/education-career-section'
import { Skiper31 } from '@/components/ui/text-scroll-animation'
import WorkSection from '@/components/work-section'
import ProjectsShowcaseSection from '@/components/projects-showcase-section'
import FooterSection from '@/components/footer-section'
import Cursor from '@/components/ui/inverted-cursor'
import FlowArt, { FlowSection } from '@/components/ui/story-scroll'

export default function App() {
  return (
    <InversionCircleScrollAnimation>
      <Cursor size={60} />
      <FlowArt aria-label="Portfolio story">
        <FlowSection aria-label="Design approach" style={{ backgroundColor: '#ffd42a', color: '#000' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">01 — Design approach</p>
          <hr className="my-[2vw] border-0 border-t border-black/40" />
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold uppercase leading-[0.85] tracking-tight">Think<br />Make<br />Move</h2>
          <p className="mt-auto max-w-[46ch] text-[clamp(1rem,2.2vw,1.6rem)] leading-relaxed">I turn visual ideas into clear, engaging digital experiences that feel as good as they look.</p>
        </FlowSection>
        <FlowSection aria-label="Working process" style={{ backgroundColor: '#000', color: '#fff' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">02 — Working process</p>
          <hr className="my-[2vw] border-0 border-t border-white/40" />
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold uppercase leading-[0.85] tracking-tight">Shape<br />The<br />Flow</h2>
          <p className="mt-auto max-w-[46ch] text-[clamp(1rem,2.2vw,1.6rem)] leading-relaxed">From concept to prototype and code, I connect each decision into one focused, usable result.</p>
        </FlowSection>
        <FlowSection aria-label="Technology and craft" style={{ backgroundColor: '#fff', color: '#000' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">03 — Technology &amp; craft</p>
          <hr className="my-[2vw] border-0 border-t border-black/40" />
          <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-bold uppercase leading-[0.85] tracking-tight">Build<br />With<br />Intent</h2>
          <p className="mt-auto max-w-[46ch] text-[clamp(1rem,2.2vw,1.6rem)] leading-relaxed">I combine React, motion, and AI tools to build responsive interactions with thoughtful detail.</p>
        </FlowSection>
      </FlowArt>
      <AboutSection />
      <EducationCareerSection />
      <Skiper31 />
      <WorkSection />
      <ProjectsShowcaseSection />
      <FooterSection />
    </InversionCircleScrollAnimation>
  )
}
