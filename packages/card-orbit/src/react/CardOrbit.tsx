'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { createOrbit } from '../core/createOrbit'
import {
  DEFAULT_ACTIVE_WINDOW,
  DEFAULT_AUTO_SPEED,
  DEFAULT_DRAG_SENSITIVITY,
  DEFAULT_PERSPECTIVE,
  cardTransformStyle,
  samplePath,
} from '../core/path'
import '../core/styles.css'

export type CardOrbitProps = {
  /** Image URLs to place on the path (order = phase offset). */
  images: string[]
  /** Optional alt text per image; falls back to `Card ${i + 1}`. */
  alts?: string[]
  className?: string
  style?: CSSProperties
  stageClassName?: string
  cardClassName?: string
  imageClassName?: string
  /** Auto-advance rate when not dragging. Default `45e-6`. */
  autoSpeed?: number
  /** Pointer scrub sensitivity. Default `8e-4`. */
  dragSensitivity?: number
  /** Visible phase window in `(0, 1)`. Default `0.72`. */
  activeWindow?: number
  /** CSS perspective in px. Default `3400`. */
  perspective?: number
  ariaLabel?: string
  /**
   * Hide below `lg` (1024px) with built-in CSS.
   * Pair with `CardOrbitMobile` for narrow screens. Default `true`.
   */
  desktopOnly?: boolean
}

export function CardOrbit({
  images,
  alts,
  className,
  style,
  stageClassName,
  cardClassName,
  imageClassName,
  autoSpeed = DEFAULT_AUTO_SPEED,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  activeWindow = DEFAULT_ACTIVE_WINDOW,
  perspective = DEFAULT_PERSPECTIVE,
  ariaLabel = 'Card orbit carousel',
  desktopOnly = true,
}: CardOrbitProps) {
  const [progress, setProgress] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<ReturnType<typeof createOrbit> | null>(null)

  const hasImages = images.length > 0

  useEffect(() => {
    if (!hasImages) return
    const node = rootRef.current
    if (!node) return

    const orbit = createOrbit({
      onProgress: setProgress,
    })
    orbitRef.current = orbit
    orbit.attach(node)
    return () => {
      orbit.destroy()
      orbitRef.current = null
    }
  }, [hasImages])

  useEffect(() => {
    orbitRef.current?.setOptions({ autoSpeed, dragSensitivity })
  }, [autoSpeed, dragSensitivity])

  if (!hasImages) return null

  const rootClass = [
    'card-orbit',
    desktopOnly ? 'card-orbit--desktop-only' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={rootRef}
      className={rootClass}
      style={{ perspective: `${perspective}px`, ...style }}
      aria-label={ariaLabel}
    >
      <div
        className={['card-orbit__stage', stageClassName].filter(Boolean).join(' ')}
      >
        {images.map((src, index) => {
          const phase = (index / images.length + progress) % 1
          const active = phase > 0 && phase < activeWindow
          const local = active ? phase / activeWindow : 0
          const point = samplePath(local, active)

          return (
            <figure
              key={`${src}-${index}`}
              className={['card-orbit__card', cardClassName].filter(Boolean).join(' ')}
              style={cardTransformStyle(point)}
            >
              <img
                src={src}
                alt={alts?.[index] ?? `Card ${index + 1}`}
                width={1200}
                height={780}
                className={['card-orbit__image', imageClassName].filter(Boolean).join(' ')}
                draggable={false}
                decoding="async"
              />
            </figure>
          )
        })}
      </div>
    </div>
  )
}
