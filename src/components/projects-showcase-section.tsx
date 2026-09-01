import { FullScreenScrollFX } from '@/components/ui/full-screen-scroll-fx'

const projects = [
  { id: 'project-01', href: '#', leftLabel: 'Editorial', title: 'Project 01', rightLabel: '01 / 07', background: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=85' },
  { id: 'project-02', href: '#', leftLabel: 'Branding', title: 'Project 02', rightLabel: '02 / 07', background: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1800&q=85' },
  { id: 'project-03', href: '#', leftLabel: 'Campaign', title: 'Project 03', rightLabel: '03 / 07', background: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1800&q=85' },
  { id: 'project-04', href: '#', leftLabel: 'Poster', title: 'Project 04', rightLabel: '04 / 07', background: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1800&q=85' },
  { id: 'project-05', href: '#', leftLabel: 'Package', title: 'Project 05', rightLabel: '05 / 07', background: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1800&q=85' },
  { id: 'project-06', href: '#', leftLabel: 'Digital', title: 'Project 06', rightLabel: '06 / 07', background: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1800&q=85' },
  { id: 'project-07', href: '#', leftLabel: 'AI Visual', title: 'Project 07', rightLabel: '07 / 07', background: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=85' },
]

export default function ProjectsShowcaseSection() {
  return (
    <section aria-label="Selected projects">
      <FullScreenScrollFX
        sections={projects}
        header={<><div>Selected</div><div>Projects</div></>}
        showProgress
        durations={{ change: 0.7, snap: 800 }}
      />
    </section>
  )
}
