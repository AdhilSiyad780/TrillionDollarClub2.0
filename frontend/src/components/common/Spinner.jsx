export default function Spinner() {
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        gap: '1rem',
      }}>

        {/* Spinner ring */}
        <div style={{ position: 'relative', width: 36, height: 36 }}>
          {/* Track */}
          <div style={{
            position: 'absolute', inset: 0,
            border: '1px solid #1a1a1a',
            borderRadius: '50%',
          }} />
          {/* Active arc */}
          <div style={{
            position: 'absolute', inset: 0,
            border: '1px solid transparent',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          {/* Inner dot */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 4, height: 4,
            background: '#333',
            borderRadius: '50%',
            animation: 'pulse-opacity 1.4s ease infinite',
          }} />
        </div>

        {/* Label */}
        <div style={{
          fontSize: '0.55rem',
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: '0.2em',
          color: '#333',
          textTransform: 'uppercase',
          animation: 'pulse-opacity 1.4s ease infinite',
        }}>
          Loading
          <span style={{ marginLeft: '2px', animation: 'pulse-opacity 0.8s step-end infinite' }}>_</span>
        </div>

      </div>
    </>
  )
}