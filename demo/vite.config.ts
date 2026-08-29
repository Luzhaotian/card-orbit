import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

// Project Pages: https://luzhaotian.github.io/card-orbit/
const base = process.env.GITHUB_PAGES === 'true' ? '/card-orbit/' : '/'

export default defineConfig({
  root,
  base,
  publicDir: path.join(root, 'public'),
  build: {
    outDir: path.join(root, 'dist'),
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    // More-specific alias must come first — object form can prefix-replace
    // `card-orbit` and turn `card-orbit/styles.css` into `index.ts/styles.css`.
    alias: [
      {
        find: /^card-orbit\/styles\.css$/,
        replacement: path.resolve(root, '../src/core/styles.css'),
      },
      {
        find: /^card-orbit$/,
        replacement: path.resolve(root, '../src/index.ts'),
      },
    ],
  },
  server: {
    fs: {
      allow: [path.resolve(root, '..')],
    },
  },
})
