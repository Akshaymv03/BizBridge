import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/auth/refresh/`, { refresh: refreshToken })
        const { access } = response.data
        localStorage.setItem('access_token', access)
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

// ─── B2C / General Product API ───────────────────────────────────────────────
export const productApi = {
  getProducts: (params) => api.get('/products/', { params }),
  getProductById: (id) => api.get(`/products/${id}/`),
  searchProducts: (query) =>
    api.get('/products/search_suggestions/', { params: { q: query } }),
  getPriceRange: () => api.get('/products/price_range/'),
  getCategories: () => api.get('/categories/'),
  getCategoriesWithCount: () => api.get('/categories/with_product_count/'),
}

// ─── B2B API ──────────────────────────────────────────────────────────────────
export const b2bApi = {
  getProducts: (params) =>
    api.get('/products/', { params: { business_model: 'B2B', ...params } }),
  getProductById: (id) => api.get(`/products/${id}/`),
  searchProducts: (query) =>
    api.get('/products/search_suggestions/', { params: { q: query, business_model: 'B2B' } }),
  getPriceRange: () => api.get('/products/price_range/'),
  getCategories: () => api.get('/categories/'),
  getCategoriesWithCount: () => api.get('/categories/with_product_count/'),
  getFeaturedProducts: () =>
    api.get('/products/', { params: { business_model: 'B2B', featured: true, page_size: 8 } }),
  submitRFQ: (data) => api.post('/b2b/rfq/', data),
  getMyRFQs: () => api.get('/b2b/rfq/my_quotes/'),
  getRFQById: (id) => api.get(`/b2b/rfq/${id}/`),
  updateRFQ: (id, data) => api.patch(`/b2b/rfq/${id}/`, data),
  cancelRFQ: (id) => api.post(`/b2b/rfq/${id}/cancel/`),
  getOrders: () => api.get('/b2b/orders/'),
  getOrderById: (id) => api.get(`/b2b/orders/${id}/`),
  createBulkOrder: (data) => api.post('/b2b/orders/', data),
  getDashboardStats: () => api.get('/b2b/dashboard/stats/'),
  getRecentActivity: () => api.get('/b2b/dashboard/activity/'),
}

// ─── C2C API ──────────────────────────────────────────────────────────────────
export const c2cApi = {
  // Browse — shared /products/ endpoint filtered by C2C
  getListings: (params) =>
    api.get('/products/', { params: { business_model: 'C2C', ...params } }),
  getListingById: (id) => api.get(`/products/${id}/`),
  searchListings: (query) =>
    api.get('/products/search_suggestions/', { params: { q: query, business_model: 'C2C' } }),

  // My listings
  getMyListings: () =>
    api.get('/c2c/my-listings/'),

  // Create / edit / delete
  createListing: (formData) =>
    api.post('/c2c/listings/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateListing: (id, formData) =>
    api.patch(`/c2c/listings/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteListing: (id) => api.delete(`/c2c/listings/${id}/`),
}

export default api