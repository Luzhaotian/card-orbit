<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type CSSProperties,
  type StyleValue,
} from 'vue'
import { createOrbit } from '../core/createOrbit'
import {
  DEFAULT_ACTIVE_WINDOW,
  DEFAULT_AUTO_SPEED,
  DEFAULT_DRAG_SENSITIVITY,
  DEFAULT_PERSPECTIVE,
  cardTransformStyle,
  samplePath,
} from '../core/path'
import '../core/styles.css'

const props = withDefaults(
  defineProps<{
    images: string[]
    alts?: string[]
    className?: string
    style?: CSSProperties
    stageClassName?: string
    cardClassName?: string
    imageClassName?: string
    autoSpeed?: number
    dragSensitivity?: number
    activeWindow?: number
    perspective?: number
    ariaLabel?: string
    desktopOnly?: boolean
  }>(),
  {
    autoSpeed: DEFAULT_AUTO_SPEED,
    dragSensitivity: DEFAULT_DRAG_SENSITIVITY,
    activeWindow: DEFAULT_ACTIVE_WINDOW,
    perspective: DEFAULT_PERSPECTIVE,
    ariaLabel: 'Card orbit carousel',
    desktopOnly: true,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const progress = ref(0)
let orbit: ReturnType<typeof createOrbit> | null = null

const rootClass = computed(() =>
  [
    'card-orbit',
    props.desktopOnly ? 'card-orbit--desktop-only' : '',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' '),
)

const rootStyle = computed(
  (): StyleValue => ({
    perspective: `${props.perspective}px`,
    ...props.style,
  }),
)

const cards = computed(() => {
  const { images, alts, activeWindow } = props
  if (images.length === 0) return []
  return images.map((src, index) => {
    const phase = (index / images.length + progress.value) % 1
    const active = phase > 0 && phase < activeWindow
    const local = active ? phase / activeWindow : 0
    const point = samplePath(local, active)
    return {
      src,
      alt: alts?.[index] ?? `Card ${index + 1}`,
      style: cardTransformStyle(point),
      key: `${src}-${index}`,
    }
  })
})

async function bindOrbit() {
  orbit?.destroy()
  orbit = null
  if (props.images.length === 0) return
  await nextTick()
  if (!rootRef.value) return
  orbit = createOrbit({
    autoSpeed: props.autoSpeed,
    dragSensitivity: props.dragSensitivity,
    onProgress: (p) => {
      progress.value = p
    },
  })
  orbit.attach(rootRef.value)
}

watch(
  () => props.images.length,
  () => {
    void bindOrbit()
  },
  { immediate: true },
)

watch(
  () => [props.autoSpeed, props.dragSensitivity] as const,
  ([autoSpeed, dragSensitivity]) => {
    orbit?.setOptions({ autoSpeed, dragSensitivity })
  },
)

onBeforeUnmount(() => {
  orbit?.destroy()
  orbit = null
})
</script>

<template>
  <div
    v-if="images.length > 0"
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    :aria-label="ariaLabel"
  >
    <div :class="['card-orbit__stage', stageClassName].filter(Boolean).join(' ')">
      <figure
        v-for="card in cards"
        :key="card.key"
        :class="['card-orbit__card', cardClassName].filter(Boolean).join(' ')"
        :style="card.style"
      >
        <img
          :src="card.src"
          :alt="card.alt"
          width="1200"
          height="780"
          :class="['card-orbit__image', imageClassName].filter(Boolean).join(' ')"
          draggable="false"
          decoding="async"
        />
      </figure>
    </div>
  </div>
</template>
