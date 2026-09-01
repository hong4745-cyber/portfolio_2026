import { AtSign, Camera, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import personImage from '@/assets/back_2-kcRSgiVN.png'

const socials = [
  { label: 'Email', href: 'mailto:', icon: Mail },
  { label: 'GitHub', href: '#', icon: AtSign },
  { label: 'Instagram', href: '#', icon: Camera },
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const root = section?.closest<HTMLDivElement>('.icsa-wrap')
    if (!section || !root) return
    const update = () => {
      const rect = section.getBoundingClientRect()
      const rootRect = root.getBoundingClientRect()
      setProgress(clamp((rootRect.height - rect.top) / (rootRect.height + rect.height)))
    }
    update()
    root.addEventListener('scroll', update, { passive: true })
    return () => root.removeEventListener('scroll', update)
  }, [])

  const textColor = `rgb(${Math.round(255 - progress * 255)}, ${Math.round(255 - progress * 255)}, ${Math.round(255 - progress * 255)})`

  return (
    <section ref={sectionRef} id="about" aria-label="About" className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="mx-auto grid min-h-[100svh] w-full max-w-[1600px] grid-cols-1 items-center px-8 py-16 md:grid-cols-[1fr_1.4fr_1fr] md:px-14 lg:px-20">
        <motion.div style={{ color: textColor }} className="relative z-30 self-center md:justify-self-start">
          <p className="mb-2 text-xs tracking-[0.18em]">DESIGN · UI/UX · FRONTEND</p>
          <h2 className="text-4xl font-semibold tracking-[0.06em] md:text-5xl">BAEK JIEUN</h2>
          <p className="mt-2 text-base">Daejeon, Korea</p>
          <div className="mt-8 flex items-center gap-5">
            {socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} aria-label={label} className="transition-opacity hover:opacity-60"><Icon className="h-8 w-8 stroke-[1.8]" /></a>)}
          </div>
          <p className="mt-16 max-w-[24rem] text-xl leading-[1.65] md:text-2xl">Visual design에서 출발해 UI/UX와<br className="hidden md:block" /> 프론트엔드로 작업 영역을 넓혀가고<br className="hidden md:block" /> 있습니다.</p>
        </motion.div>

        <div className="relative flex h-[58vh] min-h-[390px] items-end justify-center md:h-[78vh]">
          <motion.div style={{ width: `clamp(320px, ${38 + progress * 72}vw, 1200px)`, height: `clamp(320px, ${38 + progress * 72}vw, 1200px)` }} className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#F9D02A]" />
          <img src={personImage} alt="Baek Jieun portrait" className="relative z-20 h-[108%] w-auto max-w-none object-contain object-bottom" />
        </div>

        <motion.h1 style={{ color: textColor }} className="relative z-30 text-[clamp(4.5rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] md:justify-self-start">JOUR<br />NEY</motion.h1>
      </div>
    </section>
  )
}
