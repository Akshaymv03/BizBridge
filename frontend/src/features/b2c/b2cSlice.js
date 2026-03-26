import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productApi } from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'b2c/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = {
        page: 1,
        ...filters,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        // Always lock to B2C — unless user explicitly picks a type in the filter
        business_model: filters.businessModel || 'B2C',
      }
      const response = await productApi.getProducts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products')
    }
  }
)

export const fetchMoreProducts = createAsyncThunk(
  'b2c/fetchMoreProducts',
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const { currentPage } = getState().b2c
      const params = {
        page: currentPage + 1,
        ...filters,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        business_model: filters.businessModel || 'B2C',
      }
      const response = await productApi.getProducts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch more products')
    }
  }
)

const b2cSlice = createSlice({
  name: 'b2c',
  initialState: {
    products: [],
    currentPage: 1,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        // Handle both paginated {results:[]} and plain array responses
        const data = action.payload
        state.products = Array.isArray(data) ? data : (data.results || [])
        state.hasMore = Array.isArray(data) ? false : !!data.next
        state.currentPage = 1
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        const data = action.payload
        const newItems = Array.isArray(data) ? data : (data.results || [])
        state.products.push(...newItems)
        state.hasMore = Array.isArray(data) ? false : !!data.next
        state.currentPage += 1
      })
  },
})

export default b2cSlice.reducer