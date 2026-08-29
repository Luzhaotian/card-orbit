'use client'

import type { CSSProperties } from 'react'
import '../core/styles.css'

export type CardOrbitMobileProps = {
  images: string[]
  alts?: string[]
  className?: string
  style?: CSSProperties
  trackClassName?: string
  cardClassName?: string
  imageClassName?: string
  /**
   * Hide at `lg` and up (pair with desktop `CardOrbit`).
   * Default `true`.
   */
  hideOnDesktop?: boolean
  /** Marquee duration in seconds. Default `28`. */
  durationSec?: number
}

export function CardOrbitMobile({
  images,
  alts,
  className,
  style,
  trackClassName,
  cardClassName,
  imageClassName,
  hideOnDesktop = true,
  durationSec = 28,
}: CardOrbitMobileProps) {
  if (images.length === 0) return null

  const loop = [...images, ...images]

  const rootClass = [
    'card-orbit-mobile',
    hideOnDesktop ? 'card-orbit-mobile--desktop-hide' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass} style={style}>
      <div
        className={['card-orbit-mobile__track', trackClassName].filter(Boolean).join(' ')}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {loop.map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className={['card-orbit-mobile__card', cardClassName].filter(Boolean).join(' ')}
          >
            <img
              src={src}
              alt={alts?.[i % images.length] ?? ''}
              className={['card-orbit-mobile__image', imageClassName]
                .filter(Boolean)
                .join(' ')}
              draggable={false}
            />
          </figure>
        ))}
      </div>
    </div>
  )
}
