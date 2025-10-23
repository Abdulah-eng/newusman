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
  depth?: string
  firmness?: string
  quantity: number
  variantSku?: string // Added for variant SKU
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
  | { type: 'REMOVE_ITEM'; payload: string | { id: string; size?: string; color?: string; depth?: string; firmness?: string; variantSku?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number; size?: string; color?: string; depth?: string; firmness?: string; variantSku?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'VALIDATE_ITEM'; payload: { id: string; size?: string; color?: string; variantSku?: string } }
  | { type: 'HIDE_FREE_GIFT_NOTIFICATION' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  validateItem: (
    item: Omit<CartItem, 'quantity'>,
    size?: string,
    color?: string,
    variantSku?: string,
    options?: { requireSize?: boolean; requireColor?: boolean; requireVariantSku?: boolean }
  ) => { isValid: boolean; missingFields: string[] }
  hideFreeGiftNotification: () => void
  updateQuantity: (id: string, quantity: number, size?: string, color?: string, variantSku?: string) => void
  clearCart: () => void
  forceClearCart: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      console.log('ADD_ITEM action received:', action.payload)
      console.log('Current cart state before ADD_ITEM:', {
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      })
      
      // Debug: Log the payload details
      console.log('ADD_ITEM payload details:', {
        id: action.payload.id,
        name: action.payload.name,
        currentPrice: action.payload.currentPrice,
        originalPrice: action.payload.originalPrice,
        size: action.payload.size,
        color: action.payload.color,
        depth: action.payload.depth,
        firmness: action.payload.firmness,
        variantSku: action.payload.variantSku,
        fullPayload: action.payload
      })
      
      // Debug: Check validation conditions
      console.log('Validation checks:', {
        currentPrice: action.payload.currentPrice,
        originalPrice: action.payload.originalPrice,
        isZeroPrice: action.payload.currentPrice === 0,
        isSameAsOriginal: action.payload.currentPrice === action.payload.originalPrice,
        size: action.payload.size,
        color: action.payload.color,
        isEmptySize: action.payload.size === '',
        isEmptyColor: action.payload.color === ''
      })
      
      // CRITICAL: Validate that we're not adding items with invalid prices
      if (action.payload.currentPrice === 0) {
        console.error('BLOCKING: Attempting to add item with zero price:', {
          currentPrice: action.payload.currentPrice,
          originalPrice: action.payload.originalPrice,
          size: action.payload.size,
          payload: action.payload
        })
        return state // Don't add the item
      }
      
      console.log('✅ Price validation passed - currentPrice:', action.payload.currentPrice)
      
      // Simplified validation - only block if size is explicitly empty string
      // For size-only products, we only require size to be selected
      if (action.payload.size === '') {
        console.error('BLOCKING: Size is empty string:', {
          size: action.payload.size,
          payload: action.payload
        })
        return state // Don't add the item
      }
      
      console.log('✅ Variant validation passed - size is valid')
      
      // Simplified existing item matching - focus on id and size for size-only products
      const existingItem = state.items.find(item => {
        const idMatch = item.id === action.payload.id
        const sizeMatch = item.size === action.payload.size
        const colorMatch = !action.payload.color || !item.color || item.color === action.payload.color
        const depthMatch = !action.payload.depth || !item.depth || item.depth === action.payload.depth
        const firmnessMatch = !action.payload.firmness || !item.firmness || item.firmness === action.payload.firmness
        
        return idMatch && sizeMatch && colorMatch && depthMatch && firmnessMatch
      })
      
      // Note: We no longer need to handle existing items with different variants
      // because we prevent adding items to cart until all variants are selected
      
      if (existingItem) {
        const updatedItems = state.items.map(item => {
          const idMatch = item.id === action.payload.id
          const sizeMatch = item.size === action.payload.size
          const colorMatch = !action.payload.color || !item.color || item.color === action.payload.color
          const depthMatch = !action.payload.depth || !item.depth || item.depth === action.payload.depth
          const firmnessMatch = !action.payload.firmness || !item.firmness || item.firmness === action.payload.firmness
          
          if (idMatch && sizeMatch && colorMatch && depthMatch && firmnessMatch) {
            return { ...item, quantity: item.quantity + 1 }
          }
          return item
        })
        const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        console.log('CartContext - Updating existing item - Total calculation:', {
          items: updatedItems.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size,
            color: item.color,
            depth: item.depth,
            firmness: item.firmness,
            variantSku: item.variantSku,
            currentPrice: item.currentPrice,
            quantity: item.quantity,
            subtotal: item.currentPrice * item.quantity
          })),
          total,
          itemCount
        })
        
        // Check if this product has a free gift and should show notification
        const hasFreeGift = !!action.payload.freeGiftProductId
        const showNotification = hasFreeGift
        
        console.log('Updating existing item with free gift:', {
          hasFreeGift,
          freeGiftProductId: action.payload.freeGiftProductId,
          freeGiftProductName: action.payload.freeGiftProductName,
          showNotification
        })
        
        const newState = { 
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
        
        console.log('Cart state after updating existing item:', newState)
        
        // CRITICAL: Log that the existing item was successfully updated
        console.log('✅ SUCCESS: Existing item updated in cart successfully!', {
          itemId: action.payload.id,
          itemName: action.payload.name,
          itemPrice: action.payload.currentPrice,
          cartTotal: newState.total,
          cartItemCount: newState.itemCount
        })
        
        return newState
      } else {
        const newItem = { ...action.payload, quantity: 1 }
        
        // Debug: Log what's being added to cart
        console.log('CartContext - Adding new item:', {
          id: newItem.id,
          name: newItem.name,
          size: newItem.size,
          color: newItem.color,
          depth: newItem.depth,
          firmness: newItem.firmness,
          currentPrice: newItem.currentPrice,
          variantSku: newItem.variantSku,
          payload: action.payload
        })
        
        console.log('CartContext - Current state before adding:', {
          currentItems: state.items.length,
          currentTotal: state.total,
          currentItemCount: state.itemCount
        })
        
        console.log('CartContext - Item will be added to cart:', {
          itemId: newItem.id,
          itemName: newItem.name,
          itemPrice: newItem.currentPrice,
          itemSize: newItem.size,
          itemColor: newItem.color
        })
        
        let updatedItems = [...state.items, newItem]
        
        // Check if this product has a free gift and add it automatically
        console.log('Checking for free gift:', {
          freeGiftProductId: action.payload.freeGiftProductId,
          freeGiftProductName: action.payload.freeGiftProductName,
          hasFreeGift: !!action.payload.freeGiftProductId
        })
        
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
          console.log('Free gift item added to cart:', freeGiftItem)
        } else {
          console.log('No free gift to add')
        }
        
        const total = updatedItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        console.log('CartContext - Total calculation:', {
          items: updatedItems.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size,
            color: item.color,
            depth: item.depth,
            firmness: item.firmness,
            variantSku: item.variantSku,
            currentPrice: item.currentPrice,
            quantity: item.quantity,
            subtotal: item.currentPrice * item.quantity
          })),
          total,
          itemCount
        })
        
        // Note: Removed problematic price mismatch logic that was replacing entire cart
        // This was causing other products to be removed when adding new items
        
        // Note: Removed temporary fix that was potentially causing cart issues
        
        // Check if we added a free gift and should show notification
        const hasFreeGift = !!action.payload.freeGiftProductId
        const showNotification = hasFreeGift
        
        console.log('Adding item with free gift:', {
          hasFreeGift,
          freeGiftProductId: action.payload.freeGiftProductId,
          freeGiftProductName: action.payload.freeGiftProductName,
          showNotification
        })
        
        const newState = { 
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
        
        console.log('Cart state after adding new item:', newState)
        
        console.log('CartContext - Final cart state:', {
          itemsCount: newState.items.length,
          total: newState.total,
          itemCount: newState.itemCount,
          items: newState.items.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size,
            color: item.color,
            currentPrice: item.currentPrice,
            quantity: item.quantity
          }))
        })
        
        console.log('CartContext - State change:', {
          before: { items: state.items.length, total: state.total, itemCount: state.itemCount },
          after: { items: newState.items.length, total: newState.total, itemCount: newState.itemCount }
        })
      
      // CRITICAL: Log that the item was successfully added
      console.log('✅ SUCCESS: Item added to cart successfully!', {
        itemId: newItem.id,
        itemName: newItem.name,
        itemPrice: newItem.currentPrice,
        cartTotal: newState.total,
        cartItemCount: newState.itemCount
      })
      
      return newState
      }
    }
    
    case 'REMOVE_ITEM': {
      // action.payload should be an object with id, size, color, and variantSku for proper removal
      const { id, size, color, depth, firmness, variantSku } = typeof action.payload === 'string' 
        ? { id: action.payload, size: undefined, color: undefined, depth: undefined, firmness: undefined, variantSku: undefined }
        : action.payload
      
      const updatedItems = state.items.filter(item => 
        !(item.id === id && 
          (size === undefined || item.size === size) && 
          (color === undefined || item.color === color) &&
          (depth === undefined || item.depth === depth) &&
          (firmness === undefined || item.firmness === firmness) &&
          (variantSku === undefined || item.variantSku === variantSku))
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
        // Find the item to get its size, color, and variantSku for proper removal
        const itemToRemove = state.items.find(item => item.id === action.payload.id)
        if (itemToRemove) {
          return cartReducer(state, { 
            type: 'REMOVE_ITEM', 
            payload: { 
              id: action.payload.id, 
              size: itemToRemove.size, 
              color: itemToRemove.color,
              variantSku: itemToRemove.variantSku
            } 
          })
        }
        return state
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color &&
        item.depth === action.payload.depth &&
        item.firmness === action.payload.firmness &&
        item.variantSku === action.payload.variantSku
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
    // Chrome-specific fix: Always return default state during SSR
    if (typeof window === 'undefined') {
      return {
        items: [],
        total: 0,
        itemCount: 0,
        showFreeGiftNotification: false,
        freeGiftInfo: null
      }
    }

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
          
          const result = {
            items: sanitizedItems,
            total,
            itemCount,
            showFreeGiftNotification: parsedCart.showFreeGiftNotification || false,
            freeGiftInfo: parsedCart.freeGiftInfo || null
          }
          return result
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
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
        console.log('CartContext - Saving cart state to localStorage:', {
          items: state.items.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size,
            color: item.color,
            depth: item.depth,
            firmness: item.firmness,
            variantSku: item.variantSku,
            currentPrice: item.currentPrice,
            quantity: item.quantity
          })),
          total: state.total,
          itemCount: state.itemCount
        })
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
    variantSku?: string,
    options?: { requireSize?: boolean; requireColor?: boolean; requireVariantSku?: boolean }
  ) => {
    const missingFields: string[] = []
    const requireSize = options?.requireSize ?? true
    const requireColor = options?.requireColor ?? true
    const requireVariantSku = options?.requireVariantSku ?? false
    
    // Check if size is required and selected
    if (requireSize && (!size || size === 'Standard Size')) {
      missingFields.push('size')
    }
    
    // Check if color is required and selected
    if (requireColor && (!color || color === 'Standard')) {
      missingFields.push('color')
    }
    
    // Check if variant SKU is required and provided
    if (requireVariantSku && !variantSku) {
      missingFields.push('variantSku')
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }



  const hideFreeGiftNotification = () => {
    dispatch({ type: 'HIDE_FREE_GIFT_NOTIFICATION' })
  }

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string, variantSku?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, size, color, variantSku } })
  }

  const clearCart = () => {
    console.log('Clearing cart - Current state before clear:', {
      items: state.items.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        currentPrice: item.currentPrice,
        quantity: item.quantity
      })),
      total: state.total,
      itemCount: state.itemCount
    })
    dispatch({ type: 'CLEAR_CART' })
  }

  const forceClearCart = () => {
    console.log('Force clearing cart and localStorage')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{ state, dispatch, validateItem, hideFreeGiftNotification, updateQuantity, clearCart, forceClearCart }}>
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
      updateQuantity: noop,
      clearCart: noop,
      forceClearCart: noop
    }
  }
  return context
}
