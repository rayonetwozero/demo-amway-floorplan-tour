import { Text, Billboard } from '@react-three/drei'

export default function TextLabel({ data }) {
  const { position, label } = data
  const pos = [position.x, position.y, position.z]

  return (
    <Billboard position={pos} follow={true}>
      <Text
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
        depthOffset={-1}
        renderOrder={1}
      >
        {label}
      </Text>
    </Billboard>
  )
}
