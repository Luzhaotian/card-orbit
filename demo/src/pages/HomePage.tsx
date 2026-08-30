import { CardOrbit, CardOrbitMobile } from 'card-orbit'
import 'card-orbit/styles.css'
import { HeroCopy } from '../HeroCopy'

const IMAGES = Array.from(
  { length: 7 },
  (_, i) => `${import.meta.env.BASE_URL}heroimg${i + 1}.webp`,
)

export function HomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col lg:h-[100dvh] lg:overflow-hidden">
      <section
        className="relative flex w-full flex-1 flex-col overflow-hidden text-[#0a0a0a] lg:min-h-0 lg:overflow-y-auto"
        aria-label="Introduction"
      >
        <div className="pointer-events-none absolute -left-24 bottom-0 z-0 h-64 w-64 rounded-full bg-[#ff6b00]/[0.05] blur-3xl" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:h-full lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-1 lg:items-stretch lg:gap-12 lg:px-8 lg:pt-24 lg:pb-10">
          <div className="relative z-10 flex min-w-0 flex-col lg:min-h-0 lg:justify-center lg:overflow-y-visible lg:py-0">
            <HeroCopy />
            <CardOrbitMobile images={IMAGES} />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center justify-center lg:h-full lg:min-h-0 lg:max-w-none lg:self-stretch">
            <CardOrbit images={IMAGES} />
          </div>
        </div>
      </section>
    </div>
  )
}
