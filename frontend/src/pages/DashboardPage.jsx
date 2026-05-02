import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  fetchProducts, deleteProduct, createProduct,
  selectProducts, selectProductsLoading, selectProductsMeta
} from '../features/products/productsSlice'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'
import api from '../services/api'
import toast from 'react-hot-toast'

// ── Shared styles ─────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: '#000',
  border: '1px solid #2a2a2a',
  padding: '0.7rem 0.9rem',
  color: '#fff',
  fontSize: '0.8rem',
  fontFamily: "'Share Tech Mono', monospace",
  letterSpacing: '0.05em',
  transition: 'border-color 0.15s',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.6rem',
  fontFamily: "'Share Tech Mono', monospace",
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#555',
  marginBottom: '0.4rem',
}

// ── Image uploader ────────────────────────────────────────────────
function ImageUploader({ images, setImages, uploading, setUploading }) {
  const fileRef = useRef()

  const handleFiles = async (files) => {
    if (!files.length) return
    if (images.length >= 10) { toast.error('Maximum 10 images'); return }
    const allowed = Array.from(files).slice(0, 10 - images.length)
    setUploading(true)
    try {
      const fd = new FormData()
      allowed.forEach(f => fd.append('files', f))
      const { data } = await api.post('/api/upload/images', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImages(prev => [...prev, ...data.urls])
      toast.success(`${data.urls.length} image${data.urls.length > 1 ? 's' : ''} uploaded`)
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <p style={labelStyle}>Images ({images.length}/10)</p>
      <div
        onClick={() => !uploading && fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#fff' }}
        onDragLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a' }}
        onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#2a2a2a'; handleFiles(e.dataTransfer.files) }}
        style={{
          border: '1px dashed #2a2a2a',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.15s',
          marginBottom: '0.75rem',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
          disabled={uploading}
        />
        {uploading ? (
          <span style={{ fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", color: '#555', letterSpacing: '0.1em' }}>
            UPLOADING...
          </span>
        ) : (
          <>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>⬆</div>
            <div style={{ fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", color: '#555', letterSpacing: '0.1em' }}>
              CLICK OR DRAG FILES
            </div>
            <div style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", color: '#2a2a2a', marginTop: '0.2rem' }}>
              JPG · PNG · WEBP · MAX 10
            </div>
          </>
        )}
      </div>
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: '0.4rem' }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                type="button"
                onClick={() => setImages(p => p.filter((_, j) => j !== i))}
                style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: '#000', border: '1px solid #333', color: '#fff', fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────
export default function HomePage() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectProductsLoading)
  const { page, totalPages } = useSelector(selectProductsMeta)
  const { isAdmin, isAuthenticated, user } = useAuth()

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' })
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { dispatch(fetchProducts({ page: 1 })) }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(fetchProducts({ page: 1, search }))
  }
  console.log(isAdmin,'the status of the user')
  const handleDelete = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this product?')) return
    await dispatch(deleteProduct(id))
    toast.success('PRODUCT DELETED')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (uploading) { toast.error('Wait for upload to finish'); return }
    setSubmitting(true)
    const result = await dispatch(createProduct({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      images,
    }))
    setSubmitting(false)
    if (createProduct.fulfilled.match(result)) {
      toast.success('PRODUCT CREATED')
      setShowForm(false)
      setForm({ name: '', description: '', price: '', category: '', stock: '' })
      setImages([])
      dispatch(fetchProducts({ page: 1 }))
    }
  }

  const field = (key, lbl, opts = {}) => (
    <div>
      <label style={labelStyle}>{lbl}</label>
      <input
        style={inputStyle}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        onFocus={e => e.target.style.borderColor = '#fff'}
        onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        {...opts}
      />
    </div>
  )

  const handle = user?.name || user?.email?.split('@')[0] || null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        /* ── Banner ── */
        .banner-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2rem, 10vw, 5.5rem);
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
          color: #fff;
        }
        .banner-title span { color: #2a2a2a; }

        /* ── Products ── */
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1px;
        }
        .prod-card {
          background: #000;
          border: 1px solid #1a1a1a;
          display: block;
          text-decoration: none;
          color: inherit;
          position: relative;
          transition: border-color 0.2s, background 0.2s;
        }
        .prod-card:hover { border-color: #3a3a3a; background: #080808; }
        .prod-card:hover .prod-arrow { opacity: 1; transform: translate(2px,-2px); }
        .prod-arrow {
          position: absolute; top: 10px; right: 10px;
          font-size: 0.8rem; color: #fff;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
          pointer-events: none;
          z-index: 2;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        /* ── Contact ── */
        .contact-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          border: 1px solid #1a1a1a;
          background: #000;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.15s, background 0.15s;
        }
        .contact-link:hover { border-color: #fff; background: #080808; }
        .contact-link:hover .contact-arrow { opacity: 1; }
        .contact-arrow { opacity: 0; transition: opacity 0.15s; font-size: 0.7rem; margin-left: auto; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .prod-grid { grid-template-columns: 1fr 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .header-row { flex-direction: column; align-items: flex-start !important; }
          .search-row { width: 100%; }
          .search-row input { width: 100% !important; }
        }
        @media (max-width: 380px) {
          .prod-grid { grid-template-columns: 1fr; }
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
      `}</style>

      {/* ════════════════════════════════════════
          BANNER
      ════════════════════════════════════════ */}
      <section style={{
        borderBottom: '1px solid #111',
        padding: 'clamp(3rem, 10vw, 6rem) clamp(1rem, 4vw, 3rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Breadcrumb */}
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.2em',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            TRILLIONDOLLARCLUB / HOME
            {handle && (
              <span style={{ marginLeft: '1rem', color: '#555' }}>
                ● {handle.toUpperCase()}
              </span>
            )}
          </div>

          {/* Main title */}
          <h1 className="banner-title" style={{ marginBottom: '1.5rem' }}>
            Trillion<br />
            <span>Dollar</span><br />
            Club
          </h1>

          {/* Tagline */}
          <div style={{
            fontSize: 'clamp(0.65rem, 2vw, 0.8rem)',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.15em',
            color: '#444',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            maxWidth: '480px',
            lineHeight: 1.8,
          }}>
            Premium products. Curated catalogue.
            <br />
            No compromise. No noise.
            <span style={{ animation: 'blink 1s step-end infinite', marginLeft: '2px' }}>_</span>
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status badges */}
            <span style={{
              padding: '0.3rem 0.75rem',
              border: '1px solid #1a1a1a',
              fontSize: '0.55rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.12em',
              color: '#33ff88',
            }}>
              ● LIVE
            </span>

            {isAuthenticated && isAdmin && (
              <span style={{
                padding: '0.3rem 0.75rem',
                border: '1px solid #fff',
                fontSize: '0.55rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.12em',
                color: '#fff',
              }}>
                ⬡ ADMIN
              </span>
            )}

            {!isAuthenticated && (
              <Link to="/signup" style={{
                padding: '0.5rem 1.25rem',
                background: '#fff',
                color: '#000',
                fontSize: '0.65rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: '1px solid #fff',
              }}>
                Join Now →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRODUCTS
      ════════════════════════════════════════ */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1rem' }}>

        {/* Section header */}
        <div className="header-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          gap: '1rem',
        }}>
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.2em',
            color: '#333',
            textTransform: 'uppercase',
          }}>
            ── CATALOGUE
          </div>

          <div className="search-row" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.35rem' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="SEARCH..."
                style={{ ...inputStyle, width: '160px', padding: '0.45rem 0.7rem', fontSize: '0.65rem' }}
                onFocus={e => e.target.style.borderColor = '#fff'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
              <button type="submit" style={{
                padding: '0.45rem 0.8rem',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                color: '#666',
                fontSize: '0.6rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666' }}
              >
                GO
              </button>
            </form>

            {isAdmin && (
              <button
                onClick={() => setShowForm(v => !v)}
                style={{
                  padding: '0.45rem 0.8rem',
                  background: showForm ? '#fff' : 'transparent',
                  border: '1px solid #fff',
                  color: showForm ? '#000' : '#fff',
                  fontSize: '0.6rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {showForm ? '✕ CANCEL' : '+ NEW'}
              </button>
            )}
          </div>
        </div>

        {/* Create form */}
        {showForm && isAdmin && (
          <div style={{
            border: '1px solid #2a2a2a',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            animation: 'fadeUp 0.2s ease',
          }}>
            <div style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.2em', color: '#333', marginBottom: '1.25rem' }}>
              ── NEW PRODUCT ENTRY ──
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-grid" style={{ marginBottom: '1rem' }}>
                {field('name', 'Product Name *', { required: true })}
                {field('price', 'Price (USD) *', { required: true, type: 'number', min: 0.01, step: 0.01 })}
                {field('category', 'Category')}
                {field('stock', 'Stock Qty', { type: 'number', min: 0 })}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = '#fff'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <ImageUploader images={images} setImages={setImages} uploading={uploading} setUploading={setUploading} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={submitting || uploading} style={{
                  padding: '0.7rem 1.5rem',
                  background: submitting ? '#111' : '#fff',
                  border: '1px solid #fff',
                  color: submitting ? '#555' : '#000',
                  fontSize: '0.65rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}>
                  {submitting ? 'CREATING...' : 'CREATE PRODUCT'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setImages([]) }} style={{
                  padding: '0.7rem 1.1rem',
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  color: '#555',
                  fontSize: '0.65rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid */}
        {loading ? <Spinner /> : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#2a2a2a', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.15em' }}>
            NO PRODUCTS FOUND
          </div>
        ) : (
          <>
            <div className="prod-grid">
              {products.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="prod-card">
                  <span className="prod-arrow">↗</span>

                  {/* Image */}
                  <div style={{ position: 'relative', background: '#080808' }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{
      display: 'block', width: '100%', height: 'auto',
      opacity: p.is_active ? 1 : 0.45,  // ← dims image when unavailable
      transition: 'opacity 0.2s',
    }} />
                    ) : (
                      <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", color: '#1a1a1a', letterSpacing: '0.15em' }}>NO IMAGE</span>
                      </div>
                    )}
                     {/* ── Unavailable badge ── */}
  {!p.is_active && (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.55)',
    }}>
      <span style={{
        fontSize: '0.55rem',
        fontFamily: "'Share Tech Mono', monospace",
        letterSpacing: '0.18em',
        color: '#ff3333',
        border: '1px solid rgba(255,51,51,0.4)',
        padding: '0.25rem 0.6rem',
        textTransform: 'uppercase',
        background: 'rgba(0,0,0,0.7)',
      }}>
        UNAVAILABLE
      </span>
    </div>
  )}
                    {p.images?.length > 1 && (
                      <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.85)', border: '1px solid #2a2a2a', padding: '0.15rem 0.4rem', fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", color: '#555', letterSpacing: '0.08em' }}>
                        +{p.images.length - 1}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.5rem', fontFamily: "'Share Tech Mono', monospace", color: '#333', letterSpacing: '0.15em', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                      {p.category || 'GENERAL'}
                    </div>
                    <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.5rem', textTransform: 'uppercase', lineHeight: 1.3 }}>
                      {p.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                      {isAdmin && (
                        <button
                          onClick={e => handleDelete(e, p.id)}
                          style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3333', background: 'transparent', border: '1px solid rgba(255,51,51,0.2)', padding: '0.25rem 0.5rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#ff3333'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,51,51,0.2)'}
                        >
                          DEL
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '2rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p}
                    onClick={() => dispatch(fetchProducts({ page: p, search }))}
                    style={{ width: 30, height: 30, border: '1px solid', borderColor: p === page ? '#fff' : '#2a2a2a', background: p === page ? '#fff' : 'transparent', color: p === page ? '#000' : '#555', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (p !== page) { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff' } }}
                    onMouseLeave={e => { if (p !== page) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555' } }}
                  >{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════ */}
      <section style={{
  borderTop: '1px solid #111',
  padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 3rem)',
}}>
  <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

    {/* Section label */}
    <div style={{
      fontSize: '0.55rem',
      fontFamily: "'Share Tech Mono', monospace",
      letterSpacing: '0.2em',
      color: '#333',
      textTransform: 'uppercase',
      marginBottom: '1.5rem',
    }}>
      ── CONTACT
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1px',
    }}>

      {/* Email */}
      <a
        href="mailto:trilliondollarclub26@gmail.com"
        className="contact-link"
      >
        <div style={{
          width: 36, height: 36,
          border: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem',
          flexShrink: 0,
        }}>
          ✉
        </div>
        <div>
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.15em',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '0.2rem'
          }}>
            Email
          </div>
          <div style={{
            fontSize: '0.72rem',
            fontFamily: "'Share Tech Mono', monospace",
            color: '#888',
            letterSpacing: '0.04em'
          }}>
          @trilliondollarclub.com
          </div>
        </div>
        <span className="contact-arrow">→</span>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/9744955316"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-link"
      >
        <div style={{
          width: 36, height: 36,
          border: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem',
          flexShrink: 0,
        }}>
          ◉
        </div>
        <div>
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.15em',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '0.2rem'
          }}>
            WhatsApp
          </div>
          <div style={{
            fontSize: '0.72rem',
            fontFamily: "'Share Tech Mono', monospace",
            color: '#888',
            letterSpacing: '0.04em'
          }}>
            +91 9744955316
          </div>
        </div>
        <span className="contact-arrow">→</span>
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/trilliond0llarclub?igsh=MWFmYnd6Y2I1OG54cQ=="
        target="_blank"
        rel="noopener noreferrer"
        className="contact-link"
      >
        <div style={{
          width: 36, height: 36,
          border: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem',
          flexShrink: 0,
        }}>
          ◈
        </div>
        <div>
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.15em',
            color: '#333',
            textTransform: 'uppercase',
            marginBottom: '0.2rem'
          }}>
            Instagram
          </div>
          <div style={{
            fontSize: '0.72rem',
            fontFamily: "'Share Tech Mono', monospace",
            color: '#888',
            letterSpacing: '0.04em'
          }}>
            @trilliondollarclub
          </div>
        </div>
        <span className="contact-arrow">→</span>
      </a>

    </div>

    {/* Footer */}
    <div style={{
      marginTop: '3rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #0d0d0d',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.5rem',
    }}>
      <span style={{
        fontSize: '0.55rem',
        fontFamily: "'Share Tech Mono', monospace",
        letterSpacing: '0.15em',
        color: '#222',
        textTransform: 'uppercase'
      }}>
        © {new Date().getFullYear()} TrillionDollarClub
      </span>

      <span style={{
        fontSize: '0.55rem',
        fontFamily: "'Share Tech Mono', monospace",
        letterSpacing: '0.15em',
        color: '#222',
        textTransform: 'uppercase'
      }}>
        ALL RIGHTS RESERVED
      </span>
    </div>

  </div>
</section>
    </>
  )
}