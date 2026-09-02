import Link from 'next/link'
import { effects } from '@/lib/effects'
import { CardOrbitPreview } from '@/components/effects/card-orbit-preview'

function EffectPreview({ id }: { id: string }) {
  if (id === 'card-orbit') return <CardOrbitPreview />
  return (
    <div className="flex aspect-[16/10] items-center justify-center bg-fd-muted text-sm text-fd-muted-foreground">
      预览
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="fx-grid flex-1">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 lg:py-20">
        <header className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--fx-accent-deep)] uppercase">
            fxshelf
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-fd-foreground sm:text-5xl">
            动效书架
          </h1>
          <p className="mt-4 text-base leading-relaxed text-fd-muted-foreground sm:text-lg">
            浏览可直接使用的动效包。每张卡片都有 live demo、简介与安装说明 —— 按需安装，不必整包引入。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center rounded-lg bg-fd-foreground px-4 py-2 text-sm font-medium text-fd-background transition hover:opacity-90"
            >
              阅读文档
            </Link>
            <Link
              href="/docs/effects/card-orbit"
              className="inline-flex items-center rounded-lg border border-fd-border bg-fd-background/70 px-4 py-2 text-sm font-medium text-fd-foreground transition hover:bg-fd-accent"
            >
              打开 Card Orbit
            </Link>
          </div>
        </header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {effects.map((effect) => (
            <li key={effect.id}>
              <Link
                href={effect.docPath}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-background/80 shadow-sm transition hover:border-fd-foreground/20 hover:shadow-md"
              >
                <div className="overflow-hidden border-b border-fd-border">
                  <EffectPreview id={effect.id} />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-lg font-semibold tracking-tight">{effect.title}</h2>
                    <span className="text-xs font-medium text-[var(--fx-accent)] opacity-0 transition group-hover:opacity-100">
                      查看 →
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-fd-muted-foreground">{effect.blurb}</p>
                  <code className="mt-auto pt-2 text-[11px] text-fd-muted-foreground">
                    {effect.packageName}
                  </code>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
