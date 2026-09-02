# fxshelf

A shelf of copy-friendly micro animation packages for **React** and **Vue**.  
Browse the site, install only the package you need — no Framer Motion / GSAP required.

| | |
|--|--|
| **Site** | [luzhaotian.github.io/fxshelf](https://luzhaotian.github.io/fxshelf/) |
| **Docs** | Fumadocs (`apps/site`) |
| **Scope** | `@fxshelf/*` |

## Packages

| Package | Description |
|---------|-------------|
| [`@fxshelf/card-orbit`](./packages/card-orbit) | Path-constrained 3D card orbit — rise, arc, exit |

```bash
npm install @fxshelf/card-orbit
```

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

1. Create `packages/<id>/` with `name`: `@fxshelf/<id>`
2. Append an entry in [`apps/site/lib/effects.ts`](./apps/site/lib/effects.ts)
3. Add `apps/site/content/docs/effects/<id>.mdx` (Demo + 简介 + 安装 + 用法)
4. Update [`apps/site/content/docs/effects/meta.json`](./apps/site/content/docs/effects/meta.json)
5. Homepage cards pick it up from the registry

## Publish a package

```bash
cd packages/card-orbit
# bump version, then:
npm run pack:check
npm publish --access public
```

## License

MIT
