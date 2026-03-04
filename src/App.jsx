import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import FloorPlan from './components/FloorPlan'
import HotspotLayer from './components/HotspotLayer'
import Tooltip from './components/Tooltip'
import hotspotData from './data/points.json'

const isMobile = window.innerWidth <= 768

export default function App() {
  const [tooltip, setTooltip] = useState(null)
  // tooltip: { label, description, x, y } | null

  const handleHover = useCallback((info) => {
    setTooltip(info) // null to hide, or { label, description, x, y }
  }, [])

  const handleClick = useCallback((url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <>
      {/* ── 3D Canvas ─────────────────────────────────── */}
      <Canvas
        camera={{
          position: isMobile ? [1.2, 18, 6] : [1.2, 12, 3],
          fov: isMobile ? 65 : 50,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true }}
        shadows
        aria-label="3D 互動空間平面圖"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[8, 16, 8]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-8, 10, -8]} intensity={0.4} />

          {/* Model */}
          <FloorPlan />

          {/* Hotspots */}
          <HotspotLayer
            hotspots={hotspotData.hotspots}
            onHover={handleHover}
            onClick={handleClick}
          />

          {/* Camera controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.07}
            minDistance={3}
            maxDistance={22}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
            target={[1.2, 0, -0.5]}
          />
        </Suspense>
      </Canvas>

      {/* ── HTML overlays (pointer-events: none by default) */}
      <Tooltip tooltip={tooltip} />

      <div className="page-title">新竹安麗空間</div>

      <div className="controls-hint">
        <span className="desktop-only"><strong>拖曳</strong> 旋轉</span>
        <span className="desktop-only"><strong>滾輪</strong> 縮放</span>
        <span className="mobile-only"><strong>單指</strong> 旋轉</span>
        <span className="mobile-only"><strong>雙指</strong> 縮放</span>
      </div>
    </>
  )
}
