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

  // Password strength
  const strength = (() => {
    const p = form.password
    if (!p) return null
    if (p.length < 6) return { label: 'WEAK', width: '25%', color: '#ff3333' }
    if (p.length < 10) return { label: 'FAIR', width: '55%', color: '#ffcc00' }
    if (p.length < 14) return { label: 'STRONG', width: '80%', color: '#33ff88' }
    return { label: 'MAXIMUM', width: '100%', color: '#fff' }
  })()

  // Password match indicator
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
    padding: '0.85rem 1rem',
    color: '#fff',
    fontSize: '0.78rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.06em',
    transition: 'border-color 0.15s',
    outline: 'none',
    display: 'block',
  })

  const labelStyle = (name) => ({
    display: 'block',
    fontSize: '0.55rem',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: focused === name ? '#888' : '#333',
    marginBottom: '0.4rem',
    transition: 'color 0.15s',
  })

  const fields = [
    { name: 'email',    label: 'Email Address', type: 'email',    placeholder: 'operative@domain.com', autoComplete: 'email' },
    { name: 'password', label: 'Password',       type: 'password', placeholder: '••••••••••••',         autoComplete: 'new-password' },
    { name: 'confirm',  label: 'Confirm Password', type: 'password', placeholder: '••••••••••••',       autoComplete: 'new-password' },
  ]

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
        .signup-card { animation: fadeUp 0.35s ease forwards; }
        .signup-submit:hover:not(:disabled) {
          background: #fff !important;
          color: #000 !important;
        }
        .signup-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .signup-link:hover { color: #fff !important; }
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
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Corner brackets */}
        {[
          { top: 0, left: 0,   borderTop: '1px solid #1a1a1a', borderLeft:  '1px solid #1a1a1a' },
          { top: 0, right: 0,  borderTop: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a' },
          { bottom: 0, left: 0,  borderBottom: '1px solid #1a1a1a', borderLeft:  '1px solid #1a1a1a' },
          { bottom: 0, right: 0, borderBottom: '1px solid #1a1a1a', borderRight: '1px solid #1a1a1a' },
        ].map((style, i) => (
          <div key={i} style={{ position: 'absolute', width: 60, height: 60, pointerEvents: 'none', ...style }} />
        ))}

        {/* Card */}
        <div className="signup-card" style={{
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
              TRILLIONDOLLARCLUB / REGISTER
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
              Request
              <br />
              Access
            </h1>
            <div style={{
              fontSize: '0.65rem',
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
            {fields.map(({ name, label, type, placeholder, autoComplete }) => (
              <div key={name} style={{ marginBottom: name === 'confirm' ? '0' : '1rem' }}>
                <label style={labelStyle(name)}>{label}</label>
                <input
                  style={inputStyle(name)}
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  onFocus={() => setFocused(name)}
                  onBlur={() => setFocused(null)}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  required
                  minLength={name !== 'email' ? 6 : undefined}
                />

                {/* Password strength bar */}
                {name === 'password' && form.password.length > 0 && (
                  <div style={{ marginTop: '0.4rem', marginBottom: '0.25rem' }}>
                    <div style={{
                      height: '2px',
                      background: '#111',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        width: strength?.width,
                        background: strength?.color,
                        transition: 'width 0.3s, background 0.3s',
                      }} />
                    </div>
                    <div style={{
                      fontSize: '0.5rem',
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: '0.15em',
                      color: strength?.color,
                      marginTop: '0.25rem',
                      textAlign: 'right',
                    }}>
                      {strength?.label}
                    </div>
                  </div>
                )}

                {/* Match indicator */}
                {name === 'confirm' && form.confirm.length > 0 && (
                  <div style={{
                    fontSize: '0.5rem',
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: '0.15em',
                    color: passwordsMatch ? '#33ff88' : '#ff3333',
                    marginTop: '0.35rem',
                    textAlign: 'right',
                  }}>
                    {passwordsMatch ? '✓ MATCH' : '✕ NO MATCH'}
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="signup-submit"
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
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {loading ? '— CREATING ACCOUNT —' : '→ REQUEST ACCESS'}
            </button>
          </form>

          {/* Footer */}
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
              HAVE CREDENTIALS?
            </span>
            <Link
              to="/login"
              className="signup-link"
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
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}