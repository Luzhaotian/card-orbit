# card-orbit

Path-constrained 3D card orbit for **React** and **Vue** — rise → arc → exit.  
手写 `requestAnimationFrame` + 数学路径，**不依赖** Framer Motion / GSAP。

动效灵感与参考实现来自：[tasteskill.dev](https://tasteskill.dev)。

**在线 Demo：** [https://luzhaotian.github.io/card-orbit/](https://luzhaotian.github.io/card-orbit/)  
**npm：** [`card-orbit@0.1.2`](https://www.npmjs.com/package/card-orbit)

动效原理：

- [专业版](./docs/动效说明-专业.md)
- [大白话版](./docs/动效说明-大白话.md)
- [轨道坐标演示（静态 HTML）](./docs/轨道演示.html)
- 在线 3D：Demo 右上角切到 **轨道坐标**，或打开 `#/path`

**完整用法（npm / 复制 / React / Vue / props）：** [docs/使用说明.md](./docs/使用说明.md)

一套 `core`（路径 + 样式 + 动画驱动），两套薄封装。可 npm 安装、CDN `<script>` 直引，也可直接复制源码进项目。

## Install

```bash
npm install card-orbit
```

按需安装对应框架（peer）：

| 使用方 | 需要 |
|--------|------|
| React | `react` / `react-dom` ≥ 18 |
| Vue | `vue` ≥ 3.3，且能编译 `.vue`（如 Vite） |

## Usage — React

```tsx
import { CardOrbit, CardOrbitMobile } from 'card-orbit'
import 'card-orbit/styles.css'

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

Vue 入口以 **源码 `.vue` SFC** 发布（`card-orbit/vue`）。详见 [使用说明 · Vue](./docs/使用说明.md#vue)。

```vue
<script setup lang="ts">
import { CardOrbit, CardOrbitMobile } from 'card-orbit/vue'
import 'card-orbit/styles.css'

const images = ['/a.webp', '/b.webp', '/c.webp']
</script>

<template>
  <CardOrbitMobile :images="images" />
  <CardOrbit :images="images" />
</template>
```

## Usage — CDN（`<script>`）

零构建工具：先引 React 18 UMD（React 19 起官方不再提供 UMD），再引 card-orbit 浏览器产物 —— 自包含、零依赖，全局变量 `CardOrbit`。

```html
<link rel="stylesheet" href="https://unpkg.com/card-orbit/dist/index.css">

<script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/card-orbit/dist/card-orbit.iife.js"></script>

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

- 双击即开的完整示例：[docs/CDN示例.html](./docs/CDN示例.html)
- Vue 版以 `.vue` SFC 源码发布，暂无 script 直引产物

## Copy as source

不经过 npm 时，拷 `src/core` +（`src/react` 或 `src/vue`）即可。步骤见 [使用说明 · 复制进项目](./docs/使用说明.md#复制进项目不经过-npm)。

```
core/     # 必拷
react/    # React
vue/      # Vue
```

| 组件 | 作用 |
|------|------|
| `CardOrbit` | 桌面 3D 轨迹（默认 `lg+` 显示） |
| `CardOrbitMobile` | 窄屏横向跑马灯（默认 `lg+` 隐藏） |

常用 props：[使用说明 · 组件与 props](./docs/使用说明.md#组件与-props)。图片由调用方提供；包内不捆绑 demo 资源。React / Vue props 名称一致。

## 本地开发

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # 库 → dist/
npm run build:demo:pages # GitHub Pages 产物（base=/card-orbit/）
npm run typecheck
```

```
src/core/   # 无框架核心
src/react/  # React 适配
src/vue/    # Vue 适配（源码形态随包发布）
src/browser/# 浏览器直引构建的全局 shim（不随包发布）
demo/       # React 演示站（部署到 GitHub Pages）
docs/       # 使用说明 + 动效说明 + CDN 示例
dist/       # 构建产物：React ESM/CJS/d.ts + card-orbit.iife.js + CSS
```

## 再发布

```bash
# 改 version 后
npm run pack:check
npm publish
```

`prepublishOnly` 会自动跑 typecheck + build；已配置 `publishConfig.access: public`。

## License

MIT
