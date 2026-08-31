// Browser (<script>) build only.
// React UMD globals (up to 18.x) do not expose jsx/jsxs, so the automatic
// JSX runtime is rebuilt on top of createElement. Children already live in
// props there, so passing props straight through is equivalent to
// jsx(type, props, key).
import { createElement, Fragment } from './react'
import type { ElementType, Key, ReactElement } from 'react'

export { Fragment }

type CreateElement = (type: ElementType, props?: unknown) => ReactElement

export function jsx(
  type: ElementType,
  props: unknown,
  key?: Key,
): ReactElement {
  const create = createElement as unknown as CreateElement
  return key === undefined
    ? create(type, props)
    : create(type, { ...(props as Record<string, unknown>), key })
}

export const jsxs = jsx
