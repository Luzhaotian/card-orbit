# card-orbit

Path-constrained 3D card orbit for **React** and **Vue** — rise → arc → exit.  
手写 `requestAnimationFrame` + 数学路径，**不依赖** Framer Motion / GSAP。

动效灵感与参考实现来自：[tasteskill.dev](https://tasteskill.dev)。

**在线 Demo：** [https://luzhaotian.github.io/card-orbit/](https://luzhaotian.github.io/card-orbit/)  
**npm：** [`card-orbit@0.1.1`](https://www.npmjs.com/package/card-orbit)

动效原理：

- [专业版](./docs/动效说明-专业.md)
- [大白话版](./docs/动效说明-大白话.md)

**完整用法（npm / 复制 / React / Vue / props）：** [docs/使用说明.md](./docs/使用说明.md)

一套 `core`（路径 + 样式 + 动画驱动），两套薄封装。可 npm 安装，也可直接复制源码进项目。

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
demo/       # React 演示站（部署到 GitHub Pages）
docs/       # 使用说明 + 动效说明
dist/       # npm React 构建产物
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
