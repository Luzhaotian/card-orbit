# @fxshelf/glyph-rain

Matrix-style glyph rain with cursor stir. Drop heads cast light onto page content when Chrome’s experimental **html-in-canvas** APIs are available; otherwise the rain still renders as a WebGL2 overlay.

Inspired by [Canvas UI Glyph Rain](https://canvasui.dev/docs/components/glyph-rain).

## Install

```bash
npm install @fxshelf/glyph-rain
```

## React

```tsx
import { GlyphRain } from '@fxshelf/glyph-rain'

export function Demo() {
  return (
    <GlyphRain style={{ height: 420 }} density={0.18} stir={0.8}>
      <img src="/photo.jpg" alt="" style={{ width: '100%', display: 'block' }} />
    </GlyphRain>
  )
}
```

## Vue

```vue
<script setup lang="ts">
import { GlyphRain } from '@fxshelf/glyph-rain/vue'
</script>

<template>
  <GlyphRain :style="{ height: '420px' }" :density="0.18" :stir="0.8">
    <img src="/photo.jpg" alt="" style="width: 100%; display: block" />
  </GlyphRain>
</template>
```

## Browser notes

| Capability | Requirement |
|------------|-------------|
| Glyph rain overlay | WebGL2 |
| Content lighting / dim | Chrome experimental `drawElementImage` + `layoutsubtree` (html-in-canvas) |
| Cursor stir | Pointer events on the wrapper |

## License

MIT
