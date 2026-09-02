"use client"

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { useEffect, useRef, type CSSProperties, type RefObject } from "react"
import { cn } from "@/lib/utils"
import claudeCodeLogo from "@/assets/claude-code-white-icon.svg"
import codexLogo from "@/assets/Codex Logo - Black - 128x128 - zonalogo.com.png"

type CharacterProps = {
  char: string
  index: number
  centerIndex: number
  scrollYProgress: MotionValue<number>
}

const CharacterV1 = ({ char, index, centerIndex, scrollYProgress }: CharacterProps) => {
  const isSpace = char === " "
  const distanceFromCenter = index - centerIndex
  const x = useTransform(scrollYProgress, [0.08, 0.72], [distanceFromCenter * 50, 0])
  const y = useTransform(scrollYProgress, [0.08, 0.72], [Math.abs(distanceFromCenter) * 8 + 30, 0])
  const rotateX = useTransform(scrollYProgress, [0.08, 0.72], [distanceFromCenter * 50, 0])
  const opacity = useTransform(scrollYProgress, [0.08, 0.32], [0, 1])

  return (
    <motion.span
      className={cn("inline-block text-orange-500", isSpace && "w-4")}
      style={{ x, y, rotateX, opacity }}
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

const skillGroups = [
  {
    title: "Frontend",
    skills: [
      ["HTML5", "웹 퍼블리싱 및 시맨틱 마크업"], ["CSS3", "반응형 레이아웃 및 커스텀 애니메이션"],
      ["JavaScript", "DOM 제어, 인터랙션 구현 및 API 연동"], ["React", "SPA 기반 컴포넌트 설계 및 개발"],
      ["TypeScript", "컴포넌트 타입 정의 및 안정적인 코드 작성"],
      ["Framer Motion", "React 컴포넌트 애니메이션 및 상태 전환"], ["Firebase", "Authentication 및 Cloud Firestore 데이터 관리"],
      ["Naver Maps API", "지도 및 위치 기반 콘텐츠 구현"], ["GitHub", "소스 코드 버전 관리"], ["Vercel", "프론트엔드 배포 및 호스팅"],
    ],
  },
  {
    title: "Design Tools",
    skills: [
      ["Figma", "UI 기획, 와이어프레임 및 프로토타입 제작"], ["Adobe Photoshop", "이미지 보정·합성 및 포스터·브로슈어 제작"],
      ["Adobe Illustrator", "벡터 그래픽 및 홍보물 디자인"], ["Adobe InDesign", "브로슈어·리플렛·포스터·도록 편집 디자인"],
      ["Canva", "소셜 콘텐츠, 발표 자료 및 간단한 그래픽 제작"],
    ],
  },
  {
    title: "AI Tools",
    skills: [
      ["ChatGPT", "코드 작성 보조 및 콘텐츠 기획"], ["GPT Codex", "코드 생성, 수정 및 개발 보조"],
      ["Claude", "AI 페어 프로그래밍 및 설계 검토"], ["Claude Code", "포트폴리오 개발 및 코드 개선"],
      ["Gemini", "AI 이미지 생성 및 광고 콘텐츠 기획"],
    ],
  },
] as const

const skillLogoSlugs: Record<string, string> = {
  HTML5: "html5", CSS3: "css3", JavaScript: "javascript", React: "react", TypeScript: "typescript",
  "Framer Motion": "framer", Firebase: "firebase", "Naver Maps API": "naver",
  GitHub: "github", Vercel: "vercel", Figma: "figma", "Adobe Photoshop": "adobephotoshop",
  "Adobe Illustrator": "adobeillustrator", "Adobe InDesign": "adobeindesign", Canva: "canva",
  ChatGPT: "openai", "GPT Codex": "openai", Claude: "claude", "Claude Code": "claude",
  Gemini: "googlegemini", "Three.js": "threedotjs", "React Three Fiber": "react",
  OGL: "webgl", Lenis: "lenis", Vite: "vite", Iconify: "iconify", "Lucide React": "lucide",
}

const skillLogoUrl = (name: string) => {
  if (name === "Claude Code") return claudeCodeLogo
  if (name === "GPT Codex") return codexLogo
  return `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${skillLogoSlugs[name] ?? "code"}.svg`
}
const skillAbbreviation = (name: string) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase()

const Skiper31 = () => {
  const targetRef = useRef<HTMLDivElement>(null)
  const scrollYProgress = useContainerScrollProgress(targetRef)

  const text = "creative skills"
  const characters = text.split("")
  const centerIndex = Math.floor(characters.length / 2)

  return (
    <main id="skills" className="relative w-full bg-white" aria-labelledby="skills-heading">
      <div ref={targetRef} className="relative flex h-[120vh] items-center justify-center overflow-hidden bg-[#fff] p-[2vw]">
        <h2 id="skills-heading" className="w-full max-w-5xl text-center text-5xl font-bold uppercase tracking-tighter text-black md:text-7xl lg:text-8xl" style={{ perspective: "500px" }}>
          {characters.map((char, index) => (
            <CharacterV1 key={`${char}-${index}`} char={char} index={index} centerIndex={centerIndex} scrollYProgress={scrollYProgress} />
          ))}
        </h2>
      </div>

      {skillGroups.map((group, groupIndex) => <SkillGroupPanel key={group.title} group={group} index={groupIndex} />)}
    </main>
  )
}

function SkillGroupPanel({ group, index }: { group: (typeof skillGroups)[number]; index: number }) {
  const marqueeSkills = [...group.skills, ...group.skills]
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center gap-14 overflow-hidden bg-white py-24">
      <motion.h3
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }}
        transition={{ duration: .6, delay: index * .03 }}
        className="flex items-center justify-center gap-3 text-center text-2xl font-medium tracking-tight text-black md:text-4xl"
      >
        <Bracket className="h-10 text-black md:h-12" />
        <span>{group.title}</span>
        <Bracket className="h-10 scale-x-[-1] text-black md:h-12" />
      </motion.h3>
      <div className="skills-marquee w-full" style={{ '--marquee-duration': `${Math.max(24, group.skills.length * 4)}s` } as CSSProperties}>
        <div className={`skills-marquee__track ${index % 2 === 1 ? 'skills-marquee__track--reverse' : ''}`}>
          {marqueeSkills.map(([name, description], skillIndex) => (
            <button
              type="button"
              key={`${name}-${skillIndex}`}
              className="skills-marquee__item"
              aria-label={`${name}: ${description}`}
              title={`${name} — ${description}`}
            >
              <span className="skills-marquee__fallback" aria-hidden="true">{skillAbbreviation(name)}</span>
              <img
                src={skillLogoUrl(name)}
                alt=""
                loading="lazy"
                onError={(event) => { event.currentTarget.style.display = 'none' }}
              />
              <span className="skills-marquee__tooltip" aria-hidden="true">
                <strong>{name}</strong>
                <small>{description}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const Bracket = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className} aria-hidden="true">
    <path fill="#000" d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z" />
  </svg>
)

export { CharacterV1, CharacterV2, CharacterV3, Skiper31 }
