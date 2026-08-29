import { DEFAULT_AUTO_SPEED, DEFAULT_DRAG_SENSITIVITY } from './path'

export type CreateOrbitOptions = {
  autoSpeed?: number
  dragSensitivity?: number
  onProgress: (progress: number) => void
}

export type OrbitController = {
  attach(el: HTMLElement): void
  detach(): void
  setOptions(partial: {
    autoSpeed?: number
    dragSensitivity?: number
  }): void
  destroy(): void
  getProgress(): number
}

export function createOrbit(options: CreateOrbitOptions): OrbitController {
  let autoSpeed = options.autoSpeed ?? DEFAULT_AUTO_SPEED
  let dragSensitivity = options.dragSensitivity ?? DEFAULT_DRAG_SENSITIVITY
  const onProgress = options.onProgress

  let progress = 0
  let dragging = false
  let lastX: number | null = null
  let lastY: number | null = null
  let frame = 0
  let last = 0
  let el: HTMLElement | null = null
  let running = false

  const emit = () => onProgress(progress)

  const onPointerDown = (e: PointerEvent) => {
    lastX = e.clientX
    lastY = e.clientY
    dragging = true
    el?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging || lastX === null || lastY === null) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    const delta = dy + 0.25 * dx
    progress = (progress + dragSensitivity * delta + 1) % 1
    emit()
    lastX = e.clientX
    lastY = e.clientY
  }

  const endDrag = (e: PointerEvent) => {
    lastX = null
    lastY = null
    dragging = false
    if (el?.hasPointerCapture?.(e.pointerId)) {
      el.releasePointerCapture(e.pointerId)
    }
  }

  const tick = (now: number) => {
    const dt = now - last
    last = now
    if (!dragging) {
      progress = (progress + autoSpeed * dt) % 1
      emit()
    }
    frame = requestAnimationFrame(tick)
  }

  const startLoop = () => {
    if (running) return
    running = true
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }

  const stopLoop = () => {
    if (!running) return
    running = false
    cancelAnimationFrame(frame)
    frame = 0
  }

  const detach = () => {
    if (!el) return
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', endDrag)
    el.removeEventListener('pointercancel', endDrag)
    el.removeEventListener('lostpointercapture', endDrag)
    el = null
  }

  return {
    attach(target) {
      detach()
      el = target
      el.addEventListener('pointerdown', onPointerDown)
      el.addEventListener('pointermove', onPointerMove)
      el.addEventListener('pointerup', endDrag)
      el.addEventListener('pointercancel', endDrag)
      el.addEventListener('lostpointercapture', endDrag)
      startLoop()
    },
    detach,
    setOptions(partial) {
      if (partial.autoSpeed !== undefined) autoSpeed = partial.autoSpeed
      if (partial.dragSensitivity !== undefined) {
        dragSensitivity = partial.dragSensitivity
      }
    },
    destroy() {
      stopLoop()
      detach()
      dragging = false
      lastX = null
      lastY = null
    },
    getProgress() {
      return progress
    },
  }
}
