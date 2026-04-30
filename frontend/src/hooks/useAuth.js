import { useSelector } from 'react-redux'
import { selectSession, selectUser, selectIsAdmin, selectInitialized } from '../features/auth/authSlice'

export const useAuth = () => {
  const session = useSelector(selectSession)
  const user = useSelector(selectUser)
  const isAdmin = useSelector(selectIsAdmin)
  const initialized = useSelector(selectInitialized)

  return {
    session,
    user,
    isAdmin,
    initialized,
    isAuthenticated: !!session,
  }
}