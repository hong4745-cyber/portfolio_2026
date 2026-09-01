import { BriefcaseBusiness, Camera, Globe2, MessageCircle } from 'lucide-react'
import { MinimalistHero } from '@/components/ui/minimalist-hero'
import personImage from '@/assets/about-replacement.png'

const navLinks = [
  { label: 'HOME', href: '#' },
  { label: 'PRODUCT', href: '#' },
  { label: 'STORE', href: '#' },
  { label: 'ABOUT US', href: '#about' },
]

const socialLinks = [
  { icon: Globe2, href: '#' },
  { icon: Camera, href: '#' },
  { icon: MessageCircle, href: '#' },
  { icon: BriefcaseBusiness, href: '#' },
]

export default function AboutSection() {
  return (
    <section id="about" aria-label="About">
      <MinimalistHero
        logoText="mnmlst."
        navLinks={navLinks}
        mainText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultrices, justo vel tempus."
        readMoreLink="#about"
        imageSrc={personImage}
        imageAlt="mnmlst 포트폴리오 소개 이미지"
        overlayText={{ part1: 'less is', part2: 'more.' }}
        socialLinks={socialLinks}
        locationText="Arlington Heights, IL"
      />
    </section>
  )
}
