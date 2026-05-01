export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div style={{
      border: '1px solid rgba(255,51,51,0.3)',
      background: 'rgba(255,51,51,0.04)',
      padding: '0.65rem 0.9rem',
      marginBottom: '1.25rem',
      fontSize: '0.65rem',
      fontFamily: "'Share Tech Mono', monospace",
      letterSpacing: '0.08em',
      color: '#ff3333',
    }}>
      ✕ {message.toUpperCase()}
    </div>
  )
}