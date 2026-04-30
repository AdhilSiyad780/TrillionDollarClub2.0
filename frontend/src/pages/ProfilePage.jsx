import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from '../features/auth/authSlice'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import toast from 'react-hot-toast'

const S = {
  page: { maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' },
  card: { background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '2rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '0.95rem', marginBottom: '1.25rem' },
  btn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 600 },
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', avatar: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', avatar: user.avatar || '' })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/api/users/me', form)
      await dispatch(fetchCurrentUser())
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>My Profile</h1>
      <div style={S.card}>
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#0a0f1e', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>EMAIL</div>
          <div style={{ color: '#94a3b8' }}>{user?.email}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={S.label}>Display Name</label>
          <input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
          <label style={S.label}>Avatar URL</label>
          <input style={S.input} value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} placeholder="https://..." />
          {form.avatar && <img src={form.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: '1.25rem' }} />}
          <button style={S.btn} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}