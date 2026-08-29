<script setup lang="ts">
import { computed, type CSSProperties, type StyleValue } from 'vue'
import '../core/styles.css'

const props = withDefaults(
  defineProps<{
    images: string[]
    alts?: string[]
    className?: string
    style?: CSSProperties
    trackClassName?: string
    cardClassName?: string
    imageClassName?: string
    hideOnDesktop?: boolean
    durationSec?: number
  }>(),
  {
    hideOnDesktop: true,
    durationSec: 28,
  },
)

const rootClass = computed(() =>
  [
    'card-orbit-mobile',
    props.hideOnDesktop ? 'card-orbit-mobile--desktop-hide' : '',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' '),
)

const rootStyle = computed((): StyleValue => props.style)

const loop = computed(() =>
  props.images.length === 0 ? [] : [...props.images, ...props.images],
)
</script>

<template>
  <div v-if="images.length > 0" :class="rootClass" :style="rootStyle">
    <div
      :class="['card-orbit-mobile__track', trackClassName].filter(Boolean).join(' ')"
      :style="{ animationDuration: `${durationSec}s` }"
    >
      <figure
        v-for="(src, i) in loop"
        :key="`${src}-${i}`"
        :class="['card-orbit-mobile__card', cardClassName].filter(Boolean).join(' ')"
      >
        <img
          :src="src"
          :alt="alts?.[i % images.length] ?? ''"
          :class="['card-orbit-mobile__image', imageClassName].filter(Boolean).join(' ')"
          draggable="false"
        />
      </figure>
    </div>
  </div>
</template>
