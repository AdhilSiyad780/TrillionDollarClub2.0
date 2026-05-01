import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllUsers, updateUserAdmin, deleteUserAdmin,
  selectAllUsers, selectUsersLoading
} from '../features/users/usersSlice'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const loading = useSelector(selectUsersLoading)

  useEffect(() => { dispatch(fetchAllUsers()) }, [])

  const toggleAdmin = async (user) => {
    await dispatch(updateUserAdmin({ id: user.id, updates: { is_admin: !user.is_admin } }))
    toast.success(user.is_admin ? `DEMOTED — ${user.email}` : `PROMOTED — ${user.email}`)
  }

  const handleDelete = async (user) => {
    if (!confirm(`Delete user ${user.email}?`)) return
    await dispatch(deleteUserAdmin(user.id))
    toast.success('USER REMOVED')
  }

  const admins = users.filter(u => u.is_admin).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.55rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #333;
          border-bottom: 1px solid #1a1a1a;
          white-space: nowrap;
        }
        .admin-table td {
          padding: 0.9rem 1rem;
          font-size: 0.72rem;
          font-family: 'Share Tech Mono', monospace;
          border-bottom: 1px solid #0d0d0d;
          vertical-align: middle;
        }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr { transition: background 0.15s; }
        .admin-table tr:hover td { background: #080808; }

        .admin-btn {
          padding: 0.28rem 0.65rem;
          font-size: 0.58rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        /* Mobile: hide table, show cards */
        .admin-cards { display: none; }
        @media (max-width: 680px) {
          .admin-table-wrap { display: none; }
          .admin-cards { display: flex; flex-direction: column; gap: 1px; }
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '0.55rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.2em',
            color: '#333',
            marginBottom: '0.4rem',
          }}>
            TRILLIONDOLLARCLUB / SYSTEM / ADMIN
          </div>
          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 'clamp(1.2rem, 4vw, 1.75rem)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Admin Panel
          </h1>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '1px', marginTop: '1rem' }}>
            {[
              { label: 'Total Users', value: users.length },
              { label: 'Admins', value: admins },
              { label: 'Members', value: users.length - admins },
            ].map(stat => (
              <div key={stat.label} style={{
                flex: 1,
                background: '#0a0a0a',
                border: '1px solid #1a1a1a',
                padding: '0.85rem 1rem',
              }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1rem, 3vw, 1.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.55rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.12em', color: '#333', marginTop: '0.3rem', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading ? <Spinner /> : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#333', letterSpacing: '0.15em' }}>
            NO USERS FOUND
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="admin-table-wrap" style={{ border: '1px solid #1a1a1a', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      {['Email', 'Name', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td style={{ color: '#aaa' }}>{user.email}</td>
                        <td style={{ color: '#555' }}>{user.name || '—'}</td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.55rem',
                            fontSize: '0.55rem',
                            fontFamily: "'Share Tech Mono', monospace",
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            border: '1px solid',
                            borderColor: user.is_admin ? '#fff' : '#2a2a2a',
                            color: user.is_admin ? '#fff' : '#444',
                            background: user.is_admin ? 'rgba(255,255,255,0.05)' : 'transparent',
                          }}>
                            {user.is_admin ? 'ADMIN' : 'USER'}
                          </span>
                        </td>
                        <td style={{ color: '#444' }}>
                          {new Date(user.created_at).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              className="admin-btn"
                              onClick={() => toggleAdmin(user)}
                              style={{
                                border: '1px solid #2a2a2a',
                                color: user.is_admin ? '#ff3333' : '#fff',
                                borderColor: user.is_admin ? 'rgba(255,51,51,0.3)' : '#2a2a2a',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = user.is_admin ? '#ff3333' : '#fff'
                                e.currentTarget.style.background = user.is_admin ? 'rgba(255,51,51,0.05)' : 'rgba(255,255,255,0.05)'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = user.is_admin ? 'rgba(255,51,51,0.3)' : '#2a2a2a'
                                e.currentTarget.style.background = 'transparent'
                              }}
                            >
                              {user.is_admin ? 'Demote' : 'Promote'}
                            </button>
                            <button
                              className="admin-btn"
                              onClick={() => handleDelete(user)}
                              style={{ border: '1px solid rgba(255,51,51,0.2)', color: '#ff3333' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff3333'; e.currentTarget.style.background = 'rgba(255,51,51,0.05)' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,51,51,0.2)'; e.currentTarget.style.background = 'transparent' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Mobile cards ── */}
            <div className="admin-cards">
              {users.map(user => (
                <div key={user.id} style={{
                  background: '#000',
                  border: '1px solid #1a1a1a',
                  padding: '1rem',
                }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.72rem',
                        fontFamily: "'Share Tech Mono', monospace",
                        color: '#aaa',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '0.2rem',
                      }}>
                        {user.email}
                      </div>
                      <div style={{ fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", color: '#444' }}>
                        {user.name || 'No name'} · {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{
                      marginLeft: '0.75rem',
                      flexShrink: 0,
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.55rem',
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      border: '1px solid',
                      borderColor: user.is_admin ? '#fff' : '#2a2a2a',
                      color: user.is_admin ? '#fff' : '#444',
                    }}>
                      {user.is_admin ? 'ADMIN' : 'USER'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.6rem', borderTop: '1px solid #111' }}>
                    <button
                      onClick={() => toggleAdmin(user)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.6rem',
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        border: '1px solid #2a2a2a',
                        color: user.is_admin ? '#ff3333' : '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      {user.is_admin ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.6rem',
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        border: '1px solid rgba(255,51,51,0.25)',
                        color: '#ff3333',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}