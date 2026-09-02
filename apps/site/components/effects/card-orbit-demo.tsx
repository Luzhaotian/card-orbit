'use client'

import { useMemo } from 'react'
import { CardOrbit, CardOrbitMobile } from '@fxshelf/card-orbit'
import '@fxshelf/card-orbit/styles.css'

function useHeroImages() {
  return useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
    return Array.from({ length: 7 }, (_, i) => `${base}/heroimg${i + 1}.webp`)
  }, [])
}

export function CardOrbitDemo() {
  const images = useHeroImages()

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border bg-fd-background/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:px-8 lg:py-10">
        <div className="min-w-0">
          <p className="font-serif text-xl leading-snug tracking-tight text-fd-foreground sm:text-2xl">
            路径约束的 3D 卡片 —— 升起、弧线、飞出。
          </p>
          <p className="mt-3 text-[15px] font-medium text-[var(--fx-accent)]">
            按住拖动可 scrub，卡片不会离开轨道。
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-fd-muted-foreground">
            手写 requestAnimationFrame 与分段 cos/sin 路径，不依赖 Framer Motion / GSAP。
          </p>
          <CardOrbitMobile images={images} />
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <CardOrbit images={images} />
        </div>
      </div>
    </div>
  )
}
