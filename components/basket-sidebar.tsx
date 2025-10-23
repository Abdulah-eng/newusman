"use client"

import { useState, useEffect } from 'react'
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Star, ShoppingCart, ArrowRight } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

interface BasketSidebarProps {
  isOpen: boolean
  onClose: () => void
  product?: {
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
  }
}

interface RecommendedProduct {
  id: string
  name: string
  image: string
  rating: number
  reviewCount: number
  size: string
  originalPrice: number
  currentPrice: number
  badge?: string
  category: string
}

export function BasketSidebar({ isOpen, onClose, product }: BasketSidebarProps) {
  const { state, dispatch, clearCart, forceClearCart } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  // Custom scrollbar styles with Chrome compatibility
  const scrollbarStyles = `
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    /* Chrome-specific fixes */
    .custom-scrollbar::-webkit-scrollbar-corner {
      background: #f1f5f9;
    }
  `

  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([])
  const [loadingRecommended, setLoadingRecommended] = useState(true)

  // Helper function for generic recommendations
  const fetchGenericRecommendations = async () => {
    // Fetch products from multiple categories for generic recommendations
    const [pillowsResponse, beddingResponse, toppersResponse] = await Promise.all([
      fetch('/api/products/category/pillows'),
      fetch('/api/products/category/bedding'),
      fetch('/api/products/category/toppers')
    ])

    const allProducts = []
    
    if (pillowsResponse.ok) {
      const data = await pillowsResponse.json()
      allProducts.push(...(data.products?.slice(0, 1) || []))
    }
    
    if (beddingResponse.ok) {
      const data = await beddingResponse.json()
      allProducts.push(...(data.products?.slice(0, 2) || []))
    }
    
    if (toppersResponse.ok) {
      const data = await toppersResponse.json()
      allProducts.push(...(data.products?.slice(0, 1) || []))
    }

    // Transform database products to match RecommendedProduct interface
    const transformedProducts = allProducts.map((dbProduct: any, index: number) => ({
      id: dbProduct.id,
      name: dbProduct.name,
      image: dbProduct.images?.[0] || '/placeholder.jpg',
      rating: dbProduct.rating || 4.5,
      reviewCount: dbProduct.reviewCount || 500,
      size: dbProduct.variants?.[0]?.size || 'Standard Size',
      originalPrice: dbProduct.variants?.[0]?.originalPrice || 100,
      currentPrice: dbProduct.variants?.[0]?.currentPrice || 90,
      badge: index === 0 ? 'TOP PICKS 2024' : index === 2 ? 'BEST SELLER' : index === 3 ? 'BEST VALUE' : '',
      category: dbProduct.category
    }))

    setRecommendedProducts(transformedProducts)
  }

  // Fetch recommended products from database
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoadingRecommended(true)
      try {
        if (product?.id) {
          console.log('Fetching recommendations for product:', product.id)
          // Fetch recommendations for the specific product
          const response = await fetch(`/api/products/${product.id}/recommendations`)
          if (response.ok) {
            const data = await response.json()
            console.log('Received recommendations:', data.recommendations)
            setRecommendedProducts(data.recommendations || [])
          } else {
            console.log('Failed to fetch specific recommendations, falling back to generic')
            // Fallback to generic recommendations if specific ones fail
            await fetchGenericRecommendations()
          }
        } else {
          console.log('No specific product, fetching generic recommendations')
          // No specific product, fetch generic recommendations
          await fetchGenericRecommendations()
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error)
        // Set fallback products if API fails
        setRecommendedProducts([
          {
            id: "1",
            name: "Premium Pillow",
            image: "/placeholder.jpg",
            rating: 4.4,
            reviewCount: 1250,
            size: "Standard Pillow Size",
            originalPrice: 109.00,
            currentPrice: 92.65,
            badge: "TOP PICKS 2024",
            category: "pillows"
          }
        ])
      } finally {
        setLoadingRecommended(false)
      }
    }

    fetchRecommendedProducts()
  }, [product?.id])

    // State for selected recommended products
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
               {/* Sidebar */}
         <div 
           className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
             isOpen ? 'translate-x-0' : 'translate-x-full'
           }`}
         >
           {/* Header */}
           <div className="bg-gradient-to-r from-[#33373E] to-[#4A5568] text-white p-4 flex items-center justify-between flex-shrink-0">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                 <Check className="w-5 h-5 text-white" />
               </div>
               <span className="font-semibold text-lg">Item Added to your Basket</span>
             </div>
             <button
               onClick={onClose}
               className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
             >
               <X className="w-5 h-5 text-white" />
             </button>
           </div>
 
                  {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                     {/* Added Item */}
           {product && (
             <div className="p-6 border-b border-gray-200 bg-gray-50">
               <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                 <div className="flex items-start gap-4">
                   {/* Product Image - Big on Left */}
                   <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                     <Image
                       src={product.image || "/placeholder.svg"}
                       alt={product.name}
                       width={128}
                       height={128}
                       className="object-cover rounded-xl"
                     />
                   </div>
                   
                   {/* Product Details and Pricing - Content on Right */}
                   <div className="flex-1 min-w-0">
                     {/* Product Name */}
                     <h4 className="font-bold text-gray-900 text-xl mb-2">{product.name}</h4>
                     
                     {/* Pricing - Directly below name */}
                     <div className="mb-3">
                       <div className="text-4xl font-bold text-orange-600 mb-2">
                         £{product.currentPrice.toFixed(2)}
                       </div>
                       {product.originalPrice > product.currentPrice && (
                         <div className="text-lg text-gray-500 line-through">
                           Was £{product.originalPrice.toFixed(2)}
                         </div>
                       )}
                     </div>
                     
                     {/* Size and Color on same line */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                       {product.size && (
                         <span>Size: {product.size}</span>
                       )}
                       {product.color && (
                         <span>Color: {product.color}</span>
                       )}
                      {product.depth && (
                        <span>Depth: {product.depth}</span>
                      )}
                      {product.firmness && (
                        <span>Firmness: {product.firmness}</span>
                      )}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}



                         {/* Continue the Comfort Section */}
             <div className="p-4">
               <h3 className="text-lg font-semibold text-gray-900 mb-3">Continue the Comfort</h3>
               <p className="text-sm text-gray-600 mb-4">
                 We think you'll love these products so you can get the most out of your new mattress
               </p>
   
                                                                                               {/* Multiple Recommended Products with Checkboxes */}
               {loadingRecommended ? (
                 <div className="text-center py-4">
                   <div className="text-sm text-gray-500">Loading recommendations...</div>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {recommendedProducts.map((recProduct) => (
                     <div key={recProduct.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                       <div className="flex items-start gap-3">
                         {/* Checkbox */}
                         <div className="flex-shrink-0 mt-1">
                                                       <input
                              type="checkbox"
                              id={`product-${recProduct.id}`}
                              checked={selectedProducts.includes(recProduct.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts([...selectedProducts, recProduct.id])
                                  // Automatically add to cart
                                  dispatch({
                                    type: 'ADD_ITEM',
                                    payload: {
                                      id: recProduct.id,
                                      name: recProduct.name,
                                      brand: recProduct.badge || 'Premium',
                                      image: recProduct.image,
                                      currentPrice: recProduct.currentPrice,
                                      originalPrice: recProduct.originalPrice,
                                      size: recProduct.size
                                    }
                                  })
                                } else {
                                  setSelectedProducts(selectedProducts.filter(id => id !== recProduct.id))
                                  // Remove from cart (you might want to implement REMOVE_ITEM logic here)
                                }
                              }}
                              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                            />
                         </div>
                         
                         {/* Product Image - Slightly Smaller */}
                         <div className="relative w-24 h-24 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                           <Image
                             src={recProduct.image}
                             alt={recProduct.name}
                             width={96}
                             height={96}
                             className="object-cover rounded-lg"
                           />
                           {recProduct.badge && (
                             <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                               {recProduct.badge}
                             </div>
                           )}
                         </div>
                         
                         {/* Product Details and Pricing - Content on Right */}
                         <div className="flex-1 min-w-0">
                           {/* Product Name - Clickable */}
                           <Link 
                             href={`/products/${recProduct.category || 'mattresses'}/${recProduct.id}`}
                             className="block hover:text-orange-600 transition-colors"
                             target="_blank" 
                             rel="noopener noreferrer"
                           >
                             <h4 className="font-semibold text-gray-900 text-base mb-1 cursor-pointer hover:text-orange-600">
                               {recProduct.name}
                             </h4>
                           </Link>
                           
                           {/* Rating */}
                           <div className="flex items-center gap-2 mb-1">
                             <div className="flex items-center">
                               {[...Array(5)].map((_, i) => (
                                 <Star 
                                   key={i} 
                                   className={`w-3 h-3 ${i < Math.floor(recProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
                                 />
                               ))}
                             </div>
                             <span className="text-xs text-gray-600">{recProduct.rating}</span>
                           </div>
                           
                           {/* Size */}
                           <p className="text-xs text-gray-600 mb-1">{recProduct.size}</p>
                           
                           {/* Pricing */}
                           <div className="flex items-center gap-2">
                             <span className="text-base font-semibold text-gray-900">£{recProduct.currentPrice.toFixed(2)}</span>
                             {recProduct.originalPrice > recProduct.currentPrice && (
                               <span className="text-xs text-gray-500 line-through">£{recProduct.originalPrice.toFixed(2)}</span>
                             )}
                           </div>
                         </div>
                       </div>
                     </div>
                                      ))}
                 </div>
                 )}
                 
                 
               </div>
            

            {/* Bottom Spacing for Footer */}
            <div className="h-4"></div>
         </div>
 
                   {/* Footer */}
          <div className="bg-gradient-to-r from-[#33373E] to-[#4A5568] text-white p-4">
            <div className="flex items-center justify-between mb-4">
                             <div>
                 <p className="text-lg font-semibold text-white">Subtotal: £{state.total.toFixed(2)}</p>
                 <p className="text-xs text-white">{state.itemCount} items in your basket</p>
               </div>
                             <Button 
                 asChild
                 className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
               >
                 <Link href="/cart" className="flex items-center gap-2">
                   Go to Basket
                   <ArrowRight className="w-4 h-4" />
                 </Link>
               </Button>
            </div>
          </div>
      </div>
    </>
  )
}
