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
  freeGiftProductId?: string // Added for free gifts
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  showFreeGiftNotification: boolean
  freeGiftInfo: {
    giftProduct: {
      name: string
      image: string
    }
    mainProduct: {
      name: string
      image: string
    }
  } | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { 
      freeGiftProductId?: string; 
      freeGiftProductName?: string; 
      freeGiftProductImage?: string; 
    } }
  | { type: 'REMOVE_ITEM'; payload: string | { id: string; size?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number; size?: string; color?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'VALIDATE_ITEM'; payload: { id: string; size?: string; color?: string } }
  | { type: 'HIDE_FREE_GIFT_NOTIFICATION' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  validateItem: (
    item: Omit<CartItem, 'quantity'>,
    size?: string,
    color?: string,
    options?: { requireSize?: boolean; requireColor?: boolean }
  ) => { isValid: boolean; missingFields: string[] }
  hideFreeGiftNotification: () => void
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
              // ADD_ITEM action received
      
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
        
        // Check if this product has a free gift and should show notification
        const hasFreeGift = !!action.payload.freeGiftProductId
        const showNotification = hasFreeGift
        
        // Updating existing item with free gift
        
        return { 
          items: updatedItems, 
          total, 
          itemCount,
          showFreeGiftNotification: showNotification,
          freeGiftInfo: showNotification ? {
            giftProduct: {
              name: action.payload.freeGiftProductName || 'Free Gift',
              image: action.payload.freeGiftProductImage || ''
            },
            mainProduct: {
              name: action.payload.name,
              image: action.payload.image
            }
          } : null
        }
      } else {
        const newItem = { ...action.payload, quantity: 1 }
        let updatedItems = [...state.items, newItem]
        
        // Check if this product has a free gift and add it automatically
        
        if (action.payload.freeGiftProductId) {
          const freeGiftItem: CartItem = {
            id: action.payload.freeGiftProductId,
            name: action.payload.freeGiftProductName || 'Free Gift',
            brand: 'Free Gift',
            image: action.payload.freeGiftProductImage || '',
            currentPrice: 0,
            originalPrice: 0,
            quantity: 1,
            freeGiftProductId: action.payload.freeGiftProductId
          }
          updatedItems.push(freeGiftItem)
          // Free gift item added to cart
        } else {
          // No free gift to add
        }
        
        const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        // Check if we added a free gift and should show notification
        const hasFreeGift = !!action.payload.freeGiftProductId
        const showNotification = hasFreeGift
        
        // Adding item with free gift
        
        return { 
          items: updatedItems, 
          total, 
          itemCount,
          showFreeGiftNotification: showNotification,
          freeGiftInfo: showNotification ? {
            giftProduct: {
              name: action.payload.freeGiftProductName || 'Free Gift',
              image: action.payload.freeGiftProductImage || ''
            },
            mainProduct: {
              name: action.payload.name,
              image: action.payload.image
            }
          } : null
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      // action.payload should be an object with id, size, and color for proper removal
      const { id, size, color } = typeof action.payload === 'string' 
        ? { id: action.payload, size: undefined, color: undefined }
        : action.payload
      
      const updatedItems = state.items.filter(item => 
        !(item.id === id && 
          (size === undefined || item.size === size) && 
          (color === undefined || item.color === color))
      )
      
      const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { 
        items: updatedItems, 
        total, 
        itemCount,
        showFreeGiftNotification: state.showFreeGiftNotification,
        freeGiftInfo: state.freeGiftInfo
      }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        // Find the item to get its size and color for proper removal
        const itemToRemove = state.items.find(item => item.id === action.payload.id)
        if (itemToRemove) {
          return cartReducer(state, { 
            type: 'REMOVE_ITEM', 
            payload: { 
              id: action.payload.id, 
              size: itemToRemove.size, 
              color: itemToRemove.color 
            } 
          })
        }
        return state
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { 
        items: updatedItems, 
        total, 
        itemCount,
        showFreeGiftNotification: state.showFreeGiftNotification,
        freeGiftInfo: state.freeGiftInfo
      }
    }
    
    case 'CLEAR_CART':
      return { 
        items: [], 
        total: 0, 
        itemCount: 0,
        showFreeGiftNotification: false,
        freeGiftInfo: null
      }
    
    case 'HIDE_FREE_GIFT_NOTIFICATION':
      return {
        ...state,
        showFreeGiftNotification: false,
        freeGiftInfo: null
      }
    
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
          // Loading cart from localStorage
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
            
            const result = {
              items: sanitizedItems,
              total,
              itemCount,
              showFreeGiftNotification: parsedCart.showFreeGiftNotification || false,
              freeGiftInfo: parsedCart.freeGiftInfo || null
            }
            // Cart loaded with state
            return result
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    return {
      items: [],
      total: 0,
      itemCount: 0,
      showFreeGiftNotification: false,
      freeGiftInfo: null
    }
  }

  const [state, dispatch] = useReducer(cartReducer, getInitialState())

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Saving cart to localStorage
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



  const hideFreeGiftNotification = () => {
    dispatch({ type: 'HIDE_FREE_GIFT_NOTIFICATION' })
  }

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, size, color } })
  }

  return (
    <CartContext.Provider value={{ state, dispatch, validateItem, hideFreeGiftNotification, updateQuantity }}>
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
      state: { items: [], total: 0, itemCount: 0, showFreeGiftNotification: false, freeGiftInfo: null },
      dispatch: noop as unknown as React.Dispatch<any>,
      validateItem: () => ({ isValid: true, missingFields: [] }),
      hideFreeGiftNotification: noop,
      updateQuantity: noop
    }
  }
  return context
}
