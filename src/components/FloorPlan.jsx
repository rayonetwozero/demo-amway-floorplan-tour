import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Pre-load for faster first render
useGLTF.preload('/models/model-space.glb')

export default function FloorPlan() {
  const { scene } = useGLTF('/models/model-space.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        // Ensure materials are double-sided (avoids invisible faces from certain angles)
        if (child.material) {
          child.material.side = THREE.DoubleSide
        }
      }
    })
  }, [scene])

  return <primitive object={scene} />
}
