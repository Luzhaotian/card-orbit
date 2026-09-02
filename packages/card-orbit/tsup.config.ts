import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsup'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  {
    // Browser build for direct <script> usage: window.CardOrbit.
    // react / react/jsx-runtime are aliased to src/browser shims that read
    // the global React (host page loads a UMD React first, e.g. 18.3.x),
    // so the output is self-contained — no imports, no requires.
    entry: { 'card-orbit.iife': 'src/index.ts' },
    format: ['iife'],
    globalName: 'CardOrbit',
    sourcemap: true,
    clean: false,
    outExtension: () => ({ js: '.js' }),
    esbuildOptions: (options) => {
      options.alias = {
        react: join(root, 'src/browser/react.ts'),
        'react/jsx-runtime': join(root, 'src/browser/jsx-runtime.ts'),
      }
    },
  },
])
