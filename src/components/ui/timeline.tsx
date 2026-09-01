"use client"

import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

interface TimelineEntry {
  title: string
  content: ReactNode
}

interface TimelineProps {
  data: TimelineEntry[]
  eyebrow?: string
  heading?: string
  description?: string
}

export const Timeline = ({
  data,
  eyebrow = "Education & Experience",
  heading = "배움에서 경험으로",
  description = "지금의 관점과 역량을 만들어 온 학력과 주요 이력을 시간순으로 소개합니다.",
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const scrollProgress = useMotionValue(0)

  const setContainer = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const measure = () => setHeight(node.getBoundingClientRect().height)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const target = containerRef.current
    const scrollRoot = target?.closest<HTMLDivElement>(".icsa-wrap")
    if (!target || !scrollRoot) return

    let frame = 0

    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rootRect = scrollRoot.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const startLine = rootRect.top + rootRect.height * 0.9
        const endLine = rootRect.top + rootRect.height * 0.5
        const travelDistance = targetRect.height + startLine - endLine
        const progress = (startLine - targetRect.top) / travelDistance

        scrollProgress.set(Math.min(1, Math.max(0, progress)))
      })
    }

    updateProgress()
    scrollRoot.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      scrollRoot.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [scrollProgress])

  const heightTransform = useTransform(scrollProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollProgress, [0, 0.1], [0, 1])

  return (
    <section
      className="w-full bg-white font-sans md:px-10"
      ref={setContainer}
      aria-labelledby="timeline-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10 lg:py-28">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
          {eyebrow}
        </p>
        <h2
          id="timeline-heading"
          className="mb-5 max-w-4xl text-3xl font-bold tracking-tight text-black md:text-5xl"
        >
          {heading}
        </h2>
        <p className="max-w-lg text-sm leading-7 text-neutral-600 md:text-base">
          {description}
        </p>
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl pb-24">
        {data.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="flex justify-start gap-4 pt-16 md:gap-10 md:pt-36"
          >
            <div className="sticky top-32 z-40 flex max-w-xs self-start md:w-full md:max-w-sm md:flex-row md:items-center">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white md:left-3">
                <div className="h-4 w-4 rounded-full border border-neutral-300 bg-neutral-200" />
              </div>
              <h3 className="hidden pl-20 text-xl font-bold text-neutral-500 md:block md:text-4xl lg:text-5xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-16 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left text-2xl font-bold text-neutral-500 md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </article>
        ))}

        <div
          style={{ height: `${height}px` }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
          aria-hidden="true"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-purple-500 from-[0%] via-blue-500 via-[10%] to-transparent"
          />
        </div>
      </div>
    </section>
  )
}
