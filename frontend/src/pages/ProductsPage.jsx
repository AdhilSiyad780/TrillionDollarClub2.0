import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts, deleteProduct, createProduct, selectProducts, selectProductsLoading, selectProductsMeta } from '../features/products/productsSlice'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectProductsLoading)
  const { page, totalPages } = useSelector(selectProductsMeta)
  const { isAdmin } = useAuth()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' })

  useEffect(() => {
    dispatch(fetchProducts({ page, search }))
  }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(fetchProducts({ page: 1, search }))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await dispatch(deleteProduct(id))
    toast.success('Product deleted')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const result = await dispatch(createProduct({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 }))
    if (createProduct.fulfilled.match(result)) {
      toast.success('Product created!')
      setShowForm(false)
      setForm({ name: '', description: '', price: '', category: '', stock: '' })
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem' }}>Products</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.5rem 1rem', color: '#f8fafc', width: '200px' }} />
            <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem' }}>Search</button>
          </form>
          {isAdmin && (
            <button onClick={() => setShowForm(v => !v)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 600 }}>
              + New Product
            </button>
          )}
        </div>
      </div>

      {showForm && isAdmin && (
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Create Product</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[['name', 'Name *'], ['price', 'Price *'], ['category', 'Category'], ['stock', 'Stock']].map(([field, label]) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>{label}</label>
                <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  style={{ width: '100%', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.6rem 0.75rem', color: '#f8fafc' }}
                  required={['name', 'price'].includes(field)} type={['price', 'stock'].includes(field) ? 'number' : 'text'} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ width: '100%', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.6rem 0.75rem', color: '#f8fafc', minHeight: '80px', resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem 1.5rem', fontWeight: 600 }}>Create</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', padding: '0.65rem 1.5rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Spinner /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {products.map(p => (
              <div key={p.id} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
                {p.images[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6366f1', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{p.category || 'General'}</div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, color: '#10b981' }}>${p.price}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/products/${p.id}`} style={{ fontSize: '0.8rem', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '0.3rem 0.6rem' }}>View</Link>
                      {isAdmin && <button onClick={() => handleDelete(p.id)} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0.3rem 0.6rem' }}>Delete</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => dispatch(fetchProducts({ page: p, search }))}
                  style={{ width: 36, height: 36, borderRadius: '8px', border: '1px solid #334155', background: p === page ? '#6366f1' : 'transparent', color: p === page ? '#fff' : '#94a3b8' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}