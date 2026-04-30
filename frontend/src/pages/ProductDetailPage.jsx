import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProduct, deleteProduct, selectCurrentProduct, selectProductsLoading } from '../features/products/productsSlice'
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

  useEffect(() => { dispatch(fetchProduct(id)) }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return
    await dispatch(deleteProduct(id))
    toast.success('Deleted')
    navigate('/products')
  }

  if (loading) return <Spinner />
  if (!product) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Product not found</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      {product.images[0] && <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#6366f1', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{product.category || 'General'}</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
          <div style={{ fontSize: '1.5rem', color: '#10b981', fontFamily: 'Syne', fontWeight: 700 }}>${product.price}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ background: product.stock > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: product.stock > 0 ? '#10b981' : '#ef4444', border: `1px solid ${product.stock > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '20px', padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          {isAdmin && <button onClick={handleDelete} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.4rem 1rem' }}>Delete</button>}
        </div>
      </div>
      {product.description && <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>{product.description}</p>}
    </div>
  )
}

