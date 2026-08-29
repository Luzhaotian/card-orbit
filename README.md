# card-orbit

Path-constrained 3D card orbit for **React** and **Vue** — rise → arc → exit.  
手写 `requestAnimationFrame` + 数学路径，**不依赖** Framer Motion / GSAP。

动效灵感与参考实现来自：[tasteskill.dev](https://tasteskill.dev)。

动效原理：

- [专业版](./docs/动效说明-专业.md)
- [大白话版](./docs/动效说明-大白话.md)

**完整用法（npm / 复制 / React / Vue / props）：** [docs/使用说明.md](./docs/使用说明.md)

一套 `core`（路径 + 样式 + 动画驱动），两套薄封装。可用 npm 安装，也可直接复制源码进项目。

## Install

```bash
npm install card-orbit
```

React / Vue 按需安装对应框架（peer dependency）。细节见 [使用说明](./docs/使用说明.md)。

## Usage — React（npm）

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

## Usage — Vue（npm）

Vue 以 **源码 `.vue` SFC** 发布，需 Vite（或其它能编译 `.vue` 的工具）与 `vue >= 3.3`。仓库 demo 仅为 React。详见 [使用说明 · Vue](./docs/使用说明.md#vue)。

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

## Copy as source（不发 npm）

把 `src/core` +（`src/react` 或 `src/vue`）拷进项目即可。步骤与示例见 [使用说明 · 复制进项目](./docs/使用说明.md#复制进项目不经过-npm)。

```
core/     # 必拷：path + styles + createOrbit
react/    # React 项目
vue/      # Vue 项目
```

| 组件 | 作用 |
|------|------|
| `CardOrbit` | 桌面 3D 轨迹（默认 `lg+` 显示） |
| `CardOrbitMobile` | 窄屏横向跑马灯（默认 `lg+` 隐藏） |

常用 props 完整表：[使用说明 · 组件与 props](./docs/使用说明.md#组件与-props)。图片由调用方提供；包内不捆绑 demo 资源。React / Vue props 名称一致。

## 本地开发

```bash
npm install
npm run dev          # demo：http://localhost:5173（React）
npm run build        # 打包 React 库 → dist/
npm run typecheck
```

目录结构：

```
src/core/     # 无框架核心
src/react/    # React 适配
src/vue/      # Vue 适配（源码形态发布）
demo/         # Vite React 演示站
docs/         # 使用说明 + 动效说明
dist/         # npm React 构建产物
```

## 发布到 npm

1. 确认包名未被占用：`npm view card-orbit`（若占用可改 `name`）
2. 登录并发布：

```bash
npm login
npm run build
npm publish --access public
```

若要用 scoped 包名（如 `@you/card-orbit`），只改 `package.json` 的 `"name"` 即可。

## License

MIT
