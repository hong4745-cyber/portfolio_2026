"use client"

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { useEffect, useRef, type RefObject } from "react"
import { cn } from "@/lib/utils"

type CharacterProps = {
  char: string
  index: number
  centerIndex: number
  scrollYProgress: MotionValue<number>
}

const CharacterV1 = ({ char, index, centerIndex, scrollYProgress }: CharacterProps) => {
  const isSpace = char === " "
  const distanceFromCenter = index - centerIndex
  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0])

  return (
    <motion.span
      className={cn("inline-block text-orange-500", isSpace && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  )
}

const CharacterV2 = ({ char, index, centerIndex, scrollYProgress }: CharacterProps) => {
  const distanceFromCenter = index - centerIndex
  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 50, 0])

  return (
    <motion.img
      src={char}
      alt=""
      className="h-12 w-12 shrink-0 object-contain will-change-transform md:h-16 md:w-16"
      style={{ x, scale, y, transformOrigin: "center" }}
    />
  )
}

const CharacterV3 = ({ char, index, centerIndex, scrollYProgress }: CharacterProps) => {
  const distanceFromCenter = index - centerIndex
  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 90, 0])
  const rotate = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [-Math.abs(distanceFromCenter) * 20, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1])

  return (
    <motion.img
      src={char}
      alt=""
      className="h-12 w-12 shrink-0 object-contain will-change-transform md:h-16 md:w-16"
      style={{ x, rotate, y, scale, transformOrigin: "center" }}
    />
  )
}

function useContainerScrollProgress(targetRef: RefObject<HTMLDivElement | null>) {
  const progress = useMotionValue(0)

  useEffect(() => {
    const target = targetRef.current
    const scrollRoot = target?.closest<HTMLDivElement>(".icsa-wrap")
    if (!target || !scrollRoot) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rootRect = scrollRoot.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const distance = rootRect.height + targetRect.height
        const value = (rootRect.bottom - targetRect.top) / distance
        progress.set(Math.min(1, Math.max(0, value)))
      })
    }

    update()
    scrollRoot.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      scrollRoot.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [progress, targetRef])

  return progress
}

const designIcons = [
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobephotoshop.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobeillustrator.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobeindesign.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/figma.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobeaftereffects.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobepremierepro.svg",
]

const webAiIcons = [
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/html5.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/css3.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/javascript.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/react.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openai.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg",
]

const skillLabels = ["Branding", "Editorial", "UI/UX", "AI", "Content", "Marketing"]

const Skiper31 = () => {
  const targetRef = useRef<HTMLDivElement>(null)
  const targetRef2 = useRef<HTMLDivElement>(null)
  const targetRef3 = useRef<HTMLDivElement>(null)
  const scrollYProgress = useContainerScrollProgress(targetRef)
  const scrollYProgress2 = useContainerScrollProgress(targetRef2)
  const scrollYProgress3 = useContainerScrollProgress(targetRef3)

  const text = "creative skills"
  const characters = text.split("")
  const centerIndex = Math.floor(characters.length / 2)

  return (
    <main id="skills" className="relative w-full bg-white" aria-labelledby="skills-heading">
      <div className="absolute left-1/2 top-20 z-10 grid -translate-x-1/2 justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[14ch] text-xs uppercase leading-tight opacity-50 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#f5f4f3] after:to-black after:content-['']">
          Scroll to explore skills
        </span>
      </div>

      <div ref={targetRef} className="relative flex h-[190vh] items-center justify-center overflow-hidden bg-[#f5f4f3] p-[2vw]">
        <h2 id="skills-heading" className="w-full max-w-5xl text-center text-5xl font-bold uppercase tracking-tighter text-black md:text-7xl lg:text-8xl" style={{ perspective: "500px" }}>
          {characters.map((char, index) => (
            <CharacterV1 key={`${char}-${index}`} char={char} index={index} centerIndex={centerIndex} scrollYProgress={scrollYProgress} />
          ))}
        </h2>
      </div>

      <SkillIconPanel refValue={targetRef2} progress={scrollYProgress2} icons={designIcons} label="Design tools" variant="rise" />
      <SkillIconPanel refValue={targetRef3} progress={scrollYProgress3} icons={webAiIcons} label="Web & AI tools" variant="rotate" />

      <div className="relative -mt-[90vh] flex min-h-[110vh] items-center justify-center bg-[#f5f4f3] px-6 pb-28 pt-40">
        <div className="flex max-w-4xl flex-wrap justify-center gap-3">
          {skillLabels.map((skill) => (
            <span key={skill} className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-wider text-black shadow-sm md:text-base">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}

function SkillIconPanel({ refValue, progress, icons, label, variant }: {
  refValue: RefObject<HTMLDivElement | null>
  progress: MotionValue<number>
  icons: string[]
  label: string
  variant: "rise" | "rotate"
}) {
  const centerIndex = Math.floor(icons.length / 2)
  return (
    <div ref={refValue} className="relative -mt-[90vh] flex h-[190vh] flex-col items-center justify-center gap-10 overflow-hidden bg-[#f5f4f3] p-[2vw]">
      <p className="flex items-center justify-center gap-3 text-center text-xl font-medium tracking-tight text-black md:text-2xl">
        <Bracket className="h-10 text-black md:h-12" />
        <span>{label}</span>
        <Bracket className="h-10 scale-x-[-1] text-black md:h-12" />
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8" style={{ perspective: "500px" }}>
        {icons.map((icon, index) => variant === "rise" ? (
          <CharacterV2 key={icon} char={icon} index={index} centerIndex={centerIndex} scrollYProgress={progress} />
        ) : (
          <CharacterV3 key={icon} char={icon} index={index} centerIndex={centerIndex} scrollYProgress={progress} />
        ))}
      </div>
    </div>
  )
}

const Bracket = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className} aria-hidden="true">
    <path fill="#000" d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z" />
  </svg>
)

export { CharacterV1, CharacterV2, CharacterV3, Skiper31 }
