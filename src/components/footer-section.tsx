import { FaInstagram } from 'react-icons/fa'
import { Footer7 } from '@/components/ui/footer-7'

const sections = [
  {
    title: 'Expertise',
    links: [
      { name: 'Branding', href: '#skills' },
      { name: 'Editorial Design', href: '#skills' },
      { name: 'UI / UX', href: '#skills' },
      { name: 'Content Design', href: '#skills' },
    ],
  },
  {
    title: 'Built With',
    links: [
      { name: 'React', href: '#' },
      { name: 'GSAP', href: '#' },
      { name: 'Framer Motion', href: '#' },
      { name: 'Tailwind CSS', href: '#' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { name: '010. 9405. 4745', href: 'tel:01094054745' },
      { name: 'hong4745@gmail.com', href: 'mailto:hong4745@gmail.com' },
      { name: '@still___digging', href: 'https://instagram.com/still___digging' },
    ],
  },
]

export default function FooterSection() {
  return (
    <Footer7
      logo={{ url: '#', src: '/favicon.svg', alt: 'Baek Jieun logo', title: '백지은 · Baek Jieun' }}
      description="Visual Designer & Frontend Developer — 편집디자인의 경험을 바탕으로 디지털과 AI까지 작업 영역을 확장하고 있습니다."
      sections={sections}
      socialLinks={[
        {
          icon: <FaInstagram className="size-5" />,
          href: 'https://instagram.com/still___digging',
          label: 'Instagram',
        },
      ]}
      copyright="© 2026 Baek Jieun. All rights reserved."
      legalLinks={[]}
    />
  )
}
