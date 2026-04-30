import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signOut } from '../../features/auth/authSlice'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, user } = useAuth()

  const handleSignOut = async () => {
    await dispatch(signOut())
    navigate('/login')
    toast.success('Signed out')
  }

  return (
    <nav style={{
      background: '#111827',
      borderBottom: '1px solid #1e293b',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.25rem', color: '#6366f1' }}>
        FullStack App
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/products" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Products</Link>
            <Link to="/dashboard" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Dashboard</Link>
            <Link to="/profile" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Profile</Link>
            {isAdmin && <Link to="/admin" style={{ color: '#f59e0b', fontSize: '0.9rem' }}>Admin</Link>}
            <button onClick={handleSignOut} style={{
              background: 'transparent',
              border: '1px solid #334155',
              color: '#94a3b8',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Login</Link>
            <Link to="/signup" style={{
              background: '#6366f1',
              color: '#fff',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}