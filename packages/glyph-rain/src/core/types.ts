export type GlyphRainOptions = {
  /** Characters used for the falling glyphs. Deduplicated into a glyph atlas. */
  charset?: string
  /** Size of one glyph cell in CSS pixels (8 to 64). */
  cell?: number
  /** Rain color as [r, g, b] in 0-1 range. */
  color?: [number, number, number]
  /** Color of the bright head glyph as [r, g, b] in 0-1 range. */
  headColor?: [number, number, number]
  /** Fall speed in screen heights per second (0.05 to 3). */
  speed?: number
  /** Per-column speed variation (0 to 1). */
  speedVariance?: number
  /** Fraction of drops that spawn each cycle (0 to 1). */
  density?: number
  /** Length multiplier for the fading trails (0.2 to 3). */
  trail?: number
  /** Brightness of the drop heads and the light they cast (0 to 3). */
  glow?: number
  /** How fast glyphs mutate into other characters (0 to 4). */
  mutate?: number
  /** Random brightness flicker of the streaks (0 to 1). */
  flicker?: number
  /** Parallax rain layers behind the front one (1 to 3). */
  layers?: number
  /** How much the unlit page dims (0 to 1). 0 keeps it fully readable. */
  dim?: number
  /** Strength of the light the drops shine onto the page (0 to 3). */
  light?: number
  /** Radius of each drop's light pool in CSS pixels (20 to 600). */
  lightRadius?: number
  /** How high above the page the lights float, in CSS pixels. Higher is softer. */
  lightHeight?: number
  /** Embossed 3D shading of the page under the lights (0 to 2). */
  relief?: number
  /** How strongly the cursor stirs the rain as it passes (0 to 1). 0 disables it. */
  stir?: number
  /** How far the stirring reaches to either side of the cursor, in CSS pixels. */
  stirRadius?: number
  /** Seconds the stirred wake takes to settle back to its own rhythm. */
  settle?: number
}

export type GlyphRainElements = {
  /** Canvas with layoutsubtree that hosts the HTML content. */
  source: HTMLCanvasElement
  /** The element inside the source canvas that gets captured. */
  content: HTMLElement
  /** Canvas the WebGL effect renders to. */
  output: HTMLCanvasElement
}

export type GlyphRainInstance = {
  /** Update effect options live. */
  setOptions: (options: GlyphRainOptions) => void
  /** Re-read canvas size. Call when the element is resized. */
  resize: () => void
  /** Stop the loop and release all GPU resources. */
  destroy: () => void
}

export const DEFAULT_CHARSET =
  'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789Z*+-<>¦=:.'

export const DEFAULTS: Required<GlyphRainOptions> = {
  charset: DEFAULT_CHARSET,
  cell: 15,
  color: [0.267, 0.455, 1],
  headColor: [0.169, 0.416, 1],
  speed: 0.2,
  speedVariance: 0.5,
  density: 0.15,
  trail: 0.65,
  glow: 1.75,
  mutate: 0,
  flicker: 0,
  layers: 2,
  dim: 0.5,
  light: 2.8,
  lightRadius: 240,
  lightHeight: 172,
  relief: 0.05,
  stir: 0.7,
  stirRadius: 260,
  settle: 0.9,
}

export type PaintableCanvas = HTMLCanvasElement & {
  onpaint?: (() => void) | null
  requestPaint?: () => void
}

export type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => void
}
