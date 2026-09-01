import { Camera, Mail } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import personImage from '@/assets/back_2-kcRSgiVN.png'

const socials = [
  { label: '이메일', href: 'mailto:', icon: Mail },
  { label: 'GitHub', href: '#', icon: FaGithub },
  { label: 'Instagram', href: '#', icon: Camera },
]

function Intro({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="about-hero__intro">
      <p className="about-hero__eyebrow">DESIGN · UI/UX · FRONTEND</p>
      <h2 id={duplicate ? undefined : 'about-name'} className="about-hero__name">BAEK JIEUN</h2>
      <p className="about-hero__location">Daejeon, Korea</p>
      <div className="about-hero__socials">
        {socials.map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} aria-label={duplicate ? undefined : label} tabIndex={duplicate ? -1 : undefined}>
            <Icon aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="about-hero__description">Visual design에서 출발해 UI/UX와<br />프론트엔드로 작업 영역을 넓혀가고<br />있습니다.</p>
    </div>
  )
}

function Journey() {
  return <h1 className="about-hero__journey" aria-label="Journey"><span>JOUR</span><span>NEY</span></h1>
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(1920)

  useEffect(() => {
    const section = sectionRef.current
    const scrollRoot = section?.closest<HTMLDivElement>('.icsa-wrap')
    if (!section || !scrollRoot) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const sectionRect = section.getBoundingClientRect()
        const rootRect = scrollRoot.getBoundingClientRect()
        const distance = Math.max(1, sectionRect.height - rootRect.height)
        setProgress(Math.min(1, Math.max(0, (rootRect.top - sectionRect.top) / distance)))
        setViewportWidth(scrollRoot.clientWidth)
      })
    }

    update()
    scrollRoot.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      scrollRoot.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scale = 1 + progress * 4
  const maskRadius = Math.min(viewportWidth * 0.1875, 360) * scale

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-name" className="about-hero">
      <div className="about-hero__inner">
        <Intro />
        <div className="about-hero__portrait" aria-hidden="true">
          <div className="about-hero__circle" style={{ transform: `translateX(-50%) scale(${scale})` }} />
          <img src={personImage} alt="" />
        </div>
        <Journey />

        <div
          className="about-hero__inverted"
          aria-hidden="true"
          style={{ clipPath: `circle(${maskRadius}px at 50% 50%)` }}
        >
          <Intro duplicate />
          <div />
          <Journey />
        </div>
      </div>
    </section>
  )
}
