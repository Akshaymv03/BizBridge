import { createSlice } from '@reduxjs/toolkit'

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existingItem = state.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock_quantity: product.stock_quantity,
          quantity: 1,
        })
      }
      
      saveCartToStorage(state.items)
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      saveCartToStorage(state.items)
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock_quantity))
      }
      
      saveCartToStorage(state.items)
    },
    
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cart')
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
export const selectCartItemCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export default cartSlice.reducer