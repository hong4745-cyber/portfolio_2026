import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './DepthCarousel.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const normalizeItem = (item) => typeof item === 'string' ? { image: item, alt: '' } : item

export default function DepthCarousel({
  items = [], cardWidth = 300, cardHeight = 380, radius = 18, tint = '#05060a',
  depth = 220, spread = 90, tilt = 22, tiltDirection = 'right', perspective = 1400,
  visibleCards = 4, falloff = 0.2, blur = 6, duration = 700, ease = 'power3.out',
  autoplay = false, autoplayDelay = 3200, loop = true, showControls = true,
  showIndicators = true, onChange, className = '',
}) {
  const data = useMemo(() => (Array.isArray(items) ? items : []).map(normalizeItem), [items])
  const count = data.length
  const rootRef = useRef(null)
  const cardRefs = useRef([])
  const overlayRefs = useRef([])
  const posRef = useRef(0)
  const focusRef = useRef(0)
  const tweenRef = useRef(null)
  const scaleRef = useRef(1)
  const dragRef = useRef(null)
  const wheelTimerRef = useRef(null)
  const wheelLockedRef = useRef(false)
  const autoTimerRef = useRef(null)
  const reducedRef = useRef(false)
  const cfgRef = useRef({ count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, duration, ease, loop, cardWidth, autoplayDelay })
  const onChangeRef = useRef(onChange)
  const [active, setActive] = useState(0)

  useEffect(() => {
    onChangeRef.current = onChange
    cfgRef.current = { count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, duration, ease, loop, cardWidth, autoplayDelay }
  }, [onChange, count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, duration, ease, loop, cardWidth, autoplayDelay])

  const layout = useCallback((position) => {
    const cfg = cfgRef.current
    if (!cfg.count) return
    const direction = cfg.tiltDirection === 'left' ? -1 : 1
    for (let index = 0; index < cfg.count; index += 1) {
      const card = cardRefs.current[index]
      if (!card) continue
      let distance = index - position
      if (cfg.loop && cfg.count > 1) {
        distance = ((distance % cfg.count) + cfg.count) % cfg.count
        if (distance > cfg.count / 2) distance -= cfg.count
      }
      const back = Math.max(0, distance)
      const visible = Math.abs(distance) <= cfg.visibleCards + 0.5
      const opacity = visible ? (distance < 0 ? Math.max(0, 1 + distance) : 1) : 0
      const translateX = direction * cfg.spread * distance
      const translateZ = -cfg.depth * distance
      const rotateY = direction * cfg.tilt * clamp(distance, 0, 1)
      const brightness = Math.max(0.15, 1 - back * cfg.falloff)
      const blurAmount = cfg.blur > 0 ? Math.min(cfg.blur, back / Math.max(1, cfg.visibleCards) * cfg.blur) : 0
      card.style.transform = `translate(-50%, -50%) scale(${scaleRef.current}) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`
      card.style.opacity = String(opacity)
      card.style.filter = `brightness(${brightness}) blur(${blurAmount}px)`
      card.style.zIndex = String(Math.round(2000 - distance * 20))
      card.style.pointerEvents = visible && opacity > 0.05 ? 'auto' : 'none'
      if (overlayRefs.current[index]) overlayRefs.current[index].style.opacity = String(clamp(back * cfg.falloff * 1.25, 0, 0.86))
    }
  }, [])

  const tweenTo = useCallback((target, animate) => {
    tweenRef.current?.kill()
    const cfg = cfgRef.current
    const proxy = { position: posRef.current }
    tweenRef.current = gsap.to(proxy, {
      position: target,
      duration: animate && !reducedRef.current ? cfg.duration / 1000 : 0,
      ease: cfg.ease,
      onUpdate: () => { posRef.current = proxy.position; layout(proxy.position) },
      onComplete: () => {
        if (cfg.count) posRef.current = ((posRef.current % cfg.count) + cfg.count) % cfg.count
        layout(posRef.current)
      },
    })
  }, [layout])

  const setFocus = useCallback((rawIndex, animate = true) => {
    const cfg = cfgRef.current
    if (!cfg.count) return
    const index = cfg.loop ? ((rawIndex % cfg.count) + cfg.count) % cfg.count : clamp(rawIndex, 0, cfg.count - 1)
    let delta = index - posRef.current
    if (cfg.loop && cfg.count > 1) {
      delta = ((delta % cfg.count) + cfg.count) % cfg.count
      if (delta > cfg.count / 2) delta -= cfg.count
    }
    tweenTo(posRef.current + delta, animate)
    if (index !== focusRef.current) {
      focusRef.current = index
      setActive(index)
      onChangeRef.current?.(index, data[index])
    }
  }, [data, tweenTo])

  const navigateBy = useCallback((step) => setFocus(focusRef.current + step), [setFocus])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const observer = new ResizeObserver(([entry]) => {
      const needed = cfgRef.current.cardWidth + Math.abs(cfgRef.current.spread) * 2 + 120
      scaleRef.current = clamp(entry.contentRect.width / needed, 0.4, 1)
      layout(posRef.current)
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [layout])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const scrollRoot = root.closest('.icsa-wrap') || root
    const onWheel = (event) => {
      if (cfgRef.current.count < 2) return
      const carouselRect = root.getBoundingClientRect()
      const viewportRect = scrollRoot === root
        ? { top: 0, bottom: window.innerHeight, height: window.innerHeight }
        : scrollRoot.getBoundingClientRect()
      const activationTop = viewportRect.top + viewportRect.height * 0.2
      const activationBottom = viewportRect.bottom - viewportRect.height * 0.2
      if (carouselRect.bottom < activationTop || carouselRect.top > activationBottom) return
      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (Math.abs(raw) < 2) return
      const atFirst = focusRef.current <= 0
      const atLast = focusRef.current >= cfgRef.current.count - 1
      if ((!cfgRef.current.loop && raw < 0 && atFirst) || (!cfgRef.current.loop && raw > 0 && atLast)) return
      event.preventDefault()
      if (wheelLockedRef.current) return
      wheelLockedRef.current = true
      tweenRef.current?.kill()
      navigateBy(raw > 0 ? 1 : -1)
      clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => { wheelLockedRef.current = false }, Math.max(cfgRef.current.duration * 0.75, 280))
    }
    scrollRoot.addEventListener('wheel', onWheel, { passive: false })
    return () => { scrollRoot.removeEventListener('wheel', onWheel); clearTimeout(wheelTimerRef.current) }
  }, [navigateBy])

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!autoplay || reducedRef.current || count < 2) return undefined
    autoTimerRef.current = window.setInterval(() => navigateBy(1), Math.max(autoplayDelay, 600))
    return () => clearInterval(autoTimerRef.current)
  }, [autoplay, autoplayDelay, count, navigateBy])

  useEffect(() => { layout(posRef.current) }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, count])
  useEffect(() => () => { tweenRef.current?.kill(); clearTimeout(wheelTimerRef.current); clearInterval(autoTimerRef.current) }, [])

  const onPointerDown = (event) => {
    tweenRef.current?.kill()
    dragRef.current = { x: event.clientX, start: posRef.current, id: event.pointerId, moved: false }
  }
  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (!drag) return
    const delta = event.clientX - drag.x
    if (Math.abs(delta) > 4) { drag.moved = true; rootRef.current?.setPointerCapture(drag.id) }
    if (!drag.moved) return
    posRef.current = drag.start - delta / Math.max(cardWidth * 0.55 * scaleRef.current, 40)
    layout(posRef.current)
  }
  const onPointerEnd = () => { if (dragRef.current?.moved) setFocus(Math.round(posRef.current)); dragRef.current = null }

  return (
    <div ref={rootRef} className={`depth-carousel ${className}`.trim()} style={{ '--dc-perspective': `${perspective}px` }} role="group" aria-roledescription="carousel" aria-label="Project carousel" tabIndex={0} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onKeyDown={(event) => { if (event.key === 'ArrowLeft') navigateBy(-1); if (event.key === 'ArrowRight') navigateBy(1) }}>
      <div className="depth-carousel__stage">
        {data.map((item, index) => (
          <div key={item.image} className="depth-carousel__card" ref={(element) => { cardRefs.current[index] = element }} style={{ width: cardWidth, height: cardHeight, borderRadius: radius }} aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} aria-hidden={active !== index} onClick={() => setFocus(index)}>
            <img className="depth-carousel__img" src={item.image} alt={item.alt || ''} draggable={false} />
            <span className="depth-carousel__tint" ref={(element) => { overlayRefs.current[index] = element }} style={{ background: tint }} />
          </div>
        ))}
      </div>
      {showControls && count > 1 && <><button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" aria-label="Previous slide" onClick={() => navigateBy(-1)}>‹</button><button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" aria-label="Next slide" onClick={() => navigateBy(1)}>›</button></>}
      {showIndicators && count > 1 && <div className="depth-carousel__dots" role="tablist" aria-label="Slides">{data.map((item, index) => <button key={item.image} type="button" role="tab" aria-selected={active === index} aria-label={`Go to slide ${index + 1}`} className={`depth-carousel__dot${active === index ? ' is-active' : ''}`} onClick={() => setFocus(index)} />)}</div>}
    </div>
  )
}
