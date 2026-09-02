'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export interface FlowSectionProps {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  'aria-label'?: string
}

export const FlowSection: React.FC<FlowSectionProps> = ({ className, style = {}, children, 'aria-label': ariaLabel }) => (
  <section data-flow-section aria-label={ariaLabel} className={`relative min-h-screen w-full overflow-hidden ${className ?? ''}`}>
    <div data-flow-inner className="flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pb-[4vw] pt-[clamp(2rem,8vw,4vw)] will-change-transform" style={{ transformOrigin: 'bottom left', ...style }}>
      {children}
    </div>
  </section>
)

export default function FlowArt({ children, className, 'aria-label': ariaLabel = 'Story scroll' }: { children: React.ReactNode; className?: string; 'aria-label'?: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useGSAP(() => {
    if (!containerRef.current || reducedMotion) return
    const sections = Array.from(containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'))
    const scroller = containerRef.current.closest<HTMLElement>('.icsa-wrap') ?? undefined
    const triggers: ScrollTrigger[] = []

    sections.forEach((section, index) => {
      gsap.set(section, { zIndex: index + 1 })
      const inner = section.querySelector<HTMLElement>('[data-flow-inner]')
      if (!inner) return
      if (index > 0) {
        gsap.set(inner, { rotation: 30 })
        const tween = gsap.to(inner, { rotation: 0, ease: 'none', scrollTrigger: { trigger: section, scroller, start: 'top bottom', end: 'top 25%', scrub: true } })
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      }
      if (index < sections.length - 1) {
        triggers.push(ScrollTrigger.create({ trigger: section, scroller, start: 'bottom bottom', end: 'bottom top', pin: true, pinSpacing: false }))
      }
    })
    ScrollTrigger.refresh()
    return () => triggers.forEach((trigger) => trigger.kill())
  }, { scope: containerRef, dependencies: [React.Children.count(children), reducedMotion] })

  return <main ref={containerRef} aria-label={ariaLabel} className={`w-full overflow-x-hidden ${className ?? ''}`}>{children}</main>
}
