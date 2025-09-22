"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { AdminNav } from '@/components/admin/admin-nav'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Brain, 
  SlidersHorizontal, 
  Grid, 
  RotateCcw, 
  Layers, 
  Droplets, 
  Leaf, 
  ArrowLeftRight, 
  Snowflake, 
  Gem, 
  Heart, 
  Shield, 
  Feather, 
  PackageOpen, 
  Moon, 
  Crown, 
  Trees, 
  Zap, 
  Package, 
  Wrench, 
  Palette, 
  Minimize, 
  Award, 
  Truck, 
  Star, 
  Clock, 
  CornerDownLeft, 
  TrendingUp, 
  Eye, 
  Check, 
  Baby, 
  Users, 
  Mountain, 
  Thermometer, 
  Volume2, 
  Lightbulb, 
  Sun, 
  Recycle, 
  Umbrella, 
  ScrollText, 
  Waves,
  RefreshCw 
} from 'lucide-react'
import { ColorPicker } from '@/components/ui/color-picker'
import { getHexForColorName } from '@/lib/utils'
import { getIconComponent } from '@/lib/icon-mapping'
import { getFeaturesForCategory as getFeaturesForCategoryLib } from '@/lib/category-features'
import { getFeatureCardsForCategory as getFeatureCardsForCategoryLib } from '@/lib/feature-cards'
import { ImageCropModal } from '@/components/image-crop-modal'

type VariantRow = {
  id: string
  sku: string
  color?: string
  depth?: string
  firmness?: string
  size?: string
  length?: string
  width?: string
  height?: string
  availability: boolean
  originalPrice?: number
  currentPrice?: number
  variant_image?: string
}

// Presets removed by request – admin will type values directly in variant rows

// Utility function to ensure unique values
const ensureUnique = (arr: string[]) => Array.from(new Set(arr))

// Hardcoded feature cards data structure (extracted from ProductDetailHappy component)
const HARDCODED_FEATURE_CARDS = {
  mattresses: [
    {
      id: 'pocket-springs',
      title: 'Pocket Springs',
      description: 'Individually pocketed springs work to give you support exactly where you need it.',
      icon: 'springs'
    },
    {
      id: 'memory-foam',
      title: 'Memory Foam',
      description: 'Contours to your body for personalized comfort and pressure relief.',
      icon: 'brain'
    },
    {
      id: 'medium-firmness',
      title: 'Medium Firmness',
      description: 'Perfect balance of comfort and support for most sleepers.',
      icon: 'sliders'
    },
    {
      id: 'quilted-edge',
      title: 'Quilted Tape Edge',
      description: 'Premium edge-to-edge comfort with reinforced stitching.',
      icon: 'grid'
    },
    {
      id: 'rotate-feature',
      title: 'Rotate Feature',
      description: 'Easy rotation for even wear and extended mattress life.',
      icon: 'rotate'
    },
    {
      id: 'recon-foam',
      title: 'Recon Foam',
      description: 'High-quality recycled foam for sustainable comfort.',
      icon: 'layers'
    },
    {
      id: 'blue-foam',
      title: 'Blue Foam',
      description: 'Premium blue foam for enhanced comfort and support.',
      icon: 'droplet'
    },
    {
      id: 'coil-spring',
      title: 'Coil Spring',
      description: 'Traditional coil springs for classic support.',
      icon: 'springs'
    },
    {
      id: 'latex-foam',
      title: 'Latex Foam',
      description: 'Natural latex for responsive and durable comfort.',
      icon: 'leaf'
    },
    {
      id: 'reflex-foam',
      title: 'Reflex Foam',
      description: 'High-density foam for superior support and durability.',
      icon: 'arrow-left-right'
    },
    {
      id: 'cool-blue-foam',
      title: 'Cool Blue Foam',
      description: 'Temperature-regulating foam for cool sleep.',
      icon: 'snowflake'
    },
    {
      id: 'high-density-memory',
      title: 'High Density Memory',
      description: 'Premium memory foam for lasting comfort and support.',
      icon: 'layers'
    },
    {
      id: '3-zone-support',
      title: '3-Zone Support',
      description: 'Targeted support zones for optimal body alignment.',
      icon: 'grid'
    },
    {
      id: '5-zone-support',
      title: '5-Zone Support',
      description: 'Advanced support zones for superior comfort.',
      icon: 'grid'
    },
    {
      id: '7-zone-support',
      title: '7-Zone Support',
      description: 'Precision-engineered support zones for perfect alignment.',
      icon: 'grid'
    },
    {
      id: 'geltech-foam',
      title: 'GelTech Foam',
      description: 'Advanced gel-infused foam for temperature regulation.',
      icon: 'droplet'
    },
    {
      id: 'marble-gel',
      title: 'Marble Gel',
      description: 'Luxury marble gel for premium comfort and cooling.',
      icon: 'gem'
    },
    {
      id: 'foam-encapsulated',
      title: 'Foam Encapsulated',
      description: 'Foam-encapsulated springs for enhanced edge support.',
      icon: 'springs'
    },
    {
      id: 'soft-firm',
      title: 'Soft Firm',
      description: 'Gentle firmness for side sleepers and lighter individuals.',
      icon: 'sliders'
    },
    {
      id: 'medium-firm',
      title: 'Medium Firm',
      description: 'Balanced firmness for combination sleepers.',
      icon: 'sliders'
    },
    {
      id: 'firm',
      title: 'Firm',
      description: 'Firm support for back sleepers and heavier individuals.',
      icon: 'sliders'
    },
    {
      id: 'eco-friendly',
      title: 'Eco Friendly',
      description: 'Environmentally conscious materials and manufacturing.',
      icon: 'leaf'
    },
    {
      id: 'waterproof-cover',
      title: 'Waterproof Cover',
      description: 'Protective waterproof cover for easy maintenance.',
      icon: 'umbrella'
    },
    {
      id: 'removable-cover',
      title: 'Removable Cover',
      description: 'Easy-to-remove cover for convenient cleaning.',
      icon: 'scroll'
    },
    {
      id: 'washable-cover',
      title: 'Washable Cover',
      description: 'Machine-washable cover for simple care.',
      icon: 'waves'
    },
    {
      id: 'double-side',
      title: 'Double Side',
      description: 'Reversible design for extended mattress life.',
      icon: 'arrow-left-right'
    },
    {
      id: 'rolled-up',
      title: 'Rolled Up',
      description: 'Convenient rolled packaging for easy handling.',
      icon: 'scroll'
    },
    {
      id: '8-zone-support',
      title: '8-Zone Support',
      description: 'Advanced support system for ultimate comfort.',
      icon: 'grid'
    },
    {
      id: '10-zone-support',
      title: '10-Zone Support',
      description: 'Premium support system for luxury comfort.',
      icon: 'grid'
    },
    {
      id: 'revo-vasco-foam',
      title: 'Revo Vasco Foam',
      description: 'Innovative foam technology for superior comfort.',
      icon: 'brain'
    },
    {
      id: 'comfort-foam',
      title: 'Comfort Foam',
      description: 'Specially formulated foam for maximum comfort.',
      icon: 'heart'
    },
    {
      id: 'gel-infused',
      title: 'Gel Infused',
      description: 'Gel-infused technology for temperature regulation.',
      icon: 'droplet'
    },
    {
      id: 'polyester-fillings',
      title: 'Polyester Fillings',
      description: 'Soft and durable polyester fiber fillings.',
      icon: 'layers'
    }
  ],
  pillows: [
    {
      id: 'bounce-back',
      title: 'Bounce Back',
      description: 'Returns to shape quickly for consistent comfort.',
      icon: 'arrow-left-right'
    },
    {
      id: 'box-support',
      title: 'Box Support',
      description: 'Structured support for better neck alignment.',
      icon: 'package-open'
    },
    {
      id: 'classic-moulded',
      title: 'Classic Moulded',
      description: 'Moulded construction for consistent shape.',
      icon: 'layers'
    },
    {
      id: 'deep-sleep',
      title: 'Deep Sleep',
      description: 'Designed to help you sleep deeper and longer.',
      icon: 'moon'
    },
    {
      id: 'memory-flake',
      title: 'Memory Flake',
      description: 'Flake fill adapts to personalize support.',
      icon: 'snowflake'
    },
    {
      id: 'memory-foam-pillow',
      title: 'Memory Foam',
      description: 'Contours to your head and neck for support.',
      icon: 'layers'
    },
    {
      id: 'memory-laytech',
      title: 'Memory Laytech',
      description: 'Blend of memory and latex-like responsiveness.',
      icon: 'brain'
    },
    {
      id: 'pure-luxury',
      title: 'Pure Luxury',
      description: 'Indulgent finish and superior materials.',
      icon: 'gem'
    },
    {
      id: 'soft-touch',
      title: 'Soft Touch',
      description: 'Ultra-soft outer for cozy comfort.',
      icon: 'feather'
    },
    {
      id: 'super-support',
      title: 'Super Support',
      description: 'Firm support to keep posture aligned.',
      icon: 'shield'
    },
    {
      id: 'value-pillow',
      title: 'Value Pillow',
      description: 'Quality comfort without the premium price.',
      icon: 'badge'
    },
    {
      id: 'shredded-foam',
      title: 'Shredded Foam',
      description: 'Shredded fill for airflow and adjustability.',
      icon: 'layers'
    },
    {
      id: 'recon-shredded-foam',
      title: 'Recon Shredded Foam',
      description: 'Supportive blend of recycled foam pieces.',
      icon: 'layers'
    },
    {
      id: 'bamboo-pillow',
      title: 'Bamboo Pillow',
      description: 'Bamboo cover for breathable softness.',
      icon: 'leaf'
    },
    {
      id: 'polyester-filling',
      title: 'Polyester Filling',
      description: 'Soft, durable polyester fiber fill.',
      icon: 'feather'
    },
    {
      id: 'next-day-delivery',
      title: 'Next Day Delivery',
      description: 'Get it delivered as soon as tomorrow.',
      icon: 'truck'
    },
    {
      id: 'box-packed',
      title: 'Box Packed',
      description: 'Neatly packed for safe arrival.',
      icon: 'package-open'
    },
    {
      id: 'luxury-cover',
      title: 'Luxury Cover',
      description: 'Elevated look and feel with luxury cover.',
      icon: 'gem'
    },
    {
      id: 'hotel-vibe',
      title: 'Hotel Vibe',
      description: 'Experience 5-star comfort at home.',
      icon: 'crown'
    }
  ],
  beds: [
    {
      id: 'solid-wood',
      title: 'Solid Wood Construction',
      description: 'Built with premium solid wood for lasting durability.',
      icon: 'trees'
    },
    {
      id: 'metal-frame',
      title: 'Metal Frame',
      description: 'Sturdy metal construction for reliable support.',
      icon: 'zap'
    },
    {
      id: 'upholstered-headboard',
      title: 'Upholstered Headboard',
      description: 'Soft, comfortable headboard for cozy bedtime.',
      icon: 'heart'
    },
    {
      id: 'storage-drawers',
      title: 'Storage Drawers',
      description: 'Built-in storage for organized bedroom space.',
      icon: 'package'
    },
    {
      id: 'adjustable-height',
      title: 'Adjustable Height',
      description: 'Customizable height for perfect positioning.',
      icon: 'sliders-horizontal'
    },
    {
      id: 'easy-assembly',
      title: 'Easy Assembly',
      description: 'Simple setup for quick bed installation.',
      icon: 'wrench'
    },
    {
      id: 'anti-slip-feet',
      title: 'Anti-Slip Feet',
      description: 'Non-slip feet prevent unwanted movement.',
      icon: 'shield'
    },
    {
      id: 'modern-design',
      title: 'Modern Design',
      description: 'Contemporary styling that complements any bedroom.',
      icon: 'palette'
    },
    {
      id: 'space-efficient',
      title: 'Space Efficient',
      description: 'Compact design maximizes bedroom space.',
      icon: 'minimize'
    },
    {
      id: 'warranty-coverage',
      title: 'Warranty Coverage',
      description: 'Protected by comprehensive warranty terms.',
      icon: 'award'
    },
    {
      id: 'fast-delivery',
      title: 'Fast Delivery',
      description: 'Quick shipping to get your order fast.',
      icon: 'truck'
    },
    {
      id: 'secure-packaging',
      title: 'Secure Packaging',
      description: 'Carefully packaged to ensure safe delivery.',
      icon: 'package'
    },
    {
      id: 'professional-finish',
      title: 'Professional Finish',
      description: 'High-quality finish for a polished look.',
      icon: 'star'
    },
    {
      id: 'easy-maintenance',
      title: 'Easy Maintenance',
      description: 'Simple care requirements for long-lasting use.',
      icon: 'wrench'
    },
    {
      id: 'long-lasting',
      title: 'Long Lasting',
      description: 'Built to provide years of reliable service.',
      icon: 'clock'
    },
    {
      id: 'stable-support',
      title: 'Stable Support',
      description: 'Steady foundation for optimal mattress performance.',
      icon: 'layers'
    }
  ],
  sofas: [
    {
      id: 'premium-fabric',
      title: 'Premium Fabric',
      description: 'High-quality fabric for luxurious comfort and style.',
      icon: 'star'
    },
    {
      id: 'leather-upholstery',
      title: 'Leather Upholstery',
      description: 'Premium leather for sophisticated elegance.',
      icon: 'gem'
    },
    {
      id: 'memory-foam-cushions',
      title: 'Memory Foam Cushions',
      description: 'Adaptive cushions that contour to your body.',
      icon: 'brain'
    },
    {
      id: 'high-density-foam',
      title: 'High-Density Foam',
      description: 'Durable foam for long-lasting comfort.',
      icon: 'layers'
    },
    {
      id: 'pocket-springs-sofa',
      title: 'Pocket Springs',
      description: 'Individual springs for superior support and comfort.',
      icon: 'springs'
    },
    {
      id: 'reclining-mechanism',
      title: 'Reclining Mechanism',
      description: 'Smooth reclining for ultimate relaxation.',
      icon: 'arrow-left-right'
    },
    {
      id: 'power-recline',
      title: 'Power Recline',
      description: 'Electric reclining for effortless comfort.',
      icon: 'zap'
    },
    {
      id: 'built-in-storage',
      title: 'Built-in Storage',
      description: 'Convenient storage for living room organization.',
      icon: 'package'
    },
    {
      id: 'convertible-design',
      title: 'Convertible Design',
      description: 'Versatile design for multiple seating options.',
      icon: 'arrow-left-right'
    },
    {
      id: 'sleeping-function',
      title: 'Sleeping Function',
      description: 'Converts to a comfortable sleeping surface.',
      icon: 'moon'
    },
    {
      id: 'pull-out-bed',
      title: 'Pull-Out Bed',
      description: 'Easy-to-use pull-out bed mechanism.',
      icon: 'package-open'
    },
    {
      id: 'sectional-design',
      title: 'Sectional Design',
      description: 'Modular design for flexible seating arrangements.',
      icon: 'grid'
    },
    {
      id: 'modular-configuration',
      title: 'Modular Configuration',
      description: 'Customizable configuration to fit your space.',
      icon: 'grid'
    },
    {
      id: 'corner-unit',
      title: 'Corner Unit',
      description: 'Perfect for corner spaces and L-shaped layouts.',
      icon: 'corner'
    },
    {
      id: 'chaise-lounge',
      title: 'Chaise Lounge',
      description: 'Extended seating for ultimate relaxation.',
      icon: 'heart'
    },
    {
      id: 'ottoman-storage',
      title: 'Ottoman Storage',
      description: 'Storage ottoman for hidden organization.',
      icon: 'package'
    },
    {
      id: 'coffee-table-storage',
      title: 'Coffee Table Storage',
      description: 'Storage coffee table for living room organization.',
      icon: 'package'
    },
    {
      id: 'arm-storage',
      title: 'Arm Storage',
      description: 'Convenient arm storage for remote controls and magazines.',
      icon: 'package'
    },
    {
      id: 'cup-holders',
      title: 'Cup Holders',
      description: 'Built-in cup holders for beverage convenience.',
      icon: 'droplet'
    },
    {
      id: 'wireless-charging',
      title: 'Wireless Charging',
      description: 'Built-in wireless charging for your devices.',
      icon: 'zap'
    },
    {
      id: 'bluetooth-speakers',
      title: 'Bluetooth Speakers',
      description: 'Integrated speakers for entertainment convenience.',
      icon: 'volume-2'
    },
    {
      id: 'led-lighting',
      title: 'LED Lighting',
      description: 'Ambient lighting for mood enhancement.',
      icon: 'lightbulb'
    },
    {
      id: 'massage-function',
      title: 'Massage Function',
      description: 'Built-in massage for ultimate relaxation.',
      icon: 'heart'
    },
    {
      id: 'heating-function',
      title: 'Heating Function',
      description: 'Heated seating for cold weather comfort.',
      icon: 'thermometer'
    },
    {
      id: 'cooling-function',
      title: 'Cooling Function',
      description: 'Cooled seating for hot weather comfort.',
      icon: 'snowflake'
    },
    {
      id: 'anti-stain-fabric',
      title: 'Anti-Stain Fabric',
      description: 'Stain-resistant fabric for easy maintenance.',
      icon: 'shield'
    },
    {
      id: 'pet-friendly-material',
      title: 'Pet-Friendly Material',
      description: 'Durable material that withstands pet activity.',
      icon: 'heart'
    },
    {
      id: 'easy-clean-fabric',
      title: 'Easy Clean Fabric',
      description: 'Simple cleaning for busy households.',
      icon: 'droplet'
    },
    {
      id: 'removable-covers',
      title: 'Removable Covers',
      description: 'Easy-to-remove covers for convenient cleaning.',
      icon: 'package-open'
    },
    {
      id: 'washable-covers',
      title: 'Washable Covers',
      description: 'Machine-washable covers for simple care.',
      icon: 'waves'
    },
    {
      id: 'stain-resistant',
      title: 'Stain Resistant',
      description: 'Resistant to stains and spills for lasting beauty.',
      icon: 'shield'
    },
    {
      id: 'fade-resistant',
      title: 'Fade Resistant',
      description: 'Color-fast fabric that maintains its beauty.',
      icon: 'sun'
    },
    {
      id: 'wrinkle-resistant',
      title: 'Wrinkle Resistant',
      description: 'Wrinkle-free fabric for always-perfect appearance.',
      icon: 'shield'
    },
    {
      id: 'anti-allergenic',
      title: 'Anti-Allergenic',
      description: 'Hypoallergenic materials for sensitive individuals.',
      icon: 'feather'
    },
    {
      id: 'hypoallergenic',
      title: 'Hypoallergenic',
      description: 'Safe for allergy sufferers and sensitive skin.',
      icon: 'feather'
    },
    {
      id: 'eco-friendly-materials',
      title: 'Eco-Friendly',
      description: 'Environmentally conscious materials and processes.',
      icon: 'leaf'
    },
    {
      id: 'sustainable-fabric',
      title: 'Sustainable Fabric',
      description: 'Responsibly sourced materials for eco-conscious living.',
      icon: 'leaf'
    },
    {
      id: 'recycled-materials',
      title: 'Recycled Materials',
      description: 'Made with recycled materials for environmental responsibility.',
      icon: 'recycle'
    },
    {
      id: 'organic-cotton',
      title: 'Organic Cotton',
      description: 'Natural organic cotton for pure comfort.',
      icon: 'leaf'
    },
    {
      id: 'natural-linen',
      title: 'Natural Linen',
      description: 'Natural linen for breathable luxury.',
      icon: 'leaf'
    },
    {
      id: 'synthetic-blend',
      title: 'Synthetic Blend',
      description: 'Durable synthetic blend for lasting performance.',
      icon: 'layers'
    },
    {
      id: 'performance-fabric',
      title: 'Performance Fabric',
      description: 'High-performance fabric for active lifestyles.',
      icon: 'zap'
    }
  ],
  toppers: [
    {
      id: 'memory-foam-topper',
      title: 'Memory Foam',
      description: 'Contours to your body for personalized comfort.',
      icon: 'brain'
    },
    {
      id: 'gel-infused-topper',
      title: 'Gel Infused',
      description: 'Gel-infused technology for temperature regulation.',
      icon: 'droplet'
    },
    {
      id: 'latex-topper',
      title: 'Latex',
      description: 'Natural latex for responsive and durable comfort.',
      icon: 'leaf'
    },
    {
      id: 'wool-topper',
      title: 'Wool',
      description: 'Natural wool for temperature regulation and comfort.',
      icon: 'feather'
    },
    {
      id: 'bamboo-topper',
      title: 'Bamboo',
      description: 'Bamboo fiber for breathable softness.',
      icon: 'leaf'
    },
    {
      id: 'cotton-topper',
      title: 'Cotton',
      description: 'Natural cotton for soft, breathable comfort.',
      icon: 'feather'
    },
    {
      id: 'silk-topper',
      title: 'Silk',
      description: 'Luxurious silk for ultimate comfort and elegance.',
      icon: 'gem'
    },
    {
      id: 'polyester-topper',
      title: 'Polyester',
      description: 'Durable polyester for long-lasting comfort.',
      icon: 'layers'
    },
    {
      id: 'hybrid-design',
      title: 'Hybrid Design',
      description: 'Combination of materials for optimal comfort.',
      icon: 'layers'
    },
    {
      id: 'cooling-technology',
      title: 'Cooling Technology',
      description: 'Advanced cooling for temperature regulation.',
      icon: 'snowflake'
    },
    {
      id: 'temperature-regulation',
      title: 'Temperature Regulation',
      description: 'Maintains optimal sleeping temperature.',
      icon: 'thermometer'
    },
    {
      id: 'moisture-wicking',
      title: 'Moisture Wicking',
      description: 'Wicks away moisture for dry comfort.',
      icon: 'droplet'
    },
    {
      id: 'anti-bacterial',
      title: 'Anti-Bacterial',
      description: 'Bacterial-resistant for hygienic sleep.',
      icon: 'shield'
    },
    {
      id: 'anti-dust-mite',
      title: 'Anti-Dust Mite',
      description: 'Dust-mite resistant for allergy sufferers.',
      icon: 'shield'
    },
    {
      id: 'hypoallergenic-topper',
      title: 'Hypoallergenic',
      description: 'Safe for sensitive skin and allergy sufferers.',
      icon: 'feather'
    },
    {
      id: 'pressure-relief',
      title: 'Pressure Relief',
      description: 'Relieves pressure points for comfortable sleep.',
      icon: 'heart'
    },
    {
      id: 'pain-relief',
      title: 'Pain Relief',
      description: 'Alleviates pain for restful sleep.',
      icon: 'heart'
    },
    {
      id: 'joint-support',
      title: 'Joint Support',
      description: 'Supports joints for comfortable sleep.',
      icon: 'heart'
    },
    {
      id: 'back-support',
      title: 'Back Support',
      description: 'Provides back support for proper alignment.',
      icon: 'heart'
    },
    {
      id: 'hip-support',
      title: 'Hip Support',
      description: 'Supports hips for comfortable sleep.',
      icon: 'heart'
    },
    {
      id: 'shoulder-support',
      title: 'Shoulder Support',
      description: 'Supports shoulders for proper alignment.',
      icon: 'heart'
    },
    {
      id: 'spine-alignment',
      title: 'Spine Alignment',
      description: 'Maintains proper spine alignment.',
      icon: 'heart'
    },
    {
      id: 'posture-support',
      title: 'Posture Support',
      description: 'Supports proper posture during sleep.',
      icon: 'heart'
    },
    {
      id: 'health-benefits',
      title: 'Health Benefits',
      description: 'Promotes better health and wellness.',
      icon: 'heart'
    },
    {
      id: 'wellness-support',
      title: 'Wellness Support',
      description: 'Supports overall wellness and health.',
      icon: 'heart'
    },
    {
      id: 'therapeutic-comfort',
      title: 'Therapeutic Comfort',
      description: 'Therapeutic comfort for healing sleep.',
      icon: 'heart'
    },
    {
      id: 'medical-grade',
      title: 'Medical Grade',
      description: 'Medical-grade materials for therapeutic use.',
      icon: 'heart'
    },
    {
      id: 'professional-quality',
      title: 'Professional Quality',
      description: 'Professional-grade quality for therapeutic use.',
      icon: 'heart'
    },
    {
      id: 'expert-design',
      title: 'Expert Design',
      description: 'Expertly designed for optimal comfort.',
      icon: 'star'
    },
    {
      id: 'scientific-approach',
      title: 'Scientific Approach',
      description: 'Scientifically designed for optimal comfort.',
      icon: 'brain'
    },
    {
      id: 'research-based',
      title: 'Research Based',
      description: 'Based on research for optimal comfort.',
      icon: 'brain'
    },
    {
      id: 'clinically-tested',
      title: 'Clinically Tested',
      description: 'Clinically tested for proven effectiveness.',
      icon: 'check'
    },
    {
      id: 'doctor-recommended',
      title: 'Doctor Recommended',
      description: 'Recommended by healthcare professionals.',
      icon: 'heart'
    },
    {
      id: 'chiropractor-approved',
      title: 'Chiropractor Approved',
      description: 'Approved by chiropractic professionals.',
      icon: 'heart'
    },
    {
      id: 'physical-therapist-recommended',
      title: 'Physical Therapist Recommended',
      description: 'Recommended by physical therapy professionals.',
      icon: 'heart'
    },
    {
      id: 'sleep-specialist-approved',
      title: 'Sleep Specialist Approved',
      description: 'Approved by sleep medicine specialists.',
      icon: 'heart'
    },
    {
      id: 'sleep-consultant-recommended',
      title: 'Sleep Consultant Recommended',
      description: 'Recommended by sleep consultants.',
      icon: 'heart'
    },
    {
      id: 'sleep-coach-approved',
      title: 'Sleep Coach Approved',
      description: 'Approved by sleep coaches.',
      icon: 'heart'
    },
    {
      id: 'sleep-therapist-recommended',
      title: 'Sleep Therapist Recommended',
      description: 'Recommended by sleep therapists.',
      icon: 'heart'
    },
    {
      id: 'sleep-psychologist-approved',
      title: 'Sleep Psychologist Approved',
      description: 'Approved by sleep psychologists.',
      icon: 'heart'
    },
    {
      id: 'sleep-researcher-approved',
      title: 'Sleep Researcher Approved',
      description: 'Approved by sleep researchers.',
      icon: 'heart'
    },
    {
      id: 'sleep-scientist-recommended',
      title: 'Sleep Scientist Recommended',
      description: 'Recommended by sleep scientists.',
      icon: 'heart'
    },
    {
      id: 'sleep-expert-approved',
      title: 'Sleep Expert Approved',
      description: 'Approved by sleep experts.',
      icon: 'heart'
    },
    {
      id: 'sleep-professional-recommended',
      title: 'Sleep Professional Recommended',
      description: 'Recommended by sleep professionals.',
      icon: 'heart'
    },
    {
      id: 'sleep-authority-approved',
      title: 'Sleep Authority Approved',
      description: 'Approved by sleep authorities.',
      icon: 'heart'
    },
    {
      id: 'sleep-master-approved',
      title: 'Sleep Master Approved',
      description: 'Approved by sleep masters.',
      icon: 'heart'
    },
    {
      id: 'sleep-guru-recommended',
      title: 'Sleep Guru Recommended',
      description: 'Recommended by sleep gurus.',
      icon: 'heart'
    },
    {
      id: 'sleep-wizard-approved',
      title: 'Sleep Wizard Approved',
      description: 'Approved by sleep wizards.',
      icon: 'heart'
    },
    {
      id: 'sleep-magician-recommended',
      title: 'Sleep Magician Recommended',
      description: 'Recommended by sleep magicians.',
      icon: 'heart'
    },
    {
      id: 'sleep-sorcerer-approved',
      title: 'Sleep Sorcerer Approved',
      description: 'Approved by sleep sorcerers.',
      icon: 'heart'
    },
    {
      id: 'sleep-alchemist-recommended',
      title: 'Sleep Alchemist Recommended',
      description: 'Recommended by sleep alchemists.',
      icon: 'heart'
    },
    {
      id: 'sleep-philosopher-approved',
      title: 'Sleep Philosopher Approved',
      description: 'Approved by sleep philosophers.',
      icon: 'heart'
    },
    {
      id: 'sleep-sage-recommended',
      title: 'Sleep Sage Recommended',
      description: 'Recommended by sleep sages.',
      icon: 'heart'
    },
    {
      id: 'sleep-mystic-approved',
      title: 'Sleep Mystic Approved',
      description: 'Approved by sleep mystics.',
      icon: 'heart'
    },
    {
      id: 'sleep-oracle-recommended',
      title: 'Sleep Oracle Recommended',
      description: 'Recommended by sleep oracles.',
      icon: 'heart'
    },
    {
      id: 'sleep-prophet-approved',
      title: 'Sleep Prophet Approved',
      description: 'Approved by sleep prophets.',
      icon: 'heart'
    },
    {
      id: 'sleep-seer-recommended',
      title: 'Sleep Seer Recommended',
      description: 'Recommended by sleep seers.',
      icon: 'heart'
    },
    {
      id: 'sleep-visionary-approved',
      title: 'Sleep Visionary Approved',
      description: 'Approved by sleep visionaries.',
      icon: 'heart'
    }
  ],
  bunkbeds: [
    {
      id: 'space-saving',
      title: 'Space Saving',
      description: 'Maximizes bedroom space with vertical design.',
      icon: 'minimize'
    },
    {
      id: 'perfect-for-kids',
      title: 'Perfect for Kids',
      description: 'Designed specifically for children\'s needs.',
      icon: 'baby'
    },
    {
      id: 'fun-design',
      title: 'Fun Design',
      description: 'Playful design that kids love.',
      icon: 'heart'
    },
    {
      id: 'adventure-theme',
      title: 'Adventure Theme',
      description: 'Adventure-themed design for imaginative play.',
      icon: 'mountain'
    },
    {
      id: 'sleepover-solution',
      title: 'Sleepover Solution',
      description: 'Perfect for sleepovers and guests.',
      icon: 'users'
    },
    {
      id: 'guest-accommodation',
      title: 'Guest Accommodation',
      description: 'Ideal for accommodating overnight guests.',
      icon: 'users'
    },
    {
      id: 'family-solution',
      title: 'Family Solution',
      description: 'Great solution for growing families.',
      icon: 'users'
    },
    {
      id: 'sibling-sharing',
      title: 'Sibling Sharing',
      description: 'Perfect for siblings sharing a room.',
      icon: 'users'
    },
    {
      id: 'room-efficiency',
      title: 'Room Efficiency',
      description: 'Efficiently uses available room space.',
      icon: 'minimize'
    },
    {
      id: 'space-optimization',
      title: 'Space Optimization',
      description: 'Optimizes bedroom space utilization.',
      icon: 'minimize'
    },
    {
      id: 'storage-solution',
      title: 'Storage Solution',
      description: 'Built-in storage for organized rooms.',
      icon: 'package'
    },
    {
      id: 'multi-functional',
      title: 'Multi-Functional',
      description: 'Multiple functions in one piece of furniture.',
      icon: 'layers'
    },
    {
      id: 'versatile-design',
      title: 'Versatile Design',
      description: 'Versatile design for various room layouts.',
      icon: 'grid'
    },
    {
      id: 'contemporary-look',
      title: 'Contemporary Look',
      description: 'Modern, contemporary appearance.',
      icon: 'palette'
    },
    {
      id: 'modern-style',
      title: 'Modern Style',
      description: 'Contemporary modern styling.',
      icon: 'palette'
    },
    {
      id: 'classic-design',
      title: 'Classic Design',
      description: 'Timeless classic design.',
      icon: 'star'
    },
    {
      id: 'traditional-charm',
      title: 'Traditional Charm',
      description: 'Traditional charm and appeal.',
      icon: 'heart'
    },
    {
      id: 'rustic-appeal',
      title: 'Rustic Appeal',
      description: 'Rustic, natural appeal.',
      icon: 'trees'
    },
    {
      id: 'timeless-style',
      title: 'Timeless Style',
      description: 'Timeless style that never goes out of fashion.',
      icon: 'clock'
    },
    {
      id: 'trendy-design',
      title: 'Trendy Design',
      description: 'Current, trendy design.',
      icon: 'trending-up'
    },
    {
      id: 'contemporary-elegance',
      title: 'Contemporary Elegance',
      description: 'Elegant contemporary design.',
      icon: 'gem'
    },
    {
      id: 'modern-sophistication',
      title: 'Modern Sophistication',
      description: 'Sophisticated modern design.',
      icon: 'gem'
    },
    {
      id: 'classic-beauty',
      title: 'Classic Beauty',
      description: 'Beautiful classic design.',
      icon: 'star'
    },
    {
      id: 'elegant-simplicity',
      title: 'Elegant Simplicity',
      description: 'Simply elegant design.',
      icon: 'star'
    },
    {
      id: 'sophisticated-design',
      title: 'Sophisticated Design',
      description: 'Sophisticated, refined design.',
      icon: 'gem'
    },
    {
      id: 'premium-craftsmanship',
      title: 'Premium Craftsmanship',
      description: 'Premium quality craftsmanship.',
      icon: 'star'
    },
    {
      id: 'expert-construction',
      title: 'Expert Construction',
      description: 'Expertly constructed for quality.',
      icon: 'wrench'
    },
    {
      id: 'professional-finish',
      title: 'Professional Finish',
      description: 'Professional quality finish.',
      icon: 'star'
    },
    {
      id: 'attention-to-detail',
      title: 'Attention to Detail',
      description: 'Meticulous attention to every detail.',
      icon: 'eye'
    },
    {
      id: 'quality-assurance',
      title: 'Quality Assurance',
      description: 'Assured quality and reliability.',
      icon: 'check'
    },
    {
      id: 'satisfaction-guaranteed',
      title: 'Satisfaction Guaranteed',
      description: 'Guaranteed customer satisfaction.',
      icon: 'check'
    },
    {
      id: 'perfect-fit',
      title: 'Perfect Fit',
      description: 'Perfect fit for your room and needs.',
      icon: 'check'
    },
    {
      id: 'room-enhancement',
      title: 'Room Enhancement',
      description: 'Enhances your room\'s appearance.',
      icon: 'star'
    },
    {
      id: 'style-improvement',
      title: 'Style Improvement',
      description: 'Improves your room\'s style.',
      icon: 'star'
    },
    {
      id: 'aesthetic-upgrade',
      title: 'Aesthetic Upgrade',
      description: 'Upgrades your room\'s aesthetics.',
      icon: 'star'
    },
    {
      id: 'design-transformation',
      title: 'Design Transformation',
      description: 'Transforms your room\'s design.',
      icon: 'star'
    },
    {
      id: 'visual-appeal',
      title: 'Visual Appeal',
      description: 'Enhances visual appeal of your room.',
      icon: 'star'
    },
    {
      id: 'beauty-enhancement',
      title: 'Beauty Enhancement',
      description: 'Enhances beauty of your room.',
      icon: 'star'
    },
    {
      id: 'elegance-addition',
      title: 'Elegance Addition',
      description: 'Adds elegance to your room.',
      icon: 'star'
    },
    {
      id: 'sophistication-boost',
      title: 'Sophistication Boost',
      description: 'Boosts sophistication of your room.',
      icon: 'star'
    },
    {
      id: 'class-improvement',
      title: 'Class Improvement',
      description: 'Improves class of your room.',
      icon: 'star'
    },
    {
      id: 'quality-upgrade',
      title: 'Quality Upgrade',
      description: 'Upgrades quality of your room.',
      icon: 'star'
    },
    {
      id: 'fun-factor',
      title: 'Fun Factor',
      description: 'Adds fun factor to your room.',
      icon: 'heart'
    },
    {
      id: 'entertainment-value',
      title: 'Entertainment Value',
      description: 'Provides entertainment value.',
      icon: 'heart'
    },
    {
      id: 'play-area',
      title: 'Play Area',
      description: 'Creates a dedicated play area.',
      icon: 'heart'
    },
    {
      id: 'study-space',
      title: 'Study Space',
      description: 'Provides a dedicated study space.',
      icon: 'heart'
    },
    {
      id: 'work-station',
      title: 'Work Station',
      description: 'Creates a dedicated work station.',
      icon: 'heart'
    },
    {
      id: 'reading-nook',
      title: 'Reading Nook',
      description: 'Creates a cozy reading nook.',
      icon: 'heart'
    },
    {
      id: 'privacy-solution',
      title: 'Privacy Solution',
      description: 'Provides privacy for each sleeper.',
      icon: 'shield'
    },
    {
      id: 'personal-space',
      title: 'Personal Space',
      description: 'Creates personal space for each child.',
      icon: 'heart'
    }
  ],
  bedding: [
    {
      id: 'premium-cotton',
      title: 'Premium Cotton',
      description: 'High-quality cotton for soft, breathable comfort.',
      icon: 'feather'
    },
    {
      id: 'silk-blend',
      title: 'Silk Blend',
      description: 'Luxurious silk blend for ultimate comfort.',
      icon: 'gem'
    },
    {
      id: 'bamboo-fiber',
      title: 'Bamboo Fiber',
      description: 'Natural bamboo for breathable softness.',
      icon: 'leaf'
    },
    {
      id: 'organic-materials',
      title: 'Organic Materials',
      description: 'Certified organic materials for pure comfort.',
      icon: 'leaf'
    },
    {
      id: 'hypoallergenic-bedding',
      title: 'Hypoallergenic',
      description: 'Safe for sensitive skin and allergy sufferers.',
      icon: 'feather'
    },
    {
      id: 'easy-care',
      title: 'Easy Care',
      description: 'Simple maintenance for busy households.',
      icon: 'droplet'
    },
    {
      id: 'wrinkle-resistant-bedding',
      title: 'Wrinkle Resistant',
      description: 'Maintains smooth appearance with minimal effort.',
      icon: 'shield'
    },
    {
      id: 'stain-resistant-bedding',
      title: 'Stain Resistant',
      description: 'Protects against spills and stains.',
      icon: 'shield'
    }
  ],
  'box-springs': [
    {
      id: 'heavy-duty-construction',
      title: 'Heavy Duty Construction',
      description: 'Built to support heavy mattresses and sleepers.',
      icon: 'shield'
    },
    {
      id: 'noise-reduction',
      title: 'Noise Reduction',
      description: 'Quiet operation for peaceful sleep.',
      icon: 'volume2'
    },
    {
      id: 'motion-isolation',
      title: 'Motion Isolation',
      description: 'Minimizes movement transfer between sleepers.',
      icon: 'waves'
    },
    {
      id: 'edge-support',
      title: 'Edge Support',
      description: 'Provides support right to the mattress edge.',
      icon: 'shield'
    },
    {
      id: 'durable-springs',
      title: 'Durable Springs',
      description: 'Long-lasting springs for extended use.',
      icon: 'springs'
    },
    {
      id: 'easy-assembly-box',
      title: 'Easy Assembly',
      description: 'Simple setup for quick installation.',
      icon: 'wrench'
    }
  ],
  'adjustable-bases': [
    {
      id: 'motorized-adjustment',
      title: 'Motorized Adjustment',
      description: 'Electric adjustment for perfect positioning.',
      icon: 'zap'
    },
    {
      id: 'zero-gravity',
      title: 'Zero Gravity',
      description: 'Weightless position for ultimate relaxation.',
      icon: 'heart'
    },
    {
      id: 'massage-function-base',
      title: 'Massage Function',
      description: 'Built-in massage for relaxation.',
      icon: 'heart'
    },
    {
      id: 'usb-charging',
      title: 'USB Charging',
      description: 'Convenient device charging.',
      icon: 'zap'
    },
    {
      id: 'wireless-remote',
      title: 'Wireless Remote',
      description: 'Easy control from anywhere in bed.',
      icon: 'zap'
    },
    {
      id: 'preset-positions',
      title: 'Preset Positions',
      description: 'Save your favorite positions.',
      icon: 'star'
    }
  ],
  kids: [
    {
      id: 'fun-designs',
      title: 'Fun Designs',
      description: 'Playful patterns and colors kids love.',
      icon: 'heart'
    },
    {
      id: 'safe-materials',
      title: 'Safe Materials',
      description: 'Non-toxic, child-safe materials.',
      icon: 'shield'
    },
    {
      id: 'easy-clean',
      title: 'Easy Clean',
      description: 'Simple cleaning for busy parents.',
      icon: 'droplet'
    },
    {
      id: 'durable-construction',
      title: 'Durable Construction',
      description: 'Built to withstand active kids.',
      icon: 'shield'
    },
    {
      id: 'comfortable-sleep',
      title: 'Comfortable Sleep',
      description: 'Ensures restful sleep for growing children.',
      icon: 'moon'
    },
    {
      id: 'size-appropriate',
      title: 'Size Appropriate',
      description: 'Perfectly sized for children\'s needs.',
      icon: 'check'
    }
  ]
}

// Category-specific features and reasons
const CATEGORY_FEATURES = {
  beds: [
    'Solid Wood Construction','Metal Frame','Upholstered Headboard','Storage Drawers','Adjustable Height','Easy Assembly','Tool-Free Setup','Anti-Slip Feet','Reinforced Joints','Durable Finish','Modern Design','Classic Style','Contemporary Look','Rustic Charm','Minimalist Design','Space Saving','Under Bed Storage','Headboard Storage','Footboard Storage','Side Rails','Center Support','Slat System','Box Spring Compatible','Platform Bed','Low Profile','High Profile','Canopy Style','Four Poster','Sleigh Bed','Panel Bed','Mission Style','Shaker Style','Industrial Look','Scandinavian Design','French Country','Traditional English','Italian Design','Asian Inspired','Bohemian Style','Vintage Charm','Art Deco','Mid-Century Modern'
  ],
  sofas: [
    'Premium Fabric','Leather Upholstery','Memory Foam Cushions','High-Density Foam','Pocket Springs','Reclining Mechanism','Power Recline','USB Charging','Built-in Storage','Convertible Design','Sleeping Function','Pull-Out Bed','Futon Style','Sectional Design','Modular Configuration','Corner Unit','Chaise Lounge','Ottoman Storage','Coffee Table Storage','Console Storage','Arm Storage','Cup Holders','Wireless Charging','Bluetooth Speakers','LED Lighting','Massage Function','Heating Function','Cooling Function','Anti-Stain Fabric','Pet-Friendly Material','Easy Clean Fabric','Removable Covers','Washable Covers','Stain Resistant','Fade Resistant','Wrinkle Resistant','Anti-Allergenic','Hypoallergenic','Eco-Friendly Materials','Sustainable Fabric','Recycled Materials','Organic Cotton','Natural Linen','Synthetic Blend','Performance Fabric'
  ],
  pillows: [
    'Memory Foam','Gel Infused','Down Filling','Feather Blend','Synthetic Fill','Bamboo Cover','Cotton Cover','Silk Cover','Linen Cover','Cooling Technology','Temperature Regulation','Moisture Wicking','Anti-Bacterial','Anti-Dust Mite','Hypoallergenic','Orthopedic Support','Neck Support','Cervical Support','Lumbar Support','Side Sleeper','Back Sleeper','Stomach Sleeper','Combination Sleeper','Adjustable Height','Removable Cover','Washable Cover','Quick Dry','Anti-Odor','Anti-Static','Eco-Friendly','Organic Materials','Natural Fillings','Sustainable','Biodegradable','Recycled Materials','Certified Organic','OEKO-TEX Certified','GOTS Certified','Fair Trade','Handmade','Customizable','Personalized'
  ],
  toppers: [
    'Memory Foam','Gel Infused','Latex','Wool','Bamboo','Cotton','Silk','Polyester','Hybrid Design','Cooling Technology','Temperature Regulation','Moisture Wicking','Anti-Bacterial','Anti-Dust Mite','Hypoallergenic','Pressure Relief','Pain Relief','Joint Support','Back Support','Hip Support','Shoulder Support','Spine Alignment','Posture Support','Motion Isolation','Edge Support','Non-Slip Base','Gripper Backing','Elastic Straps','Zipper Closure','Removable Cover','Washable Cover','Waterproof','Stain Resistant','Anti-Odor','Anti-Static','Eco-Friendly','Organic Materials','Natural Fibers','Sustainable','Biodegradable','Recycled Materials','Certified Organic','OEKO-TEX Certified','GOTS Certified','Fair Trade','Handmade'
  ],
  bunkbeds: [
    'Twin over Twin','Twin over Full','Full over Full','Twin over Twin XL','Twin XL over Twin XL','Full over Twin','Full over Twin XL','Triple Bunk','L-Shaped','T-Shaped','U-Shaped','Staircase Access','Ladder Access','Safety Rails','Guard Rails','Built-in Storage','Under Bed Storage','Headboard Storage','Footboard Storage','Side Storage','Drawer Storage','Shelf Storage','Desk Attachment','Study Area','Work Station','Play Area','Reading Nook','Privacy Curtains','Canopy Design','Tent Style','Adventure Theme','Space Theme','Princess Theme','Knight Theme','Jungle Theme','Ocean Theme','Forest Theme','Mountain Theme','Desert Theme','Tropical Theme','Arctic Theme','Galaxy Theme','Underwater Theme','Castle Theme','Treehouse Theme','Cabin Theme','Lodge Theme','Chalet Theme'
  ]
}

const CATEGORY_REASONS_TO_LOVE = {
  mattresses: [
    'Sleeps cool all night','Cloud-like comfort','Outstanding value','Built to last','Relieves pressure points','Minimal partner disturbance','Supports natural alignment','Edge-to-edge support','Breathable year-round','Hypoallergenic and safe','Eco-conscious choice','Easy, tool-free setup','Arrives fast','Hassle-free returns','Great for back sleepers','Great for side sleepers','Comfort for stomach sleepers','Hotel-quality feel','Quiet nights','No rolling together','Great for couples','Ideal for guest rooms','Kid-friendly durability','Pet-friendly cover','Removable washable cover','Works with any base','Adjustable-base compatible','Odour-free materials','CertiPUR foam','OEKO-TEX textiles','Proudly made in UK','Available in many sizes','Multiple firmness choices','Clean, modern design','Premium stitching','Gentle on skin','Reinforced handles','Motion-isolating coils','Adaptive foams','Balanced support','Plush comfort option','Medium-firm balance','Firm support choice','Excellent bundle value','Highly rated by customers','Best seller'
  ],
  beds: [
    'Sturdy construction','Easy assembly','Beautiful design','Perfect fit','Space efficient','Storage solution','Modern style','Classic elegance','Durable finish','Quality materials','Easy maintenance','Versatile design','Room transformation','Bedroom centerpiece','Sleep sanctuary','Restful environment','Peaceful atmosphere','Serene space','Comfortable height','Perfect proportions','Balanced design','Harmonious style','Cohesive look','Unified aesthetic','Refined details','Premium quality','Luxury feel','Affordable luxury','Value for money','Investment piece','Family heirloom','Generational quality','Timeless design','Trendy style','Contemporary look','Traditional charm','Rustic appeal','Modern sophistication','Classic beauty','Elegant simplicity','Sophisticated design','Premium craftsmanship','Expert construction','Professional finish','Attention to detail','Quality assurance','Satisfaction guaranteed'
  ],
  sofas: [
    'Ultra comfortable','Stylish design','Perfect fit','Room transformation','Living room centerpiece','Entertainment hub','Family gathering spot','Guest accommodation','Sleeping solution','Storage solution','Modern style','Contemporary look','Classic elegance','Timeless design','Trendy style','Versatile design','Multi-functional','Space efficient','Easy maintenance','Durable fabric','Quality construction','Premium materials','Luxury feel','Affordable luxury','Value for money','Investment piece','Family heirloom','Generational quality','Professional finish','Expert craftsmanship','Attention to detail','Quality assurance','Satisfaction guaranteed','Perfect proportions','Balanced design','Harmonious style','Cohesive look','Unified aesthetic','Refined details','Premium quality'
  ],
  pillows: [
    'Perfect support','Neck comfort','Pain relief','Better sleep','Restful nights','Comfortable sleep','Supportive design','Orthopedic benefits','Health improvement','Wellness support','Therapeutic comfort','Medical grade','Professional quality','Expert design','Scientific approach','Research based','Clinically tested','Doctor recommended','Chiropractor approved','Physical therapist recommended','Sleep specialist approved','Sleep consultant recommended','Sleep coach approved','Sleep therapist recommended','Sleep psychologist approved','Sleep researcher approved','Sleep scientist approved','Sleep expert approved','Sleep professional approved','Sleep authority approved','Sleep master approved','Sleep guru approved','Sleep wizard approved','Sleep magician approved','Sleep sorcerer approved','Sleep alchemist approved','Sleep philosopher approved','Sleep sage approved','Sleep mystic approved','Sleep oracle approved','Sleep prophet approved','Sleep seer approved','Sleep visionary approved'
  ],
  toppers: [
    'Instant comfort','Pain relief','Better sleep','Support improvement','Pressure relief','Joint support','Back support','Hip support','Shoulder support','Spine alignment','Posture improvement','Health benefits','Wellness support','Therapeutic comfort','Medical grade','Professional quality','Expert design','Scientific approach','Research based','Clinically tested','Doctor recommended','Chiropractor approved','Physical therapist recommended','Sleep specialist approved','Sleep consultant recommended','Sleep coach approved','Sleep therapist recommended','Sleep psychologist approved','Sleep researcher approved','Sleep scientist approved','Sleep expert approved','Sleep professional approved','Sleep authority approved','Sleep master approved','Sleep guru approved','Sleep wizard approved','Sleep magician approved','Sleep sorcerer approved','Sleep alchemist approved','Sleep philosopher approved','Sleep sage approved','Sleep mystic approved','Sleep oracle approved','Sleep prophet approved','Sleep seer approved','Sleep visionary approved'
  ],
  bunkbeds: [
    'Space saving','Perfect for kids','Fun design','Adventure theme','Sleepover solution','Guest accommodation','Family solution','Sibling sharing','Room efficiency','Space optimization','Storage solution','Multi-functional','Versatile design','Contemporary look','Modern style','Classic design','Traditional charm','Rustic appeal','Timeless style','Trendy design','Contemporary elegance','Modern sophistication','Classic beauty','Elegant simplicity','Sophisticated design','Premium craftsmanship','Expert construction','Professional finish','Attention to detail','Quality assurance','Satisfaction guaranteed','Perfect fit','Room enhancement','Style improvement','Aesthetic upgrade','Design transformation','Visual appeal','Beauty enhancement','Elegance addition','Sophistication boost','Class improvement','Quality upgrade','Fun factor','Entertainment value','Play area','Study space','Work station','Reading nook','Privacy solution','Personal space'
  ]
}

// Default to centralized list for consistency across add/edit
const getFeaturesForCategory = (category: string) => getFeaturesForCategoryLib(category)
const getReasonsForCategory = (category: string) => ensureUnique(CATEGORY_REASONS_TO_LOVE[category as keyof typeof CATEGORY_REASONS_TO_LOVE] || CATEGORY_REASONS_TO_LOVE.mattresses)

// Get feature cards for a category from centralized source
const getFeatureCardsForCategory = (category: string) => getFeatureCardsForCategoryLib(category)

// Get icon component based on icon name (now uses centralized mapping)
const getIconComponentAdmin = (iconName: string) => {
  const iconFn = getIconComponent(iconName, 'md')
  return typeof iconFn === 'function' ? iconFn : (() => React.createElement(Check, { className: "w-6 h-6" }))
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/admin/add-product">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Orders
              </Button>
            </Link>
            <Link href="/admin/header-dropdown">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Header Dropdowns
              </Button>
            </Link>
            <Link href="/admin/promotional-banners">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 16h12l-1-16M10 9v6M14 9v6" />
                </svg>
                Promotional Banners
              </Button>
            </Link>
            <Link href="/admin/promotional-popup">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a4 4 0 100-8 4 4 0 000 8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Promotional Popup
              </Button>
            </Link>
            <Link href="/admin/homepage">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                Homepage Content
              </Button>
            </Link>
          </div>
        </div>
          <ProductForm />
      </div>
    </div>
  )
}

function CheckboxGrid({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const toggle = (opt: string) => {
    const exists = selected.includes(opt)
    onChange(exists ? selected.filter(o => o !== opt) : [...selected, opt])
  }

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">{label}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map((opt, index) => (
          <label key={`${opt}-${index}`} className={`flex items-center gap-2 rounded border p-2 cursor-pointer ${selected.includes(opt) ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'}`}>
            <input type="checkbox" className="h-4 w-4" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
            <span className="text-sm text-gray-800">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
  }

function RecommendedProductCard({
  product,
  isSelected,
  onSelect,
  onDeselect,
  disabled
}: {
  product: any
  isSelected: boolean
  onSelect: () => void
  onDeselect: () => void
  disabled: boolean
}) {
  return (
    <div
      className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-green-500 bg-green-50'
          : disabled
          ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={disabled ? undefined : isSelected ? onDeselect : onSelect}
    >
      <div className="flex items-center gap-3">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            className="w-12 h-12 rounded-md object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
          <p className="text-xs text-gray-500">{product.category}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-green-600">£{product.currentPrice?.toFixed(2) || '0.00'}</span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-xs text-gray-400 line-through">£{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductForm() {

  const [variants, setVariants] = useState<VariantRow[]>([])
  
  // Step 1: Attribute selection
  const [useColor, setUseColor] = useState<boolean>(false)
  const [useDepth, setUseDepth] = useState<boolean>(false)
  const [useSize, setUseSize] = useState<boolean>(false)
  const [useFirmness, setUseFirmness] = useState<boolean>(false)
  const [attributesConfirmed, setAttributesConfirmed] = useState<boolean>(false)

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedReasonsToLove, setSelectedReasonsToLove] = useState<Array<{reason: string, description: string, smalltext?: string, icon?: string}>>([])
  const [reasonsToBuy, setReasonsToBuy] = useState<string[]>([])
  const [newReason, setNewReason] = useState<string>("")

  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [convertToWebP, setConvertToWebP] = useState<boolean>(true) // Default for new images
  const [webpQuality, setWebpQuality] = useState<number>(90) // Default for new images
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)
  const [imageWebPSettings, setImageWebPSettings] = useState<Map<string, { convert: boolean; quality: number }>>(new Map())
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false)
  const [imageToCrop, setImageToCrop] = useState<File | null>(null)
  const [croppedImages, setCroppedImages] = useState<Map<string, string>>(new Map())

  const [name, setName] = useState('')
  const [rating, setRating] = useState<number>(4.5)
  const [headline, setHeadline] = useState('Premium Sleep Experience')
  const [longDescription, setLongDescription] = useState('Write a compelling description about comfort, materials and value.')
  const [warrantyDeliveryLine, setWarrantyDeliveryLine] = useState('1-Year Warranty • Free Delivery • 100-Night Trial')
  
  // Description paragraphs with images
  const [descriptionParagraphs, setDescriptionParagraphs] = useState([
    { heading: 'Comfort & Support', content: 'Experience exceptional comfort with our premium materials...', image: '', uploadedFile: null as File | null },
    { heading: 'Quality Materials', content: 'Crafted with the finest materials for lasting durability...', image: '', uploadedFile: null as File | null },
    { heading: 'Sleep Benefits', content: 'Wake up feeling refreshed and well-rested...', image: '', uploadedFile: null as File | null }
  ])
  
  // FAQ section
  const [faqs, setFaqs] = useState([
    { question: 'What is the warranty period?', answer: 'This mattress comes with a 10-year warranty...' },
    { question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days...' }
  ])
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  
  // Warranty section
  const [warrantySections, setWarrantySections] = useState([
    { heading: 'Coverage', content: 'Comprehensive coverage for manufacturing defects...' },
    { heading: 'Terms', content: 'Warranty terms and conditions apply...' },
    { heading: 'Support', content: 'Dedicated customer support for warranty claims...' }
  ])
  
  // Care instructions
  const [careInstructions, setCareInstructions] = useState('')
  
  // Trial information
  const [trialInformation, setTrialInformation] = useState('Try your mattress risk-free for 100 nights. If you are not completely satisfied, return it for a full refund. No questions asked.')
  const [trialInformationHeading, setTrialInformationHeading] = useState('Trial')
  
  // Dimensions and specifications
  const [dimensions, setDimensions] = useState({
    height: '25 cm',
    length: 'L 190cm',
    width: '135cm',
    mattressSize: '135cm x L 190cm cm',
    maxHeight: '25 cm',
    weightCapacity: '200 kg',
    pocketSprings: '1000 count',
    comfortLayer: '8 cm',
    supportLayer: '17 cm',
    // Editable headings
    mattressSizeHeading: 'Mattress Size',
      maximumHeightHeading: 'Maximum Height',
    weightCapacityHeading: 'Weight Capacity',
    pocketSpringsHeading: 'Pocket Springs',
    comfortLayerHeading: 'Comfort Layer',
      supportLayerHeading: 'Support Layer',
      // Dimension disclaimer
      dimensionDisclaimer: 'All measurements are approximate and may vary slightly.',
      // Visibility controls
      show_basic_dimensions: true,
      show_mattress_specs: true,
      show_technical_specs: true
  })

  // Important notices state
  const [importantNotices, setImportantNotices] = useState<Array<{
    id: string
    noticeText: string
    sortOrder: number
  }>>([])

  // Popular categories state
  const [selectedPopularCategories, setSelectedPopularCategories] = useState<string[]>([])

  // Firmness scale and comfort metrics
  const [firmnessScale, setFirmnessScale] = useState<'Soft' | 'Soft-Medium' | 'Medium' | 'Medium-Firm' | 'Firm' | 'Extra-firm'>('Medium')
  const [supportLevel, setSupportLevel] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [pressureReliefLevel, setPressureReliefLevel] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [airCirculationLevel, setAirCirculationLevel] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [durabilityLevel, setDurabilityLevel] = useState<'Low' | 'Medium' | 'High'>('High')

  // Category flags
  const [isKidsCategory, setIsKidsCategory] = useState<boolean>(false)
  const [isSalesCategory, setIsSalesCategory] = useState<boolean>(false)

  // Recommended products state
  const [mattresses, setMattresses] = useState<any[]>([])
  const [beds, setBeds] = useState<any[]>([])
  const [sofas, setSofas] = useState<any[]>([])
  const [pillows, setPillows] = useState<any[]>([])

  // Badges state
  const [badges, setBadges] = useState<Array<{ type: 'sale' | 'new_in' | 'free_gift'; enabled: boolean }>>([
    { type: 'sale', enabled: false },
    { type: 'new_in', enabled: false },
    { type: 'free_gift', enabled: false }
  ])
  const [selectedGiftProduct, setSelectedGiftProduct] = useState<any>(null)
  const [toppers, setToppers] = useState<any[]>([])
  const [loadingMattresses, setLoadingMattresses] = useState(true)
  const [loadingBeds, setLoadingBeds] = useState(true)
  const [loadingSofas, setLoadingSofas] = useState(true)
  const [loadingPillows, setLoadingPillows] = useState(true)
  const [loadingToppers, setLoadingToppers] = useState(true)
  const [selectedRecommendedProducts, setSelectedRecommendedProducts] = useState<any[]>([])

  // Product selector modal state
  const [productSelectorOpen, setProductSelectorOpen] = useState(false)
  const [selectedCategoryForSelector, setSelectedCategoryForSelector] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // Free gift product selector modal state
  const [freeGiftSelectorOpen, setFreeGiftSelectorOpen] = useState(false)
  const [selectedCategoryForGiftSelector, setSelectedCategoryForGiftSelector] = useState<string>('mattresses')
  const [giftSearchTerm, setGiftSearchTerm] = useState('')

  // Image selector modal state
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false)
  const [selectedVariantForImage, setSelectedVariantForImage] = useState<string>('')

  // Fetch recommended products on component mount
  useEffect(() => {
    fetchRecommendedProducts()
  }, [])

  const addReasonToLove = (reason: string, description: string = '', smalltext: string = '', icon: string = '') => {
    setSelectedReasonsToLove(prev => [...prev, { reason, description, smalltext, icon }])
  }

  const updateReasonToLoveDescription = (index: number, description: string) => {
    setSelectedReasonsToLove(prev => prev.map((item, i) => 
      i === index ? { ...item, description } : item
    ))
  }

  const updateReasonToLoveSmalltext = (index: number, smalltext: string) => {
    setSelectedReasonsToLove(prev => prev.map((item, i) => 
      i === index ? { ...item, smalltext } : item
    ))
  }

  const removeReasonToLove = (index: number) => {
    setSelectedReasonsToLove(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants(v => ([
      ...v,
      {
        id: crypto.randomUUID(),
        sku: '',
        color: '',
        depth: '',
        firmness: '',
        size: '',
        length: '',
        width: '',
        height: '',
        availability: true,
        originalPrice: undefined,
        currentPrice: undefined,
        variant_image: '',
      },
    ]))
  }

  const updateVariant = (id: string, patch: Partial<VariantRow>) => {
    setVariants(v => {
      const updatedVariants = v.map(row => row.id === id ? { ...row, ...patch } : row)
      
      // Auto-sync attribute checkboxes based on actual variant data
      const hasColorData = updatedVariants.some(variant => variant.color && variant.color.trim() !== '')
      const hasDepthData = updatedVariants.some(variant => variant.depth && variant.depth.trim() !== '')
      const hasFirmnessData = updatedVariants.some(variant => variant.firmness && variant.firmness.trim() !== '')
      const hasSizeData = updatedVariants.some(variant => variant.size && variant.size.trim() !== '')
      
      // Update checkboxes if data exists but checkbox is unchecked
      if (hasColorData && !useColor) setUseColor(true)
      if (hasDepthData && !useDepth) setUseDepth(true)
      if (hasFirmnessData && !useFirmness) setUseFirmness(true)
      if (hasSizeData && !useSize) setUseSize(true)
      
      return updatedVariants
    })
  }

  const removeVariant = (id: string) => setVariants(v => {
    const updatedVariants = v.filter(row => row.id !== id)
    
    // Re-sync attributes after removing a variant
    setTimeout(() => syncAttributesWithVariants(), 0)
    
    return updatedVariants
  })

  // Auto-sync attribute checkboxes based on actual variant data
  const syncAttributesWithVariants = () => {
    const hasColorData = variants.some(v => v.color && v.color.trim() !== '')
    const hasDepthData = variants.some(v => v.depth && v.depth.trim() !== '')
    const hasFirmnessData = variants.some(v => v.firmness && v.firmness.trim() !== '')
    const hasSizeData = variants.some(v => v.size && v.size.trim() !== '')
    
    // Update checkboxes if data exists
    if (hasColorData) setUseColor(true)
    if (hasDepthData) setUseDepth(true)
    if (hasFirmnessData) setUseFirmness(true)
    if (hasSizeData) setUseSize(true)
  }

  const confirmAttributes = () => {
    // Auto-sync attributes before confirmation
    syncAttributesWithVariants()
    
    // Relaxed: allow bunkbeds without forcing both color and size; just ensure at least one attribute or mattress
    if (selectedCategory === 'bunkbeds') {
      if (selectedBunkbedMattresses.length === 0 && !useColor && !useSize) {
        alert('Please select at least one mattress or an attribute for this bunkbed')
        return
      }
    } else {
      // For other categories, require at least one attribute when none selected
      if (!useColor && !useDepth && !useSize && !useFirmness) {
        alert('Please select at least one attribute (Color, Depth, Size, or Firmness)')
        return
      }
    }
    setAttributesConfirmed(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    setUploadedFiles(prev => [...prev, ...Array.from(files)])
  }

  const handleCropComplete = (_croppedImageUrl: string) => {
    // Crop disabled in add form
    setCropModalOpen(false)
    setImageToCrop(null)
  }

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    // Adjust main image index if needed
    if (mainImageIndex >= uploadedFiles.length - 1) {
      setMainImageIndex(Math.max(0, uploadedFiles.length - 2))
    }
  }

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  // WebP settings are not configurable in add form; uploads are always converted to WebP (quality 90)

  const updateDescriptionParagraph = (index: number, field: 'heading' | 'content' | 'image' | 'uploadedFile', value: string | File | null) => {
    setDescriptionParagraphs(prev => prev.map((para, i) => 
      i === index ? { ...para, [field]: value } : para
    ))
  }

  // Badge helper functions
  const handleBadgeToggle = (badgeType: 'sale' | 'new_in' | 'free_gift', enabled: boolean) => {
    const currentBadges = badges || []
    const existingBadgeIndex = currentBadges.findIndex(b => b.type === badgeType)
    
    if (existingBadgeIndex >= 0) {
      const updatedBadges = [...currentBadges]
      updatedBadges[existingBadgeIndex] = { ...updatedBadges[existingBadgeIndex], enabled }
      setBadges(updatedBadges)
    } else {
      setBadges([...currentBadges, { type: badgeType, enabled }])
    }

    // If disabling free gift, clear the gift product
    if (badgeType === 'free_gift' && !enabled) {
      setSelectedGiftProduct(null)
    }
  }

  const handleGiftProductSelect = (product: any) => {
    setSelectedGiftProduct(product)
  }

  const getBadgeStatus = (badgeType: 'sale' | 'new_in' | 'free_gift') => {
    const badge = badges?.find(b => b.type === badgeType)
    return badge?.enabled || false
  }

  const handleDescriptionFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      updateDescriptionParagraph(index, 'uploadedFile', files[0])
      updateDescriptionParagraph(index, 'image', '') // Clear URL when file is uploaded
    }
  }

  const removeDescriptionFile = (index: number) => {
    updateDescriptionParagraph(index, 'uploadedFile', null)
  }

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFaqs(prev => [...prev, { ...newFaq }])
      setNewFaq({ question: '', answer: '' })
    }
  }

  const removeFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index))
  }

  const updateWarrantySection = (index: number, field: 'heading' | 'content', value: string) => {
    setWarrantySections(prev => prev.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    ))
  }

  const updateDimension = (field: keyof typeof dimensions, value: string | boolean) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
  }

  // Important notices functions
  const addImportantNotice = () => {
    const newNotice = {
      id: crypto.randomUUID(),
      noticeText: '',
      sortOrder: importantNotices.length
    }
    setImportantNotices(prev => [...prev, newNotice])
  }

  const updateImportantNotice = (id: string, field: 'noticeText' | 'sortOrder', value: string | number) => {
    setImportantNotices(prev => prev.map(notice =>
      notice.id === id ? { ...notice, [field]: value } : notice
    ))
  }

  const removeImportantNotice = (id: string) => {
    setImportantNotices(prev => prev.filter(notice => notice.id !== id))
  }

  // Dimension images functions


  // Recommended products functions
  const fetchRecommendedProducts = async () => {
    try {
      console.log('Fetching recommended products for all categories...')
      
      // Fetch products for each category
      const [mattressesRes, bedsRes, sofasRes, pillowsRes, toppersRes] = await Promise.all([
        fetch('/api/products/recommendations?category=mattresses&limit=6'),
        fetch('/api/products/recommendations?category=beds&limit=6'),
        fetch('/api/products/recommendations?category=sofas&limit=6'),
        fetch('/api/products/recommendations?category=pillows&limit=6'),
        fetch('/api/products/recommendations?category=toppers&limit=6')
      ])

      // Handle mattresses
      if (mattressesRes.ok) {
        const data = await mattressesRes.json()
        console.log('Mattresses loaded:', data.products?.length || 0)
        console.log('Sample mattress data:', data.products?.[0])
        setMattresses(data.products || [])
      } else {
        const errorData = await mattressesRes.json().catch(() => ({}))
        console.error('Failed to load mattresses:', mattressesRes.status, errorData)
      }
      setLoadingMattresses(false)

      // Handle beds
      if (bedsRes.ok) {
        const data = await bedsRes.json()
        console.log('Beds loaded:', data.products?.length || 0)
        setBeds(data.products || [])
      } else {
        const errorData = await bedsRes.json().catch(() => ({}))
        console.error('Failed to load beds:', bedsRes.status, errorData)
      }
      setLoadingBeds(false)

      // Handle sofas
      if (sofasRes.ok) {
        const data = await sofasRes.json()
        console.log('Sofas loaded:', data.products?.length || 0)
        setSofas(data.products || [])
      } else {
        const errorData = await sofasRes.json().catch(() => ({}))
        console.error('Failed to load sofas:', sofasRes.status, errorData)
      }
      setLoadingSofas(false)

      // Handle pillows
      if (pillowsRes.ok) {
        const data = await pillowsRes.json()
        console.log('Pillows loaded:', data.products?.length || 0)
        setPillows(data.products || [])
      } else {
        const errorData = await pillowsRes.json().catch(() => ({}))
        console.error('Failed to load pillows:', pillowsRes.status, errorData)
      }
      setLoadingPillows(false)

      // Handle toppers
      if (toppersRes.ok) {
        const data = await toppersRes.json()
        console.log('Toppers loaded:', data.products?.length || 0)
        setToppers(data.products || [])
      } else {
        const errorData = await toppersRes.json().catch(() => ({}))
        console.error('Failed to load toppers:', toppersRes.status, errorData)
      }
      setLoadingToppers(false)
      
      console.log('Finished fetching recommended products')
    } catch (error) {
      console.error('Error fetching recommended products:', error)
      setLoadingMattresses(false)
      setLoadingBeds(false)
      setLoadingSofas(false)
      setLoadingPillows(false)
      setLoadingToppers(false)
    }
  }

  const handleRecommendedProductSelect = (product: any) => {
    if (selectedRecommendedProducts.length >= 3) {
      alert('You can only select up to 3 recommended products')
      return
    }
    console.log('Adding recommended product:', product)
    setSelectedRecommendedProducts(prev => [...prev, product])
  }

  const handleRecommendedProductDeselect = (productId: string) => {
    setSelectedRecommendedProducts(prev => prev.filter(p => p.id !== productId))
  }





  // Product selector modal functions
  const openProductSelector = (category: string) => {
    setSelectedCategoryForSelector(category)
    setSearchTerm('')
    setProductSelectorOpen(true)
  }

  const closeProductSelector = () => {
    setProductSelectorOpen(false)
    setSelectedCategoryForSelector('')
    setSearchTerm('')
  }

  // Free gift product selector modal functions
  const openFreeGiftSelector = (category: string) => {
    setSelectedCategoryForGiftSelector(category)
    setGiftSearchTerm('')
    setFreeGiftSelectorOpen(true)
  }

  const closeFreeGiftSelector = () => {
    setFreeGiftSelectorOpen(false)
    setSelectedCategoryForGiftSelector('')
    setGiftSearchTerm('')
  }

  const getProductsForCategory = (category: string) => {
    switch (category) {
      case 'mattresses': return mattresses;
      case 'beds': return beds;
      case 'sofas': return sofas;
      case 'pillows': return pillows;
      case 'toppers': return toppers;
      case 'bunkbeds': return mattresses; // bunkbeds use mattresses
      default: return [];
    }
  }

  const getLoadingStateForCategory = (category: string) => {
    switch (category) {
      case 'mattresses': return loadingMattresses;
      case 'beds': return loadingBeds;
      case 'sofas': return loadingSofas;
      case 'pillows': return loadingPillows;
      case 'toppers': return loadingToppers;
      case 'bunkbeds': return loadingMattresses;
      default: return false;
    }
  }

  // Image selector modal functions
  const openImageSelector = (variantId: string) => {
    setSelectedVariantForImage(variantId)
    setImageSelectorOpen(true)
  }

  const closeImageSelector = () => {
    setImageSelectorOpen(false)
    setSelectedVariantForImage('')
  }

  const selectImageForVariant = (imageUrl: string) => {
    if (selectedVariantForImage) {
      updateVariant(selectedVariantForImage, { variant_image: imageUrl })
      closeImageSelector()
    }
  }

    const resetForm = () => {
    // No confirmation dialog - just clear the form
    setIsResetting(true)
    
    setSelectedCategory('mattresses')
    setVariants([])
    setAttributesConfirmed(false)
    setUseColor(false)
    setUseDepth(false)
    setUseSize(false)
    setUseFirmness(false)
    setSelectedFeatures([])
    setSelectedReasonsToLove([])
    setReasonsToBuy([])
    setNewReason('')
    setImages([])
    setNewImage('')
    setUploadedFiles([])
    setName('')
    setRating(4.5)
    setHeadline('Premium Sleep Experience')
    setLongDescription('Write a compelling description about comfort, materials and value.')
    setWarrantyDeliveryLine('1-Year Warranty • Free Delivery • 100-Night Trial')
    setFirmnessScale('Medium')
    setSupportLevel('Medium')
    setPressureReliefLevel('Medium')
    setAirCirculationLevel('Medium')
    setDurabilityLevel('High')
    setIsKidsCategory(false)
    setIsSalesCategory(false)
    setDescriptionParagraphs([
      { heading: 'Comfort & Support', content: 'Experience exceptional comfort with our premium materials...', image: '', uploadedFile: null },
      { heading: 'Quality Materials', content: 'Crafted with the finest materials for lasting durability...', image: '', uploadedFile: null },
      { heading: 'Sleep Benefits', content: 'Wake up feeling refreshed and well-rested...', image: '', uploadedFile: null }
    ])
    setFaqs([
      { question: 'What is the warranty period?', answer: 'This mattress comes with a 10-year warranty...' },
      { question: 'How long does delivery take?', answer: 'Standard delivery takes 3-5 business days...' }
    ])
    setNewFaq({ question: '', answer: '' })
    setWarrantySections([
      { heading: 'Coverage', content: 'Comprehensive coverage for manufacturing defects...' },
      { heading: 'Terms', content: 'Warranty terms and conditions apply...' },
      { heading: 'Support', content: 'Dedicated customer support for warranty claims...' }
    ])
    setCareInstructions('')
    setTrialInformation('Try your mattress risk-free for 100 nights. If you are not completely satisfied, return it for a full refund. No questions asked.')
    setDimensions({
      height: '25 cm',
      length: 'L 190cm',
      width: '135cm',
      mattressSize: '135cm x L 190cm cm',
      maxHeight: '25 cm',
      weightCapacity: '200 kg',
      pocketSprings: '1000 count',
      comfortLayer: '8 cm',
      supportLayer: '17 cm',
      // Editable headings
      mattressSizeHeading: 'Mattress Size',
      maximumHeightHeading: 'Maximum Height',
      weightCapacityHeading: 'Weight Capacity',
      pocketSpringsHeading: 'Pocket Springs',
      comfortLayerHeading: 'Comfort Layer',
      supportLayerHeading: 'Support Layer',
      // Dimension disclaimer
      dimensionDisclaimer: 'All measurements are approximate and may vary slightly.',
      // Visibility controls
      show_basic_dimensions: true,
      show_mattress_specs: true,
      show_technical_specs: true
    })

    setImportantNotices([])
    setSelectedBunkbedMattresses([])
    setSelectedPopularCategories([])
    setSelectedRecommendedProducts([])
    
    // Reset badges
    setBadges([
      { type: 'sale', enabled: false },
      { type: 'new_in', enabled: false },
      { type: 'free_gift', enabled: false }
    ])
    setSelectedGiftProduct(null)
    
    // Reset free gift selector state
    setFreeGiftSelectorOpen(false)
    setSelectedCategoryForGiftSelector('mattresses')
    setGiftSearchTerm('')
    
    // Reset the resetting state
    setIsResetting(false)
  }

  // Clear features and reasons when category changes
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory)
    setSelectedFeatures([])
    setSelectedReasonsToLove([])
    setSelectedBunkbedMattresses([]) // Clear bunkbed mattress selection
    setSelectedPopularCategories([]) // Clear popular categories selection
    
    // Fetch mattresses if category is bunkbeds
    if (newCategory === 'bunkbeds') {
      fetchBunkbedMattresses()
    }
  }

  // Bunkbed mattress selection helpers
  const toggleBunkbedMattress = (mattressId: string) => {
    setSelectedBunkbedMattresses(prev => 
      prev.includes(mattressId) 
        ? prev.filter(id => id !== mattressId)
        : [...prev, mattressId]
    )
  }

  const getSelectedMattressNames = () => {
    return availableMattresses
      .filter(m => selectedBunkbedMattresses.includes(m.id))
      .map(m => `${m.name} (${m.size})`)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Auto-sync attributes with variant data before saving
      syncAttributesWithVariants()
      // 1) Upload any selected files to Supabase Storage and collect public URLs
      const uploadedUrls: string[] = []
      if (uploadedFiles.length > 0) {
        console.log('[Admin Save] Uploading files to Supabase bucket:', process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images', uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })))
        // Collect upload results for summary alert
        const uploadResults: Array<{
          fileName: string
          originalSize: number
          optimizedSize: number
          savingsPercent: string
          success: boolean
          error?: string
        }> = []
        
        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i]
          
          try {
            // Use optimized upload API instead of direct Supabase upload
            const formData = new FormData()
            formData.append('file', file)
            formData.append('preset', 'large') // Use large preset for product images
            formData.append('convert', 'true')
            formData.append('format', 'webp')
            formData.append('quality', '90')
            
            const response = await fetch('/api/upload-optimized', {
              method: 'POST',
              body: formData
            })
            
            if (response.ok) {
              const result = await response.json()
              uploadedUrls.push(result.url)
              
              // Collect result for summary
              uploadResults.push({
                fileName: file.name,
                originalSize: file.size,
                optimizedSize: file.size, // No compression, same size
                success: true
              })
              
              console.log('[Admin Save] Optimized upload result:', result)
            } else {
              const error = await response.json()
              console.error('[Admin Save] Optimized upload error:', error)
              
              // Fallback to regular upload if optimized upload fails
          const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
          const filePath = `products/${Date.now()}-${i}-${safeName}`
          const { error: uploadError } = await supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .upload(filePath, file, { upsert: true, contentType: file.type })
          if (uploadError) {
                console.error('[Admin Save] Fallback upload error:', uploadError, 'for', filePath)
                uploadResults.push({
                  fileName: file.name,
                  originalSize: file.size,
                  optimizedSize: file.size,
                  savingsPercent: '0',
                  success: false,
                  error: 'Upload failed'
                })
            continue
          }
          const { data: publicData } = supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .getPublicUrl(filePath)
              if (publicData?.publicUrl) {
                uploadedUrls.push(publicData.publicUrl)
                uploadResults.push({
                  fileName: file.name,
                  originalSize: file.size,
                  optimizedSize: file.size,
                  savingsPercent: '0',
                  success: false,
                  error: 'Fallback upload (no optimization)'
                })
              }
            }
          } catch (error) {
            console.error('[Admin Save] Upload error:', error, 'for', file.name)
            // Fallback to regular upload
            const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
            const filePath = `products/${Date.now()}-${i}-${safeName}`
            const { error: uploadError } = await supabase
              .storage
              .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
              .upload(filePath, file, { upsert: true, contentType: file.type })
            if (uploadError) {
              console.error('[Admin Save] Fallback upload error:', uploadError, 'for', filePath)
              uploadResults.push({
                fileName: file.name,
                originalSize: file.size,
                optimizedSize: file.size,
                savingsPercent: '0',
                success: false,
                error: 'Upload failed'
              })
              continue
            }
            const { data: publicData } = supabase
              .storage
              .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
              .getPublicUrl(filePath)
            if (publicData?.publicUrl) {
              uploadedUrls.push(publicData.publicUrl)
              uploadResults.push({
                fileName: file.name,
                originalSize: file.size,
                optimizedSize: file.size,
                savingsPercent: '0',
                success: false,
                error: 'Fallback upload (no optimization)'
              })
            }
          }
        }
        
        // Show summary alert for all uploads
        if (uploadResults.length > 0) {
          const successfulUploads = uploadResults.filter(r => r.success)
          const failedUploads = uploadResults.filter(r => !r.success)
          
          let alertMessage = `📸 Image Upload Summary\n\n`
          
          if (successfulUploads.length > 0) {
            const totalSize = successfulUploads.reduce((sum, r) => sum + r.originalSize, 0)
            
            alertMessage += `✅ Successfully Uploaded: ${successfulUploads.length} images\n`
            alertMessage += `📏 Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n\n`
            
            // Add individual file details
            successfulUploads.forEach(result => {
              const fileMB = (result.originalSize / 1024 / 1024).toFixed(2)
              alertMessage += `📁 ${result.fileName}: ${fileMB} MB\n`
            })
          }
          
          if (failedUploads.length > 0) {
            alertMessage += `\n❌ Failed: ${failedUploads.length} images\n`
            failedUploads.forEach(result => {
              const sizeMB = (result.originalSize / 1024 / 1024).toFixed(2)
              alertMessage += `📁 ${result.fileName}: ${sizeMB} MB (${result.error})\n`
            })
          }
          
          // Show WebP conversion summary
          alertMessage += `\n🎯 All images converted to WebP (quality 90).`
          
          alert(alertMessage)
        }
        

        
        console.log('[Admin Save] Uploaded public URLs:', uploadedUrls)
      }

      // 2) Upload description paragraph files to storage and replace with public URLs
      const descriptionPublicUrls: Array<string | null> = []
      const updatedDescriptionParagraphs = [] as typeof descriptionParagraphs
        const descriptionUploadResults: Array<{
          fileName: string
          originalSize: number
          optimizedSize: number
          savingsPercent: string
          success: boolean
          error?: string
        }> = []
        
      for (let i = 0; i < descriptionParagraphs.length; i++) {
        const para = descriptionParagraphs[i]
        let imageUrl = para.image
        if (para.uploadedFile) {
          const file = para.uploadedFile
            
            try {
              // Use optimized upload API for description images
              const formData = new FormData()
              formData.append('file', file)
              formData.append('preset', 'medium') // Use medium preset for description images
              formData.append('convert', String(convertToWebP))
              formData.append('format', convertToWebP ? 'webp' : 'original')
              if (convertToWebP) formData.append('quality', String(webpQuality))
              
              const response = await fetch('/api/upload-optimized', {
                method: 'POST',
                body: formData
              })
              
              if (response.ok) {
                const result = await response.json()
                imageUrl = result.url
                
                // Collect result for summary
                descriptionUploadResults.push({
                  fileName: file.name,
                  originalSize: file.size,
                  optimizedSize: file.size, // No compression, same size
                  success: true
                })
                
                console.log('[Admin Save] Description optimized upload result:', result)
              } else {
                const error = await response.json()
                console.error('[Admin Save] Description optimized upload error:', error)
                // Fallback to regular upload
          const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
          const filePath = `descriptions/${Date.now()}-${i}-${safeName}`
          const { error: descUploadError } = await supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .upload(filePath, file, { upsert: true, contentType: file.type })
          if (descUploadError) {
            console.error('[Admin Save] Description image upload error:', descUploadError, 'for', filePath)
                  descriptionUploadResults.push({
                    fileName: file.name,
                    originalSize: file.size,
                    optimizedSize: file.size,
                    savingsPercent: '0',
                    success: false,
                    error: 'Upload failed'
                  })
          } else {
            const { data: publicData } = supabase
              .storage
              .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
              .getPublicUrl(filePath)
            console.log('[Admin Save] Description public URL for', filePath, '=>', publicData?.publicUrl)
            imageUrl = publicData?.publicUrl || imageUrl
                  descriptionUploadResults.push({
                    fileName: file.name,
                    originalSize: file.size,
                    optimizedSize: file.size,
                    savingsPercent: '0',
                    success: false,
                    error: 'Fallback upload (no optimization)'
                  })
                }
              }
            } catch (error) {
              console.error('[Admin Save] Description upload error:', error, 'for', file.name)
              // Fallback to regular upload
          const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
              const filePath = `descriptions/${Date.now()}-${i}-${safeName}`
              const { error: descUploadError } = await supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .upload(filePath, file, { upsert: true, contentType: file.type })
              if (descUploadError) {
                console.error('[Admin Save] Description image upload error:', descUploadError, 'for', filePath)
                descriptionUploadResults.push({
                  fileName: file.name,
                  originalSize: file.size,
                  optimizedSize: file.size,
                  savingsPercent: '0',
                  success: false,
                  error: 'Upload failed'
                })
          } else {
            const { data: publicData } = supabase
              .storage
              .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
              .getPublicUrl(filePath)
                console.log('[Admin Save] Description public URL for', filePath, '=>', publicData?.publicUrl)
            imageUrl = publicData?.publicUrl || imageUrl
                descriptionUploadResults.push({
                  fileName: file.name,
                  originalSize: file.size,
                  optimizedSize: file.size,
                  savingsPercent: '0',
                  success: false,
                  error: 'Fallback upload (no optimization)'
                })
              }
            }
          }
          descriptionPublicUrls.push(imageUrl || null)
          updatedDescriptionParagraphs.push({ ...para, image: imageUrl || '', uploadedFile: null })
        }
        
        // Show summary alert for description images if any were uploaded
        if (descriptionUploadResults.length > 0) {
          const successfulDescUploads = descriptionUploadResults.filter(r => r.success)
          const failedDescUploads = descriptionUploadResults.filter(r => !r.success)
          
          let descAlertMessage = `📸 Description Images Upload Summary\n\n`
          
          if (successfulDescUploads.length > 0) {
            const totalSize = successfulDescUploads.reduce((sum, r) => sum + r.originalSize, 0)
            
            descAlertMessage += `✅ Successfully Uploaded: ${successfulDescUploads.length} images\n`
            descAlertMessage += `📏 Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n\n`
            
            // Add individual file details
            successfulDescUploads.forEach(result => {
              const fileMB = (result.originalSize / 1024 / 1024).toFixed(2)
              descAlertMessage += `📁 ${result.fileName}: ${fileMB} MB\n`
            })
          }
          
          if (failedDescUploads.length > 0) {
            descAlertMessage += `\n❌ Failed: ${failedDescUploads.length} images\n`
            failedDescUploads.forEach(result => {
              const sizeMB = (result.originalSize / 1024 / 1024).toFixed(2)
              descAlertMessage += `📁 ${result.fileName}: ${sizeMB} MB (${result.error})\n`
            })
          }
          
          descAlertMessage += `\n🎯 Images converted to WebP format for better performance!`
          
          alert(descAlertMessage)
        }



              // 4) Build payload with URL images (typed URLs + uploaded URLs)
      console.log('[Admin Save] Characteristics being sent:', {
        firmnessScale,
        supportLevel,
        pressureReliefLevel,
        airCirculationLevel,
        durabilityLevel
      })
      
      // Debug: Log what we're sending for reasons to love
      console.log('[Admin Save] selectedReasonsToLove being sent:', selectedReasonsToLove)
      
      const payload = {
        category: selectedCategory,
        name,
        rating,
        headline,
        longDescription,
        warrantyDeliveryLine,
        firmnessScale,
        supportLevel,
        pressureReliefLevel,
        airCirculationLevel,
        durabilityLevel,
        isKidsCategory,
        isSalesCategory,
        selectedBunkbedMattresses,
        // Include URL-based images so backend can persist them
        images: [...images, ...uploadedUrls],
        uploadedFiles: [],
        mainImageIndex: mainImageIndex,
        variants,
        selectedFeatures,
        selectedReasonsToLove,
        customReasonsToBuy: reasonsToBuy,
        descriptionParagraphs: updatedDescriptionParagraphs.map(para => ({
          heading: para.heading,
          content: para.content,
          image: para.image,
          uploadedFile: null
        })),
        faqs,
        warrantySections,
        careInstructions,
        trialInformation,
        trialInformationHeading,
        dimensions: {
          ...dimensions,
          // Include editable headings
          mattressSizeHeading: dimensions.mattressSizeHeading,
          maximumHeightHeading: dimensions.maximumHeightHeading,
          weightCapacityHeading: dimensions.weightCapacityHeading,
          pocketSpringsHeading: dimensions.pocketSpringsHeading,
          comfortLayerHeading: dimensions.comfortLayerHeading,
          supportLayerHeading: dimensions.supportLayerHeading,
          // Include dimension disclaimer
          dimensionDisclaimer: dimensions.dimensionDisclaimer
        },
        importantNotices: importantNotices.map(notice => ({
          noticeText: notice.noticeText,
          sortOrder: notice.sortOrder
        })),

        popularCategories: getPopularCategories().filter(cat => selectedPopularCategories.includes(cat.name)),
        recommendedProducts: selectedRecommendedProducts.map(product => ({
          recommendedProductId: product.id,
          categoryName: product.category,
          sortOrder: 0
        })),
        selectedAttributes: {
          useColor,
          useDepth,
          useSize,
          useFirmness,
        },
        badges: badges,
        selectedGiftProduct: selectedGiftProduct
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[Admin Save] API error response:', errorData)
        throw new Error(errorData.error || 'Failed to save product')
      }

      const result = await response.json()
      console.log('[Admin Save] Product created result:', result)
      
      // Show single success message and automatically clear form
      alert('Product is saved')
      resetForm()
      
    } catch (error) {
      console.error('Error saving product:', error)
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Category selection
  const [selectedCategory, setSelectedCategory] = useState('mattresses')
  

  
  const categories = [
    { value: 'mattresses', label: 'Mattresses' },
    { value: 'beds', label: 'Beds' },
    { value: 'sofas', label: 'Sofas' },
    { value: 'pillows', label: 'Pillows' },
    { value: 'toppers', label: 'Toppers' },
    { value: 'bunkbeds', label: 'Bunk Beds' }
  ]

  // Bunkbed mattress selection - now populated from database
  const [selectedBunkbedMattresses, setSelectedBunkbedMattresses] = useState<string[]>([])
  const [availableMattresses, setAvailableMattresses] = useState<Array<{ id: string; name: string; size: string }>>([])
  const [loadingBunkbedMattresses, setLoadingBunkbedMattresses] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Function to fetch real mattresses for bunkbed selection
  const fetchBunkbedMattresses = async () => {
    if (selectedCategory === 'bunkbeds') {
      setLoadingBunkbedMattresses(true)
      try {
        console.log('Fetching mattresses for bunkbed selection...')
        const response = await fetch('/api/products/recommendations?category=mattresses&limit=20')
        
        if (response.ok) {
          const data = await response.json()
          console.log('Bunkbed mattresses loaded:', data.products?.length || 0)
          
          // Transform the data to match the expected format
          const transformedMattresses = data.products?.map((product: any) => ({
            id: product.id,
            name: product.name,
            size: product.size || 'Standard'
          })) || []
          
          setAvailableMattresses(transformedMattresses)
        } else {
          console.error('Failed to fetch bunkbed mattresses:', response.status)
          setAvailableMattresses([])
        }
      } catch (error) {
        console.error('Error fetching bunkbed mattresses:', error)
        setAvailableMattresses([])
      } finally {
        setLoadingBunkbedMattresses(false)
      }
    }
  }

  // Fetch bunkbed mattresses when category is bunkbeds
  useEffect(() => {
    if (selectedCategory === 'bunkbeds') {
      fetchBunkbedMattresses()
    }
  }, [selectedCategory])

  // Popular categories data based on product category
  const getPopularCategories = () => {
    if (selectedCategory === 'beds') {
      return [
        { name: "Luxury Beds", filterKey: "Bed Type", filterValue: "Luxury" },
        { name: "Fabric Beds", filterKey: "Bed Type", filterValue: "Fabric" },
        { name: "Wooden Beds", filterKey: "Bed Type", filterValue: "Wooden" },
        { name: "Children Beds", filterKey: "Bed Type", filterValue: "Children" },
        { name: "Bunk Beds", filterKey: "Bed Type", filterValue: "Bunk" },
        { name: "Sofa Beds", filterKey: "Bed Type", filterValue: "Sofa" },
        { name: "Storage Beds", filterKey: "Bed Type", filterValue: "Storage" },
        { name: "Ottoman Beds", filterKey: "Bed Type", filterValue: "Ottoman" },
      ]
    } else if (selectedCategory === 'sofas') {
      return [
        { name: "L Shape Sofa", filterKey: "Sofa Type", filterValue: "L Shape" },
        { name: "3 Seater Sofa", filterKey: "Sofa Type", filterValue: "3 Seater" },
        { name: "Sofa Bed", filterKey: "Sofa Type", filterValue: "Sofa Bed" },
        { name: "2 Seater Sofa", filterKey: "Sofa Type", filterValue: "2 Seater" },
        { name: "Recliner Sofa", filterKey: "Sofa Type", filterValue: "Recliner" },
        { name: "Corner Sofa", filterKey: "Sofa Type", filterValue: "Corner" },
        { name: "Fabric Sofa", filterKey: "Sofa Material", filterValue: "Fabric" },
        { name: "Leather Sofa", filterKey: "Sofa Material", filterValue: "Leather" },
        { name: "New In", filterKey: "Status", filterValue: "New" },
        { name: "Sale", filterKey: "Status", filterValue: "Sale" },
        { name: "Clearance", filterKey: "Status", filterValue: "Clearance" },
      ]
    } else if (selectedCategory === 'kids') {
      return [
        { name: "Mattresses", filterKey: "Kids Category", filterValue: "Mattresses" },
        { name: "Beds", filterKey: "Kids Category", filterValue: "Beds" },
        { name: "Bunk Beds", filterKey: "Kids Category", filterValue: "Bunk Beds" },
        { name: "New In", filterKey: "Kids Status", filterValue: "New" },
        { name: "Clearance", filterKey: "Kids Status", filterValue: "Clearance" },
        { name: "Sale", filterKey: "Kids Status", filterValue: "Sale" },
      ]
    } else {
      // Default mattress categories for other pages
      return [
        { name: "Most Cooling", filterKey: "Features", filterValue: "Cooling" },
        { name: "Soft Comfort", filterKey: "Firmness", filterValue: "Soft" },
        { name: "Firm Comfort", filterKey: "Firmness", filterValue: "Firm" },
        { name: "Medium Comfort", filterKey: "Firmness", filterValue: "Medium" },
        { name: "Super Firm", filterKey: "Features", filterValue: "Heavy Duty" },
        { name: "Most Support", filterKey: "Features", filterValue: "Extra Support" },
        { name: "Luxury", filterKey: "Mattress Type", filterValue: "Luxury" },
        { name: "Hybrid", filterKey: "Mattress Type", filterValue: "Hybrid" },
        { name: "Pocket Sprung", filterKey: "Mattress Type", filterValue: "Foam" },
        { name: "Coil Sprung", filterKey: "Mattress Type", filterValue: "Latex" },
        { name: "Kids", filterKey: "Mattress Type", filterValue: "Kids" },
        { name: "Memory Foam", filterKey: "Mattress Type", filterValue: "Standard Foam" },
        { name: "Latex Foam", filterKey: "Mattress Type", filterValue: "Latex Foam" },
      ]
    }
  }

  const togglePopularCategory = (categoryName: string) => {
    setSelectedPopularCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    )
  }

  return (
    <div className="mt-4 space-y-6 max-w-full overflow-hidden">
      {/* Category Selection */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Product Category</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="category" className="text-sm font-medium mb-2 block">Select Product Category</Label>
                         <select
               id="category"
               value={selectedCategory}
               onChange={(e) => handleCategoryChange(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            <strong>Current Category:</strong> {categories.find(c => c.value === selectedCategory)?.label}
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All form fields below are universal and work for any product category. 
            The category selection above determines how the product will be categorized in the system.
          </p>
        </div>
      </Card>

      {/* Product Images - Moved to top for better flow */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Product Images</h2>
        <p className="text-sm text-gray-600 mb-4">Add product images that will be displayed prominently on the product page.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold mb-2">Product Images</div>
            
            {/* URL Input */}
            <div className="mb-4">
              <Label className="text-sm text-gray-600 mb-2 block">Add Image URLs</Label>
              <div className="flex gap-2 mb-3">
                <Input placeholder="https://..." value={newImage} onChange={e => setNewImage(e.target.value)} />
                <Button onClick={() => { if (newImage.trim()) { setImages(imgs => [...imgs, newImage.trim()]); setNewImage('') } }}>Add URL</Button>
              </div>
              {images.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Image Sequence (drag to reorder)
                  </div>
                <ul className="space-y-2">
                  {images.map((url, idx) => (
                      <li 
                        key={`${url}-${idx}`} 
                        className={`flex items-center justify-between gap-2 p-3 rounded border transition-all duration-200 cursor-move ${
                          draggedIndex === idx 
                            ? 'bg-blue-100 border-blue-300 shadow-lg transform scale-105' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        draggable
                        onDragStart={(e) => {
                          setDraggedIndex(idx)
                          e.dataTransfer.setData('text/plain', idx.toString())
                          e.dataTransfer.effectAllowed = 'move'
                        }}
                        onDragEnd={() => {
                          setDraggedIndex(null)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.dataTransfer.dropEffect = 'move'
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'))
                          const newImages = [...images]
                          const draggedItem = newImages[draggedIndex]
                          newImages.splice(draggedIndex, 1)
                          newImages.splice(idx, 0, draggedItem)
                          setImages(newImages)
                          
                          setDraggedIndex(null)
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex flex-col gap-1">
                            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                              {idx + 1}
                            </div>
                            <div className="text-xs text-gray-500 text-center">Drag</div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (idx > 0) {
                                  const newImages = [...images]
                                  const temp = newImages[idx]
                                  newImages[idx] = newImages[idx - 1]
                                  newImages[idx - 1] = temp
                                  setImages(newImages)
                                  
                                }
                              }}
                              disabled={idx === 0}
                              className="w-6 h-4 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center text-xs"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (idx < images.length - 1) {
                                  const newImages = [...images]
                                  const temp = newImages[idx]
                                  newImages[idx] = newImages[idx + 1]
                                  newImages[idx + 1] = temp
                                  setImages(newImages)
                                  
                                }
                              }}
                              disabled={idx === images.length - 1}
                              className="w-6 h-4 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center text-xs"
                            >
                              ↓
                            </button>
                          </div>
                          <img 
                            src={url} 
                            alt={`Product image ${idx + 1}`} 
                            className="w-12 h-12 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm text-gray-700">{url}</div>
                            <div className="text-xs text-gray-500">Position {idx + 1}</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setImages(imgs => imgs.filter((_, i) => i !== idx))
                          }}>Remove</Button>
                        </div>
                    </li>
                  ))}
                </ul>
                </div>
              )}
            </div>


            {/* File Upload */}
            <div className="mb-4">
              <Label className="text-sm text-gray-600 mb-2 block">Upload Image Files</Label>
              <div className="flex gap-2 mb-3">
                <Input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {uploadedFiles.length > 0 && (
                <ul className="space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <li key={`${file.name}-${idx}`} className={`flex items-center justify-between gap-2 p-2 rounded border-2 transition-all ${
                      mainImageIndex === idx 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-blue-50 border-transparent hover:border-blue-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-800">{file.name}</span>
                            {mainImageIndex === idx && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                                MAIN
                              </span>
                            )}
                      </div>
                          <span className="text-xs text-blue-600 block">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          
                          {/* WebP settings removed in add form; auto-convert on save */}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {mainImageIndex !== idx && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setAsMainImage(idx)}
                            className="text-xs"
                          >
                            Set as Main
                          </Button>
                        )}
                      <Button variant="ghost" size="sm" onClick={() => removeUploadedFile(idx)}>Remove</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Summary */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Total Images:</strong> {images.length + uploadedFiles.length}
                {images.length > 0 && <span className="ml-2">• URLs: {images.length}</span>}
                {uploadedFiles.length > 0 && <span className="ml-2">• Files: {uploadedFiles.length}</span>}
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 text-green-600 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Main Image: {uploadedFiles[mainImageIndex]?.name || 'None selected'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

             {/* Step 1: Attribute Selection */}
       {!attributesConfirmed && (
         <Card className="p-4">
           <h2 className="text-xl font-semibold mb-2">Step 1: Select Variant Attributes</h2>
           <p className="text-sm text-gray-600 mb-4">Check which attributes this {categories.find(c => c.value === selectedCategory)?.label?.toLowerCase()} will have variants for:</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
             <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
               <input 
                 type="checkbox" 
                 className="h-4 w-4" 
                 checked={useColor} 
                 onChange={e => setUseColor(e.target.checked)} 
               />
               <span className="font-medium">Color</span>
             </label>
             
             {/* Only show Depth and Firmness for non-bunkbed categories */}
             {selectedCategory !== 'bunkbeds' && (
               <>
                 <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                   <input 
                     type="checkbox" 
                     className="h-4 w-4" 
                     checked={useDepth} 
                     onChange={e => setUseDepth(e.target.checked)} 
                   />
                   <span className="font-medium">Depth</span>
                 </label>
                 
                 <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                   <input 
                     type="checkbox" 
                     className="h-4 w-4" 
                     checked={useFirmness} 
                     onChange={e => setUseFirmness(e.target.checked)} 
                   />
                   <span className="font-medium">Firmness</span>
                 </label>
               </>
             )}
             
             <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
               <input 
                 type="checkbox" 
                 className="h-4 w-4" 
                 checked={useSize} 
                 onChange={e => setUseSize(e.target.checked)} 
               />
               <span className="font-medium">Size</span>
             </label>
           </div>

           {/* Bunkbed Mattress Selection - Only show for bunkbeds */}
           {selectedCategory === 'bunkbeds' && (
             <div className="mt-6 p-4 border rounded-lg bg-blue-50">
               <h3 className="text-lg font-semibold mb-3 text-blue-800">Bunkbed Mattress Selection</h3>
               <p className="text-sm text-blue-700 mb-4">
                 Select mattresses that will be available for this bunkbed. These will appear in the "choose colour and other option" popup for customers.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                 {loadingBunkbedMattresses ? (
                   <div className="col-span-full p-4 text-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                     <div className="text-sm text-gray-600">Loading mattresses...</div>
                   </div>
                 ) : availableMattresses.length > 0 ? (
                   availableMattresses.map((mattress) => (
                     <label key={mattress.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                       selectedBunkbedMattresses.includes(mattress.id) 
                         ? 'border-blue-400 bg-blue-100' 
                         : 'border-gray-200 bg-white hover:bg-gray-50'
                     }`}>
                       <input 
                         type="checkbox" 
                         className="h-4 w-4 text-blue-600" 
                         checked={selectedBunkbedMattresses.includes(mattress.id)} 
                         onChange={() => toggleBunkbedMattress(mattress.id)} 
                       />
                       <div className="flex-1">
                         <div className="font-medium text-gray-800">{mattress.name}</div>
                         <div className="text-sm text-gray-600">Size: {mattress.size}</div>
                       </div>
                     </label>
                   ))
                 ) : (
                   <div className="col-span-full p-4 text-center text-gray-500">
                     No mattresses found. Please ensure you have mattress products in your database.
                   </div>
                 )}
               </div>
               
               {selectedBunkbedMattresses.length > 0 && (
                 <div className="mt-4 p-3 bg-white border border-blue-200 rounded-lg">
                   <div className="text-sm font-medium text-blue-800 mb-2">Selected Mattresses:</div>
                   <div className="text-sm text-blue-700">
                     {getSelectedMattressNames().join(', ')}
                   </div>
                 </div>
               )}
             </div>
           )}
           
           <Button onClick={confirmAttributes} className="bg-blue-600 hover:bg-blue-700 mt-4">
             OK - Continue to Variants
           </Button>
         </Card>
       )}

      {/* Step 2: Variants Table (only shown after attributes confirmed) */}
      {attributesConfirmed && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Step 2: Add Variants</h2>
          <p className="text-sm text-gray-600 mb-4">Add variant rows and fill in the details for each combination of this {categories.find(c => c.value === selectedCategory)?.label?.toLowerCase()}.</p>
          <div className="mb-3"><Button onClick={addVariant}>Add blank row</Button></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-2 min-w-[80px]">SKU</th>
                  {useColor && <th className="p-2 min-w-[100px]">Color</th>}
                  {useDepth && (selectedCategory || '').toLowerCase() !== 'sofas' && <th className="p-2 min-w-[80px]">Depth</th>}
                  {useFirmness && <th className="p-2 min-w-[100px]">Firmness</th>}
                  {useSize && <th className="p-2 min-w-[100px]">Size</th>}
                  <th className="p-2 min-w-[80px]">Length</th>
                  <th className="p-2 min-w-[80px]">{(selectedCategory || '').toLowerCase() === 'sofas' ? 'Depth' : 'Width'}</th>
                  <th className="p-2 min-w-[80px]">Height</th>
                  <th className="p-2 min-w-[80px]">Available</th>
                  <th className="p-2 min-w-[100px]">Original Price</th>
                  <th className="p-2 min-w-[100px]">Now Price</th>
                  <th className="p-2 min-w-[120px]">Color</th>
                  <th className="p-2 min-w-[80px]"></th>
                </tr>
              </thead>
              <tbody>
                {variants.map(v => (
                  <tr key={v.id} className="border-t">
                    <td className="p-2 min-w-[80px]"><Input value={v.sku} onChange={e => updateVariant(v.id, { sku: e.target.value })} placeholder="SKU" /></td>
                    {useColor && (
                    <td className="p-2 min-w-[100px]">
                        <select 
                          value={v.color || ''} 
                          onChange={e => updateVariant(v.id, { color: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select color</option>
                          <option>GREY</option>
                          <option>LIGHT GREY</option>
                          <option>DARK GREY</option>
                          <option>BROWN</option>
                          <option>LIGHT BROWN</option>
                          <option>DARK BROWN</option>
                          <option>BLACK</option>
                          <option>WHITE</option>
                          <option>BEIGE</option>
                          <option>LILAC</option>
                          <option>CREAM</option>
                          <option>RED</option>
                          <option>ORANGE</option>
                          <option>NAVY BLUE</option>
                          <option>DARK BLUE</option>
                          <option>LIGHT BLUE</option>
                          <option>BLUE</option>
                          <option>TEAL</option>
                          <option>GREEN</option>
                          <option>LIGHT GREEN</option>
                          <option>DARK GREEN</option>
                          <option>OLIVE GREEN</option>
                          <option>YELLOW</option>
                          <option>PINK</option>
                          <option>PURPLE</option>
                          <option>SOCCER BLUE</option>
                          <option>HONEY WAX</option>
                          <option>PINE WAX</option>
                          <option>PINE</option>
                          <option>SOCCER RED</option>
                          <option>SOCCER BLACK</option>
                          <option>TAUPE</option>
                          <option>TORQUOISE</option>
                          <option>AQUA BLUE</option>
                          <option>LIME</option>
                        </select>
                      </td>
                    )}
                    {useDepth && (selectedCategory || '').toLowerCase() !== 'sofas' && <td className="p-2 min-w-[80px]"><Input value={v.depth || ''} onChange={e => updateVariant(v.id, { depth: e.target.value })} placeholder="Depth" /></td>}
                    {useFirmness && <td className="p-2 min-w-[100px]"><Input value={v.firmness || ''} onChange={e => updateVariant(v.id, { firmness: e.target.value })} placeholder="Firmness" /></td>}
                    {useSize && <td className="p-2 min-w-[100px]"><Input value={v.size || ''} onChange={e => updateVariant(v.id, { size: e.target.value })} placeholder="Size" /></td>}
                    <td className="p-2 min-w-[80px]"><Input value={v.length || ''} onChange={e => updateVariant(v.id, { length: e.target.value })} placeholder="Length" /></td>
                    <td className="p-2 min-w-[80px]"><Input value={((selectedCategory || '').toLowerCase() === 'sofas' ? v.depth : v.width) || ''} onChange={e => ((selectedCategory || '').toLowerCase() === 'sofas' ? updateVariant(v.id, { depth: e.target.value }) : updateVariant(v.id, { width: e.target.value }))} placeholder={(selectedCategory || '').toLowerCase() === 'sofas' ? 'Depth' : 'Width'} /></td>
                    <td className="p-2 min-w-[80px]"><Input value={v.height || ''} onChange={e => updateVariant(v.id, { height: e.target.value })} placeholder="Height" /></td>
                    <td className="p-2 min-w-[80px]">
                      <select 
                        value={v.availability ? 'true' : 'false'} 
                        onChange={e => updateVariant(v.id, { availability: e.target.value === 'true' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="p-2 min-w-[100px]"><Input type="number" value={v.originalPrice ?? ''} onChange={e => updateVariant(v.id, { originalPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="Original" /></td>
                    <td className="p-2 min-w-[100px]"><Input type="number" value={v.currentPrice ?? ''} onChange={e => updateVariant(v.id, { currentPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="Now" /></td>
                    <td className="p-2 min-w-[120px]">
                      <div className="space-y-2">
                        {/* Color Picker */}
                        <ColorPicker
                          value={v.color || ''}
                          onChange={(color) => updateVariant(v.id, { color })}
                          placeholder="Select color"
                        />
                        
                        {/* Premium Color Preview */}
                        {v.color && (
                          <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white shadow-sm">
                            <div 
                              className="w-6 h-6 rounded-lg border shadow-sm relative overflow-hidden group"
                              style={{ 
                                backgroundColor: getHexForColorName(v.color) || v.color,
                                borderColor: '#e5e7eb'
                              }}
                            >
                              {/* Premium shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"></div>
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30"></div>
                          </div>
                            <span className="text-xs font-medium text-gray-700 truncate">{v.color}</span>
                        </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2"><Button variant="ghost" onClick={() => removeVariant(v.id)}>Remove</Button></td>
                  </tr>
                ))}
                {variants.length === 0 && (
                  <tr>
                                          <td colSpan={1 + (useColor ? 1 : 0) + (useDepth && (selectedCategory || '').toLowerCase() !== 'sofas' ? 1 : 0) + (useFirmness ? 1 : 0) + (useSize ? 1 : 0) + 5} className="p-4 text-gray-500">
                        No variants yet. Click "Add blank row" to start.
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" onClick={() => setAttributesConfirmed(false)}>
              ← Back to Attribute Selection
            </Button>
          </div>
        </Card>
      )}

             <Card className="p-4">
         <h2 className="text-xl font-semibold mb-4">Features & Reasons</h2>
         <CheckboxGrid 
           label={`${categories.find(c => c.value === selectedCategory)?.label} features`} 
           options={getFeaturesForCategory(selectedCategory)} 
           selected={selectedFeatures} 
           onChange={setSelectedFeatures} 
         />
         <div className="mb-4">
           <Label className="text-sm font-medium mb-2 block">
             {`Features you will love - Select from available ${categories.find(c => c.value === selectedCategory)?.label?.toLowerCase()} features:`}
           </Label>
           
           {/* Feature Cards Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
             {getFeatureCardsForCategory(selectedCategory).map((feature) => {
               const isSelected = selectedReasonsToLove.some(item => item.reason === feature.title)
               const IconComponent = getIconComponentAdmin(feature.icon)
               
               return (
                 <div
                   key={feature.id}
                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                     isSelected
                       ? 'border-orange-500 bg-orange-50 shadow-md'
                       : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                   }`}
                   onClick={() => {
                     if (isSelected) {
                       // Remove if already selected
                       const index = selectedReasonsToLove.findIndex(item => item.reason === feature.title)
                       if (index !== -1) {
                         removeReasonToLove(index)
                       }
                     } else {
                       // Add if not selected
                       addReasonToLove(feature.title, feature.description, '', feature.icon)
                     }
                   }}
                 >
                   <div className="text-center">
                     <div className="w-12 h-12 mx-auto mb-3 text-orange-500 flex items-center justify-center">
                       <IconComponent />
                     </div>
                     <h3 className="text-sm font-semibold text-gray-900 mb-2">{feature.title}</h3>
                     <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                   </div>
                 </div>
               )
             })}
           </div>
           
           {/* Display selected features with custom description inputs */}
           {selectedReasonsToLove.length > 0 && (
             <div className="mt-4 space-y-3">
               <Label className="text-sm font-medium">Customize descriptions for selected features (optional):</Label>
               {selectedReasonsToLove.map((item, index) => (
                 <div key={index} className="p-3 border rounded-lg bg-gray-50">
                   <div className="flex items-center justify-between mb-2">
                     <span className="font-medium text-sm">{item.reason}</span>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => removeReasonToLove(index)}
                       className="text-red-600 hover:text-red-700"
                     >
                       Remove
                     </Button>
                   </div>
                   <Textarea
                     placeholder="Customize the description or leave as default..."
                     value={item.description}
                     onChange={(e) => updateReasonToLoveDescription(index, e.target.value)}
                     rows={2}
                     className="w-full"
                   />
                   <div className="mt-3">
                     <Label className="text-sm font-medium mb-2 block">Small Text (displayed below icon)</Label>
                     <Input
                       placeholder="Enter small descriptive text..."
                       value={item.smalltext || ''}
                       onChange={(e) => updateReasonToLoveSmalltext(index, e.target.value)}
                     className="w-full"
                   />
                     <p className="text-xs text-gray-500 mt-1">
                       This text will appear below the icon in the feature card on the product page.
                     </p>
                   </div>
                   <p className="text-xs text-gray-500 mt-1">
                     Leave empty to use the default description, or customize it for this specific product.
                   </p>
                 </div>
               ))}
             </div>
           )}
         </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Reasons to buy (add as many as needed)</div>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Add a reason to buy" value={newReason} onChange={e => setNewReason(e.target.value)} />
            <Button onClick={() => { if (newReason.trim()) { setReasonsToBuy(r => [...r, newReason.trim()]); setNewReason('') } }}>Add</Button>
          </div>
          {reasonsToBuy.length > 0 && (
            <ul className="list-disc pl-6 space-y-1">
              {reasonsToBuy.map((r, i) => (
                <li key={`${r}-${i}`} className="flex items-center justify-between gap-2">
                  <span>{r}</span>
                  <Button variant="ghost" onClick={() => setReasonsToBuy(rs => rs.filter((_, idx) => idx !== i))}>Remove</Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create a custom feature card */}
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Add a custom feature card</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                placeholder="e.g., Breathable Cover"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Description</Label>
              <Input
                placeholder="Short description that appears in the card"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <Label className="text-xs">Small Text (optional)</Label>
              <Input
                placeholder="Small subtext displayed under the icon"
                value={trialInformation}
                onChange={(e) => setTrialInformation(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3">
            <Button
              type="button"
              onClick={() => {
                const title = newReason.trim()
                if (!title) return
                setSelectedReasonsToLove(prev => [...prev, { reason: title, description: headline.trim(), smalltext: trialInformation.trim(), icon: 'check' }])
                setNewReason('')
                setHeadline('')
                setTrialInformation('')
              }}
            >
              Add Feature Card
            </Button>
          </div>
        </div>
      </Card>

      {/* Description Paragraphs with Images */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Product Description</h2>
        <p className="text-sm text-gray-600 mb-4">Add 3 description paragraphs with images for the product page.</p>
        
        {descriptionParagraphs.map((para, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Paragraph {index + 1} Heading</Label>
                <Input 
                  value={para.heading} 
                  onChange={e => updateDescriptionParagraph(index, 'heading', e.target.value)}
                  placeholder="Enter heading..."
                />
                <Label className="text-sm font-medium mb-2 block mt-3">Content</Label>
                <Textarea 
                  value={para.content} 
                  onChange={e => updateDescriptionParagraph(index, 'content', e.target.value)}
                  placeholder="Enter paragraph content..."
                  rows={4}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Image</Label>
                
                {/* URL Input */}
                <div className="mb-3">
                  <Label className="text-xs text-gray-600 mb-1 block">Image URL</Label>
                  <Input 
                    value={para.image} 
                    onChange={e => updateDescriptionParagraph(index, 'image', e.target.value)}
                    placeholder="https://..."
                    disabled={!!para.uploadedFile}
                  />
                </div>

                {/* File Upload */}
                <div className="mb-3">
                  <Label className="text-xs text-gray-600 mb-1 block">Or Upload File</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleDescriptionFileUpload(index, e)}
                    className="file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Image Preview */}
                {(para.image || para.uploadedFile) && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    {para.uploadedFile ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(para.uploadedFile)} 
                          alt={para.heading} 
                          className="w-full h-32 object-cover rounded" 
                        />
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{para.uploadedFile.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeDescriptionFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove File
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <img src={para.image} alt={para.heading} className="w-full h-32 object-cover rounded" />
                    )}
                  </div>
                )}

                {/* Clear URL when file is uploaded */}
                {para.uploadedFile && para.image && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    File uploaded - URL will be cleared when saved
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* FAQ Section */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <p className="text-sm text-gray-600 mb-4">Add Q&A pairs for this product.</p>
        
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <Label className="text-sm font-medium mb-2 block">Question</Label>
              <Input 
                value={newFaq.question} 
                onChange={e => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter question..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Answer</Label>
              <Input 
                value={newFaq.answer} 
                onChange={e => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter answer..."
              />
            </div>
          </div>
          <Button onClick={addFaq} className="w-full">Add FAQ</Button>
        </div>
        
        {faqs.map((faq, index) => (
          <div key={index} className="mb-3 p-3 border rounded-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-gray-800 mb-1">Q: {faq.question}</div>
                <div className="text-sm text-gray-600">A: {faq.answer}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFaq(index)}>Remove</Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Warranty Section */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Warranty Information</h2>
        <p className="text-sm text-gray-600 mb-4">Add 3 warranty sections with headings and content.</p>
        
        {warrantySections.map((section, index) => (
          <div key={index} className="mb-4 p-3 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Section {index + 1} Heading</Label>
                <Input 
                  value={section.heading} 
                  onChange={e => updateWarrantySection(index, 'heading', e.target.value)}
                  placeholder="Enter heading..."
                />
               </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Content</Label>
                <Textarea 
                  value={section.content} 
                  onChange={e => updateWarrantySection(index, 'content', e.target.value)}
                  placeholder="Enter warranty content..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Care Instructions */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Care Instructions</h2>
        <p className="text-sm text-gray-600 mb-4">Enter care and maintenance instructions for the product.</p>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Care Instructions</Label>
          <Textarea 
            value={careInstructions} 
            onChange={e => setCareInstructions(e.target.value)}
            placeholder="e.g., Rotate your mattress every 3-6 months, use a mattress protector, and clean spills immediately. The bamboo cover is removable and machine washable."
            rows={4}
          />
          </div>
      </Card>

      {/* Trial Information */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Trial Information</h2>
        <p className="text-sm text-gray-600 mb-4">Enter the trial period information that will appear in the Warranty & Care section.</p>
        
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Trial Heading</Label>
          <Input 
            value={trialInformationHeading}
            onChange={e => setTrialInformationHeading(e.target.value)}
            placeholder="e.g., Trial"
          />
        </div>
        <div>
          <Label className="text-sm font-medium mb-2 block">Trial Information</Label>
          <Textarea 
            value={trialInformation} 
            onChange={e => setTrialInformation(e.target.value)}
            placeholder="e.g., Try your mattress risk-free for 100 nights. If you are not completely satisfied, return it for a full refund. No questions asked."
            rows={3}
          />
        </div>
      </Card>

      {/* Dimensions & Specifications */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Dimensions & Specifications</h2>
        <p className="text-sm text-gray-600 mb-4">Enter product dimensions and technical specifications. You can customize the headings for each field.</p>
        

        
        {/* Section 1: Basic Dimensions */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Checkbox
              id="show_basic_dimensions_main"
              checked={dimensions.show_basic_dimensions}
              onCheckedChange={(checked) => updateDimension('show_basic_dimensions', checked as boolean)}
            />
            <label htmlFor="show_basic_dimensions_main" className="text-sm font-medium text-gray-700">
              Show Basic Dimensions Section
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Height</Label>
            <Input 
              value={dimensions.height} 
              onChange={e => updateDimension('height', e.target.value)}
              placeholder="Enter height"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Length</Label>
            <Input 
              value={dimensions.length} 
              onChange={e => updateDimension('length', e.target.value)}
              placeholder="Enter length"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Width</Label>
            <Input 
              value={dimensions.width} 
              onChange={e => updateDimension('width', e.target.value)}
              placeholder="Enter width"
            />
            </div>
          </div>
          </div>
          
        {/* Section 2: Mattress Specifications */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Checkbox
              id="show_mattress_specs_main"
              checked={dimensions.show_mattress_specs}
              onCheckedChange={(checked) => updateDimension('show_mattress_specs', checked as boolean)}
            />
            <label htmlFor="show_mattress_specs_main" className="text-sm font-medium text-gray-700">
              Show Mattress Specifications Section
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mattress Size with Editable Heading */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium block">Heading</Label>
              <Input 
                value={dimensions.mattressSizeHeading} 
                onChange={e => updateDimension('mattressSizeHeading', e.target.value)}
                placeholder="Mattress Size"
                className="text-xs"
              />
            </div>
            <Input 
              value={dimensions.mattressSize} 
              onChange={e => updateDimension('mattressSize', e.target.value)}
              placeholder="135cm x L 190cm cm"
            />
          </div>
          
          {/* Maximum Height with Editable Heading */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium block">Heading</Label>
              <Input 
                value={dimensions.maximumHeightHeading} 
                onChange={e => updateDimension('maximumHeightHeading', e.target.value)}
                placeholder="Maximum Height"
                className="text-xs"
              />
            </div>
            <Input 
              value={dimensions.maxHeight} 
              onChange={e => updateDimension('maxHeight', e.target.value)}
              placeholder="25 cm"
            />
          </div>
          
          {/* Weight Capacity with Editable Heading */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium block">Heading</Label>
              <Input 
                value={dimensions.weightCapacityHeading} 
                onChange={e => updateDimension('weightCapacityHeading', e.target.value)}
                placeholder="Weight Capacity"
                className="text-xs"
              />
            </div>
            <Input 
              value={dimensions.weightCapacity} 
              onChange={e => updateDimension('weightCapacity', e.target.value)}
              placeholder="200 kg"
            />
            </div>
          </div>
          </div>
          
        {/* Section 3: Technical Specifications */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Checkbox
              id="show_technical_specs_main"
              checked={dimensions.show_technical_specs}
              onCheckedChange={(checked) => updateDimension('show_technical_specs', checked as boolean)}
            />
            <label htmlFor="show_technical_specs_main" className="text-sm font-medium text-gray-700">
              Show Technical Specifications Section
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pocket Springs with Editable Heading */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium block">Heading</Label>
              <Input 
                value={dimensions.pocketSpringsHeading} 
                onChange={e => updateDimension('pocketSpringsHeading', e.target.value)}
                placeholder="Pocket Springs"
                className="text-xs"
              />
            </div>
            <Input 
              value={dimensions.pocketSprings} 
              onChange={e => updateDimension('pocketSprings', e.target.value)}
              placeholder="1000 count"
            />
          </div>
          
          {/* Comfort Layer with Editable Heading */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium block">Heading</Label>
              <Input 
                value={dimensions.comfortLayerHeading} 
                onChange={e => updateDimension('comfortLayerHeading', e.target.value)}
                placeholder="Comfort Layer"
                className="text-xs"
              />
            </div>
            <Input 
              value={dimensions.comfortLayer} 
              onChange={e => updateDimension('comfortLayer', e.target.value)}
              placeholder="8 cm"
            />
          </div>
          
          {/* Support Layer with Editable Heading */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium block">Heading</Label>
              <Input 
                value={dimensions.supportLayerHeading} 
                onChange={e => updateDimension('supportLayerHeading', e.target.value)}
                placeholder="Support Layer"
                className="text-xs"
              />
            </div>
            <Input 
              value={dimensions.supportLayer} 
              onChange={e => updateDimension('supportLayer', e.target.value)}
              placeholder="17 cm"
            />
            </div>
          </div>
          </div>
          
          {/* Dimension Disclaimer */}
        <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Dimension Disclaimer</Label>
            <Textarea 
              value={dimensions.dimensionDisclaimer} 
              onChange={e => updateDimension('dimensionDisclaimer', e.target.value)}
              placeholder="e.g., All measurements are approximate and may vary slightly."
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">This disclaimer will appear below the dimension specifications on the product page.</p>
        </div>
      </Card>

      {/* Important Notices */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Important Notices</h2>
        <p className="text-sm text-gray-600 mb-4">Add important notices that will appear in the Dimensions section of the product page. These notices will be displayed as bullet points below the technical specifications.</p>
        
        {/* Add Notice Button */}
        <div className="mb-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addImportantNotice}
          >
            Add Notice
          </Button>
        </div>
        
        {/* Notices List */}
        {importantNotices.length > 0 && (
          <div className="space-y-3">
            {importantNotices.map((notice, index) => (
              <div key={notice.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Notice {index + 1}</span>
                    <Input 
                      value={notice.noticeText} 
                      onChange={e => updateImportantNotice(notice.id, 'noticeText', e.target.value)}
                      placeholder="Enter important notice text..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-gray-600">Sort Order:</Label>
                    <Input 
                      type="number"
                      value={notice.sortOrder} 
                      onChange={e => updateImportantNotice(notice.id, 'sortOrder', parseInt(e.target.value) || 0)}
                      className="w-20 text-xs"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImportantNotice(notice.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {importantNotices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No important notices added yet.</p>
            <p className="text-sm">Click "Add Notice" to create your first important notice.</p>
          </div>
        )}
      </Card>

      {/* Popular Categories */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
        <p className="text-sm text-gray-600 mb-4">Select which popular categories this product should appear in. These categories are shown on the product pages.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {getPopularCategories().map((category) => (
            <label key={category.name} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="checkbox" 
                className="h-4 w-4" 
                checked={selectedPopularCategories.includes(category.name)} 
                onChange={() => togglePopularCategory(category.name)} 
              />
              <span className="text-sm font-medium">{category.name}</span>
            </label>
          ))}
        </div>
        
        {selectedPopularCategories.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> {selectedPopularCategories.join(', ')}
            </p>
          </div>
        )}
      </Card>

      {/* Bulk CSV Upload */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Bulk Upload Products (CSV)</h2>
        <p className="text-sm text-gray-600 mb-4">Upload a CSV file to add multiple products at once. We'll parse and show a preview before saving.</p>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const text = await file.text()
              try {
                const parseCSV = (csvText: string): Array<Record<string,string>> => {
                  const rows: string[] = []
                  let current = ''
                  let inQuotes = false
                  for (let i = 0; i < csvText.length; i++) {
                    const char = csvText[i]
                    const next = csvText[i + 1]
                    if (char === '"') {
                      if (inQuotes && next === '"') { current += '"'; i++; continue }
                      inQuotes = !inQuotes
                      continue
                    }
                    if ((char === '\n' || (char === '\r' && next === '\n')) && !inQuotes) {
                      rows.push(current)
                      current = ''
                      if (char === '\r') i++
                      continue
                    }
                    current += char
                  }
                  if (current.length) rows.push(current)

                  const splitRow = (line: string): string[] => {
                    const cols: string[] = []
                    let field = ''
                    let q = false
                    for (let i = 0; i < line.length; i++) {
                      const c = line[i]
                      const n = line[i + 1]
                      if (c === '"') {
                        if (q && n === '"') { field += '"'; i++; continue }
                        q = !q
                        continue
                      }
                      if (c === ',' && !q) { cols.push(field); field = ''; continue }
                      field += c
                    }
                    cols.push(field)
                    return cols.map(v => v.trim())
                  }

                  const headerLine = rows.shift() || ''
                  const headers = splitRow(headerLine).map(h => h.trim())
                  return rows.filter(r => r.trim().length > 0).map(line => {
                    const values = splitRow(line)
                    const obj: Record<string, string> = {}
                    headers.forEach((h, i) => { obj[h] = (values[i] ?? '').trim() })
                    return obj
                  })
                }

                const parsed = parseCSV(text)
                console.log('CSV parsed preview (first 3):', parsed.slice(0,3))
                const res = await fetch('/api/admin/products/bulk', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ rows: parsed })
                })
                let result: any = null
                if (!res.ok) {
                  const txt = await res.text()
                  try { result = JSON.parse(txt) } catch { result = { error: txt.slice(0, 300) } }
                  alert(`Bulk upload failed: ${result.error || 'Unknown error'}`)
                } else {
                  result = await res.json()
                  alert(`Bulk upload complete: ${result.inserted || 0} products added`)
                }
              } catch (err: any) {
                console.error('CSV parse error', err)
                alert('Failed to parse CSV. Please check formatting.')
              }
            }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Expected columns include: name, category, rating, headline, longDescription, price, salePrice, images (pipe-separated), features (pipe-separated), reasonsToLove (pipe-separated), reasonsToBuy (pipe-separated). We will try to map gracefully.
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        <p className="text-sm text-gray-600 mb-4">These products will appear in the sidebar when customers add this product to their basket.</p>
        
        {/* Category Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {categories.map((category) => (
                    <button
              key={category.value}
              onClick={() => openProductSelector(category.value)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center"
            >
              <div className="text-lg font-semibold text-gray-800 mb-1">{category.label}</div>
              <div className="text-sm text-gray-500">
                {(() => {
                  switch (category.value) {
                    case 'mattresses': return mattresses.length;
                    case 'beds': return beds.length;
                    case 'sofas': return sofas.length;
                    case 'pillows': return pillows.length;
                    case 'toppers': return toppers.length;
                    case 'bunkbeds': return mattresses.length; // bunkbeds use mattresses
                    default: return 0;
                  }
                })()} products
                  </div>
                    </button>
          ))}
        </div>

        {/* Selected Recommended Products */}
        {selectedRecommendedProducts.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Selected Recommended Products ({selectedRecommendedProducts.length}/3)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedRecommendedProducts.map((product, index) => (
                <div key={product.id} className="p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                      <div className="text-xs text-gray-500">£{product.currentPrice?.toFixed(2) || '0.00'}</div>
                    </div>
                    <button
                      onClick={() => handleRecommendedProductDeselect(product.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Select up to 3 products that will be recommended to customers when they add this product to their basket.
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Product name" />
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input id="rating" type="number" step="0.1" value={rating} onChange={e => setRating(Number(e.target.value))} placeholder="4.5" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="headline">Headline (e.g., Premium Sleep Experience)</Label>
            <Input id="headline" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Engaging headline" />
          </div>
          <div className="md:col-span-2">
            <div className="font-semibold mb-2">Category Flags</div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="h-4 w-4" 
                  checked={isKidsCategory} 
                  onChange={e => setIsKidsCategory(e.target.checked)} 
                />
                <span>Show in Kids category</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="h-4 w-4" 
                  checked={isSalesCategory} 
                  onChange={e => setIsSalesCategory(e.target.checked)} 
                />
                <span>Show in Sales category</span>
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="desc">Long description</Label>
            <Textarea id="desc" value={longDescription} onChange={e => setLongDescription(e.target.value)} rows={6} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="warranty-delivery">Warranty & Delivery Information</Label>
            <Input 
              id="warranty-delivery" 
              value={warrantyDeliveryLine} 
              onChange={e => setWarrantyDeliveryLine(e.target.value)} 
              placeholder="e.g., 10-Year Warranty • Free Delivery • 100-Night Trial"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the warranty, delivery, and trial information separated by bullet points (•)
            </p>
          </div>
          {/* Firmness & Comfort Section - Only show for mattresses */}
          {selectedCategory === 'mattresses' && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mt-2 mb-2">Firmness & Comfort</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Firmness scale</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {([
                    'Soft',
                    'Soft-Medium',
                    'Medium',
                    'Medium-Firm',
                    'Firm',
                    'Extra-firm',
                  ] as const).map((val) => (
                    <label key={val} className={`px-3 py-1 rounded border cursor-pointer text-sm ${firmnessScale===val ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="firmness" className="mr-1" checked={firmnessScale===val} onChange={() => {
                        console.log('[Admin] Setting firmnessScale to:', val);
                        setFirmnessScale(val);
                      }} />{val}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Support</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`support-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${supportLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="support" className="mr-1" checked={supportLevel===l} onChange={() => setSupportLevel(l)} />{l}
                    </label>
                  ))}
                </div>
                <Label className="mt-3 block">Pressure Relief</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`pressure-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${pressureReliefLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="pressure" className="mr-1" checked={pressureReliefLevel===l} onChange={() => setPressureReliefLevel(l)} />{l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Air Circulation</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`air-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${airCirculationLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="air" className="mr-1" checked={airCirculationLevel===l} onChange={() => setAirCirculationLevel(l)} />{l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Durability</Label>
                <div className="flex gap-2 mt-2">
                  {(['Low','Medium','High'] as const).map(l => (
                    <label key={`durability-${l}`} className={`px-3 py-1 rounded border cursor-pointer text-sm ${durabilityLevel===l ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'}`}>
                      <input type="radio" name="durability" className="mr-1" checked={durabilityLevel===l} onChange={() => setDurabilityLevel(l)} />{l}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}
              </div>

              {/* Product Badges Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Product Badges</h3>
                <div className="space-y-3">
                  {/* Sale Badge */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={getBadgeStatus('sale')}
                        onChange={(e) => handleBadgeToggle('sale', e.target.checked)}
                        className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="text-base font-medium text-gray-700">Sale Badge</span>
                      <Badge className="ml-3 bg-orange-500 text-white text-sm">Sale</Badge>
                    </div>
                    <span className="text-sm text-gray-500">Shows when product is on sale</span>
                  </label>

                  {/* New In Badge */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={getBadgeStatus('new_in')}
                        onChange={(e) => handleBadgeToggle('new_in', e.target.checked)}
                        className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="text-base font-medium text-gray-700">New In Badge</span>
                      <Badge className="ml-3 bg-orange-600 text-white text-sm">New In</Badge>
                    </div>
                    <span className="text-sm text-gray-500">Shows for new products</span>
                  </label>

                  {/* Free Gift Badge */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={getBadgeStatus('free_gift')}
                        onChange={(e) => handleBadgeToggle('free_gift', e.target.checked)}
                        className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="text-base font-medium text-gray-700">Free Gift Badge</span>
                      <Badge className="ml-3 bg-blue-900 text-white text-sm">Free Gift</Badge>
                    </div>
                    <span className="text-sm text-gray-500">Shows when product comes with free gift</span>
                  </label>

                  {/* Free Gift Product Selection */}
                  {getBadgeStatus('free_gift') && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Free Gift Product</span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => openFreeGiftSelector('mattresses')}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Select Product
                        </Button>
                      </div>
                      
                      {selectedGiftProduct ? (
                        <div className="flex items-center space-x-3 p-2 bg-green-50 rounded border">
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            {selectedGiftProduct.image ? (
                              <img
                                src={selectedGiftProduct.image}
                                alt={selectedGiftProduct.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-5 h-5 text-gray-400">📦</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{selectedGiftProduct.name}</p>
                            {selectedGiftProduct.currentPrice && (
                              <p className="text-xs text-gray-600">£{selectedGiftProduct.currentPrice.toFixed(2)}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedGiftProduct(null)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No gift product selected</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

                 <div className="mt-4 flex gap-2">
           <Button onClick={handleSave} disabled={isSaving}>
             {isSaving ? (
               <>
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                 Saving...
               </>
             ) : (
               `Save ${categories.find(c => c.value === selectedCategory)?.label || 'Product'}`
             )}
           </Button>
           <Button variant="secondary" onClick={resetForm} disabled={isResetting}>
             {isResetting ? (
               <>
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                 Clearing...
               </>
             ) : (
               'Reset Form'
             )}
           </Button>
            </div>
      </Card>



      {/* Product Selector Modal */}
      {productSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-white p-6 rounded-t-2xl relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      Select {categories.find(c => c.value === selectedCategoryForSelector)?.label || 'Products'}
                    </h2>
                  </div>
                  <button
                    onClick={closeProductSelector}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/90 text-base">
                  Choose up to 3 products to recommend with this product
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">
                  {(() => {
                    const products = getProductsForCategory(selectedCategoryForSelector)
                    const filtered = products.filter(p => 
                      p.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    return `${filtered.length} of ${products.length} products`
                  })()}
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {getLoadingStateForCategory(selectedCategoryForSelector) ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(() => {
                    const products = getProductsForCategory(selectedCategoryForSelector)
                    const filtered = products.filter(p => 
                      p.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    
                    if (filtered.length === 0) {
                      return (
                        <div className="col-span-full text-center py-8">
                          <p className="text-gray-500">
                            {searchTerm ? 'No products match your search' : 'No products found in this category'}
                          </p>
    </div>
  )
}

                    return filtered.map((product) => {
                      const isSelected = selectedRecommendedProducts.some(p => p.id === product.id)
                      const isDisabled = !isSelected && selectedRecommendedProducts.length >= 3
                      
                      return (
                        <div 
                          key={product.id} 
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-green-500 bg-green-50 shadow-md' 
                              : isDisabled
                                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
                          }`}
                          onClick={() => {
                            if (isDisabled) return
                            if (isSelected) {
                              handleRecommendedProductDeselect(product.id)
                            } else {
                              handleRecommendedProductSelect(product)
                            }
                          }}
                        >
                          <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📦
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                              <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                              <div className="text-lg font-bold text-blue-600">
                                £{product.currentPrice?.toFixed(2) || '0.00'}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                                ✓
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {isSelected ? 'Selected' : isDisabled ? 'Max 3 products' : 'Click to select'}
                            </span>
                            {!isSelected && !isDisabled && (
                              <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <strong>Selected:</strong> {selectedRecommendedProducts.length}/3 products
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={closeProductSelector}>
                    Close
                  </Button>
                  <Button onClick={closeProductSelector} className="bg-blue-600 hover:bg-blue-700">
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Selector Modal */}
      {imageSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white p-6 rounded-t-2xl relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                      Select Variant Image
                    </h2>
                  </div>
                  <button
                    onClick={closeImageSelector}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/90 text-base">
                  Choose an image for your variant from the available product images
                </p>
              </div>
            </div>

            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Product Images (URLs) */}
                {images.map((url, idx) => (
                  <div 
                    key={`url-${idx}`}
                    className="group cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-400 hover:shadow-lg transition-all duration-200"
                    onClick={() => selectImageForVariant(url)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={url}
                        alt={`Product Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-xs text-gray-600 font-medium">Product Image {idx + 1}</p>
                      <p className="text-xs text-gray-400">(URL)</p>
                    </div>
                  </div>
                ))}

                {/* Uploaded Files */}
                  {uploadedFiles.map((file, idx) => (
                  <div 
                    key={`file-${idx}`}
                    className="group cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-400 hover:shadow-lg transition-all duration-200"
                    onClick={() => selectImageForVariant(URL.createObjectURL(file))}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Product Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                            ✓
                      </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-xs text-gray-600 font-medium">Product Image {idx + 1}</p>
                      <p className="text-xs text-gray-400">({file.name})</p>
                    </div>
                  </div>
                ))}

                {/* No images message */}
                {images.length === 0 && uploadedFiles.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No images available</p>
                    <p className="text-gray-400 text-sm">Upload product images first to use them as variant images</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
              <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                  <strong>Available:</strong> {images.length + uploadedFiles.length} images
              </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={closeImageSelector}>
                    Cancel
                  </Button>
                  <Button onClick={closeImageSelector} className="bg-green-600 hover:bg-green-700">
                    Close
                  </Button>
            </div>
          </div>
        </div>
         </div>
        </div>
      )}

      {/* Free Gift Product Selector Modal */}
      {freeGiftSelectorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-800 via-orange-700 to-orange-900 text-white p-6 rounded-t-2xl relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                      Select Free Gift Product
                    </h2>
                  </div>
                  <button
                    onClick={closeFreeGiftSelector}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/90 text-base">
                  Choose a product to give as a free gift with this product
                </p>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategoryForGiftSelector(category.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedCategoryForGiftSelector === category.value
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="Search products..."
                  value={giftSearchTerm}
                  onChange={(e) => setGiftSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">
                  {(() => {
                    const products = getProductsForCategory(selectedCategoryForGiftSelector || 'mattresses')
                    const filtered = products.filter(p => 
                      p.name.toLowerCase().includes(giftSearchTerm.toLowerCase())
                    )
                    return `${filtered.length} of ${products.length} products`
                  })()}
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {getLoadingStateForCategory(selectedCategoryForGiftSelector || 'mattresses') ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(() => {
                    const products = getProductsForCategory(selectedCategoryForGiftSelector || 'mattresses')
                    const filtered = products.filter(p => 
                      p.name.toLowerCase().includes(giftSearchTerm.toLowerCase())
                    )
                    
                    if (filtered.length === 0) {
                      return (
                        <div className="col-span-full text-center py-8">
                          <p className="text-gray-500">
                            {giftSearchTerm ? 'No products match your search' : 'No products found in this category'}
                          </p>
                        </div>
                      )
                    }

                    return filtered.map((product) => {
                      console.log('Rendering product in free gift selector:', product)
                      return (
                        <div 
                          key={product.id} 
                          className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 bg-white hover:border-orange-400 hover:shadow-md"
                          onClick={() => {
                            handleGiftProductSelect(product)
                            closeFreeGiftSelector()
                          }}
                        >
                          <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📦
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                          {product.currentPrice && (
                            <p className="text-sm text-gray-600">£{product.currentPrice.toFixed(2)}</p>
                          )}
                        </div>
                      )
                    })
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Crop Modal */}
      {/* Crop modal intentionally kept but disabled in add form workflow */}

    </div>
  )
}


