import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { supabase } from './services/supabase'
import { setSession, fetchCurrentUser, clearAuth, setInitialized } from './features/auth/authSlice'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/layout/Navbar'
import Spinner from './components/common/Spinner'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminPage from './pages/AdminPage'

function PrivateRoute({ children }) {
  const { isAuthenticated, initialized } = useAuth()
  if (!initialized) return <Spinner />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, initialized } = useAuth()
  if (!initialized) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { initialized } = useAuth()

  useEffect(() => {
    // Restore session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session))
      if (session) dispatch(fetchCurrentUser())
      dispatch(setInitialized())
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
      if (session) dispatch(fetchCurrentUser())
      else dispatch(clearAuth())
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!initialized) return <Spinner />

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Routes>
    </> 
  )
}