import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, OrbitControls, Text } from '@react-three/drei'
import katex from 'katex'
import { useEffect, useMemo, useRef, useState } from 'react'
import { F, G, samplePath } from 'card-orbit'
import * as THREE from 'three'
import 'katex/dist/katex.min.css'

const SCALE = 0.012
const SPEED = 0.16

function toVec3(local: number): THREE.Vector3 {
  const p = samplePath(local, true)
  // CSS: +x% right, +y% down; Three: +X right, +Y up, +Z toward camera-ish
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

function Tracer({ local }: { local: number }) {
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

function Formula({ tex, className }: { tex: string; className?: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: false }),
    [tex],
  )
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
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
      outlineColor="#f7f5f1"
    >
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
      : new THREE.LineBasicMaterial({ color })
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

export function PathPage() {
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
    { id: 'rise' as const, label: '① 上升', color: '#cc5400', hint: '竖直爬上来' },
    { id: 'arc' as const, label: '② 拐弯', color: '#0a0a0a', hint: '四分之一圆弧' },
    { id: 'exit' as const, label: '③ 退出', color: '#6b7280', hint: '水平滑出' },
  ]

  return (
    <div className="min-h-[100dvh] bg-[#efece6] text-[#0a0a0a]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-24 pb-12 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-12 lg:px-8 lg:pt-28 lg:pb-16">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#cc5400] uppercase">
            R3F · KaTeX
          </p>
          <h1
            className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            3D 坐标轴上的轨道
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">
            拖拽旋转查看。路径与库内 <code className="text-[#0a0a0a]">samplePath</code> 一致；
            <Formula tex="Z" className="mx-0.5" /> 由{' '}
            <Formula tex="\mathrm{depth}" /> 映射，靠近时点更大更靠前。
          </p>

          <div className="mt-6 space-y-2 rounded-xl border border-black/8 bg-white/50 px-4 py-3 text-[13px] leading-relaxed">
            <div>
              <Formula tex="\mathrm{local}\in[0,1]" />
              <span className="text-neutral-500"> — 单卡在窗口内的路径参数</span>
            </div>
            <div>
              <Formula tex="\mathrm{phase}=(i/n+\mathrm{progress})\bmod 1" />
            </div>
            <div>
              <Formula tex="\mathrm{depth}=\sin(\pi\cdot u(\mathrm{local}))" />
            </div>
            <div className="font-mono text-[12px] text-neutral-500">
              local = {local.toFixed(3)} · depth = {point.depth.toFixed(2)} · seg = {seg}
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {segs.map((s) => (
              <li
                key={s.id}
                className={`flex items-baseline gap-3 transition-opacity ${seg === s.id ? 'opacity-100' : 'opacity-40'}`}
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                <div>
                  <div className="text-[15px] font-semibold">{s.label}</div>
                  <div className="text-[13px] text-neutral-500">{s.hint}</div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="mt-8 w-fit rounded-md bg-[#0a0a0a] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#222]"
          >
            {paused ? '继续动画' : '暂停示踪点'}
          </button>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f1] shadow-[0_24px_60px_rgba(20,20,20,0.08)] lg:min-h-[560px]">
          <Canvas
            camera={{ position: [4.2, 2.4, 5.2], fov: 42 }}
            gl={{ antialias: true }}
          >
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
          <p className="pointer-events-none absolute bottom-3 left-3 text-[11px] text-neutral-500">
            拖拽旋转 · 滚轮缩放 · X 红橙轨迹 / Y 轴向上 / Z 景深
          </p>
        </div>
      </div>
    </div>
  )
}
