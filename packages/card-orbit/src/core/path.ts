export const RISE = 280
export const ARC = (Math.PI / 2) * 90
export const EXIT = 240
export const PATH_LEN = RISE + ARC + EXIT
export const F = RISE / PATH_LEN
export const G = (RISE + ARC) / PATH_LEN

export const DEFAULT_ACTIVE_WINDOW = 0.72
export const DEFAULT_AUTO_SPEED = 45e-6
export const DEFAULT_DRAG_SENSITIVITY = 8e-4
export const DEFAULT_PERSPECTIVE = 3400

export type PathPoint = {
  x: number
  y: number
  depth: number
  fade: number
  local: number
  active: boolean
}

export function samplePath(local: number, active: boolean): PathPoint {
  const fade = active
    ? Math.min(
        Math.min(1, Math.max(0, local / 0.06)),
        Math.min(1, Math.max(0, (1 - local) / 0.08)),
      )
    : 0

  const depth = active
    ? Math.sin(
        (local < F ? local / (2 * F) : 0.5 + (local - F) / (2 * (1 - F))) * Math.PI,
      )
    : 0

  let x: number
  let y: number

  if (local < F) {
    x = -10
    y = -300 + (local / F) * RISE
  } else if (local < G) {
    const ang = (180 + ((local - F) / (G - F)) * 90) * (Math.PI / 180)
    x = 80 + 90 * Math.cos(ang)
    y = -20 - 90 * Math.sin(ang)
  } else {
    x = 80 + ((local - G) / (1 - G)) * EXIT
    y = 70
  }

  return { x, y, depth, fade, local, active }
}

export function cardTransformStyle(point: PathPoint): {
  zIndex: number
  opacity: number
  transform: string
  pointerEvents: 'auto' | 'none'
} {
  const { x, y, depth, fade, local, active } = point

  return {
    zIndex: Math.round(20 + 80 * depth),
    opacity: active ? fade * (0.4 + 0.6 * depth) : 0,
    transform: [
      `translate3d(calc(-50% + ${x}%), calc(-50% + ${y}%), ${-1000 + 1280 * depth}px)`,
      `rotateX(${4 - 2 * depth}deg)`,
      `rotateY(${-3 + 6 * local}deg)`,
      'rotateZ(0deg)',
      `scale(${0.44 + 0.74 * depth})`,
    ].join(' '),
    pointerEvents: depth > 0.72 ? 'auto' : 'none',
  }
}
