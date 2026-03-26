import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import b2bReducer from '../features/b2b/b2bSlice'
import b2cReducer from '../features/b2c/b2cSlice'
import c2cReducer from '../features/c2c/c2cSlice'
import orderReducer from '../features/orders/orderSlice'
import c2cCartReducer from '../features/c2c/c2cCartSlice'
import c2cOrderReducer from '../features/c2c/c2cOrderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    b2b: b2bReducer,
    b2c: b2cReducer,
    c2c: c2cReducer,
    orders: orderReducer,
    c2cCart: c2cCartReducer,
    c2cOrders: c2cOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})