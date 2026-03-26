import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { c2cApi } from '../../services/api'

export const fetchC2CListings = createAsyncThunk(
  'c2c/fetchListings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await c2cApi.getListings(params)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch listings')
    }
  }
)

export const fetchMoreC2CListings = createAsyncThunk(
  'c2c/fetchMoreListings',
  async (params, { getState, rejectWithValue }) => {
    try {
      const { nextPage } = getState().c2c
      const response = await c2cApi.getListings({ ...params, page: nextPage })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch more listings')
    }
  }
)

export const fetchC2CListingDetail = createAsyncThunk(
  'c2c/fetchListingDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await c2cApi.getListingById(id)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch listing')
    }
  }
)

export const fetchMyListings = createAsyncThunk(
  'c2c/fetchMyListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await c2cApi.getMyListings()
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch your listings')
    }
  }
)

export const createListing = createAsyncThunk(
  'c2c/createListing',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await c2cApi.createListing(formData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create listing')
    }
  }
)

export const updateListing = createAsyncThunk(
  'c2c/updateListing',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await c2cApi.updateListing(id, formData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update listing')
    }
  }
)

export const deleteListing = createAsyncThunk(
  'c2c/deleteListing',
  async (id, { rejectWithValue }) => {
    try {
      await c2cApi.deleteListing(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete listing')
    }
  }
)

const c2cSlice = createSlice({
  name: 'c2c',
  initialState: {
    // Browse
    listings: [],
    nextPage: 2,
    hasMore: true,
    listingsLoading: false,
    listingsError: null,

    // Detail
    currentListing: null,
    detailLoading: false,
    detailError: null,

    // My listings
    myListings: [],
    myListingsLoading: false,
    myListingsError: null,

    // Create / update
    submitting: false,
    submitSuccess: false,
    submitError: null,

    loading: false,
    error: null,
  },
  reducers: {
    clearSubmitStatus(state) {
      state.submitSuccess = false
      state.submitError = null
    },
    clearCurrentListing(state) {
      state.currentListing = null
      state.detailError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchC2CListings.pending, (state) => {
        state.listingsLoading = true
        state.listingsError = null
      })
      .addCase(fetchC2CListings.fulfilled, (state, action) => {
        state.listingsLoading = false
        state.listings = action.payload.results || action.payload
        state.hasMore = !!action.payload.next
        state.nextPage = 2
      })
      .addCase(fetchC2CListings.rejected, (state, action) => {
        state.listingsLoading = false
        state.listingsError = action.payload
      })

    builder
      .addCase(fetchMoreC2CListings.fulfilled, (state, action) => {
        state.listings = [...state.listings, ...(action.payload.results || action.payload)]
        state.hasMore = !!action.payload.next
        state.nextPage += 1
      })

    builder
      .addCase(fetchC2CListingDetail.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
        state.currentListing = null
      })
      .addCase(fetchC2CListingDetail.fulfilled, (state, action) => {
        state.detailLoading = false
        state.currentListing = action.payload
      })
      .addCase(fetchC2CListingDetail.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })

    builder
      .addCase(fetchMyListings.pending, (state) => {
        state.myListingsLoading = true
        state.myListingsError = null
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.myListingsLoading = false
        state.myListings = action.payload.results || action.payload
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.myListingsLoading = false
        state.myListingsError = action.payload
      })

    builder
      .addCase(createListing.pending, (state) => {
        state.submitting = true
        state.submitSuccess = false
        state.submitError = null
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.submitting = false
        state.submitSuccess = true
        state.myListings = [action.payload, ...state.myListings]
      })
      .addCase(createListing.rejected, (state, action) => {
        state.submitting = false
        state.submitError = action.payload
      })

    builder
      .addCase(updateListing.fulfilled, (state, action) => {
        state.myListings = state.myListings.map(l =>
          l.id === action.payload.id ? action.payload : l
        )
      })

    builder
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.myListings = state.myListings.filter(l => l.id !== action.payload)
      })
  },
})

export const { clearSubmitStatus, clearCurrentListing } = c2cSlice.actions
export default c2cSlice.reducer