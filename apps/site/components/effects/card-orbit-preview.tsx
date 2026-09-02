'use client'

import { useMemo } from 'react'
import { CardOrbit } from '@fxshelf/card-orbit'
import '@fxshelf/card-orbit/styles.css'

function useHeroImages() {
  return useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
    return Array.from({ length: 7 }, (_, i) => `${base}/heroimg${i + 1}.webp`)
  }, [])
}

export function CardOrbitPreview() {
  const images = useHeroImages()

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-[#f0eeea]">
      <div className="pointer-events-none absolute inset-0 origin-center scale-[0.55] opacity-90">
        <CardOrbit images={images} desktopOnly={false} ariaLabel="Card Orbit preview" />
      </div>
    </div>
  )
}
