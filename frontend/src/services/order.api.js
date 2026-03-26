import api from './api'

export const orderApi = {
  getOrders: () => api.get('/orders/'),
  
  getOrderById: (id) => api.get(`/orders/${id}/`),
  
  createOrder: (orderData) => api.post('/orders/', orderData),
  
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
  
  getOrderStatistics: () => api.get('/orders/statistics/'),
}