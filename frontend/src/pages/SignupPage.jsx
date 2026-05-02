import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  signUp, selectAuthLoading, selectAuthError, clearError
} from '../features/auth/authSlice'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [focused, setFocused] = useState(null)

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (error) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('PASSWORDS DO NOT MATCH')
      return
    }
    if (form.password.length < 6) {
      toast.error('MINIMUM 6 CHARACTERS')
      return
    }
    const result = await dispatch(signUp({ email: form.email, password: form.password }))
    if (signUp.fulfilled.match(result)) {
      toast.success('ACCOUNT CREATED — SIGN IN')
      navigate('/login')
    }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return null
    if (p.length < 6)  return { label: 'WEAK',    width: '25%',  color: '#ff3333' }
    if (p.length < 10) return { label: 'FAIR',    width: '55%',  color: '#ffcc00' }
    if (p.length < 14) return { label: 'STRONG',  width: '80%',  color: '#33ff88' }
    return               { label: 'MAXIMUM', width: '100%', color: '#fff' }
  })()

  const passwordsMatch = form.confirm.length > 0 && form.password === form.confirm

  const inputStyle = (name) => ({
    width: '100%',
    background: '#000',
    border: '1px solid',
    borderColor: focused === name
      ? '#fff'
      : name === 'confirm' && form.confirm.length > 0
        ? passwordsMatch ? 'rgba(51,255,136,0.4)' : 'rgba(255,51,51,0.4)'
        : error ? '#ff333322' : '#1a1a1a',
    padding: '0.8rem 0.9rem',
    color: '#fff',
    /*
     * font-size must be >= 16px on mobile to prevent iOS auto-zoom on focus.
     * We use 16px here; the Share Tech Mono feel is preserved via letter-spacing.
     */
    fontSize: '16px',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.04em',
    transition: 'border-color 0.15s',
    outline: 'none',
    display: 'block',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    borderRadius: 0,
    boxSizing: 'border-box',
  })

  const labelStyle = (name) => ({
    display: 'block',
    fontSize: '0.52rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: focused === name ? '#888' : '#333',
    marginBottom: '0.35rem',
    transition: 'color 0.15s',
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Prevent iOS font scaling */
        html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

        .signup-wrap {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: #000;
          padding: 0;
        }

        /* Full-bleed card on mobile, bordered card on desktop */
        .signup-card {
          width: 100%;
          max-width: 100%;
          background: #000;
          border: none;
          border-bottom: 1px solid #1a1a1a;
          padding: 2rem 1.25rem;
          position: relative;
          animation: fadeUp 0.3s ease forwards;
          /* Let content define height on mobile — avoids awkward whitespace */
          min-height: 0;
        }

        @media (min-width: 560px) {
          .signup-wrap {
            align-items: center;
            padding: 1rem;
          }
          .signup-card {
            max-width: 420px;
            border: 1px solid #1a1a1a;
            padding: 2.5rem 2rem;
            border-bottom: 1px solid #1a1a1a;
          }
        }

        .signup-submit {
          width: 100%;
          /* Minimum 44px tap target height */
          min-height: 44px;
          padding: 0.85rem;
          background: transparent;
          border: 1px solid #fff;
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 0.7rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          margin-top: 1.25rem;
          margin-bottom: 1.5rem;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .signup-submit:active:not(:disabled),
        .signup-submit:hover:not(:disabled) {
          background: #fff;
          color: #000;
        }
        .signup-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .signup-link:hover,
        .signup-link:active { color: #fff !important; }

        /* Remove all native input styling */
        input {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border-radius: 0;
        }
      `}</style>

      <div className="signup-wrap">

        {/* Background grid */}
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div className="signup-card" style={{ position: 'relative', zIndex: 1 }}>

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
              TRILLIONDOLLARCLUB / REGISTER
            </div>
            <h1 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(1.2rem, 6vw, 1.65rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
              margin: '0 0 0.5rem 0',
            }}>
              Request<br />Access
            </h1>
            <div style={{
              fontSize: '0.6rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.1em',
              color: '#333',
            }}>
              CREATE YOUR CREDENTIALS
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
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={labelStyle('email')}>Email Address</label>
              <input
                style={inputStyle('email')}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="operative@domain.com"
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={labelStyle('password')}>Password</label>
              <input
                style={inputStyle('password')}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••••••"
                autoComplete="new-password"
                required
                minLength={6}
              />
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div style={{ marginTop: '0.35rem' }}>
                  <div style={{ height: '2px', background: '#111', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      width: strength?.width,
                      background: strength?.color,
                      transition: 'width 0.3s, background 0.3s',
                    }} />
                  </div>
                  <div style={{
                    fontSize: '0.48rem',
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: '0.12em',
                    color: strength?.color,
                    marginTop: '0.2rem',
                    textAlign: 'right',
                  }}>
                    {strength?.label}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label style={labelStyle('confirm')}>Confirm Password</label>
              <input
                style={inputStyle('confirm')}
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                onFocus={() => setFocused('confirm')}
                onBlur={() => setFocused(null)}
                placeholder="••••••••••••"
                autoComplete="new-password"
                required
                minLength={6}
              />
              {/* Match indicator */}
              {form.confirm.length > 0 && (
                <div style={{
                  fontSize: '0.48rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.12em',
                  color: passwordsMatch ? '#33ff88' : '#ff3333',
                  marginTop: '0.25rem',
                  textAlign: 'right',
                }}>
                  {passwordsMatch ? '✓ MATCH' : '✕ NO MATCH'}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="signup-submit"
            >
              {loading ? '— CREATING ACCOUNT —' : '→ REQUEST ACCESS'}
            </button>
          </form>

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
              HAVE CREDENTIALS?
            </span>
            <Link
              to="/login"
              className="signup-link"
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
                /* Adequate tap target via padding */
                padding: '0.5rem 0',
              }}
            >
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}