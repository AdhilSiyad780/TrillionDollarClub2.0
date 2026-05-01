import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  fetchProduct, deleteProduct,
  selectCurrentProduct, selectProductsLoading
} from '../features/products/productsSlice'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

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

  useEffect(() => {
    dispatch(fetchProduct(id))
    setActiveImg(0)
    setImgLoaded(false)
  }, [id])

  // keyboard nav for lightbox
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

  if (loading) return <Spinner />

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: '#000' }}>
      <div style={{ fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase' }}>ERROR / 404</div>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.25rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product Not Found</div>
      <Link to="/products" style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid #222', paddingBottom: '2px' }}>
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
          max-width: 1080px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
          background: #000;
          min-height: 100vh;
          color: #fff;
          font-family: "'Share Tech Mono', monospace";
        }

        /* ── Main image viewer ── */
        .main-img-wrap {
          background: #060606;
          border: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          cursor: zoom-in;
          min-height: 300px;
          max-height: 600px;
        }
        .main-img {
          display: block;
          max-width: 100%;
          max-height: 600px;
          width: auto;
          height: auto;
          object-fit: contain;
          transition: opacity 0.25s, transform 0.3s;
        }
        .main-img:hover { transform: scale(1.015); }
        .main-img.loading { opacity: 0; }
        .main-img.loaded  { opacity: 1; }

        /* ── Thumbnails ── */
        .thumbs-wrap {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }
        .thumb-item {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border: 1px solid #1a1a1a;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.15s;
          position: relative;
        }
        .thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(40%) brightness(0.8);
          transition: filter 0.15s;
        }
        .thumb-item:hover img,
        .thumb-item.active img {
          filter: grayscale(0%) brightness(1);
        }
        .thumb-item.active { border-color: #fff; }
        .thumb-item:hover  { border-color: #555; }

        /* ── Arrow nav ── */
        .img-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.7);
          border: 1px solid #2a2a2a;
          color: #888;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.15s;
          z-index: 2;
          user-select: none;
        }
        .img-nav:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #fff; }
        .img-nav.prev { left: 8px; }
        .img-nav.next { right: 8px; }

        /* ── Lightbox ── */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.96);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 80vh;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          border: 1px solid #1a1a1a;
        }
        .lightbox-close {
          position: fixed;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: 1px solid #333;
          color: #888;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.15s;
        }
        .lightbox-close:hover { border-color: #fff; color: #fff; }
        .lightbox-nav {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .lightbox-nav button {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #555;
          padding: 0.4rem 0.75rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.15s;
        }
        .lightbox-nav button:hover { border-color: #fff; color: #fff; }
        .lightbox-counter {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #333;
          min-width: 60px;
          text-align: center;
        }

        /* ── Layout ── */
        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* ── Info panel ── */
        .del-btn:hover {
          background: rgba(255,51,51,0.06) !important;
          border-color: #ff3333 !important;
        }

        @media (max-width: 700px) {
          .detail-layout { grid-template-columns: 1fr; gap: 2rem; }
          .thumb-item { width: 52px; height: 52px; }
        }
      `}</style>

      {/* Lightbox */}
      {lightbox && images.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <img
            src={images[activeImg]}
            alt={product.name}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
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
            {/* Main image */}
            <div
              className="main-img-wrap"
              onClick={() => images.length > 0 && setLightbox(true)}
              title="Click to enlarge"
            >
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
                  {/* Counter badge */}
                  {images.length > 1 && (
                    <div style={{
                      position: 'absolute', bottom: 8, right: 8,
                      background: 'rgba(0,0,0,0.85)',
                      border: '1px solid #2a2a2a',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.55rem',
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: '0.1em',
                      color: '#555',
                      pointerEvents: 'none',
                    }}>
                      {activeImg + 1}/{images.length}
                    </div>
                  )}
                  {/* Zoom hint */}
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid #1a1a1a',
                    padding: '0.2rem 0.45rem',
                    fontSize: '0.5rem',
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: '0.1em',
                    color: '#333',
                    pointerEvents: 'none',
                  }}>⊕ ZOOM</div>

                  {/* Arrow nav */}
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

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="thumbs-wrap">
                {images.map((url, i) => (
                  <div
                    key={i}
                    className={`thumb-item${activeImg === i ? ' active' : ''}`}
                    onClick={() => { setActiveImg(i); setImgLoaded(false) }}
                  >
                    <img src={url} alt={`view-${i}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Image strip count */}
            {images.length > 0 && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", color: '#2a2a2a', letterSpacing: '0.12em' }}>
                {images.length} IMAGE{images.length > 1 ? 'S' : ''} · CLICK TO ENLARGE
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div>
            {/* Category */}
            <div style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.18em', color: '#444', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              {product.category || 'GENERAL'}
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              {product.name}
            </h1>

            {/* Price + stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #111', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
                ${product.price}
              </span>
              <span style={{
                padding: '0.2rem 0.65rem',
                border: '1px solid',
                borderColor: inStock ? 'rgba(255,255,255,0.2)' : 'rgba(255,51,51,0.3)',
                color: inStock ? '#aaa' : '#ff3333',
                background: inStock ? 'rgba(255,255,255,0.03)' : 'rgba(255,51,51,0.04)',
                fontSize: '0.55rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
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
                { label: 'Status', value: product.is_active ? 'ACTIVE' : 'INACTIVE' },
                { label: 'Listed', value: new Date(product.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', color: '#333', textTransform: 'uppercase' }}>{row.label}</span>
                  <span style={{ fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.08em', color: '#666' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Admin delete */}
            {isAdmin && (
              <button onClick={handleDelete} className="del-btn" style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,51,51,0.2)', color: '#ff3333', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.15s', cursor: 'pointer' }}>
                ✕ Delete Product
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}