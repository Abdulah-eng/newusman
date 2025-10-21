"use client"

import { useCart } from '@/lib/cart-context'
import { FreeGiftNotification } from './free-gift-notification'

export function CartNotificationWrapper() {
  const { state, hideFreeGiftNotification } = useCart()

  // Debug logging removed to prevent console spam

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
