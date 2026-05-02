import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  signIn, fetchCurrentUser,
  selectAuthLoading, selectAuthError, clearError
} from '../features/auth/authSlice'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

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
      navigate('/')
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/' }
    })
    if (error) toast.error(error.message)
  }

  const inputStyle = (name) => ({
    width: '100%',
    background: '#000',
    border: '1px solid',
    borderColor: focused === name ? '#fff' : error ? '#ff333344' : '#1a1a1a',
    padding: '0.8rem 0.9rem',
    color: '#fff',
    fontSize: '0.8rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.04em',
    transition: 'border-color 0.15s',
    display: 'block',
    outline: 'none',
    WebkitAppearance: 'none',
    borderRadius: 0,
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .login-wrap {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          padding: 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: #000;
          border: 1px solid #1a1a1a;
          padding: 1.75rem 1.25rem;
          position: relative;
          animation: fadeUp 0.3s ease forwards;
        }

        @media (min-width: 480px) {
          .login-card { padding: 2.5rem 2rem; }
        }

        .login-submit {
          width: 100%;
          padding: 0.85rem;
          background: transparent;
          border: 1px solid #fff;
          color: #fff;
          fontSize: 0.7rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.15s;
          cursor: pointer;
          font-size: 0.7rem;
          -webkit-tap-highlight-color: transparent;
        }
        .login-submit:active:not(:disabled),
        .login-submit:hover:not(:disabled) {
          background: #fff;
          color: #000;
        }
        .login-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .google-btn {
          width: 100%;
          padding: 0.85rem;
          background: #fff;
          border: 1px solid #fff;
          color: #000;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .google-btn:active { background: #ddd; }

        .login-link:hover,
        .login-link:active { color: #fff !important; }

        /* Remove iOS input styling */
        input { -webkit-appearance: none; border-radius: 0; }
      `}</style>

      <div className="login-wrap">

        {/* Subtle background grid — hidden on very small screens */}
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <div className="login-card">

          {/* Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{
              fontSize: '0.52rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.18em',
              color: '#333',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
            }}>
              TRILLIONDOLLARCLUB / AUTH
            </div>
            <h1 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(1.2rem, 6vw, 1.65rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}>
              Access<br />Terminal
            </h1>
            <div style={{
              fontSize: '0.6rem',
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
              padding: '0.6rem 0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.62rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.06em',
              color: '#ff3333',
              wordBreak: 'break-word',
            }}>
              ✕ {error.toUpperCase()}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.52rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: focused === 'email' ? '#888' : '#333',
                marginBottom: '0.35rem',
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
                inputMode="email"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.52rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: focused === 'password' ? '#888' : '#333',
                marginBottom: '0.35rem',
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
              style={{ marginBottom: '0.75rem' }}
            >
              {loading ? '— AUTHENTICATING —' : '→ INITIATE ACCESS'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#111' }} />
            <span style={{ fontSize: '0.5rem', fontFamily: "'Share Tech Mono', monospace", color: '#333', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#111' }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="google-btn"
            style={{ marginBottom: '1.5rem' }}
          >
            G — Continue with Google
          </button>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #111',
            paddingTop: '1.1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{
              fontSize: '0.55rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.08em',
              color: '#333',
              flexShrink: 0,
            }}>
              NO CREDENTIALS?
            </span>
            <Link
              to="/signup"
              className="login-link"
              style={{
                fontSize: '0.55rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#555',
                borderBottom: '1px solid #222',
                paddingBottom: '1px',
                transition: 'color 0.15s',
                flexShrink: 0,
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