# @fxshelf/card-orbit

Path-constrained 3D card orbit for **React** and **Vue** — rise → arc → exit.  
手写 `requestAnimationFrame` + 数学路径，**不依赖** Framer Motion / GSAP。

动效灵感与参考实现来自：[tasteskill.dev](https://tasteskill.dev)。

属于 [fxshelf](https://github.com/Luzhaotian/fxshelf) 动效书架中的一个可独立安装包。

| | |
|--|--|
| **在线 Demo** | [luzhaotian.github.io/fxshelf](https://luzhaotian.github.io/fxshelf/)（`#/effects/card-orbit`） |
| **npm** | [`@fxshelf/card-orbit`](https://www.npmjs.com/package/@fxshelf/card-orbit) |
| **CDN** | [unpkg](https://unpkg.com/@fxshelf/card-orbit/) · [jsDelivr](https://cdn.jsdelivr.net/npm/@fxshelf/card-orbit/) |

动效原理：

- [专业版](./docs/动效说明-专业.md)
- [大白话版](./docs/动效说明-大白话.md)
- [轨道坐标演示（静态 HTML）](./docs/轨道演示.html)

**完整用法：** [docs/使用说明.md](./docs/使用说明.md)

## Install

```bash
npm install @fxshelf/card-orbit
```

| 使用方 | Peer |
|--------|------|
| React | `react` / `react-dom` ≥ 18 |
| Vue | `vue` ≥ 3.3，且能编译 `.vue`（如 Vite） |
| CDN | 页面先加载 **React 18 UMD**（React 19 无官方 UMD） |

## Usage — React

```tsx
import { CardOrbit, CardOrbitMobile } from '@fxshelf/card-orbit'
import '@fxshelf/card-orbit/styles.css'

const images = ['/a.webp', '/b.webp', '/c.webp']

export function Hero() {
  return (
    <>
      <CardOrbitMobile images={images} />
      <CardOrbit images={images} />
    </>
  )
}
```

## Usage — Vue

入口为源码 SFC：`@fxshelf/card-orbit/vue`。详见 [使用说明 · Vue](./docs/使用说明.md#vue)。

```vue
<script setup lang="ts">
import { CardOrbit, CardOrbitMobile } from '@fxshelf/card-orbit/vue'
import '@fxshelf/card-orbit/styles.css'

const images = ['/a.webp', '/b.webp', '/c.webp']
</script>

<template>
  <CardOrbitMobile :images="images" />
  <CardOrbit :images="images" />
</template>
```

## Usage — CDN

自包含浏览器产物 `dist/card-orbit.iife.js`，全局变量 `CardOrbit`。完整示例：[docs/CDN示例.html](./docs/CDN示例.html)。

## License

MIT
