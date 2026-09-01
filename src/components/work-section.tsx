import { useCallback } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { RadialScrollGallery } from '@/components/ui/portfolio-and-image-gallery'

const projects = [
  { id: 1, title: 'Nebula', cat: 'Editorial', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=85' },
  { id: 2, title: 'Decay', cat: 'Branding', img: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=600&q=85' },
  { id: 3, title: 'Oceanic', cat: 'Campaign', img: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=600&q=85' },
  { id: 4, title: 'Neon', cat: 'Digital', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=85' },
  { id: 5, title: 'Desert', cat: 'Poster', img: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=600&q=85' },
]

export default function WorkSection() {
  const renderProjects = useCallback((hoveredIndex: number | null) =>
    projects.map((project, index) => {
      const isActive = hoveredIndex === index
      return (
        <div key={project.id} className="group relative h-[280px] w-[200px] overflow-hidden rounded-xl border border-border bg-card shadow-lg sm:h-[320px] sm:w-[240px]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={project.img}
              alt={project.title}
              className={`h-full w-full object-cover transition-transform duration-700 ease-out ${isActive ? 'scale-110 blur-0' : 'scale-100 grayscale-[30%] blur-[1px]'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="bg-white/85 px-2 py-0 text-[10px] text-black backdrop-blur">
                {project.cat}
              </Badge>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-all duration-500 ${isActive ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'}`}>
                <ArrowUpRight size={12} aria-hidden="true" />
              </div>
            </div>
            <div className={`transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-2'}`}>
              <h3 className="text-xl font-bold leading-tight text-white">{project.title}</h3>
              <div className={`mt-2 h-0.5 bg-white transition-all duration-500 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
            </div>
          </div>
        </div>
      )
    }), [])

  return (
    <section id="work" className="min-h-[600px] w-full overflow-hidden bg-background text-foreground" aria-labelledby="work-heading">
      <div className="flex h-[300px] flex-col items-center justify-center space-y-4 pt-8">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Portfolio</span>
          <h2 id="work-heading" className="text-4xl font-bold tracking-tighter md:text-6xl">Work</h2>
        </div>
        <div className="animate-bounce text-xs text-muted-foreground">↓ Scroll</div>
      </div>
      <RadialScrollGallery className="!min-h-[600px]" baseRadius={400} mobileRadius={250} visiblePercentage={50} scrollDuration={2000}>
        {renderProjects}
      </RadialScrollGallery>
    </section>
  )
}
