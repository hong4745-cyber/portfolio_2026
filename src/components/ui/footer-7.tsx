import type { ReactElement } from "react"
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"

interface Footer7Props {
  logo?: {
    url: string
    src: string
    alt: string
    title: string
  }
  sections?: Array<{
    title: string
    links: Array<{ name: string; href: string }>
  }>
  description?: string
  socialLinks?: Array<{
    icon: ReactElement
    href: string
    label: string
  }>
  copyright?: string
  legalLinks?: Array<{
    name: string
    href: string
  }>
}

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
]

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
]

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
]

export const Footer7 = ({
  logo = {
    url: "#",
    src: "/favicon.svg",
    alt: "logo",
    title: "Baek Jieun",
  },
  sections = defaultSections,
  description = "Visual Designer & Frontend Developer",
  socialLinks = defaultSocialLinks,
  copyright = "© 2026 Baek Jieun. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  const preventPlaceholderJump = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#") event.preventDefault()
  }

  return (
    <footer className="h-[300px] overflow-y-auto bg-black p-[50px] text-white">
      <div className="container mx-auto flex h-full max-w-7xl flex-col justify-between">
        <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-4 lg:items-start">
            <div className="flex items-center gap-3 lg:justify-start">
              <a href={logo.url} onClick={(event) => preventPlaceholderJump(event, logo.url)}>
                <img src={logo.src} alt={logo.alt} title={logo.title} className="h-9 w-9" />
              </a>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            <p className="max-w-md text-sm leading-5 text-white/60">{description}</p>
            <ul className="flex items-center space-x-6 text-white/60">
              {socialLinks.map((social) => (
                <li key={social.label} className="font-medium transition-colors hover:text-white">
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                    onClick={(event) => preventPlaceholderJump(event, social.href)}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.name}`} className={`font-medium ${section.title === 'Expertise' || section.title === 'Built With' ? '!text-white/60 transition-none' : 'transition-colors hover:text-white'}`}>
                      {section.title === 'Expertise' || section.title === 'Built With' ? (
                        <span>{link.name}</span>
                      ) : (
                        <a href={link.href} onClick={(event) => preventPlaceholderJump(event, link.href)}>{link.name}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-white/15 pt-4 text-xs font-medium text-white/45 md:flex-row md:items-center md:text-left">
          <p className="order-2 md:order-1">{copyright}</p>
          {legalLinks.length > 0 && (
            <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-6">
              {legalLinks.map((link) => (
                <li key={link.name} className="transition-colors hover:text-white">
                  <a href={link.href} onClick={(event) => preventPlaceholderJump(event, link.href)}>{link.name}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
