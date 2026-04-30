export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div style={{
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      color: '#fca5a5',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      marginBottom: '1rem',
    }}>
      {message}
    </div>
  )
}