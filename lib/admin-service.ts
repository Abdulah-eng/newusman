import { supabase } from './supabaseClient'

export interface AdminProduct {
  id: string
  name: string
  brand: string
  brandColor: string
  badge: string
  badgeColor: string
  image: string
  rating: number
  reviewCount: number
  firmness: string
  firmnessLevel: number
  features: string[]
  originalPrice: number
  currentPrice: number
  savings: number
  freeDelivery: string
  setupService: boolean
  setupCost?: number
  certifications: string[]
  sizes: string[]
  selectedSize: string
  monthlyPrice: number
  images: string[]
  category: string
  type: string
  size: string
  comfortLevel: string
  inStore: boolean
  onSale: boolean
  shortDescription: string
  longDescription: string
  colors: string[]
  materials: string[]
  dimensions: any
  dispatchTime: string
  reasonsToBuy: string[]
  descriptionParagraph1?: string
  descriptionParagraph2?: string
  descriptionParagraph3?: string
  descriptionImage1?: string
  descriptionImage2?: string
  descriptionImage3?: string
  firmnessScaleImage?: string
  productQuestions: any[]
  warrantyInfo: any
  careInstructions: string
  careImage?: string
  stockQuantity: number
  inStock: boolean
  // Filter fields
  filterMattressType?: string[]
  filterFirmness?: string[]
  filterSizes?: string[]
  filterFeatures?: string[]
  filterBrand?: string[]
  filterMaterial?: string[]
  filterMinPrice?: number
  filterMaxPrice?: number
  filterInStore?: boolean
  filterOnSale?: boolean
}

export interface HomepageContent {
  mattressTypes: any[]
  galleryItems: any[]
  sofaTypes: any[]
  trendingItems: any[]
  promotionalCards: any[]
  guides: any[]
}

export class AdminService {
  // Product Management
  static async getProductsByCategory(category: string): Promise<AdminProduct[]> {
    try {
      const { data, error } = await supabase
        .from(category)
        .select(`
          *,
          brands (
            id,
            name,
            logo
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return this.transformProducts(data || [], category)
    } catch (error) {
      console.error(`Error fetching ${category}:`, error)
      return []
    }
  }

  static async getProductById(category: string, id: string): Promise<AdminProduct | null> {
    try {
      const { data, error } = await supabase
        .from(category)
        .select(`
          *,
          brands (
            id,
            name,
            logo
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      const products = this.transformProducts([data], category)
      return products[0] || null
    } catch (error) {
      console.error(`Error fetching ${category} by ID:`, error)
      return null
    }
  }

  static async createProduct(category: string, productData: Partial<AdminProduct>): Promise<AdminProduct | null> {
    try {
      const transformedData = this.transformToDatabaseFormat(category, productData)
      
      const { data, error } = await supabase
        .from(category)
        .insert(transformedData)
        .select()

      if (error) throw error

      const products = this.transformProducts([data[0]], category)
      return products[0] || null
    } catch (error) {
      console.error(`Error creating ${category}:`, error)
      return null
    }
  }

  static async updateProduct(category: string, id: string, productData: Partial<AdminProduct>): Promise<AdminProduct | null> {
    try {
      const transformedData = this.transformToDatabaseFormat(category, productData)
      
      const { data, error } = await supabase
        .from(category)
        .update(transformedData)
        .eq('id', id)
        .select()

      if (error) throw error

      const products = this.transformProducts([data[0]], category)
      return products[0] || null
    } catch (error) {
      console.error(`Error updating ${category}:`, error)
      return null
    }
  }

  static async deleteProduct(category: string, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(category)
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error(`Error deleting ${category}:`, error)
      return false
    }
  }

  // Homepage Content Management
  static async getHomepageContent(): Promise<HomepageContent> {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      const content: HomepageContent = {
        mattressTypes: [],
        galleryItems: [],
        sofaTypes: [],
        trendingItems: [],
        promotionalCards: [],
        guides: []
      }

      data?.forEach(item => {
        if (content.hasOwnProperty(item.section_key)) {
          content[item.section_key as keyof HomepageContent] = item.content
        }
      })

      return content
    } catch (error) {
      console.error('Error fetching homepage content:', error)
      return {
        mattressTypes: [],
        galleryItems: [],
        sofaTypes: [],
        trendingItems: [],
        promotionalCards: [],
        guides: []
      }
    }
  }

  static async updateHomepageContent(sectionKey: string, content: any[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({
          section_key: sectionKey,
          content,
          is_active: true,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating homepage content:', error)
      return false
    }
  }

  // Utility Methods
  private static transformProducts(products: any[], category: string): AdminProduct[] {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brands?.name || 'Unknown',
      brandColor: 'blue',
      badge: product.on_sale ? 'On Sale' : '',
      badgeColor: product.on_sale ? 'orange' : '',
      image: product.main_image,
      rating: product.rating || 4.0,
      reviewCount: product.review_count || 0,
      firmness: product.firmness_description || 'Medium',
      firmnessLevel: product.firmness_level || 6,
      features: product.features || ['Premium Quality'],
      originalPrice: product.original_price,
      currentPrice: product.current_price,
      savings: product.savings || 0,
      freeDelivery: product.free_delivery ? 'Free' : 'Standard',
      setupService: product.setup_service,
      setupCost: product.setup_cost,
      certifications: ['OEKO-TEX', 'Made in UK'],
      sizes: product.sizes || ['Queen'],
      selectedSize: 'Queen',
      monthlyPrice: product.monthly_price,
      images: [product.main_image, ...(product.images || [])],
      category,
      type: this.getProductType(product, category),
      size: 'Queen Size',
      comfortLevel: product.firmness_description || 'Medium',
      inStore: true,
      onSale: product.on_sale,
      shortDescription: product.short_description,
      longDescription: product.long_description,
      colors: product.colors || [],
      materials: product.materials || [],
      dimensions: product.dimensions || {},
      dispatchTime: product.dispatch_time,
      reasonsToBuy: product.reasons_to_buy || [],
      descriptionParagraph1: product.description_paragraph_1,
      descriptionParagraph2: product.description_paragraph_2,
      descriptionParagraph3: product.description_paragraph_3,
      descriptionImage1: product.description_image_1,
      descriptionImage2: product.description_image_2,
      descriptionImage3: product.description_image_3,
      firmnessScaleImage: product.firmness_scale_image,
      productQuestions: product.product_questions || [],
      warrantyInfo: product.warranty_info || {},
      careInstructions: product.care_instructions,
      careImage: product.care_image,
      stockQuantity: product.stock_quantity,
      inStock: product.in_stock,
      // Filter fields
      filterMattressType: product.filter_mattress_type || [],
      filterFirmness: product.filter_firmness || [],
      filterSizes: product.filter_sizes || [],
      filterFeatures: product.filter_features || [],
      filterBrand: product.filter_brand || [],
      filterMaterial: product.filter_material || [],
      filterMinPrice: product.filter_min_price,
      filterMaxPrice: product.filter_max_price,
      filterInStore: product.filter_in_store,
      filterOnSale: product.filter_on_sale
    }))
  }

  private static transformToDatabaseFormat(category: string, productData: Partial<AdminProduct>): any {
    const baseData = {
      name: productData.name,
      slug: productData.name?.toLowerCase().replace(/\s+/g, '-') || '',
      original_price: productData.originalPrice || productData.currentPrice,
      current_price: productData.currentPrice,
      monthly_price: productData.monthlyPrice,
      main_image: productData.mainImage || productData.image,
      images: productData.images || [],
      short_description: productData.shortDescription,
      long_description: productData.longDescription,
      description_paragraph_1: productData.descriptionParagraph1,
      description_paragraph_2: productData.descriptionParagraph2,
      description_paragraph_3: productData.descriptionParagraph3,
      description_image_1: productData.descriptionImage1,
      description_image_2: productData.descriptionImage2,
      description_image_3: productData.descriptionImage3,
      reasons_to_buy: productData.reasonsToBuy,
      sizes: productData.sizes,
      colors: productData.colors,
      features: productData.features,
      materials: productData.materials,
      dimensions: productData.dimensions,
      rating: productData.rating,
      review_count: productData.reviewCount,
      in_stock: productData.inStock,
      stock_quantity: productData.stockQuantity,
      featured: productData.featured,
      on_sale: productData.onSale,
      dispatch_time: productData.dispatchTime,
      setup_service: productData.setupService,
      setup_cost: productData.setupCost,
      free_delivery: productData.freeDelivery === 'Free',
      product_questions: productData.productQuestions,
      warranty_info: productData.warrantyInfo,
      care_instructions: productData.careInstructions,
      care_image: productData.careImage,
      // Filter fields
      filter_sizes: productData.filterSizes,
      filter_features: productData.filterFeatures,
      filter_brand: productData.filterBrand,
      filter_material: productData.filterMaterial,
      filter_min_price: productData.filterMinPrice,
      filter_max_price: productData.filterMaxPrice,
      filter_in_store: productData.filterInStore,
      filter_on_sale: productData.filterOnSale
    }

    // Add category-specific fields
    switch (category) {
      case 'mattresses':
        return {
          ...baseData,
          mattress_type: productData.type,
          firmness_level: productData.firmnessLevel,
          firmness_description: productData.firmness,
          firmness_scale_image: productData.firmnessScaleImage,
          filter_mattress_type: productData.filterMattressType,
          filter_firmness: productData.filterFirmness
        }
      case 'beds':
        return {
          ...baseData,
          bed_type: productData.type,
          style: productData.style,
          filter_bed_type: productData.filterBedType,
          filter_style: productData.filterStyle
        }
      case 'sofas':
        return {
          ...baseData,
          sofa_type: productData.type,
          style: productData.style,
          filter_sofa_type: productData.filterSofaType,
          filter_style: productData.filterStyle
        }
      case 'pillows':
        return {
          ...baseData,
          pillow_type: productData.type,
          firmness: productData.firmness,
          filter_pillow_type: productData.filterPillowType,
          filter_firmness: productData.filterFirmness
        }
      case 'toppers':
        return {
          ...baseData,
          topper_type: productData.type,
          filter_topper_type: productData.filterTopperType
        }
      case 'bunkbeds':
        return {
          ...baseData,
          bunk_bed_type: productData.type,
          filter_bunk_bed_type: productData.filterBunkBedType
        }
      default:
        return baseData
    }
  }

  private static getProductType(product: any, category: string): string {
    switch (category) {
      case 'mattresses':
        return product.mattress_type || 'Standard'
      case 'beds':
        return product.bed_type || 'Standard'
      case 'sofas':
        return product.sofa_type || 'Standard'
      case 'pillows':
        return product.pillow_type || 'Standard'
      case 'toppers':
        return product.topper_type || 'Standard'
      case 'bunkbeds':
        return product.bunk_bed_type || 'Standard'
      default:
        return 'Standard'
    }
  }
}
