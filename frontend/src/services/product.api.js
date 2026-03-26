import api from './api'

export const productApi = {
  getProducts: (params) => api.get('/products/', { params }),
  
  getProductById: (id) => api.get(`/products/${id}/`),
  
  searchProducts: (query) => api.get('/products/search_suggestions/', { 
    params: { q: query } 
  }),
  
  getPriceRange: () => api.get('/products/price_range/'),
  
  getCategories: () => api.get('/categories/'),
  
  getCategoriesWithCount: () => api.get('/categories/with_product_count/'),
}