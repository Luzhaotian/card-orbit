import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { appName, gitConfig } from './shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-fd-foreground text-[10px] font-semibold text-fd-background">
            FX
          </span>
          <span className="font-semibold tracking-tight">{appName}</span>
        </>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: 'Card Orbit',
        url: '/docs/effects/card-orbit',
        active: 'nested-url',
      },
      {
        text: 'npm',
        url: 'https://www.npmjs.com/package/@fxshelf/card-orbit',
        external: true,
      },
    ],
  }
}
