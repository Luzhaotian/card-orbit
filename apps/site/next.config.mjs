import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

// GitHub project Pages: https://<user>.github.io/<repo>/
// Repo should be named `fxshelf` so basePath is `/fxshelf`.
// Override with BASE_PATH if needed.
const basePath =
  process.env.BASE_PATH?.replace(/\/$/, '') ||
  (process.env.GITHUB_PAGES === 'true' ? '/fxshelf' : '')

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  transpilePackages: ['@fxshelf/card-orbit'],
  turbopack: {
    resolveAlias: {
      '@fxshelf/card-orbit': '../../packages/card-orbit/src/index.ts',
      '@fxshelf/card-orbit/styles.css': '../../packages/card-orbit/src/core/styles.css',
    },
  },
}

export default withMDX(config)
