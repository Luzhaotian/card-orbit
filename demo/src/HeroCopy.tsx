export function HeroCopy() {
  return (
    <div className="relative z-10 flex min-w-0 flex-col lg:min-h-0 lg:justify-center">
      <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#ff6b00]/35 bg-[#ff6b00]/[0.08] px-3 py-1.5 text-[12px] font-medium tracking-tight text-[#cc5400] sm:text-[13px]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6b00]/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
        </span>
        Hero path carousel demo
      </span>

      <h1 className="text-[44px] leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl lg:leading-[0.95]">
        Card Orbit
      </h1>

      <p
        className="mt-4 max-w-xl text-xl leading-snug font-normal tracking-tight text-neutral-800 sm:mt-5 sm:text-3xl sm:leading-tight"
        style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
      >
        Path-constrained 3D cards — rise, arc, exit.
      </p>

      <p className="mt-3 text-[15px] font-medium text-[#ff6b00] sm:mt-4 sm:text-lg">
        Drag to scrub. Cards never leave the track.
      </p>

      <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-neutral-600 sm:mt-6 sm:text-base">
        Recreated from tasteskill.dev: custom requestAnimationFrame progress, piecewise
        cos/sin path, no Framer Motion drag. Hover the stage and drag with a grab cursor.
      </p>
    </div>
  )
}
