import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../services/supabase'
import api from '../../services/api'

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return rejectWithValue(error.message)
  return data
})

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return rejectWithValue(error.message)
  return data
})

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  const { error } = await supabase.auth.signOut()
  if (error) return rejectWithValue(error.message)
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/users/me')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    session: null,
    user: null,
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {
    setSession: (state, action) => { state.session = action.payload },
    setUser: (state, action) => { state.user = action.payload },
    clearAuth: (state) => { state.session = null; state.user = null },
    setInitialized: (state) => { state.initialized = true },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => { state.loading = true; state.error = null })
      .addCase(signIn.fulfilled, (state, { payload }) => { state.loading = false; state.session = payload.session })
      .addCase(signIn.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(signUp.pending, (state) => { state.loading = true; state.error = null })
      .addCase(signUp.fulfilled, (state) => { state.loading = false })
      .addCase(signUp.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(signOut.fulfilled, (state) => { state.session = null; state.user = null })

      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => { state.user = payload })
  },
})

export const { setSession, setUser, clearAuth, setInitialized, clearError } = authSlice.actions
export default authSlice.reducer

export const selectSession = (s) => s.auth.session
export const selectUser = (s) => s.auth.user
export const selectIsAdmin = (s) => s.auth.user?.is_admin || false
export const selectAuthLoading = (s) => s.auth.loading
export const selectAuthError = (s) => s.auth.error
export const selectInitialized = (s) => s.auth.initialized