import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const c2cCartSlice = createSlice({
  name: 'c2cCart',
  initialState,
  reducers: {
    addToC2CCart(state, action) {
      const item = action.payload
      const existing = state.items.find(i => i.id === item.id)

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
    },

    removeFromC2CCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },

    updateC2CQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
    },

    clearC2CCart(state) {
      state.items = []
    },
  },
})

/* selectors */
export const selectC2CCartItems = state => state.c2cCart.items

export const selectC2CCartTotal = state =>
  state.c2cCart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

export const {
  addToC2CCart,
  removeFromC2CCart,
  updateC2CQuantity,
  clearC2CCart,
} = c2cCartSlice.actions

export default c2cCartSlice.reducer