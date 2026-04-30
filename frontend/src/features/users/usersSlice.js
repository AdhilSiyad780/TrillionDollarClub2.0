import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/admin/users')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

export const updateUserAdmin = createAsyncThunk('users/updateAdmin', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/api/admin/users/${id}`, updates)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

export const deleteUserAdmin = createAsyncThunk('users/deleteAdmin', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/admin/users/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchAllUsers.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload })
      .addCase(fetchAllUsers.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(updateUserAdmin.fulfilled, (state, { payload }) => {
        const idx = state.list.findIndex(u => u.id === payload.id)
        if (idx !== -1) state.list[idx] = payload
      })

      .addCase(deleteUserAdmin.fulfilled, (state, { payload }) => {
        state.list = state.list.filter(u => u.id !== payload)
      })
  },
})

export default usersSlice.reducer
export const selectAllUsers = (s) => s.users.list
export const selectUsersLoading = (s) => s.users.loading