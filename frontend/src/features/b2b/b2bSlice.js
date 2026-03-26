import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { b2bApi } from '../../services/api'

// ✅ NEW: Update RFQ Status
export const updateRFQStatus = createAsyncThunk(
  'b2b/updateRFQStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await b2bApi.updateRFQ(id, { status })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update RFQ status')
    }
  }
)

export const fetchB2BProducts = createAsyncThunk(
  'b2b/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await b2bApi.getProducts(params)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch products')
    }
  }
)

export const fetchMoreB2BProducts = createAsyncThunk(
  'b2b/fetchMoreProducts',
  async (params, { getState, rejectWithValue }) => {
    try {
      const { nextPage } = getState().b2b
      const response = await b2bApi.getProducts({ ...params, page: nextPage })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch more products')
    }
  }
)

export const fetchB2BProductDetail = createAsyncThunk(
  'b2b/fetchProductDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await b2bApi.getProductById(id)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch product')
    }
  }
)

export const submitRFQ = createAsyncThunk(
  'b2b/submitRFQ',
  async (rfqData, { rejectWithValue }) => {
    try {
      const response = await b2bApi.submitRFQ(rfqData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to submit RFQ')
    }
  }
)

export const fetchMyRFQs = createAsyncThunk(
  'b2b/fetchMyRFQs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await b2bApi.getMyRFQs()
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch RFQs')
    }
  }
)

export const fetchB2BOrders = createAsyncThunk(
  'b2b/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await b2bApi.getOrders()
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch orders')
    }
  }
)

export const fetchDashboardStats = createAsyncThunk(
  'b2b/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await b2bApi.getDashboardStats()
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch dashboard stats')
    }
  }
)

const b2bSlice = createSlice({
  name: 'b2b',
  initialState: {
    products: [],
    nextPage: 2,
    hasMore: true,
    productsLoading: false,
    productsError: null,

    currentProduct: null,
    productDetailLoading: false,
    productDetailError: null,

    quotes: [],
    quotesLoading: false,
    quotesError: null,
    rfqSubmitting: false,
    rfqSuccess: false,
    rfqError: null,

    bulkOrders: [],
    ordersLoading: false,
    ordersError: null,

    dashboardStats: null,
    dashboardLoading: false,
    dashboardError: null,

    loading: false,
    error: null,
  },
  reducers: {
    clearRFQStatus(state) {
      state.rfqSuccess = false
      state.rfqError = null
    },
    clearProductDetail(state) {
      state.currentProduct = null
      state.productDetailError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchB2BProducts.pending, (state) => {
        state.productsLoading = true
        state.productsError = null
      })
      .addCase(fetchB2BProducts.fulfilled, (state, action) => {
        state.productsLoading = false
        state.products = action.payload.results || action.payload
        state.hasMore = !!action.payload.next
        state.nextPage = 2
      })
      .addCase(fetchB2BProducts.rejected, (state, action) => {
        state.productsLoading = false
        state.productsError = action.payload
      })

      // Infinite scroll
      .addCase(fetchMoreB2BProducts.fulfilled, (state, action) => {
        state.products = [...state.products, ...(action.payload.results || action.payload)]
        state.hasMore = !!action.payload.next
        state.nextPage += 1
      })

      // Product detail
      .addCase(fetchB2BProductDetail.pending, (state) => {
        state.productDetailLoading = true
        state.productDetailError = null
        state.currentProduct = null
      })
      .addCase(fetchB2BProductDetail.fulfilled, (state, action) => {
        state.productDetailLoading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchB2BProductDetail.rejected, (state, action) => {
        state.productDetailLoading = false
        state.productDetailError = action.payload
      })

      // Submit RFQ
      .addCase(submitRFQ.pending, (state) => {
        state.rfqSubmitting = true
        state.rfqSuccess = false
        state.rfqError = null
      })
      .addCase(submitRFQ.fulfilled, (state, action) => {
        state.rfqSubmitting = false
        state.rfqSuccess = true
        state.quotes = [action.payload, ...state.quotes]
      })
      .addCase(submitRFQ.rejected, (state, action) => {
        state.rfqSubmitting = false
        state.rfqError = action.payload
      })

      // Fetch RFQs
      .addCase(fetchMyRFQs.pending, (state) => {
        state.quotesLoading = true
        state.quotesError = null
      })
      .addCase(fetchMyRFQs.fulfilled, (state, action) => {
        state.quotesLoading = false
        state.quotes = action.payload.results || action.payload
      })
      .addCase(fetchMyRFQs.rejected, (state, action) => {
        state.quotesLoading = false
        state.quotesError = action.payload
      })

      // Orders
      .addCase(fetchB2BOrders.pending, (state) => {
        state.ordersLoading = true
        state.ordersError = null
      })
      .addCase(fetchB2BOrders.fulfilled, (state, action) => {
        state.ordersLoading = false
        state.bulkOrders = action.payload.results || action.payload
      })
      .addCase(fetchB2BOrders.rejected, (state, action) => {
        state.ordersLoading = false
        state.ordersError = action.payload
      })

      // Dashboard
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true
        state.dashboardError = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false
        state.dashboardStats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false
        state.dashboardError = action.payload
      })

      // ✅ NEW: Update RFQ Status
      .addCase(updateRFQStatus.fulfilled, (state, action) => {
        const updated = action.payload
        state.quotes = state.quotes.map((rfq) =>
          rfq.id === updated.id ? updated : rfq
        )
      })
  },
})

export const { clearRFQStatus, clearProductDetail } = b2bSlice.actions
export default b2bSlice.reducer