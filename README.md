# card-orbit

Path-constrained 3D card orbit for **React** and **Vue** — rise → arc → exit.  
手写 `requestAnimationFrame` + 数学路径，**不依赖** Framer Motion / GSAP。

动效灵感与参考实现来自：[tasteskill.dev](https://tasteskill.dev)。

| | |
|--|--|
| **在线 Demo** | [luzhaotian.github.io/card-orbit](https://luzhaotian.github.io/card-orbit/)（`#/` Hero · `#/path` 3D 轨道） |
| **npm** | [`card-orbit@0.1.3`](https://www.npmjs.com/package/card-orbit) |
| **CDN** | [unpkg](https://unpkg.com/card-orbit/) · [jsDelivr](https://cdn.jsdelivr.net/npm/card-orbit/) |

动效原理：

- [专业版](./docs/动效说明-专业.md)
- [大白话版](./docs/动效说明-大白话.md)
- [轨道坐标演示（静态 HTML）](./docs/轨道演示.html)
- 在线 3D（R3F + KaTeX）：[Demo `#/path`](https://luzhaotian.github.io/card-orbit/#/path)

**完整用法：** [docs/使用说明.md](./docs/使用说明.md)

一套 `core`（路径 + 样式 + 动画驱动）+ React / Vue 薄封装。支持 **npm**、**CDN `<script>`**、**复制源码**。

---

## Install

```bash
npm install card-orbit
```

| 使用方 | Peer |
|--------|------|
| React | `react` / `react-dom` ≥ 18 |
| Vue | `vue` ≥ 3.3，且能编译 `.vue`（如 Vite） |
| CDN | 页面先加载 **React 18 UMD**（React 19 无官方 UMD） |

---

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

入口为源码 SFC：`card-orbit/vue`。详见 [使用说明 · Vue](./docs/使用说明.md#vue)。

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

自包含浏览器产物 `dist/card-orbit.iife.js`（约 10 KB），全局变量 `CardOrbit`。

```html
<link rel="stylesheet" href="https://unpkg.com/card-orbit/dist/index.css" />

<script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/card-orbit/dist/card-orbit.iife.js"></script>

<div id="hero"></div>
<script>
  var images = ['/a.webp', '/b.webp', '/c.webp']
  ReactDOM.createRoot(document.getElementById('hero')).render(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(CardOrbit.CardOrbitMobile, { images: images }),
      React.createElement(CardOrbit.CardOrbit, { images: images }),
    ),
  )
</script>
```

也可用 jsDelivr：`https://cdn.jsdelivr.net/npm/card-orbit/dist/card-orbit.iife.js`。  
完整可双击打开的示例：[docs/CDN示例.html](./docs/CDN示例.html)。Vue 暂无 script 直引产物。

---

## Copy as source

拷 `src/core` +（`src/react` 或 `src/vue`）。步骤见 [使用说明 · 复制进项目](./docs/使用说明.md#复制进项目不经过-npm)。

| 组件 | 作用 |
|------|------|
| `CardOrbit` | 桌面 3D 轨迹（默认 `lg+` 显示） |
| `CardOrbitMobile` | 窄屏横向跑马灯（默认 `lg+` 隐藏） |

常用 props：[使用说明 · 组件与 props](./docs/使用说明.md#组件与-props)。图片由调用方提供。

---

## 本地开发

```bash
npm install
npm run dev              # http://localhost:5173  ·  #/path 看 3D 轨道
npm run build            # ESM/CJS + IIFE → dist/
npm run build:demo:pages # GitHub Pages（base=/card-orbit/）
npm run typecheck
```

```
src/core/      # 无框架核心
src/react/     # React 适配
src/vue/       # Vue 适配（SFC 源码发布）
src/browser/   # IIFE 构建用的 React 全局 shim（不单独发布）
demo/          # 演示站（Hero + #/path）
docs/          # 使用说明、动效、CDN 示例、轨道演示
dist/          # index.{js,cjs,d.ts,css} + card-orbit.iife.js
```

## 再发布

```bash
# 改 version 后
npm run pack:check
npm publish
```

`prepublishOnly` 会跑 typecheck + build；已配置 `publishConfig.access: public`。  
若出现 `E404`，多为 npm 登录态/token 权限问题：重新 `npm login` 并完成浏览器确认。

## License

MIT
