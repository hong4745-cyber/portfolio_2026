import CurvedLoop from '@/components/ui/CurvedLoop'
import { CardsParallax, type iCardItem } from '@/components/ui/scroll-cards'

const projects = [
  { title: 'Nebula', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=85' },
  { title: 'Decay', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&q=85' },
  { title: 'Oceanic', image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=600&q=85' },
  { title: 'Neon', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=85' },
  { title: 'Desert', image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=600&q=85' },
  { title: 'Archive', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=85' },
  { title: 'Signal', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=85' },
]

const scrollCardItems: iCardItem[] = projects.map(({ title, image }) => ({
  title,
  description: 'Selected project',
  tag: 'portfolio',
  src: image,
  link: '#',
  color: '#ffffff',
  textColor: '#ffffff',
}))

export default function WorkSection() {
  return (
    <section id="work" className="w-full bg-white text-black" aria-labelledby="work-heading">
      <h2 id="work-heading" className="sr-only">Work</h2>
      <CurvedLoop marqueeText="PORTFOLIO ✦ WORK ✦ " speed={0.9} curveAmount={180} direction="left" interactive />
      <div className="relative w-full">
        <CardsParallax items={scrollCardItems} />
      </div>
    </section>
  )
}
