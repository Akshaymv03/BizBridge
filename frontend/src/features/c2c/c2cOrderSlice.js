import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchC2COrders = createAsyncThunk(
  'c2cOrders/fetchC2COrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/?type=c2c')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch C2C orders')
    }
  }
)

export const fetchC2COrderDetails = createAsyncThunk(
  'c2cOrders/fetchC2COrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch C2C order details')
    }
  }
)

export const cancelC2COrder = createAsyncThunk(
  'c2cOrders/cancelC2COrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel C2C order')
    }
  }
)

const c2cOrderSlice = createSlice({
  name: 'c2cOrders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearC2CCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearC2CError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchC2COrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchC2COrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.results || action.payload
      })
      .addCase(fetchC2COrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchC2COrderDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchC2COrderDetails.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchC2COrderDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(cancelC2COrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id)
        if (index !== -1) state.orders[index] = action.payload
        if (state.currentOrder?.id === action.payload.id) state.currentOrder = action.payload
      })
  },
})

export const { clearC2CCurrentOrder, clearC2CError } = c2cOrderSlice.actions
export default c2cOrderSlice.reducer