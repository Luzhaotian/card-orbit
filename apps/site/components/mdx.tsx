import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { CardOrbitDemo } from '@/components/effects/card-orbit-demo'
import { CardOrbitPathLab } from '@/components/effects/card-orbit-path'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    CardOrbitDemo,
    CardOrbitPathLab,
    ...components,
  } as MDXComponents
}

export const useMDXComponents = getMDXComponents
