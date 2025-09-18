"use client"

import { RotateCcw, Truck, ShoppingCart, CreditCard, Clock } from 'lucide-react'

export function TrustBadgesSection() {
  return (
    <section className="hidden lg:block text-gray-800" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-center py-1">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 xl:gap-8 w-full max-w-6xl">
            {/* Easy Returns, No Worries */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs min-w-0">
                <div className="font-medium leading-tight">Easy Returns</div>
                <div className="text-xs text-gray-600 leading-tight">No Worries</div>
              </div>
            </div>

            {/* Quick Delivery, Instant Comfort */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs min-w-0">
                <div className="font-medium leading-tight">Quick Delivery</div>
                <div className="text-xs text-gray-600 leading-tight">Instant Comfort</div>
              </div>
            </div>

            {/* Shop Easy, Sleep Easy */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs min-w-0">
                <div className="font-medium leading-tight">Shop Easy</div>
                <div className="text-xs text-gray-600 leading-tight">Sleep Easy</div>
              </div>
            </div>

            {/* Shop Now, Pay Later with Klarna */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs min-w-0">
                <div className="font-medium leading-tight">Shop Now, Pay Later</div>
                <div className="text-xs text-gray-600 leading-tight">with Klarna</div>
              </div>
            </div>

            {/* Buy It, Try It, Pay Later */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs min-w-0">
                <div className="font-medium leading-tight">Buy It, Try It</div>
                <div className="text-xs text-gray-600 leading-tight">Pay Later</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
