'use client'

import { GlyphRain } from '@fxshelf/glyph-rain'

export function GlyphRainDemo() {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border bg-[#07090f]">
      <GlyphRain
        className="h-[min(52vh,440px)] w-full"
        density={0.18}
        glow={1.9}
        stir={0.85}
        layers={2}
        color={[0.267, 0.455, 1]}
        headColor={[0.55, 0.78, 1]}
      >
        <div className="flex h-full min-h-[min(52vh,440px)] flex-col justify-end gap-3 bg-[radial-gradient(ellipse_at_30%_20%,#1a2744_0%,#07090f_55%)] px-6 py-8 sm:px-10">
          <p className="max-w-md font-serif text-2xl leading-snug tracking-tight text-white/90 sm:text-3xl">
            Glyphs rain. Cursor stirs the stream.
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            WebGL2 overlay · optional html-in-canvas lighting · zero Framer /
            GSAP.
          </p>
        </div>
      </GlyphRain>
    </div>
  )
}
