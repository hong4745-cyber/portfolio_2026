import { ArrowUpRight } from 'lucide-react'
import MarqueeAlongSvgPath from '@/components/ui/marquee-along-svg-path'
import { Badge } from '@/components/ui/badge'

const projects = [
  { title: 'Nebula', category: 'Editorial', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=85' },
  { title: 'Decay', category: 'Branding', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&q=85' },
  { title: 'Oceanic', category: 'Campaign', image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=600&q=85' },
  { title: 'Neon', category: 'Digital', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=85' },
  { title: 'Desert', category: 'Poster', image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=600&q=85' },
  { title: 'Archive', category: 'Package', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=85' },
  { title: 'Signal', category: 'AI Visual', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=85' },
]

const path = 'M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5'

export default function WorkSection() {
  return (
    <section id="work" className="w-full overflow-hidden bg-white text-black" aria-labelledby="work-heading">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-8 pt-24 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/45">Portfolio</span>
        <h2 id="work-heading" className="mt-3 text-5xl font-black tracking-tighter md:text-7xl">Work</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-black/55">스크롤하거나 드래그해 프로젝트를 살펴보세요.</p>
      </div>

      <div className="h-[500px] w-full md:h-[600px]">
        <MarqueeAlongSvgPath path={path} viewBox="0 0 996 330" baseVelocity={8} slowdownOnHover draggable repeat={1} dragSensitivity={0.1} className="scale-100" grabCursor>
          {projects.map((project) => (
            <a key={project.title} href="#" onClick={(event) => event.preventDefault()} className="group block h-[140px] w-[140px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl transition-transform duration-300 hover:scale-105 sm:h-[170px] sm:w-[170px]">
              <div className="relative h-full w-full overflow-hidden">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 text-left text-white">
                  <Badge variant="secondary" className="mb-3 bg-white/85 px-2 py-0 text-[10px] text-black">{project.category}</Badge>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <ArrowUpRight className="h-5 w-5 opacity-70" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </MarqueeAlongSvgPath>
      </div>
    </section>
  )
}
