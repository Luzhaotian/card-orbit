import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PathPage } from './pages/PathPage'

function DemoNav() {
  const link =
    'rounded-md px-3 py-1.5 text-[13px] font-medium transition aria-[current=page]:bg-[#0a0a0a] aria-[current=page]:text-white'
  const idle = 'text-[#0a0a0a]/70 hover:bg-black/5 hover:text-[#0a0a0a]'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-5 sm:px-6 lg:px-8">
      <div className="pointer-events-auto flex items-center gap-2 text-sm font-semibold tracking-tight text-[#0a0a0a]">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#0a0a0a] text-[11px] text-white">
          CO
        </span>
        Card Orbit
      </div>
      <nav className="pointer-events-auto flex items-center gap-1 rounded-lg border border-black/10 bg-white/80 p-1 backdrop-blur-sm">
        <NavLink to="/" end className={({ isActive }) => `${link} ${isActive ? '' : idle}`}>
          Demo
        </NavLink>
        <NavLink to="/path" className={({ isActive }) => `${link} ${isActive ? '' : idle}`}>
          轨道坐标
        </NavLink>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <HashRouter>
      <DemoNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/path" element={<PathPage />} />
      </Routes>
    </HashRouter>
  )
}
