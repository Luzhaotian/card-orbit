import type { ElementImageContext, PaintableCanvas } from './types'

/** True when Chrome's experimental html-in-canvas APIs are available. */
export function supportsHtmlInCanvas(): boolean {
  if (typeof document === 'undefined') return false
  const probe = document.createElement('canvas') as PaintableCanvas
  const ctx = probe.getContext('2d') as ElementImageContext | null
  return Boolean(
    ctx &&
      typeof ctx.drawElementImage === 'function' &&
      typeof probe.requestPaint === 'function',
  )
}
