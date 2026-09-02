# fxshelf

[English](./README.md) · [中文](./README.zh-CN.md)

A shelf of copy-friendly micro animation packages for **React** and **Vue**.  
Browse the site, install only the package you need — or copy the source into your project. No Framer Motion / GSAP required.

| | |
|--|--|
| **Site / Docs** | [luzhaotian.github.io/fxshelf](https://luzhaotian.github.io/fxshelf/) |
| **Scope** | `@fxshelf/*` |

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@fxshelf/card-orbit`](./packages/card-orbit) | `0.1.4` | Path-constrained 3D card orbit — rise, arc, exit |

```bash
npm install @fxshelf/card-orbit
```

Each package supports three usage modes: **npm**, **CDN `<script>`** (React), and **copying `src/core` + `react` / `vue` source**. See the site docs for Demo, props, and a full CDN example.

## Local development

```bash
npm install
npm run dev              # Fumadocs → http://localhost:3001
npm run build            # build publishable packages
npm run build:site       # static export → apps/site/out
npm run build:site:pages # GitHub Pages (base=/fxshelf)
npm run typecheck
```

```
packages/<id>/   # publishable @fxshelf/<id> packages
apps/site/       # Fumadocs docs (Next.js static export)
```

## Add a new effect

1. Create `packages/<id>/` with `"name": "@fxshelf/<id>"`
2. Append an entry in [`apps/site/lib/effects.ts`](./apps/site/lib/effects.ts)
3. Add `apps/site/content/docs/effects/<id>.mdx` (Demo + intro + install + usage: npm / CDN / copy-source + props)
4. Update [`apps/site/content/docs/effects/meta.json`](./apps/site/content/docs/effects/meta.json)
5. Homepage cards pick it up from the registry

## Publish a package

```bash
cd packages/card-orbit
# bump version in package.json, then:
npm run pack:check
npm publish --access public
```

## License

MIT
