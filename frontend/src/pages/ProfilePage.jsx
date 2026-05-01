import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from '../features/auth/authSlice'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, isAdmin } = useAuth()
  const [form, setForm] = useState({ name: '', avatar: '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [focused, setFocused] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    if (user) setForm({ name: user.name || '', avatar: user.avatar || '' })
  }, [user])

  // Upload avatar image to Cloudinary via backend
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(f => ({ ...f, avatar: data.url }))
      toast.success('AVATAR UPLOADED')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/api/users/me', form)
      await dispatch(fetchCurrentUser())
      toast.success('PROFILE UPDATED')
    } catch {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (name) => ({
    width: '100%',
    background: '#000',
    border: '1px solid',
    borderColor: focused === name ? '#fff' : '#1a1a1a',
    padding: '0.8rem 1rem',
    color: '#fff',
    fontSize: '0.78rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.05em',
    transition: 'border-color 0.15s',
    outline: 'none',
    display: 'block',
  })

  const labelStyle = {
    display: 'block',
    fontSize: '0.55rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#333',
    marginBottom: '0.4rem',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        .save-btn:hover:not(:disabled) {
          background: #fff !important;
          color: #000 !important;
        }
        .save-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .avatar-upload:hover .avatar-overlay {
          opacity: 1 !important;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem', animation: 'fadeUp 0.3s ease' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.2em',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}>
            TRILLIONDOLLARCLUB / PROFILE
          </div>
          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(1.2rem, 4vw, 1.75rem)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Identity
          </h1>
        </div>

        {/* ── Identity card ── */}
        <div style={{
          border: '1px solid #1a1a1a',
          marginBottom: '1px',
        }}>
          {/* Avatar + basic info row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.25rem',
            borderBottom: '1px solid #111',
            background: '#080808',
          }}>
            {/* Avatar */}
            <div
              className="avatar-upload"
              onClick={() => fileRef.current.click()}
              style={{
                width: 64,
                height: 64,
                flexShrink: 0,
                border: '1px solid #2a2a2a',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                background: '#111',
              }}
            >
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(20%)' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', color: '#333',
                }}>
                  ◈
                </div>
              )}
              {/* Hover overlay */}
              <div className="avatar-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.15s',
              }}>
                <span style={{
                  fontSize: '0.5rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.1em',
                  color: '#fff',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}>
                  {uploading ? 'UPLOADING' : 'CHANGE'}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Info */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '0.3rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user?.name || 'NO NAME SET'}
              </div>
              <div style={{
                fontSize: '0.65rem',
                fontFamily: "'Share Tech Mono', monospace",
                color: '#444',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '0.4rem',
              }}>
                {user?.email}
              </div>
              {isAdmin && (
                <span style={{
                  display: 'inline-block',
                  padding: '0.1rem 0.45rem',
                  border: '1px solid #fff',
                  fontSize: '0.5rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#fff',
                }}>
                  ADMIN
                </span>
              )}
            </div>
          </div>

          {/* Account meta strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: '#111',
          }}>
            {[
              { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—' },
              { label: 'Access Level', value: isAdmin ? 'LEVEL 2 — ADMIN' : 'LEVEL 1 — MEMBER' },
            ].map(item => (
              <div key={item.label} style={{ padding: '0.75rem 1rem', background: '#000' }}>
                <div style={{ fontSize: '0.5rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.15em', color: '#333', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.06em', color: '#666' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Edit form ── */}
        <div style={{
          border: '1px solid #1a1a1a',
          padding: '1.5rem',
          background: '#000',
        }}>
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.2em',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            ── EDIT IDENTITY
          </div>

          <form onSubmit={handleSubmit}>
            {/* Display name */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Display Name</label>
              <input
                style={inputStyle('name')}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                placeholder="Your handle"
                maxLength={50}
              />
            </div>

            {/* Avatar URL — manual fallback */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Avatar URL</label>
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  style={{
                    fontSize: '0.55rem',
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    background: 'transparent',
                    border: '1px solid #2a2a2a',
                    color: '#555',
                    padding: '0.2rem 0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555' }}
                >
                  {uploading ? 'Uploading...' : '⬆ Upload File'}
                </button>
              </div>
              <input
                style={inputStyle('avatar')}
                value={form.avatar}
                onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                onFocus={() => setFocused('avatar')}
                onBlur={() => setFocused(null)}
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="save-btn"
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                fontSize: '0.7rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
                cursor: loading || uploading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '— SAVING —' : '→ SAVE CHANGES'}
            </button>
          </form>
        </div>

      </div>
    </>
  )
}