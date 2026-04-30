import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/products', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/products/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

export const createProduct = createAsyncThunk('products/create', async (body, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/products', body)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/products/${id}`, updates)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || err.message)
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    current: null,
    total: 0,
    page: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => { state.page = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload.items
        state.total = payload.total
        state.page = payload.page
        state.totalPages = payload.total_pages
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => { state.loading = false; state.error = payload })

      .addCase(fetchProduct.fulfilled, (state, { payload }) => { state.current = payload })

      .addCase(createProduct.fulfilled, (state, { payload }) => { state.list.unshift(payload) })

      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        const idx = state.list.findIndex(p => p.id === payload.id)
        if (idx !== -1) state.list[idx] = payload
        if (state.current?.id === payload.id) state.current = payload
      })

      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.list = state.list.filter(p => p.id !== payload)
      })
  },
})

export const { setPage } = productsSlice.actions
export default productsSlice.reducer
export const selectProducts = (s) => s.products.list
export const selectCurrentProduct = (s) => s.products.current
export const selectProductsLoading = (s) => s.products.loading
export const selectProductsMeta = (s) => ({ total: s.products.total, page: s.products.page, totalPages: s.products.totalPages })