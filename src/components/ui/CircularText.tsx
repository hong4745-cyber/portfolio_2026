import { useEffect } from 'react'
import { motion, useAnimation, useMotionValue, type Transition } from 'motion/react'
import './CircularText.css'

type HoverBehavior = 'slowDown' | 'speedUp' | 'pause' | 'goBonkers'

interface CircularTextProps {
  text?: string
  spinDuration?: number
  onHover?: HoverBehavior
  className?: string
}

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0,
})

const getTransition = (duration: number, from: number): Transition => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
})

export default function CircularText({
  text = '',
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
}: CircularTextProps) {
  const letters = Array.from(text)
  const controls = useAnimation()
  const rotation = useMotionValue(0)

  useEffect(() => {
    const start = rotation.get()
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    })
  }, [spinDuration, text, onHover, controls, rotation])

  const handleHoverStart = () => {
    const start = rotation.get()
    let transition: Transition
    let scale = 1

    switch (onHover) {
      case 'slowDown':
        transition = getTransition(spinDuration * 2, start)
        break
      case 'pause':
        transition = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 },
        }
        break
      case 'goBonkers':
        transition = getTransition(spinDuration / 20, start)
        scale = 0.8
        break
      case 'speedUp':
      default:
        transition = getTransition(spinDuration / 4, start)
    }

    controls.start({ rotate: start + 360, scale, transition })
  }

  const handleHoverEnd = () => {
    const start = rotation.get()
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    })
  }

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, index) => {
        const rotationDeg = (360 / Math.max(1, letters.length)) * index
        const factor = Math.PI / Math.max(1, letters.length)
        const offset = factor * index
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${offset}px, ${offset}px, 0)`

        return (
          <span key={`${letter}-${index}`} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        )
      })}
    </motion.div>
  )
}
