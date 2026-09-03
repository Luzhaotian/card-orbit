<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
  type StyleValue,
} from 'vue'
import {
  createGlyphRain,
  supportsHtmlInCanvas,
  type GlyphRainInstance,
  type GlyphRainOptions,
} from '../core/createGlyphRain'

const props = defineProps<{
  charset?: string
  cell?: number
  color?: [number, number, number]
  headColor?: [number, number, number]
  speed?: number
  speedVariance?: number
  density?: number
  trail?: number
  glow?: number
  mutate?: number
  flicker?: number
  layers?: number
  dim?: number
  light?: number
  lightRadius?: number
  lightHeight?: number
  relief?: number
  stir?: number
  stirRadius?: number
  settle?: number
  className?: string
  style?: CSSProperties
}>()

const sourceRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const outputRef = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)
const supported = ref(false)

let instance: GlyphRainInstance | null = null

const native = computed(() => supported.value && !failed.value)

const rootClass = computed(() => props.className ?? '')
const rootStyle = computed(
  (): StyleValue => ({
    position: 'relative',
    ...props.style,
  }),
)

function optionPayload(): GlyphRainOptions {
  return {
    charset: props.charset,
    cell: props.cell,
    color: props.color,
    headColor: props.headColor,
    speed: props.speed,
    speedVariance: props.speedVariance,
    density: props.density,
    trail: props.trail,
    glow: props.glow,
    mutate: props.mutate,
    flicker: props.flicker,
    layers: props.layers,
    dim: props.dim,
    light: props.light,
    lightRadius: props.lightRadius,
    lightHeight: props.lightHeight,
    relief: props.relief,
    stir: props.stir,
    stirRadius: props.stirRadius,
    settle: props.settle,
  }
}

function mountEffect() {
  instance?.destroy()
  instance = null
  const source = sourceRef.value
  const content = contentRef.value
  const output = outputRef.value
  if (!source || !content || !output) return
  instance = createGlyphRain({ source, content, output }, optionPayload())
  if (native.value && !instance) failed.value = true
}

onMounted(async () => {
  supported.value = supportsHtmlInCanvas()
  await nextTick()
  mountEffect()
})

watch(
  () => [
    props.charset,
    props.cell,
    props.color,
    props.headColor,
    props.speed,
    props.speedVariance,
    props.density,
    props.trail,
    props.glow,
    props.mutate,
    props.flicker,
    props.layers,
    props.dim,
    props.light,
    props.lightRadius,
    props.lightHeight,
    props.relief,
    props.stir,
    props.stirRadius,
    props.settle,
  ],
  () => {
    instance?.setOptions(optionPayload())
  },
)

onBeforeUnmount(() => {
  instance?.destroy()
  instance = null
})
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <canvas
      ref="sourceRef"
      layoutsubtree="true"
      :style="
        native
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }
          : { display: 'none' }
      "
    >
      <div
        v-if="native"
        ref="contentRef"
        style="position: relative; width: 100%; height: 100%; overflow: auto"
      >
        <slot />
      </div>
    </canvas>
    <div
      v-if="!native"
      ref="contentRef"
      style="position: relative; width: 100%; height: 100%; overflow: auto"
    >
      <slot />
    </div>
    <canvas
      ref="outputRef"
      aria-hidden="true"
      style="
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      "
    />
  </div>
</template>
