#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const directive = '"use client";\n'

for (const file of ['index.js', 'index.cjs']) {
  const path = join(root, 'dist', file)
  const src = readFileSync(path, 'utf8')
  if (src.startsWith('"use client"') || src.startsWith("'use client'")) continue
  writeFileSync(path, directive + src)
}
