"use client"

import { useCart } from '@/lib/cart-context'
import { FreeGiftNotification } from './free-gift-notification'

export function CartNotificationWrapper() {
  const { state, hideFreeGiftNotification } = useCart()

  console.log('CartNotificationWrapper state:', {
    showFreeGiftNotification: state.showFreeGiftNotification,
    freeGiftInfo: state.freeGiftInfo,
    itemCount: state.itemCount
  })

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
