# @fxshelf/card-orbit

Path-constrained 3D card orbit for **React** and **Vue** — rise → arc → exit.  
手写 `requestAnimationFrame` + 数学路径，**不依赖** Framer Motion / GSAP。

动效灵感与参考实现来自：[tasteskill.dev](https://tasteskill.dev)。  
属于 [fxshelf](https://github.com/Luzhaotian/fxshelf) 动效书架中的一个可独立安装包。

| | |
|--|--|
| **文档 / Demo** | [luzhaotian.github.io/fxshelf](https://luzhaotian.github.io/fxshelf/docs/effects/card-orbit) |
| **坐标演示** | [card-orbit-path](https://luzhaotian.github.io/fxshelf/docs/effects/card-orbit-path) |
| **npm** | [`@fxshelf/card-orbit@0.1.5`](https://www.npmjs.com/package/@fxshelf/card-orbit) |
| **CDN** | [unpkg](https://unpkg.com/@fxshelf/card-orbit/) · [jsDelivr](https://cdn.jsdelivr.net/npm/@fxshelf/card-orbit/) |

支持 **npm**、**CDN `<script>`**、**复制源码**。详细用法见站点文档或 [docs/使用说明.md](./docs/使用说明.md)。

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

入口为源码 SFC：`@fxshelf/card-orbit/vue`。

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

## Usage — CDN（React 18 UMD）

自包含产物 `dist/card-orbit.iife.js`，全局变量 `CardOrbit`。完整示例见 [docs/CDN示例.html](./docs/CDN示例.html)。

```html
<link rel="stylesheet" href="https://unpkg.com/@fxshelf/card-orbit/dist/index.css" />

<script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@fxshelf/card-orbit/dist/card-orbit.iife.js"></script>

<div id="hero"></div>
<script>
  var images = ['/a.webp', '/b.webp', '/c.webp']
  ReactDOM.createRoot(document.getElementById('hero')).render(
    React.createElement(React.Fragment, null,
      React.createElement(CardOrbit.CardOrbitMobile, { images: images }),
      React.createElement(CardOrbit.CardOrbit, { images: images }),
    ),
  )
</script>
```

生产环境建议锁定版本，例如 `https://unpkg.com/@fxshelf/card-orbit@0.1.5/dist/card-orbit.iife.js`。  
不要用 jsDelivr 的 GitHub `gh/.../dist` 直链（`dist/` 不进仓库）。

## Copy as source

不经过 npm 时，从本包 `src/`（或 `node_modules/@fxshelf/card-orbit/`）拷贝：

```
core/     # 必拷
react/    # React 项目
vue/      # Vue 项目
```

保持 `core` 与 `react`/`vue` 同级，然后：

```tsx
// React
import { CardOrbit, CardOrbitMobile } from './components/card-orbit/react'
import './components/card-orbit/core/styles.css'
```

```ts
// Vue
import { CardOrbit, CardOrbitMobile } from './components/card-orbit/vue'
import './components/card-orbit/core/styles.css'
```

## License

MIT
