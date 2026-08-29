import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root,
  publicDir: path.join(root, 'public'),
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
