import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { gsap } from 'gsap'
import CircularText from '@/components/ui/CircularText'

type Section = {
  id?: string
  href?: string
  background: string
  leftLabel?: ReactNode
  title: ReactNode
  rightLabel?: ReactNode
  renderBackground?: (active: boolean, previous: boolean) => ReactNode
}

type Colors = Partial<{
  text: string
  overlay: string
  pageBg: string
  stageBg: string
}>

type Durations = Partial<{
  change: number
  snap: number
}>

export type FullScreenFXAPI = {
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  getIndex: () => number
  refresh: () => void
}

export type FullScreenFXProps = {
  sections: Section[]
  className?: string
  style?: CSSProperties
  fontFamily?: string
  header?: ReactNode
  footer?: ReactNode
  showProgress?: boolean
  debug?: boolean
  durations?: Durations
  reduceMotion?: boolean
  currentIndex?: number
  onIndexChange?: (index: number) => void
  initialIndex?: number
  colors?: Colors
  apiRef?: React.Ref<FullScreenFXAPI>
  ariaLabel?: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export const FullScreenScrollFX = forwardRef<HTMLDivElement, FullScreenFXProps>(
  (
    {
      sections,
      className,
      style,
      fontFamily = 'Inter, system-ui, sans-serif',
      header,
      footer,
      showProgress = true,
      debug = false,
      durations = { change: 0.7, snap: 800 },
      reduceMotion,
      currentIndex,
      onIndexChange,
      initialIndex = 0,
      colors = {
        text: 'rgba(245,245,245,0.94)',
        overlay: 'rgba(0,0,0,0.42)',
        pageBg: '#ffffff',
        stageBg: '#000000',
      },
      apiRef,
      ariaLabel = '프로젝트 쇼케이스',
    },
    forwardedRef,
  ) => {
    const total = sections.length
    const [localIndex, setLocalIndex] = useState(
      clamp(initialIndex, 0, Math.max(0, total - 1)),
    )
    const controlled = typeof currentIndex === 'number'
    const index = controlled
      ? clamp(currentIndex, 0, Math.max(0, total - 1))
      : localIndex

    const rootRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const backgroundRefs = useRef<(HTMLImageElement | null)[]>([])
    const previousIndexRef = useRef(index)
    const indexRef = useRef(index)
    const reduced =
      reduceMotion ??
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    useEffect(() => {
      indexRef.current = index
    }, [index])

    useEffect(() => {
      const section = sectionRef.current
      const scrollRoot = section?.closest<HTMLDivElement>('.icsa-wrap')
      if (!section || !scrollRoot || total === 0) return

      let frame = 0
      const update = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          const rootRect = scrollRoot.getBoundingClientRect()
          const sectionRect = section.getBoundingClientRect()
          const scrollableDistance = Math.max(1, sectionRect.height - rootRect.height)
          const progress = clamp((rootRect.top - sectionRect.top) / scrollableDistance, 0, 1)
          const nextIndex = Math.min(total - 1, Math.floor(progress * total))

          if (nextIndex !== indexRef.current) {
            indexRef.current = nextIndex
            if (!controlled) setLocalIndex(nextIndex)
            onIndexChange?.(nextIndex)
          }
        })
      }

      update()
      scrollRoot.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)
      return () => {
        cancelAnimationFrame(frame)
        scrollRoot.removeEventListener('scroll', update)
        window.removeEventListener('resize', update)
      }
    }, [controlled, onIndexChange, total])

    useEffect(() => {
      const from = previousIndexRef.current
      if (from === index) return
      const duration = reduced ? 0 : durations.change ?? 0.7
      const goingDown = index > from
      const previousBackground = backgroundRefs.current[from]
      const nextBackground = backgroundRefs.current[index]

      if (nextBackground) {
        gsap.fromTo(
          nextBackground,
          { opacity: 0, scale: 1.06, yPercent: goingDown ? 2 : -2 },
          { opacity: 1, scale: 1, yPercent: 0, duration, ease: 'power2.out' },
        )
      }
      if (previousBackground) {
        gsap.to(previousBackground, {
          opacity: 0,
          yPercent: goingDown ? -3 : 3,
          duration,
          ease: 'power2.out',
        })
      }
      previousIndexRef.current = index
    }, [durations.change, index, reduced])

    const goTo = (targetIndex: number) => {
      const section = sectionRef.current
      const scrollRoot = section?.closest<HTMLDivElement>('.icsa-wrap')
      if (!section || !scrollRoot || total === 0) return
      const target = clamp(targetIndex, 0, total - 1)
      const sectionRect = section.getBoundingClientRect()
      const rootRect = scrollRoot.getBoundingClientRect()
      const sectionTop = scrollRoot.scrollTop + sectionRect.top - rootRect.top
      const segment = (section.offsetHeight - scrollRoot.clientHeight) / total
      scrollRoot.scrollTo({
        top: sectionTop + segment * target + 2,
        behavior: reduced ? 'auto' : 'smooth',
      })
    }

    useImperativeHandle(apiRef, () => ({
      next: () => goTo(indexRef.current + 1),
      prev: () => goTo(indexRef.current - 1),
      goTo,
      getIndex: () => indexRef.current,
      refresh: () => window.dispatchEvent(new Event('resize')),
    }))

    const cssVariables = {
      '--fx-font': fontFamily,
      '--fx-text': colors.text ?? 'rgba(245,245,245,0.94)',
      '--fx-overlay': colors.overlay ?? 'rgba(0,0,0,0.42)',
      '--fx-page-bg': colors.pageBg ?? '#fff',
      '--fx-stage-bg': colors.stageBg ?? '#000',
    } as CSSProperties

    return (
      <div
        ref={(node) => {
          rootRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        className={['fx', className].filter(Boolean).join(' ')}
        style={{ ...cssVariables, ...style }}
        aria-label={ariaLabel}
      >
        {debug && <div className="fx-debug">Project: {index + 1}</div>}
        <div
          className="fx-fixed-section"
          ref={sectionRef}
          style={{ height: `${Math.max(1, total + 1) * 100}svh` }}
        >
          <div className="fx-fixed">
            <div className="fx-bgs" aria-hidden="true">
              {sections.map((item, itemIndex) => (
                <div className="fx-bg" key={item.id ?? itemIndex}>
                  {item.renderBackground ? (
                    item.renderBackground(index === itemIndex, false)
                  ) : (
                    <>
                      <img
                        ref={(node) => { backgroundRefs.current[itemIndex] = node }}
                        src={item.background}
                        alt=""
                        className="fx-bg-img"
                        style={{ opacity: itemIndex === initialIndex ? 1 : 0 }}
                      />
                      <div className="fx-bg-overlay" />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="fx-grid">
              {header && <div className="fx-header">{header}</div>}
              <div className="fx-content">
                <div className="fx-side fx-left" role="list" aria-label="프로젝트 분류">
                  {sections.map((item, itemIndex) => (
                    <button key={`left-${item.id ?? itemIndex}`} className={`fx-item ${itemIndex === index ? 'active' : ''}`} onClick={() => goTo(itemIndex)} type="button">
                      {item.leftLabel}
                    </button>
                  ))}
                </div>

                <div className="fx-center">
                  <div className="fx-featured active">
                    <a
                      href={sections[index]?.href ?? '#'}
                      className="fx-featured-link"
                      aria-label={`프로젝트 ${index + 1} 열기`}
                      onClick={(event) => {
                        const href = sections[index]?.href
                        if (!href || href === '#') event.preventDefault()
                      }}
                    >
                      <CircularText
                        text="VIEW PROJECT * VIEW WORK * "
                        onHover="speedUp"
                        spinDuration={20}
                      />
                      <span className="fx-open-project">View project ↗</span>
                    </a>
                  </div>
                </div>

                <div className="fx-side fx-right" role="list" aria-label="프로젝트 번호">
                  {sections.map((item, itemIndex) => (
                    <button key={`right-${item.id ?? itemIndex}`} className={`fx-item ${itemIndex === index ? 'active' : ''}`} onClick={() => goTo(itemIndex)} type="button">
                      {item.rightLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fx-footer">
                {footer && <div className="fx-footer-title">{footer}</div>}
                {showProgress && (
                  <div className="fx-progress">
                    <div className="fx-progress-numbers">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{String(total).padStart(2, '0')}</span>
                    </div>
                    <div className="fx-progress-bar">
                      <div className="fx-progress-fill" style={{ width: `${(index / Math.max(1, total - 1)) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .fx { width: 100%; overflow: clip; background: var(--fx-page-bg); font-family: var(--fx-font); text-transform: uppercase; }
          .fx-debug { position: fixed; right: 10px; bottom: 10px; z-index: 9999; border-radius: 4px; background: #fffc; padding: 6px 8px; color: #000; font: 12px/1 monospace; }
          .fx-fixed-section { position: relative; }
          .fx-fixed { position: sticky; top: 0; width: 100%; height: 100svh; overflow: hidden; background: var(--fx-stage-bg); }
          .fx-bgs, .fx-bg, .fx-bg-img, .fx-bg-overlay { position: absolute; inset: 0; }
          .fx-bgs { z-index: 1; background: var(--fx-stage-bg); }
          .fx-bg-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.82); will-change: transform, opacity; }
          .fx-bg-overlay { background: var(--fx-overlay); }
          .fx-grid { position: relative; z-index: 2; display: grid; height: 100%; grid-template-rows: auto 1fr auto; padding: 5vh clamp(1rem,4vw,4rem); }
          .fx-header { color: var(--fx-text); text-align: center; font-size: clamp(1.7rem,6vw,5.5rem); font-weight: 900; line-height: .9; }
          .fx-content { display: grid; grid-template-columns: 1fr 1.6fr 1fr; align-items: center; gap: 2rem; }
          .fx-side { display: flex; max-height: 52vh; flex-direction: column; justify-content: center; gap: .8rem; }
          .fx-right { align-items: flex-end; }
          .fx-item { appearance: none; border: 0; background: transparent; color: var(--fx-text); cursor: pointer; font: inherit; font-size: clamp(.75rem,1.5vw,1.15rem); font-weight: 800; opacity: .35; transition: opacity .3s, transform .3s; }
          .fx-left .fx-item { text-align: left; }
          .fx-right .fx-item { text-align: right; }
          .fx-item.active { opacity: 1; transform: translateX(8px); }
          .fx-right .fx-item.active { transform: translateX(-8px); }
          .fx-center { position: relative; display: grid; min-height: 50vh; place-items: center; overflow: hidden; text-align: center; }
          .fx-featured { position: absolute; visibility: hidden; opacity: 0; }
          .fx-featured.active { visibility: visible; opacity: 1; }
          .fx-featured-link { position: relative; display: grid; place-items: center; color: var(--fx-text); text-decoration: none; }
          .fx-featured-title { margin: 0; color: var(--fx-text); font-size: clamp(2.8rem,8vw,7rem); font-weight: 900; letter-spacing: -.05em; line-height: .9; }
          .fx-open-project { position: absolute; inset: 50% auto auto 50%; transform: translate(-50%,-50%); white-space: nowrap; font-size: .6rem; font-weight: 800; letter-spacing: .1em; }
          .fx-footer { align-self: end; text-align: center; }
          .fx-footer-title { color: var(--fx-text); font-size: clamp(1rem,3vw,2.5rem); font-weight: 800; }
          .fx-progress { position: relative; width: min(240px,60vw); margin: 1.8rem auto 0; }
          .fx-progress-numbers { display: flex; justify-content: space-between; margin-bottom: .55rem; color: var(--fx-text); font-size: .75rem; }
          .fx-progress-bar { position: relative; height: 2px; background: rgba(245,245,245,.28); }
          .fx-progress-fill { position: absolute; inset: 0 auto 0 0; height: 100%; background: var(--fx-text); transition: width .35s ease; }
          @media (max-width: 760px) {
            .fx-grid { padding-block: 4vh; }
            .fx-content { grid-template-columns: 1fr; }
            .fx-side { position: absolute; bottom: 16vh; max-height: none; flex-direction: row; gap: .55rem; }
            .fx-left { left: 1rem; }
            .fx-right { right: 1rem; }
            .fx-item { font-size: .65rem; }
            .fx-item:not(.active) { display: none; }
            .fx-center { min-height: 55vh; }
          }
        `}</style>
      </div>
    )
  },
)

FullScreenScrollFX.displayName = 'FullScreenScrollFX'
