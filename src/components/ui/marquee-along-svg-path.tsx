"use client"

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { Children, useMemo, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const wrap = (min: number, max: number, value: number) => ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min

interface MarqueeAlongSvgPathProps {
  children: ReactNode
  className?: string
  path: string
  pathId?: string
  preserveAspectRatio?: string
  showPath?: boolean
  width?: string | number
  height?: string | number
  viewBox?: string
  baseVelocity?: number
  direction?: "normal" | "reverse"
  slowdownOnHover?: boolean
  slowDownFactor?: number
  repeat?: number
  draggable?: boolean
  dragSensitivity?: number
  grabCursor?: boolean
  responsive?: boolean
}

function MarqueeItem({
  child,
  index,
  count,
  offset,
  path,
  draggable,
  grabCursor,
  hovered,
  setHovered,
}: {
  child: ReactNode
  index: number
  count: number
  offset: MotionValue<number>
  path: string
  draggable: boolean
  grabCursor: boolean
  hovered: boolean
  setHovered: (value: boolean) => void
}) {
  const position = useTransform(offset, (value) => `${wrap(0, 100, value + (index * 100) / count)}%`)
  return (
    <motion.div
      className={cn("absolute left-0 top-0", draggable && grabCursor && "cursor-grab")}
      style={{ offsetPath: `path('${path}')`, offsetDistance: position, willChange: "offset-distance" } as never}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
    >
      <div className={cn("transition-transform duration-300", hovered && "scale-110")}>{child}</div>
    </motion.div>
  )
}

export default function MarqueeAlongSvgPath({
  children,
  className,
  path,
  pathId = "work-marquee-path",
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,
  width = "100%",
  height = "100%",
  viewBox = "0 0 996 330",
  baseVelocity = 7,
  direction = "normal",
  slowdownOnHover = true,
  slowDownFactor = 0.3,
  repeat = 2,
  draggable = true,
  grabCursor = true,
}: MarqueeAlongSvgPathProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const offset = useMotionValue(0)
  const hoverFactor = useMotionValue(1)
  const smoothHoverFactor = useSpring(hoverFactor, { damping: 50, stiffness: 400 })
  const [hovered, setHovered] = useState(false)
  const dragVelocity = useRef(0)
  const dragging = useRef(false)
  const pointerX = useRef(0)
  const nodes = useMemo(() => {
    const source = Children.toArray(children)
    return Array.from({ length: Math.max(1, repeat) }, () => source).flat()
  }, [children, repeat])

  useAnimationFrame((_, delta) => {
    if (dragging.current && draggable) {
      offset.set(offset.get() + dragVelocity.current)
      dragVelocity.current *= 0.92
      return
    }
    hoverFactor.set(slowdownOnHover && hovered ? slowDownFactor : 1)
    const sign = direction === "reverse" ? -1 : 1
    offset.set(offset.get() + sign * baseVelocity * (delta / 1000) * smoothHoverFactor.get() + dragVelocity.current)
    dragVelocity.current *= 0.94
  })

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragging.current = true
    pointerX.current = event.clientX
  }
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !draggable) return
    const delta = event.clientX - pointerX.current
    pointerX.current = event.clientX
    dragVelocity.current = delta * 0.12
  }
  const handlePointerUp = () => { dragging.current = false }

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" width={width} height={height} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} aria-hidden="true">
        <path id={pathId} d={path} stroke={showPath ? "currentColor" : "none"} fill="none" />
      </svg>
      <div className="absolute inset-0">
        {nodes.map((child, index) => (
          <MarqueeItem key={`${index}-${repeat}`} child={child} index={index} count={nodes.length} offset={offset} path={path} draggable={draggable} grabCursor={grabCursor} hovered={hovered} setHovered={setHovered} />
        ))}
      </div>
    </div>
  )
}
