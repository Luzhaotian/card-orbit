'use client'

import Link from 'next/link'
import {Canvas, useFrame} from '@react-three/fiber'
import {Grid, OrbitControls, Text} from '@react-three/drei'
import katex from 'katex'
import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react'
import {F, G, samplePath} from '@fxshelf/card-orbit'
import * as THREE from 'three'
import 'katex/dist/katex.min.css'
import styles from './card-orbit-path.module.css'

const SCALE = 0.012
const SPEED = 0.16

function toVec3(local: number): THREE.Vector3 {
  const p = samplePath(local, true)
  return new THREE.Vector3(
    p.x * SCALE,
    -p.y * SCALE,
    (-1000 + 1280 * p.depth) * 0.0012,
  )
}

function segmentOf(local: number): 'rise' | 'arc' | 'exit' {
  if (local < F) return 'rise'
  if (local < G) return 'arc'
  return 'exit'
}

function buildSegment(from: number, to: number, steps = 48): Float32Array {
  const arr = new Float32Array((steps + 1) * 3)
  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps
    const v = toVec3(t)
    arr[i * 3] = v.x
    arr[i * 3 + 1] = v.y
    arr[i * 3 + 2] = v.z
  }
  return arr
}

function Tracer({local}: {local: number}) {
  const ref = useRef<THREE.Mesh>(null)
  const localRef = useRef(local)

  useEffect(() => {
    localRef.current = local
  }, [local])

  useFrame(() => {
    if (!ref.current) return
    const t = localRef.current
    const p = samplePath(t, true)
    const v = toVec3(t)
    ref.current.position.copy(v)
    const r = 0.06 + p.depth * 0.14
    ref.current.scale.setScalar(r / 0.08)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 24, 24]} />
      <meshStandardMaterial
        color="#ff6b00"
        emissive="#ff6b00"
        emissiveIntensity={0.25}
        roughness={0.35}
      />
    </mesh>
  )
}

function Formula({tex, className}: {tex: string; className?: string}) {
  const html = useMemo(
    () => katex.renderToString(tex, {throwOnError: false, displayMode: false}),
    [tex],
  )
  return <span className={className} dangerouslySetInnerHTML={{__html: html}} />
}

function AxisLabel({
  position,
  children,
}: {
  position: [number, number, number]
  children: string
}) {
  return (
    <Text
      position={position}
      fontSize={0.28}
      color="#0a0a0a"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.012}
      outlineColor="#f7f5f1">
      {children}
    </Text>
  )
}

function Axes() {
  const len = 3.8
  return (
    <group>
      <mesh position={[len / 2, 0, 0]}>
        <boxGeometry args={[len, 0.025, 0.025]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, len / 2, 0]}>
        <boxGeometry args={[0.025, len, 0.025]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, 0, len / 2]}>
        <boxGeometry args={[0.025, 0.025, len]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <AxisLabel position={[len + 0.28, 0, 0]}>X</AxisLabel>
      <AxisLabel position={[0, len + 0.28, 0]}>Y</AxisLabel>
      <AxisLabel position={[0, 0, len + 0.28]}>Z</AxisLabel>
    </group>
  )
}

function PathLines() {
  const rise = useMemo(() => buildSegment(0, F), [])
  const arc = useMemo(() => buildSegment(F, G), [])
  const exit = useMemo(() => buildSegment(G, 1), [])

  const mk = (positions: Float32Array, color: string, dashed = false) => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = dashed
      ? new THREE.LineDashedMaterial({
          color,
          dashSize: 0.12,
          gapSize: 0.08,
        })
      : new THREE.LineBasicMaterial({color})
    const line = new THREE.Line(geo, mat)
    if (dashed) line.computeLineDistances()
    return line
  }

  const riseLine = useMemo(() => mk(rise, '#cc5400'), [rise])
  const arcLine = useMemo(() => mk(arc, '#0a0a0a'), [arc])
  const exitLine = useMemo(() => mk(exit, '#6b7280', true), [exit])

  return (
    <group>
      <primitive object={riseLine} />
      <primitive object={arcLine} />
      <primitive object={exitLine} />
    </group>
  )
}

export function CardOrbitPathLab(): ReactNode {
  const [local, setLocal] = useState(0)
  const [paused, setPaused] = useState(false)
  const seg = segmentOf(local)
  const point = samplePath(local, true)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setLocal((v) => (v + SPEED * dt) % 1)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paused])

  const segs = [
    {id: 'rise' as const, label: '① 上升', color: '#cc5400', hint: '竖直爬上来'},
    {id: 'arc' as const, label: '② 拐弯', color: '#0a0a0a', hint: '四分之一圆弧'},
    {id: 'exit' as const, label: '③ 退出', color: '#6b7280', hint: '水平滑出'},
  ]

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <Link href="/docs/effects/card-orbit" className={styles.back}>
            ← Card Orbit
          </Link>
          <p className={styles.eyebrow}>R3F · KaTeX</p>
          <h2 className={styles.title}>3D 坐标轴上的轨道</h2>
          <p className={styles.body}>
            拖拽旋转查看。路径与库内 <code>samplePath</code> 一致；
            <Formula tex="Z" /> 由 <Formula tex="\mathrm{depth}" /> 映射，靠近时点更大更靠前。
          </p>

          <div className={styles.panel}>
            <div>
              <Formula tex="\mathrm{local}\in[0,1]" />
              <span className={styles.muted}> — 单卡在窗口内的路径参数</span>
            </div>
            <div>
              <Formula tex="\mathrm{phase}=(i/n+\mathrm{progress})\bmod 1" />
            </div>
            <div>
              <Formula tex="\mathrm{depth}=\sin(\pi\cdot u(\mathrm{local}))" />
            </div>
            <div className={styles.mono}>
              local = {local.toFixed(3)} · depth = {point.depth.toFixed(2)} · seg = {seg}
            </div>
          </div>

          <ul className={styles.segs}>
            {segs.map((s) => (
              <li
                key={s.id}
                className={seg === s.id ? styles.segActive : styles.segIdle}>
                <span className={styles.dot} style={{background: s.color}} />
                <div>
                  <div className={styles.segLabel}>{s.label}</div>
                  <div className={styles.muted}>{s.hint}</div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={styles.button}
            onClick={() => setPaused((p) => !p)}>
            {paused ? '继续动画' : '暂停示踪点'}
          </button>
        </div>

        <div className={styles.canvasWrap}>
          <Canvas camera={{position: [4.2, 2.4, 5.2], fov: 42}} gl={{antialias: true}}>
            <color attach="background" args={['#f7f5f1']} />
            <ambientLight intensity={0.85} />
            <directionalLight position={[4, 6, 3]} intensity={1.1} />
            <Axes />
            <PathLines />
            <Tracer local={local} />
            <Grid
              infiniteGrid
              fadeDistance={18}
              sectionSize={1}
              cellSize={0.25}
              sectionColor="#d4d0c8"
              cellColor="#e8e4dc"
              position={[0, -0.02, 0]}
            />
            <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
          </Canvas>
          <p className={styles.hint}>拖拽旋转 · 滚轮缩放 · X 红橙轨迹 / Y 轴向上 / Z 景深</p>
        </div>
      </div>
    </div>
  )
}
