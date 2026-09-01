import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MinimalistHeroProps {
  logoText: string
  navLinks: { label: string; href: string }[]
  mainText: string
  readMoreLink: string
  imageSrc: string
  imageAlt: string
  overlayText: {
    part1: string
    part2: string
  }
  socialLinks: { icon: LucideIcon; href: string }[]
  locationText: string
  className?: string
}

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
)

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-foreground/60 transition-colors hover:text-foreground"
  >
    <Icon className="h-5 w-5" aria-hidden="true" />
  </a>
)

export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-8 font-sans md:h-screen md:p-12',
        className,
      )}
    >
      <header className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold tracking-wider"
        >
          {logoText}
        </motion.div>
        <nav className="hidden items-center space-x-8 md:flex" aria-label="About navigation">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-1.5 md:hidden"
          aria-label="Open menu"
          type="button"
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="block h-0.5 w-5 bg-foreground" />
        </motion.button>
      </header>

      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-8 py-10 md:grid-cols-3 md:gap-0 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="z-20 order-2 text-center md:order-1 md:text-left"
        >
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-foreground/80 md:mx-0">
            {mainText}
          </p>
          <a
            href={readMoreLink}
            className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-from-font"
          >
            Read More
          </a>
        </motion.div>

        <div className="relative order-1 flex min-h-80 items-center justify-center md:order-2 md:h-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 h-[280px] w-[280px] rounded-full bg-yellow-400/90 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
          />
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-auto w-48 scale-125 object-cover md:w-64 md:scale-150 lg:w-72"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            onError={(event) => {
              const target = event.currentTarget
              target.onerror = null
              target.src = 'https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found'
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-start md:text-left"
        >
          <h2 className="text-6xl font-extrabold leading-none text-foreground md:text-7xl lg:text-8xl xl:text-9xl">
            {overlayText.part1}
            <br />
            {overlayText.part2}
          </h2>
        </motion.div>
      </div>

      <footer className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-sm font-medium text-foreground/80"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  )
}
