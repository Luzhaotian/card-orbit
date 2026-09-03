import { buildAtlas } from './atlas'
import { FRAG, VERT } from './shaders'
import { supportsHtmlInCanvas } from './supports'
import {
  DEFAULTS,
  type ElementImageContext,
  type GlyphRainElements,
  type GlyphRainInstance,
  type GlyphRainOptions,
  type PaintableCanvas,
} from './types'

export function createGlyphRain(
  elements: GlyphRainElements,
  options: GlyphRainOptions = {},
): GlyphRainInstance | null {
  const config = { ...DEFAULTS, ...options }
  const { source, content, output } = elements

  const maybeGl = output.getContext('webgl2', {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true,
  })
  if (!maybeGl || maybeGl.isContextLost()) return null
  const gl: WebGL2RenderingContext = maybeGl

  const sourceCtx = source.getContext('2d') as ElementImageContext | null
  const paintable = source as PaintableCanvas
  const htmlInCanvas = Boolean(
    sourceCtx &&
      typeof sourceCtx.drawElementImage === 'function' &&
      typeof paintable.requestPaint === 'function',
  )

  let contentDirty = false
  let pageLum = 0
  let wake = () => {}

  function readPageLum(): number {
    try {
      const probe = document.createElement('canvas')
      probe.width = probe.height = 1
      const pctx = probe.getContext('2d', { willReadFrequently: true })
      if (!pctx) return 0
      let el: Element | null = content
      while (el instanceof Element) {
        const bgColor = getComputedStyle(el).backgroundColor
        if (bgColor && bgColor !== 'transparent') {
          pctx.clearRect(0, 0, 1, 1)
          pctx.fillStyle = bgColor
          pctx.fillRect(0, 0, 1, 1)
          const d = pctx.getImageData(0, 0, 1, 1).data
          if (d[3]! > 128) {
            return (0.2126 * d[0]! + 0.7152 * d[1]! + 0.0722 * d[2]!) / 255
          }
        }
        el = el.parentElement
      }
    } catch {
      /* ignore */
    }
    return 0
  }

  if (htmlInCanvas) {
    paintable.onpaint = () => {
      try {
        sourceCtx!.reset()
        sourceCtx!.drawElementImage!(content, 0, 0)
        contentDirty = true
        wake()
      } catch {
        /* ignore */
      }
    }
  }

  function compile(type: number, text: string): WebGLShader {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, text)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('GlyphRain shader error:', gl.getShaderInfoLog(shader))
    }
    return shader
  }

  const vertexShader = compile(gl.VERTEX_SHADER, VERT)
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG)
  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const uniforms: Record<string, WebGLUniformLocation> = {}
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < uniformCount; i++) {
    const info = gl.getActiveUniform(program, i)!
    uniforms[info.name] = gl.getUniformLocation(program, info.name)!
  }

  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const contentTexture = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, contentTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]),
  )

  const atlasTexture = gl.createTexture()!
  let atlasCount = 1
  let atlasGrid = 1
  let atlasCharset = ''

  function syncAtlas() {
    if (config.charset === atlasCharset) return
    atlasCharset = config.charset
    const atlas = buildAtlas(config.charset)
    atlasCount = atlas.count
    atlasGrid = atlas.grid
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture)
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      atlas.canvas,
    )
    gl.generateMipmap(gl.TEXTURE_2D)
  }

  syncAtlas()

  let dpr = 1

  function syncCanvasSize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(output.clientWidth * dpr))
    const height = Math.max(1, Math.round(output.clientHeight * dpr))
    if (output.width !== width || output.height !== height) {
      output.width = width
      output.height = height
    }
    if (htmlInCanvas) {
      const cssWidth = Math.max(1, Math.round(source.clientWidth))
      const cssHeight = Math.max(1, Math.round(source.clientHeight))
      if (
        source.width !== cssWidth * dpr ||
        source.height !== cssHeight * dpr
      ) {
        source.width = cssWidth * dpr
        source.height = cssHeight * dpr
      }
      paintable.requestPaint!()
    }
  }

  syncCanvasSize()

  function uploadContent() {
    if (!htmlInCanvas || !contentDirty) return
    contentDirty = false
    pageLum = readPageLum()
    gl.bindTexture(gl.TEXTURE_2D, contentTexture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      source,
    )
    sourceCtx!.clearRect(0, 0, source.width, source.height)
  }

  let time = 7.3

  const WAKE_RES = 256
  const wakeCharge = new Float32Array(WAKE_RES)
  const wakeField = new Float32Array(WAKE_RES * 2)
  let wakeLive = false
  let wakeTouched = false
  let pointerX = 0
  let tracking = false

  const wakeTexture = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, wakeTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RG32F,
    WAKE_RES,
    1,
    0,
    gl.RG,
    gl.FLOAT,
    wakeField,
  )

  function stirAmount(): number {
    return Math.min(Math.max(config.stir, 0), 1)
  }

  function wakeSpan(): number {
    const width = Math.max(output.clientWidth, 1)
    const px = Math.min(Math.max(config.stirRadius, 8), 2000)
    return Math.max(px / width, 1 / WAKE_RES)
  }

  function stepWake(delta: number) {
    const stir = stirAmount()
    const settleT = Math.min(Math.max(config.settle, 0.05), 8)
    const decay = Math.exp(-delta / settleT)
    const span = wakeSpan()
    const drive = stir > 0.001 && !reducedMotion
    const track = drive && tracking
    let live = false
    for (let i = 0; i < WAKE_RES; i++) {
      let charge = wakeCharge[i]! * decay
      if (track) {
        const d = Math.abs((i + 0.5) / WAKE_RES - pointerX) / span
        if (d < 1) {
          const t = 1 - d
          const target = t * t * (3 - 2 * t)
          if (target > charge) charge = target
        }
      }
      if (charge < 1e-4) charge = 0
      wakeCharge[i] = charge
      if (charge > 0) {
        live = true
        if (drive) {
          wakeField[i * 2]! += delta * stir * 2.2 * charge
          wakeTouched = true
        }
      }
      wakeField[i * 2 + 1] = charge
    }
    if (!live && !wakeLive) return
    wakeLive = live
    gl.bindTexture(gl.TEXTURE_2D, wakeTexture)
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      WAKE_RES,
      1,
      gl.RG,
      gl.FLOAT,
      wakeField,
    )
  }

  function render() {
    uploadContent()
    gl.useProgram(program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, contentTexture)
    gl.uniform1i(uniforms.uContent!, 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture)
    gl.uniform1i(uniforms.uAtlas!, 1)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, wakeTexture)
    gl.uniform1i(uniforms.uWake!, 2)
    gl.uniform2f(uniforms.uResolution!, output.width, output.height)
    gl.uniform1f(uniforms.uTime!, time)
    gl.uniform1f(uniforms.uCell!, Math.min(Math.max(config.cell, 8), 64) * dpr)
    gl.uniform1f(uniforms.uGlyphCount!, atlasCount)
    gl.uniform1f(uniforms.uAtlasGrid!, atlasGrid)
    gl.uniform3f(
      uniforms.uColor!,
      config.color[0],
      config.color[1],
      config.color[2],
    )
    gl.uniform3f(
      uniforms.uHeadColor!,
      config.headColor[0],
      config.headColor[1],
      config.headColor[2],
    )
    gl.uniform1f(uniforms.uSpeed!, Math.min(Math.max(config.speed, 0.05), 3))
    gl.uniform1f(
      uniforms.uSpeedVar!,
      Math.min(Math.max(config.speedVariance, 0), 1),
    )
    gl.uniform1f(uniforms.uDensity!, Math.min(Math.max(config.density, 0), 1))
    gl.uniform1f(uniforms.uTrail!, Math.min(Math.max(config.trail, 0.2), 3))
    gl.uniform1f(uniforms.uGlow!, Math.min(Math.max(config.glow, 0), 3))
    gl.uniform1f(uniforms.uMutate!, Math.min(Math.max(config.mutate, 0), 4))
    gl.uniform1f(uniforms.uFlicker!, Math.min(Math.max(config.flicker, 0), 1))
    gl.uniform1f(
      uniforms.uLayers!,
      Math.round(Math.min(Math.max(config.layers, 1), 3)),
    )
    gl.uniform1f(uniforms.uDim!, Math.min(Math.max(config.dim, 0), 1))
    gl.uniform1f(uniforms.uLight!, Math.min(Math.max(config.light, 0), 3))
    gl.uniform1f(
      uniforms.uLightRadius!,
      Math.min(Math.max(config.lightRadius, 20), 600) * dpr,
    )
    gl.uniform1f(uniforms.uLightHeight!, Math.max(config.lightHeight, 4) * dpr)
    gl.uniform1f(uniforms.uRelief!, Math.min(Math.max(config.relief, 0), 2))
    gl.uniform1f(uniforms.uStir!, wakeTouched ? stirAmount() : 0)
    gl.uniform1f(uniforms.uScroll!, content.scrollTop * dpr)
    gl.uniform1f(uniforms.uPageLum!, pageLum)
    gl.uniform1f(uniforms.uHasContent!, htmlInCanvas ? 1 : 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, output.width, output.height)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let raf = 0
  let lastTime = performance.now()
  let destroyed = false
  let running = false
  let visible = true

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let reducedMotion = motionQuery.matches

  function frame(now: number) {
    if (destroyed) return
    if (!visible) {
      running = false
      return
    }
    const delta = Math.min((now - lastTime) / 1000, 1 / 30)
    lastTime = now
    if (!reducedMotion) time += delta
    stepWake(delta)
    render()
    if (reducedMotion && !contentDirty) {
      running = false
      return
    }
    raf = requestAnimationFrame(frame)
  }

  function start() {
    if (destroyed || running || !visible) return
    running = true
    lastTime = performance.now()
    raf = requestAnimationFrame(frame)
  }

  wake = start
  start()

  function onMotionChange() {
    reducedMotion = motionQuery.matches
    if (reducedMotion) {
      tracking = false
      wakeCharge.fill(0)
      for (let i = 0; i < WAKE_RES; i++) wakeField[i * 2 + 1] = 0
      wakeLive = true
    }
    start()
  }
  motionQuery.addEventListener('change', onMotionChange)
  content.addEventListener('scroll', start, { passive: true })

  const pointerHost = output.parentElement ?? output

  function pointerNorm(event: PointerEvent): number {
    const box = output.getBoundingClientRect()
    if (box.width < 1) return -1
    return (event.clientX - box.left) / box.width
  }

  function onPointerMove(event: PointerEvent) {
    if (reducedMotion) return
    const x = pointerNorm(event)
    if (x < 0) return
    pointerX = x
    tracking = true
    start()
  }

  function onPointerLeave() {
    tracking = false
  }

  function onPointerDown(event: PointerEvent) {
    if (reducedMotion || stirAmount() <= 0.001) return
    const x = pointerNorm(event)
    if (x < 0) return
    pointerX = x
    tracking = true
    const span = wakeSpan() * 1.8
    for (let i = 0; i < WAKE_RES; i++) {
      const d = Math.abs((i + 0.5) / WAKE_RES - x) / span
      if (d >= 1) continue
      const t = 1 - d
      const burst = t * t * (3 - 2 * t)
      if (burst > wakeCharge[i]!) wakeCharge[i] = burst
    }
    start()
  }

  pointerHost.addEventListener('pointermove', onPointerMove, { passive: true })
  pointerHost.addEventListener('pointerleave', onPointerLeave, { passive: true })
  pointerHost.addEventListener('pointercancel', onPointerLeave, { passive: true })
  pointerHost.addEventListener('pointerdown', onPointerDown, { passive: true })

  const observer = new ResizeObserver(() => {
    syncCanvasSize()
    start()
  })
  observer.observe(output)
  observer.observe(content)

  const intersection = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1]?.isIntersecting ?? true
    if (visible) start()
  })
  intersection.observe(output)

  return {
    setOptions(next) {
      let changed = false
      for (const [key, value] of Object.entries(next)) {
        const prev = config[key as keyof typeof config]
        if (Array.isArray(value) && Array.isArray(prev)) {
          if (
            value.length !== prev.length ||
            value.some((item, i) => item !== prev[i])
          ) {
            changed = true
            break
          }
        } else if (prev !== value) {
          changed = true
          break
        }
      }
      Object.assign(config, next)
      if (!changed) return
      syncAtlas()
      syncCanvasSize()
      start()
    },
    resize() {
      syncCanvasSize()
      start()
    },
    destroy() {
      destroyed = true
      cancelAnimationFrame(raf)
      observer.disconnect()
      intersection.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
      content.removeEventListener('scroll', start)
      pointerHost.removeEventListener('pointermove', onPointerMove)
      pointerHost.removeEventListener('pointerleave', onPointerLeave)
      pointerHost.removeEventListener('pointercancel', onPointerLeave)
      pointerHost.removeEventListener('pointerdown', onPointerDown)
      gl.deleteTexture(contentTexture)
      gl.deleteTexture(atlasTexture)
      gl.deleteTexture(wakeTexture)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(quad)
      if (htmlInCanvas) paintable.onpaint = null
    },
  }
}

export { supportsHtmlInCanvas }
export type {
  GlyphRainElements,
  GlyphRainInstance,
  GlyphRainOptions,
} from './types'
export { DEFAULT_CHARSET, DEFAULTS } from './types'
