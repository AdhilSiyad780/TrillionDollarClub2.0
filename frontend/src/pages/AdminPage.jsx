import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers, updateUserAdmin, deleteUserAdmin, selectAllUsers, selectUsersLoading } from '../features/users/usersSlice'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const loading = useSelector(selectUsersLoading)

  useEffect(() => { dispatch(fetchAllUsers()) }, [])

  const toggleAdmin = async (user) => {
    await dispatch(updateUserAdmin({ id: user.id, updates: { is_admin: !user.is_admin } }))
    toast.success(`${user.is_admin ? 'Demoted' : 'Promoted'} ${user.email}`)
  }

  const handleDelete = async (user) => {
    if (!confirm(`Delete user ${user.email}?`)) return
    await dispatch(deleteUserAdmin(user.id))
    toast.success('User deleted')
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Panel</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>{users.length} total users</p>
      {loading ? <Spinner /> : (
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                {['Email', 'Name', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.9rem' }}>{user.name || '—'}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: user.is_admin ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)', color: user.is_admin ? '#f59e0b' : '#64748b', border: `1px solid ${user.is_admin ? 'rgba(245,158,11,0.3)' : 'rgba(100,116,139,0.3)'}`, borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => toggleAdmin(user)} style={{ fontSize: '0.8rem', color: '#6366f1', background: 'transparent', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px', padding: '0.3rem 0.6rem' }}>
                        {user.is_admin ? 'Demote' : 'Promote'}
                      </button>
                      <button onClick={() => handleDelete(user)} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0.3rem 0.6rem' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
