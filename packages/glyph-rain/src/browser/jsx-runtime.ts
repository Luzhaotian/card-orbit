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
