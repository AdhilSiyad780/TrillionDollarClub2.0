import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()

  const cards = [
    { label: 'Browse Products', to: '/products', icon: '📦', desc: 'View all available products' },
    { label: 'My Profile', to: '/profile', icon: '👤', desc: 'Update your name and avatar' },
    ...(isAdmin ? [{ label: 'Admin Panel', to: '/admin', icon: '🛡️', desc: 'Manage users and products' }] : []),
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Hey, {user?.name || user?.email?.split('@')[0]} 👋
        </h1>
        <p style={{ color: '#64748b' }}>Welcome to your dashboard</p>
        {isAdmin && (
          <span style={{ display: 'inline-block', marginTop: '0.5rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 600 }}>
            Admin
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {cards.map(card => (
          <Link key={card.to} to={card.to} style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '1.75rem',
            transition: 'border-color 0.2s',
            display: 'block',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{card.icon}</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.4rem' }}>{card.label}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{card.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}