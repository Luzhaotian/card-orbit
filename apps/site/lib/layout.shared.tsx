import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { FxshelfLogo } from '@/components/brand/fxshelf-logo'
import { gitConfig } from './shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <FxshelfLogo />,
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
