// Browser (<script>) build only.
// Reads React from the global scope — the host page must load a UMD build
// of React first (e.g. react@18.3.x; React 19 ships no UMD build).
// Wired in via `esbuildOptions.alias` in tsup.config.ts for the IIFE build.
// Not published: npm users consume dist/, copy-as-source users have a bundler.
import type * as ReactModule from 'react'

type ReactGlobal = typeof ReactModule

const globalReact = (globalThis as { React?: ReactGlobal }).React

if (!globalReact) {
  throw new Error(
    '[card-orbit] browser build: global "React" not found. ' +
      'Load a UMD build of React (react@18.3.x) before card-orbit.',
  )
}

// Keep in sync with the hooks used by the src/react components.
export const Fragment = globalReact.Fragment
export const createElement = globalReact.createElement
export const useEffect = globalReact.useEffect
export const useRef = globalReact.useRef
export const useState = globalReact.useState
