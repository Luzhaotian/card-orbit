export type EffectMeta = {
  id: string
  title: string
  blurb: string
  packageName: string
  docPath: string
}

export const effects: EffectMeta[] = [
  {
    id: 'card-orbit',
    title: 'Card Orbit',
    blurb: '路径约束的 3D 卡片轨道 —— 升起、弧线、飞出。',
    packageName: '@fxshelf/card-orbit',
    docPath: '/docs/effects/card-orbit',
  },
  {
    id: 'glyph-rain',
    title: 'Glyph Rain',
    blurb: 'Matrix 风格字符雨 —— 光标搅动，可选内容照明。',
    packageName: '@fxshelf/glyph-rain',
    docPath: '/docs/effects/glyph-rain',
  },
]
