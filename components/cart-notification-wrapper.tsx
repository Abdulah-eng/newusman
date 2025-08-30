"use client"

import { useCart } from '@/lib/cart-context'
import { FreeGiftNotification } from './free-gift-notification'

export function CartNotificationWrapper() {
  const { state, hideFreeGiftNotification } = useCart()

  // State logging removed for performance

  if (!state.showFreeGiftNotification || !state.freeGiftInfo) {
    return null
  }

  return (
    <FreeGiftNotification
      isOpen={state.showFreeGiftNotification}
      onClose={hideFreeGiftNotification}
      giftProduct={state.freeGiftInfo.giftProduct}
      mainProduct={state.freeGiftInfo.mainProduct}
    />
  )
}
