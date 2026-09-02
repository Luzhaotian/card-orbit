# fxshelf

[English](./README.md) · [中文](./README.zh-CN.md)

面向 **React** / **Vue** 的可复制微动效包书架。  
浏览站点、按需安装 —— 也可以把源码直接拷进项目。不依赖 Framer Motion / GSAP。

| | |
|--|--|
| **站点 / 文档** | [luzhaotian.github.io/fxshelf](https://luzhaotian.github.io/fxshelf/) |
| **包作用域** | `@fxshelf/*` |

## 包列表

| 包名 | 版本 | 说明 |
|------|------|------|
| [`@fxshelf/card-orbit`](./packages/card-orbit) | `0.1.4` | 路径约束的 3D 卡片轨道 —— 升起、弧线、飞出 |

```bash
npm install @fxshelf/card-orbit
```

每个包支持三种用法：**npm**、**CDN `<script>`**（React）、**复制 `src/core` + `react` / `vue` 源码**。站点文档页含 Demo、props 与完整 CDN 示例。

## 本地开发

```bash
npm install
npm run dev              # Fumadocs → http://localhost:3001
npm run build            # 构建可发布包
npm run build:site       # 静态导出 → apps/site/out
npm run build:site:pages # GitHub Pages（base=/fxshelf）
npm run typecheck
```

```
packages/<id>/   # 可发布的 @fxshelf/<id> 包
apps/site/       # Fumadocs 文档站（Next.js 静态导出）
```

## 新增一个动效

1. 创建 `packages/<id>/`，`"name"` 设为 `@fxshelf/<id>`
2. 在 [`apps/site/lib/effects.ts`](./apps/site/lib/effects.ts) 追加条目
3. 添加 `apps/site/content/docs/effects/<id>.mdx`（Demo + 简介 + 安装 + 用法：npm / CDN / 复制源码 + props）
4. 更新 [`apps/site/content/docs/effects/meta.json`](./apps/site/content/docs/effects/meta.json)
5. 首页卡片会从 registry 自动带上

## 发布包

```bash
cd packages/card-orbit
# 先改 package.json 里的 version，然后：
npm run pack:check
npm publish --access public
```

## License

MIT
