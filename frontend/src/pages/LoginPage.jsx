import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  signIn, fetchCurrentUser,
  selectAuthLoading, selectAuthError, clearError
} from '../features/auth/authSlice'
import toast from 'react-hot-toast'
import { supabase } from '../services/supabase' // make sure this exists


export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [form, setForm] = useState({ email: '', password: '' })
  const [focused, setFocused] = useState(null)

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(signIn(form))
    if (signIn.fulfilled.match(result)) {
      await dispatch(fetchCurrentUser())
      toast.success('ACCESS GRANTED')
      navigate('/dashboard')
    }
  }

  const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard'
    }
  })

  if (error) {
    toast.error(error.message)
  }
}

  const inputStyle = (name) => ({
    width: '100%',
    background: '#000',
    border: '1px solid',
    borderColor: focused === name ? '#fff' : error ? '#ff333344' : '#1a1a1a',
    padding: '0.85rem 1rem',
    color: '#fff',
    fontSize: '0.8rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.06em',
    transition: 'border-color 0.15s',
    display: 'block',
    outline: 'none',
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .login-card {
          animation: fadeUp 0.35s ease forwards;
        }
        .login-submit:hover:not(:disabled) {
          background: #fff !important;
          color: #000 !important;
        }
        .login-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .login-link:hover {
          color: #fff !important;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Corner decorations */}
        {['top:0;left:0', 'top:0;right:0', 'bottom:0;left:0', 'bottom:0;right:0'].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute',
            ...Object.fromEntries(pos.split(';').map(p => p.split(':'))),
            width: 60, height: 60,
            borderTop: i < 2 ? '1px solid #1a1a1a' : 'none',
            borderBottom: i >= 2 ? '1px solid #1a1a1a' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid #1a1a1a' : 'none',
            borderRight: i % 2 === 1 ? '1px solid #1a1a1a' : 'none',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Card */}
        <div className="login-card" style={{
          width: '100%',
          maxWidth: '400px',
          background: '#000',
          border: '1px solid #1a1a1a',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          position: 'relative',
          zIndex: 1,
        }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '0.55rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.2em',
              color: '#333',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              TRILLIONDOLLARCLUB / AUTH
            </div>
            <h1 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(1.3rem, 5vw, 1.75rem)',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
              lineHeight: 1.1,
            }}>
              Access
              <br />
              Terminal
            </h1>
            <div style={{
              fontSize: '0.65rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.1em',
              color: '#333',
            }}>
              AUTHENTICATE TO CONTINUE
              <span style={{ animation: 'blink 1s step-end infinite', marginLeft: '2px' }}>_</span>
            </div>
          </div>

          {/* Error */}
          {error && (
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
              ✕ {error.toUpperCase()}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.55rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: focused === 'email' ? '#888' : '#333',
                marginBottom: '0.4rem',
                transition: 'color 0.15s',
              }}>
                Email Address
              </label>
              <input
                style={inputStyle('email')}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="operative@domain.com"
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.55rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: focused === 'password' ? '#888' : '#333',
                marginBottom: '0.4rem',
                transition: 'color 0.15s',
              }}>
                Password
              </label>
              <input
                style={inputStyle('password')}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-submit"
              style={{
                width: '100%',
                padding: '0.9rem',
                background: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                fontSize: '0.7rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
                marginBottom: '1.5rem',
              }}
            >
              {loading
                ? '— AUTHENTICATING —'
                : '→ INITIATE ACCESS'}
            </button>
          </form>
          {/* GOOGLE LOGIN */}
<button
  type="button"
  onClick={handleGoogleLogin}
  style={{
    width: '100%',
    padding: '0.9rem',
    background: '#fff',
    border: 'none',
    color: '#000',
    fontSize: '0.7rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
    cursor: 'pointer'
  }}
>
  → Continue with Google
</button>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid #111',
            paddingTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '0.6rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.1em',
              color: '#333',
            }}>
              NO CREDENTIALS?
            </span>
            <Link
              to="/signup"
              className="login-link"
              style={{
                fontSize: '0.6rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#555',
                borderBottom: '1px solid #222',
                paddingBottom: '1px',
                transition: 'color 0.15s',
              }}
            >
              Request Access →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}