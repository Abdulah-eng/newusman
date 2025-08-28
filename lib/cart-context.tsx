"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  brand: string
  image: string
  currentPrice: number
  originalPrice: number
  size?: string
  color?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'VALIDATE_ITEM'; payload: { id: string; size?: string; color?: string } }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  validateItem: (
    item: Omit<CartItem, 'quantity'>,
    size?: string,
    color?: string,
    options?: { requireSize?: boolean; requireColor?: boolean }
  ) => { isValid: boolean; missingFields: string[] }
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color
      )
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        return { items: updatedItems, total, itemCount }
      } else {
        const newItem = { ...action.payload, quantity: 1 }
        const updatedItems = [...state.items, newItem]
        const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        return { items: updatedItems, total, itemCount }
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: updatedItems, total, itemCount }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id })
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: updatedItems, total, itemCount }
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart state from localStorage if available
  const getInitialState = (): CartState => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          // Ensure the parsed cart has the correct structure
          if (parsedCart.items && Array.isArray(parsedCart.items)) {
            // Recompute totals to avoid stale/zero values
            const sanitizedItems = parsedCart.items.map((it: any) => ({
              ...it,
              currentPrice: Number(it.currentPrice) || 0,
              quantity: Number(it.quantity) || 1,
            }))
            const total = sanitizedItems.reduce(
              (sum: number, item: any) => sum + (Number(item.currentPrice) * (Number(item.quantity) || 1)),
              0
            )
            const itemCount = sanitizedItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0)
            return {
              items: sanitizedItems,
              total,
              itemCount,
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    return {
      items: [],
      total: 0,
      itemCount: 0
    }
  }

  const [state, dispatch] = useReducer(cartReducer, getInitialState())

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(state))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [state])

  const validateItem = (
    item: Omit<CartItem, 'quantity'>,
    size?: string,
    color?: string,
    options?: { requireSize?: boolean; requireColor?: boolean }
  ) => {
    const missingFields: string[] = []
    const requireSize = options?.requireSize ?? true
    const requireColor = options?.requireColor ?? true
    
    // Check if size is required and selected
    if (requireSize && (!size || size === 'Standard Size')) {
      missingFields.push('size')
    }
    
    // Check if color is required and selected
    if (requireColor && (!color || color === 'Standard')) {
      missingFields.push('color')
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }



  return (
    <CartContext.Provider value={{ state, dispatch, validateItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    // Graceful fallback when provider isn't mounted (prevents hard crashes on SSR/routes)
    const noop = () => {}
    return {
      state: { items: [], total: 0, itemCount: 0 },
      dispatch: noop as unknown as React.Dispatch<any>,
      validateItem: () => ({ isValid: true, missingFields: [] })
    }
  }
  return context
}
