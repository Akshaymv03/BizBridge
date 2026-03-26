import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderApi } from '../../services/order.api'

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrders()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders')
    }
  }
)

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderById(orderId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order details')
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.cancelOrder(orderId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel order')
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.results || action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.orders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
      })
  },
})

export const { clearCurrentOrder, clearError } = orderSlice.actions
export default orderSlice.reducer