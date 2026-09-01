import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './CurvedLoop.css'

export default function CurvedLoop({ marqueeText = '', speed = 2, className, curveAmount = 400, direction = 'left', interactive = true }) {
  const text = useMemo(() => `${marqueeText.replace(/\s+$/, '')}\u00A0`, [marqueeText])
  const measureRef = useRef(null)
  const textPathRef = useRef(null)
  const [spacing, setSpacing] = useState(0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const pathId = `curve-${useId().replace(/:/g, '')}`
  const dragRef = useRef(false)
  const lastXRef = useRef(0)
  const directionRef = useRef(direction)
  const velocityRef = useRef(0)
  const totalText = spacing ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join('') : text
  const ready = spacing > 0

  useEffect(() => { if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength()) }, [text, className])
  useEffect(() => {
    if (!spacing || !textPathRef.current) return
    textPathRef.current.setAttribute('startOffset', `${-spacing}px`)
    setOffset(-spacing)
  }, [spacing])
  useEffect(() => {
    if (!spacing || !ready) return undefined
    let frame = 0
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const current = Number.parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
        let next = current + (directionRef.current === 'right' ? speed : -speed)
        if (next <= -spacing) next += spacing
        if (next > 0) next -= spacing
        textPathRef.current.setAttribute('startOffset', `${next}px`)
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [spacing, speed, ready])

  const move = (event) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return
    const delta = event.clientX - lastXRef.current
    lastXRef.current = event.clientX
    velocityRef.current = delta
    const current = Number.parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
    let next = current + delta
    if (next <= -spacing) next += spacing
    if (next > 0) next -= spacing
    textPathRef.current.setAttribute('startOffset', `${next}px`)
  }
  const endDrag = () => {
    if (!interactive) return
    dragRef.current = false
    setDragging(false)
    directionRef.current = velocityRef.current > 0 ? 'right' : 'left'
  }

  return (
    <div className="curved-loop-jacket" style={{ visibility: ready ? 'visible' : 'hidden', cursor: interactive ? (dragging ? 'grabbing' : 'grab') : 'auto' }} onPointerDown={(event) => { if (!interactive) return; dragRef.current = true; setDragging(true); lastXRef.current = event.clientX; velocityRef.current = 0; event.currentTarget.setPointerCapture(event.pointerId) }} onPointerMove={move} onPointerUp={endDrag} onPointerCancel={endDrag}>
      <svg className="curved-loop-svg" viewBox="0 0 1440 120" aria-label={marqueeText}>
        <text ref={measureRef} xmlSpace="preserve" className={className} style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>{text}</text>
        <defs><path id={pathId} d={`M-100,40 Q500,${40 + curveAmount} 1540,40`} fill="none" stroke="transparent" /></defs>
        {ready && <text fontWeight="bold" xmlSpace="preserve" className={className}><textPath ref={textPathRef} href={`#${pathId}`} startOffset={`${offset}px`} xmlSpace="preserve">{totalText}</textPath></text>}
      </svg>
    </div>
  )
}
