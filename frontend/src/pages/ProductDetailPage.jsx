import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  fetchProduct, deleteProduct, updateProduct,
  selectCurrentProduct, selectProductsLoading
} from '../features/products/productsSlice'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

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
  boxSizing: 'border-box',
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

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector(selectCurrentProduct)
  const loading = useSelector(selectProductsLoading)
  const { isAdmin } = useAuth()

  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  // ── Edit state ──
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    is_active: true,
  })

  useEffect(() => {
    dispatch(fetchProduct(id))
    setActiveImg(0)
    setImgLoaded(false)
    setEditing(false)
  }, [id])

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock ?? 0,
        is_active: product.is_active ?? true,
      })
    }
  }, [product])

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') setActiveImg(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setActiveImg(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return
    await dispatch(deleteProduct(id))
    toast.success('PRODUCT REMOVED')
    navigate('/products')
  }
const handleSave = async (e) => {
  e.preventDefault()
  setSaving(true)
  const result = await dispatch(updateProduct({
    id,
    data: {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      category: form.category || null,
      is_active: form.is_active,  // ← explicitly pass it
    }
  }))
  setSaving(false)
  if (updateProduct.fulfilled.match(result)) {
    toast.success('PRODUCT UPDATED')
    setEditing(false)
  } else {
    toast.error('Update failed')
  }
}

  // Quick toggle is_active without opening edit form
const handleToggleActive = async () => {
  const newValue = !product.is_active
  const result = await dispatch(updateProduct({
    id,
    data: { is_active: newValue }
  }))
  if (updateProduct.fulfilled.match(result)) {
    toast.success(newValue ? 'PRODUCT MARKED AVAILABLE' : 'PRODUCT MARKED UNAVAILABLE')
    dispatch(fetchProduct(id))           // ← sync detail page
    dispatch(fetchProducts({ page: 1 })) // ← sync home page list
  }
}

  if (loading) return <Spinner />
  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: '#000' }}>
      <div style={{ fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase' }}>ERROR / 404</div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.25rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product Not Found</div>
      <Link to="/products" style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid #222', paddingBottom: '2px', textDecoration: 'none' }}>
        ← Back to Catalogue
      </Link>
    </div>
  )

  const images = product.images?.length > 0 ? product.images : []
  const inStock = product.stock > 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; }

        .detail-wrap {
          max-width: 1080px; margin: 0 auto;
          padding: 2rem 1.25rem;
          background: #000; min-height: 100vh; color: #fff;
        }

        .main-img-wrap {
          background: #060606; border: 1px solid #1a1a1a;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; position: relative;
          cursor: zoom-in; min-height: 300px; max-height: 600px;
        }
        .main-img {
          display: block; max-width: 100%; max-height: 600px;
          width: auto; height: auto; object-fit: contain;
          transition: opacity 0.25s, transform 0.3s;
        }
        .main-img:hover { transform: scale(1.015); }
        .main-img.loading { opacity: 0; }
        .main-img.loaded  { opacity: 1; }

        .thumbs-wrap { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .thumb-item {
          width: 64px; height: 64px; flex-shrink: 0;
          border: 1px solid #1a1a1a; overflow: hidden;
          cursor: pointer; transition: border-color 0.15s;
        }
        .thumb-item img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(40%) brightness(0.8); transition: filter 0.15s; }
        .thumb-item:hover img, .thumb-item.active img { filter: grayscale(0%) brightness(1); }
        .thumb-item.active { border-color: #fff; }
        .thumb-item:hover  { border-color: #555; }

        .img-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(0,0,0,0.7); border: 1px solid #2a2a2a;
          color: #888; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 0.75rem; transition: all 0.15s;
          z-index: 2; user-select: none;
        }
        .img-nav:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #fff; }
        .img-nav.prev { left: 8px; }
        .img-nav.next { right: 8px; }

        .lightbox-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.96);
          z-index: 1000; display: flex; align-items: center;
          justify-content: center; flex-direction: column;
          gap: 1rem; padding: 1rem;
        }
        .lightbox-img { max-width: 100%; max-height: 80vh; width: auto; height: auto; object-fit: contain; display: block; border: 1px solid #1a1a1a; }
        .lightbox-close {
          position: fixed; top: 1rem; right: 1rem;
          background: transparent; border: 1px solid #333; color: #888;
          width: 36px; height: 36px; display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 0.8rem; transition: all 0.15s;
        }
        .lightbox-close:hover { border-color: #fff; color: #fff; }
        .lightbox-nav { display: flex; gap: 0.5rem; align-items: center; }
        .lightbox-nav button { background: transparent; border: 1px solid #2a2a2a; color: #555; padding: 0.4rem 0.75rem; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.15s; }
        .lightbox-nav button:hover { border-color: #fff; color: #fff; }
        .lightbox-counter { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: #333; min-width: 60px; text-align: center; }

        .detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }

        /* ── Edit form grid ── */
        .edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }

        /* ── Availability toggle ── */
        .avail-toggle {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1rem; border: 1px solid #1a1a1a;
          background: #080808; margin-bottom: 0.75rem;
          cursor: pointer; transition: border-color 0.15s;
        }
        .avail-toggle:hover { border-color: #333; }

        .del-btn:hover { background: rgba(255,51,51,0.06) !important; border-color: #ff3333 !important; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        @media (max-width: 700px) {
          .detail-layout { grid-template-columns: 1fr; gap: 2rem; }
          .thumb-item { width: 52px; height: 52px; }
          .edit-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Lightbox */}
      {lightbox && images.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <img src={images[activeImg]} alt={product.name} className="lightbox-img" onClick={e => e.stopPropagation()} />
          {images.length > 1 && (
            <div className="lightbox-nav" onClick={e => e.stopPropagation()}>
              <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>← PREV</button>
              <span className="lightbox-counter">{activeImg + 1} / {images.length}</span>
              <button onClick={() => setActiveImg(i => (i + 1) % images.length)}>NEXT →</button>
            </div>
          )}
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', color: '#222', letterSpacing: '0.12em' }}>
            ESC TO CLOSE · ARROW KEYS TO NAVIGATE
          </div>
        </div>
      )}

      <div className="detail-wrap">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem', fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.18em', color: '#333', textTransform: 'uppercase' }}>
          <Link to="/products" style={{ color: '#444', transition: 'color 0.15s', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#444'}
          >Catalogue</Link>
          <span>/</span>
          <span style={{ color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>{product.name}</span>
        </div>

        <div className="detail-layout">

          {/* ── Left: Image viewer ── */}
          <div>
            <div className="main-img-wrap" onClick={() => images.length > 0 && setLightbox(true)} title="Click to enlarge">
              {images.length > 0 ? (
                <>
                  <img
                    key={images[activeImg]}
                    src={images[activeImg]}
                    alt={product.name}
                    className={`main-img ${imgLoaded ? 'loaded' : 'loading'}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgLoaded(true)}
                  />
                  {images.length > 1 && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.85)', border: '1px solid #2a2a2a', padding: '0.2rem 0.5rem', fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.1em', color: '#555', pointerEvents: 'none' }}>
                      {activeImg + 1}/{images.length}
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: '1px solid #1a1a1a', padding: '0.2rem 0.45rem', fontSize: '0.5rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.1em', color: '#333', pointerEvents: 'none' }}>⊕ ZOOM</div>
                  {images.length > 1 && (
                    <>
                      <button className="img-nav prev" onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length); setImgLoaded(false) }}>‹</button>
                      <button className="img-nav next" onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length); setImgLoaded(false) }}>›</button>
                    </>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ fontSize: '2rem', opacity: 0.1 }}>◻</div>
                  <span style={{ fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", color: '#222', letterSpacing: '0.15em' }}>NO IMAGE</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="thumbs-wrap">
                {images.map((url, i) => (
                  <div key={i} className={`thumb-item${activeImg === i ? ' active' : ''}`} onClick={() => { setActiveImg(i); setImgLoaded(false) }}>
                    <img src={url} alt={`view-${i}`} />
                  </div>
                ))}
              </div>
            )}
            {images.length > 0 && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", color: '#2a2a2a', letterSpacing: '0.12em' }}>
                {images.length} IMAGE{images.length > 1 ? 'S' : ''} · CLICK TO ENLARGE
              </div>
            )}
          </div>

          {/* ── Right: Info / Edit ── */}
          <div>
            {editing ? (
              /* ════ EDIT FORM ════ */
              <form onSubmit={handleSave} style={{ animation: 'fadeUp 0.2s ease' }}>
                <div style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.2em', color: '#333', marginBottom: '1.25rem' }}>
                  ── EDIT PRODUCT ──
                </div>

                <div className="edit-grid">
                  <div>
                    <label style={labelStyle}>Product Name *</label>
                    <input style={inputStyle} value={form.name} required onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Price (USD) *</label>
                    <input style={inputStyle} type="number" min="0.01" step="0.01" value={form.price} required onChange={e => setForm(f => ({ ...f, price: e.target.value }))} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <input style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Stock Qty</label>
                    <input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} onFocus={e => e.target.style.borderColor = '#fff'} onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = '#fff'}
                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                    style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                  />
                </div>

                {/* Availability toggle inside form */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Availability</label>
                  <div
                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      border: `1px solid ${form.is_active ? 'rgba(51,255,136,0.3)' : 'rgba(255,51,51,0.3)'}`,
                      background: '#080808', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', color: form.is_active ? '#33ff88' : '#ff3333', textTransform: 'uppercase' }}>
                      {form.is_active ? '● AVAILABLE' : '○ UNAVAILABLE'}
                    </span>
                    <span style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.1em', color: '#333' }}>CLICK TO TOGGLE</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="submit" disabled={saving} style={{ flex: 1, padding: '0.75rem', background: saving ? '#111' : '#fff', border: '1px solid #fff', color: saving ? '#555' : '#000', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
                    {saving ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} style={{ padding: '0.75rem 1rem', background: 'transparent', border: '1px solid #2a2a2a', color: '#555', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              /* ════ VIEW MODE ════ */
              <>
                <div style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.18em', color: '#444', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  {product.category || 'GENERAL'}
                </div>

                <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                  {product.name}
                </h1>

                {/* Price + stock */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #111', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
                    ${product.price}
                  </span>
                  <span style={{ padding: '0.2rem 0.65rem', border: '1px solid', borderColor: inStock ? 'rgba(255,255,255,0.2)' : 'rgba(255,51,51,0.3)', color: inStock ? '#aaa' : '#ff3333', background: inStock ? 'rgba(255,255,255,0.03)' : 'rgba(255,51,51,0.04)', fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {inStock ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.18em', color: '#333', textTransform: 'uppercase', marginBottom: '0.6rem' }}>— Description</div>
                    <p style={{ fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", color: '#555', lineHeight: 1.9, letterSpacing: '0.03em' }}>
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Meta table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem', padding: '1rem', background: '#080808', border: '1px solid #111' }}>
                  {[
                    { label: 'Product ID', value: product.id?.slice(-8).toUpperCase() },
                    { label: 'Listed', value: new Date(product.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', color: '#333', textTransform: 'uppercase' }}>{row.label}</span>
                      <span style={{ fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.08em', color: '#666' }}>{row.value}</span>
                    </div>
                  ))}

                  {/* Availability row — admin can click to toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid #111', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', color: '#333', textTransform: 'uppercase' }}>Availability</span>
                    {isAdmin ? (
                      <button
                        onClick={handleToggleActive}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace",
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: product.is_active ? '#33ff88' : '#ff3333',
                          padding: '0.15rem 0.5rem',
                          border: `1px solid ${product.is_active ? 'rgba(51,255,136,0.2)' : 'rgba(255,51,51,0.2)'}`,
                          transition: 'all 0.15s',
                        }}
                        title="Click to toggle availability"
                      >
                        {product.is_active ? '● AVAILABLE' : '○ UNAVAILABLE'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.08em', color: product.is_active ? '#33ff88' : '#ff3333' }}>
                        {product.is_active ? '● AVAILABLE' : '○ UNAVAILABLE'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditing(true)}
                      style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid #fff', color: '#fff', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.15s', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}
                    >
                      ✎ Edit Product
                    </button>
                    <button
                      onClick={handleDelete}
                      className="del-btn"
                      style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,51,51,0.2)', color: '#ff3333', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.15s', cursor: 'pointer' }}
                    >
                      ✕ Delete Product
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}