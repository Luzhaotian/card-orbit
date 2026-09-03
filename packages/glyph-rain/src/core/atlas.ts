export function buildAtlas(charset: string): {
  canvas: HTMLCanvasElement
  count: number
  grid: number
} {
  const glyphs = Array.from(new Set(Array.from(charset))).filter(
    (g) => g.trim().length > 0,
  )
  if (glyphs.length === 0) glyphs.push('0', '1')
  const count = glyphs.length
  const grid = Math.max(Math.ceil(Math.sqrt(count)), 1)
  const cellPx = 64
  const canvas = document.createElement('canvas')
  canvas.width = grid * cellPx
  canvas.height = grid * cellPx
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 ${Math.round(cellPx * 0.72)}px ui-monospace, SFMono-Regular, Menlo, monospace`
  for (let i = 0; i < count; i++) {
    const x = ((i % grid) + 0.5) * cellPx
    const y = (Math.floor(i / grid) + 0.5) * cellPx
    ctx.fillText(glyphs[i]!, x, y)
  }
  return { canvas, count, grid }
}
