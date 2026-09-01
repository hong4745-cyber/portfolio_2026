'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Children,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  type Ref,
} from 'react'

gsap.registerPlugin(ScrollTrigger)

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((item) => item == null)) return null
    return (node: T) => {
      refs.forEach((item) => {
        if (typeof item === 'function') item(node)
        else if (item != null) (item as MutableRefObject<T | null>).current = node
      })
    }
  }, [refs])
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue)

  useEffect(() => {
    const handleResize = () => setValue(window.innerWidth < 768 ? mobileValue : baseValue)
    handleResize()
    let timeoutId: ReturnType<typeof setTimeout>
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }
    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [baseValue, mobileValue])

  return value
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (hoveredIndex: number | null) => ReactNode[]
  scrollDuration?: number
  visiblePercentage?: number
  baseRadius?: number
  mobileRadius?: number
  startTrigger?: string
  onItemSelect?: (index: number) => void
  direction?: 'ltr' | 'rtl'
  disabled?: boolean
}

export const RadialScrollGallery = forwardRef<HTMLDivElement, RadialScrollGalleryProps>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = '',
      startTrigger = 'center center',
      onItemSelect,
      direction = 'ltr',
      disabled = false,
      ...rest
    },
    ref,
  ) => {
    const pinRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLUListElement>(null)
    const childRef = useRef<HTMLLIElement>(null)
    const mergedRef = useMergeRefs(ref, pinRef)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(null)
    const currentRadius = useResponsiveValue(baseRadius, mobileRadius)
    const circleDiameter = currentRadius * 2

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage))
      const visible = clamped / 100
      return { visibleDecimal: visible, hiddenDecimal: 1 - visible }
    }, [visiblePercentage])

    const childrenNodes = useMemo(
      () => Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex],
    )
    const childrenCount = childrenNodes.length

    useEffect(() => {
      const child = childRef.current
      if (!child) return
      const observer = new ResizeObserver(([entry]) => {
        setChildSize({ w: entry.contentRect.width, h: entry.contentRect.height })
        ScrollTrigger.refresh()
      })
      observer.observe(child)
      return () => observer.disconnect()
    }, [childrenCount])

    useGSAP(
      () => {
        const pin = pinRef.current
        const wheel = containerRef.current
        const scroller = pin?.closest<HTMLDivElement>('.icsa-wrap')
        if (!pin || !wheel || !scroller || childrenCount === 0) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reducedMotion) return

        gsap.fromTo(
          wheel.children,
          { scale: 0, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'back.out(1.2)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: pin,
              scroller,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        gsap.to(wheel, {
          rotation: direction === 'rtl' ? -360 : 360,
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            scroller,
            pin: true,
            start: startTrigger,
            end: `+=${scrollDuration}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      },
      {
        scope: pinRef,
        dependencies: [scrollDuration, currentRadius, startTrigger, childrenCount, direction],
      },
    )

    if (childrenCount === 0) return null

    const calculatedBuffer = childSize ? childSize.h * 0.25 + 60 : 150
    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200

    return (
      <div
        ref={mergedRef}
        className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden ${className}`}
        {...rest}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
          }}
        >
          <ul
            ref={containerRef}
            className={`absolute left-1/2 m-0 -translate-x-1/2 list-none p-0 transition-opacity duration-500 ease-out will-change-transform ${
              disabled ? 'pointer-events-none grayscale opacity-50' : ''
            }`}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI
              let x = currentRadius * Math.cos(angle)
              const y = currentRadius * Math.sin(angle)
              if (direction === 'rtl') x = -x
              const rotationAngle = (angle * 180) / Math.PI
              const isHovered = hoveredIndex === index
              const isAnyHovered = hoveredIndex !== null

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotationAngle + 90}deg)`,
                  }}
                >
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={`프로젝트 ${index + 1} 보기`}
                    onClick={() => !disabled && onItemSelect?.(index)}
                    onKeyDown={(event) => {
                      if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault()
                        onItemSelect?.(index)
                      }
                    }}
                    onMouseEnter={() => !disabled && setHoveredIndex(index)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    onFocus={() => !disabled && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    className={`block cursor-pointer rounded-xl text-left outline-none transition-all duration-500 ease-out will-change-transform focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      isHovered ? '-translate-y-8 scale-125' : 'scale-100'
                    } ${isAnyHovered && !isHovered ? 'opacity-40 blur-[2px] grayscale' : 'opacity-100 blur-0'}`}
                  >
                    {child}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  },
)

RadialScrollGallery.displayName = 'RadialScrollGallery'
