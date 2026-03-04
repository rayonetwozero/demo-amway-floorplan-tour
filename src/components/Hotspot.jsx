import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const COLOUR_DEFAULT = new THREE.Color('#44549c')
const COLOUR_HOVER   = new THREE.Color('#4dff01')
const EXTRA_HEIGHT   = 0.9  // extra stem height above base position.y

// Reusable geometry / material (created once, shared across instances)
const pinSphereGeo  = new THREE.SphereGeometry(0.12, 16, 16)
const pinRingGeo    = new THREE.RingGeometry(0.15, 0.22, 32)
const pinPulseGeo   = new THREE.RingGeometry(0.22, 0.28, 32)

export default function Hotspot({ data, index, onHover, onClick }) {
  const { position, label, description, url } = data
  const pos = [position.x, position.y, position.z]

  const sphereRef  = useRef()
  const ringRef    = useRef()
  const pulseRef   = useRef()
  const groupRef   = useRef()

  const [hovered, setHovered] = useState(false)
  const { gl } = useThree()

  // Animate: pulse ring + bobbing
  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Gentle bob
    if (groupRef.current) {
      groupRef.current.position.y = position.y + Math.sin(t * 1.8) * 0.04
    }

    // Pulse ring scale
    if (pulseRef.current) {
      const pulse = 1 + 0.4 * ((Math.sin(t * 2.5) + 1) / 2)
      pulseRef.current.scale.setScalar(pulse)
      pulseRef.current.material.opacity = hovered
        ? 0.6 - 0.4 * ((Math.sin(t * 2.5) + 1) / 2)
        : 0.3 - 0.2 * ((Math.sin(t * 2.5) + 1) / 2)
    }

    // Sphere colour
    if (sphereRef.current) {
      sphereRef.current.material.color.lerp(
        hovered ? COLOUR_HOVER : COLOUR_DEFAULT,
        0.12
      )
      sphereRef.current.material.emissive.lerp(
        hovered ? COLOUR_HOVER : new THREE.Color(0, 0, 0),
        0.12
      )
      sphereRef.current.material.emissiveIntensity = hovered ? 0.5 : 0
    }
  })

  // Project 3D → screen for tooltip positioning
  const getScreenPos = useCallback((e) => {
    const vector = new THREE.Vector3(...pos)
    vector.project(e.camera)
    const x = (vector.x * 0.5 + 0.5) * gl.domElement.clientWidth
    const y = (-(vector.y * 0.5) + 0.5) * gl.domElement.clientHeight
    return { x, y }
  }, [pos, gl])

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(true)
    gl.domElement.style.cursor = 'pointer'
    const { x, y } = getScreenPos(e)
    onHover({ label, description, x, y })
  }, [label, description, getScreenPos, onHover, gl])

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation()
    setHovered(false)
    gl.domElement.style.cursor = 'auto'
    onHover(null)
  }, [onHover, gl])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    onClick(url)
  }, [url, onClick])

  return (
    <group ref={groupRef} position={pos}>
      {/* Pulse ring (always faces up) */}
      <mesh
        ref={pulseRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -position.y + 0.02, 0]}
      >
        <primitive object={pinPulseGeo} />
        <meshBasicMaterial
          color={hovered ? '#4dff01' : '#ffffff'}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Static ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -position.y + 0.01, 0]}
      >
        <primitive object={pinRingGeo} />
        <meshBasicMaterial
          color={hovered ? '#4dff01' : '#ffffff'}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Sphere pin — the interactive mesh */}
      <mesh
        ref={sphereRef}
        position={[0, EXTRA_HEIGHT, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <primitive object={pinSphereGeo} />
        <meshStandardMaterial
          color={COLOUR_DEFAULT.clone()}
          emissive={new THREE.Color(0, 0, 0)}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Number label on sphere */}
      <Text
        position={[0, EXTRA_HEIGHT, 0]}
        fontSize={0.10}
        color="#222222"
        anchorX="center"
        anchorY="middle"
        depthOffset={-2}
        renderOrder={1}
      >
        {String(index)}
      </Text>

      {/* Vertical stem */}
      <mesh position={[0, (-position.y / 2) + (EXTRA_HEIGHT / 2), 0]}>
        <cylinderGeometry args={[0.015, 0.015, position.y + EXTRA_HEIGHT, 6]} />
        <meshBasicMaterial
          color={hovered ? '#4dff01' : '#ffffff'}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}
