import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, fetchCurrentUser, selectAuthLoading, selectAuthError, clearError } from '../features/auth/authSlice'
import ErrorMessage from '../components/common/ErrorMessage'
import toast from 'react-hot-toast'

const S = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' },
  card: { background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' },
  title: { fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f8fafc' },
  sub: { color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '0.95rem', marginBottom: '1.25rem', transition: 'border 0.2s' },
  btn: { width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.85rem', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem' },
  link: { textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' },
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(signIn(form))
    if (signIn.fulfilled.match(result)) {
      await dispatch(fetchCurrentUser())
      toast.success('Welcome back!')
      navigate('/dashboard')
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h1 style={S.title}>Welcome back</h1>
        <p style={S.sub}>Sign in to your account</p>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <label style={S.label}>Email</label>
          <input style={S.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          <label style={S.label}>Password</label>
          <input style={S.input} name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          <button style={S.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={S.link}>
          Don't have an account? <Link to="/signup" style={{ color: '#6366f1' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}