export default function Tooltip({ tooltip }) {
  if (!tooltip) return null

  const { label, description, x, y } = tooltip

  return (
    <div
      className="hotspot-tooltip"
      style={{ left: x, top: y }}
      role="tooltip"
      aria-live="polite"
    >
      <div style={{ fontWeight: 600, marginBottom: description ? 4 : 0 }}>
        {label}
      </div>
      {description && (
        <div style={{ opacity: 0.7, fontSize: 12, marginTop: 2 }}>
          {description}
        </div>
      )}
      <div style={{
        marginTop: 6,
        fontSize: 11,
        opacity: 0.5,
        letterSpacing: '0.05em'
      }}>
        點擊開啟 →
      </div>
    </div>
  )
}
