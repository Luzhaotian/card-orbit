'use client'

import { GlyphRain } from '@fxshelf/glyph-rain'

export function GlyphRainPreview() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-[#07090f]">
      <div className="pointer-events-none absolute inset-0">
        <GlyphRain
          className="h-full w-full"
          density={0.22}
          glow={2}
          stir={0}
          layers={2}
          speed={0.28}
          color={[0.267, 0.455, 1]}
          headColor={[0.55, 0.78, 1]}
        >
          <div className="flex h-full min-h-full flex-col justify-end gap-1.5 bg-[radial-gradient(ellipse_at_35%_15%,#1a2744_0%,#07090f_60%)] px-4 py-4 sm:px-5 sm:py-5">
            <p className="text-[11px] font-medium tracking-[0.16em] text-sky-300/70 uppercase">
              Glyph Rain
            </p>
            <p className="max-w-[14rem] text-sm leading-snug font-medium text-white/85 sm:text-[15px]">
              字符雨倾泻，光标搅动气流。
            </p>
          </div>
        </GlyphRain>
      </div>
    </div>
  )
}
