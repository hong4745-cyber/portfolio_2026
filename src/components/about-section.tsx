import { BriefcaseBusiness, Camera, Globe2, MessageCircle } from 'lucide-react'
import { MinimalistHero } from '@/components/ui/minimalist-hero'

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
        imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
        imageAlt="A portrait of a person in a black turtleneck, in profile."
        overlayText={{ part1: 'less is', part2: 'more.' }}
        socialLinks={socialLinks}
        locationText="Arlington Heights, IL"
      />
    </section>
  )
}
