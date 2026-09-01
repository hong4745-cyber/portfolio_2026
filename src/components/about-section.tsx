import { AtSign, Camera, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import personImage from '@/assets/back_2-kcRSgiVN.png'

const socials = [
  { label: 'Email', href: 'mailto:', icon: Mail },
  { label: 'GitHub', href: '#', icon: AtSign },
  { label: 'Instagram', href: '#', icon: Camera },
]

export default function AboutSection() {
  return (
    <section id="about" aria-label="About" className="relative min-h-[100svh] overflow-hidden bg-[#f4f0e8] text-[#0c1742]">
      <div className="mx-auto grid min-h-[100svh] w-full max-w-[1500px] grid-cols-1 items-center gap-8 px-8 py-16 md:grid-cols-[1fr_1.25fr_1fr] md:gap-0 md:px-16 md:py-20">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="z-10 self-center md:justify-self-start">
          <p className="mb-2 text-xs tracking-[0.2em]">DESIGN · UI/UX · FRONTEND</p>
          <h2 className="text-4xl font-semibold tracking-[0.08em] md:text-5xl">BAEK JIEUN</h2>
          <p className="mt-2 text-base">Daejeon, Korea</p>
          <div className="mt-8 flex items-center gap-5">{socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} aria-label={label} className="transition-opacity hover:opacity-60"><Icon className="h-8 w-8 stroke-[1.8]" /></a>)}</div>
          <p className="mt-16 max-w-[24rem] text-xl leading-[1.65] md:text-2xl">Visual design에서 출발해 UI/UX와<br className="hidden md:block" /> 프론트엔드로 작업 영역을 넓혀가고<br className="hidden md:block" /> 있습니다.</p>
        </motion.div>
        <div className="relative flex h-[52vh] min-h-[360px] items-end justify-center md:h-[74vh]">
          <motion.div initial={{ scale: 0.86, opacity: 1 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9 }} className="absolute bottom-0 left-1/2 aspect-square w-[min(78vw,620px)] -translate-x-1/2 rounded-full bg-[#ffd21c]" />
          <motion.img src={personImage} alt="Baek Jieun portrait" initial={{ opacity: 1, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }} className="relative z-10 h-[66%] w-auto max-w-none object-contain object-bottom" />
        </div>
        <motion.h1 initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="z-10 text-[clamp(4.5rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] md:justify-self-start">JOUR<br />NEY</motion.h1>
      </div>
    </section>
  )
}
