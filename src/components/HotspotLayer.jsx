import Hotspot from './Hotspot'
import TextLabel from './TextLabel'

export default function HotspotLayer({ hotspots, onHover, onClick }) {
  const interactiveSpots = hotspots.filter((s) => !s.textOnly)
  const textSpots = hotspots.filter((s) => s.textOnly)

  return (
    <group>
      {interactiveSpots.map((spot, index) => (
        <Hotspot
          key={spot.id}
          data={spot}
          index={index + 1}
          onHover={onHover}
          onClick={onClick}
        />
      ))}
      {textSpots.map((spot) => (
        <TextLabel key={spot.id} data={spot} />
      ))}
    </group>
  )
}
