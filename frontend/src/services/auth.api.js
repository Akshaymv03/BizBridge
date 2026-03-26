import api from './api'

export const authApi = {
  login: (credentials) => api.post('/auth/login/', credentials),
  
  register: (userData) => api.post('/auth/register/', userData),
  
  getCurrentUser: () => api.get('/auth/profile/'),
  
  updateProfile: (userData) => api.patch('/auth/profile/', userData),
  
  refreshToken: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
}