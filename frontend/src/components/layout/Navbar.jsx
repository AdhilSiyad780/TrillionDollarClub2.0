import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signOut } from '../../features/auth/authSlice'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import tdcLogo from '../../assets/logo.png'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await dispatch(signOut())
    navigate('/login')
    toast.success('SIGNED OUT')
    setMenuOpen(false)
  }

  // Close drawer when viewport widens to desktop — no listener leak
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 601px)')
    const handler = (e) => { if (e.matches) setMenuOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/profile', label: 'Profile' },
        ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
      ]
    : [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/login', label: 'Login' },
      ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        @media (max-width: 600px) {
          .tdc-desktop-nav { display: none !important; }
          .tdc-burger      { display: flex !important; }
        }

        /* Smooth active-link hover without JS */
        .tdc-nav-link:not(.tdc-nav-link--active):hover {
          color: #aaa !important;
        }
        .tdc-exit-btn:hover {
          border-color: #fff !important;
          color: #fff !important;
        }
      `}</style>

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.96)',
        borderBottom: '1px solid #1a1a1a',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        boxSizing: 'border-box',
        width: '100%',
      }}>

        {/* ── Logo ── */}
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={tdcLogo}
            alt="TDC"
            style={{ height: '36px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* ── Desktop links ── */}
        <div className="tdc-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`tdc-nav-link${isActive(link.to) ? ' tdc-nav-link--active' : ''}`}
              style={{
                padding: '0.35rem 0.8rem',
                fontSize: '0.62rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: isActive(link.to) ? '#fff' : '#444',
                borderBottom: isActive(link.to) ? '1px solid #fff' : '1px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="tdc-exit-btn"
              style={{
                marginLeft: '0.75rem',
                padding: '0.35rem 0.8rem',
                background: 'transparent',
                border: '1px solid #222',
                color: '#444',
                fontSize: '0.62rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                transition: 'border-color 0.15s, color 0.15s',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Exit
            </button>
          ) : (
            <Link
              to="/signup"
              style={{
                marginLeft: '0.75rem',
                padding: '0.35rem 0.9rem',
                background: '#fff',
                color: '#000',
                fontSize: '0.62rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Join
            </Link>
          )}
        </div>

        {/* ── Mobile burger ── */}
        <button
          className="tdc-burger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="tdc-mobile-drawer"
          style={{
            display: 'none',           /* shown via media query */
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '1.1rem',
            padding: '0.5rem',
            fontFamily: "'Share Tech Mono', monospace",
            lineHeight: 1,
            cursor: 'pointer',
            /* 44×44 minimum tap target */
            minWidth: '44px',
            minHeight: '44px',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        id="tdc-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          top: '52px',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          zIndex: 99,
          borderTop: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 1.25rem',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          /* Slide in/out */
          transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
          transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: menuOpen ? 'auto' : 'none',
          visibility: menuOpen ? 'visible' : 'hidden',
        }}
      >
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              padding: '1.1rem 0',
              fontSize: '0.8rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: isActive(link.to) ? '#fff' : '#444',
              borderBottom: '1px solid #111',
              textDecoration: 'none',
              /* 44px minimum tap target */
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {link.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'transparent',
                border: '1px solid #222',
                color: '#555',
                fontSize: '0.75rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                minHeight: '44px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              Exit System
            </button>
          ) : (
            <Link
              to="/signup"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                background: '#fff',
                color: '#000',
                fontSize: '0.75rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                minHeight: '44px',
              }}
            >
              Join Now
            </Link>
          )}
        </div>
      </div>

      {/* ── Backdrop (tap outside to close) ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 98,
            background: 'transparent',
          }}
        />
      )}
    </>
  )
}