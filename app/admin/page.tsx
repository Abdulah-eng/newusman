"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { AdminNav } from '@/components/admin/admin-nav'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Badge, 
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
      id: 'eco-friendly-sofa',
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

// Default to beds features if category not found
const getFeaturesForCategory = (category: string) => ensureUnique(CATEGORY_FEATURES[category as keyof typeof CATEGORY_FEATURES] || CATEGORY_FEATURES.beds)
const getReasonsForCategory = (category: string) => ensureUnique(CATEGORY_REASONS_TO_LOVE[category as keyof typeof CATEGORY_REASONS_TO_LOVE] || CATEGORY_REASONS_TO_LOVE.mattresses)

// Get hardcoded feature cards for a category
const getFeatureCardsForCategory = (category: string) => HARDCODED_FEATURE_CARDS[category as keyof typeof HARDCODED_FEATURE_CARDS] || HARDCODED_FEATURE_CARDS.mattresses

// Get icon component based on icon name
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'springs': () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
      <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
      <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
      <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
    </svg>,
    'brain': () => <Brain className="w-6 h-6" />,
    'sliders': () => <SlidersHorizontal className="w-6 h-6" />,
    'grid': () => <Grid className="w-6 h-6" />,
    'rotate': () => <RotateCcw className="w-6 h-6" />,
    'layers': () => <Layers className="w-6 h-6" />,
    'droplet': () => <Droplets className="w-6 h-6" />,
    'leaf': () => <Leaf className="w-6 h-6" />,
    'arrow-left-right': () => <ArrowLeftRight className="w-6 h-6" />,
    'snowflake': () => <Snowflake className="w-6 h-6" />,
    'gem': () => <Gem className="w-6 h-6" />,
    'heart': () => <Heart className="w-6 h-6" />,
    'shield': () => <Shield className="w-6 h-6" />,
    'feather': () => <Feather className="w-6 h-6" />,
    'badge': () => <Badge className="w-6 h-6" />,
    'package-open': () => <PackageOpen className="w-6 h-6" />,
    'moon': () => <Moon className="w-6 h-6" />,
    'crown': () => <Crown className="w-6 h-6" />,
    'tree': () => <Trees className="w-6 h-6" />,
    'zap': () => <Zap className="w-6 h-6" />,
    'package': () => <Package className="w-6 h-6" />,
    'sliders-horizontal': () => <SlidersHorizontal className="w-6 h-6" />,
    'wrench': () => <Wrench className="w-6 h-6" />,
    'palette': () => <Palette className="w-6 h-6" />,
    'minimize': () => <Minimize className="w-6 h-6" />,
    'award': () => <Award className="w-6 h-6" />,
    'truck': () => <Truck className="w-6 h-6" />,
    'star': () => <Star className="w-6 h-6" />,
    'clock': () => <Clock className="w-6 h-6" />,
    'corner': () => <CornerDownLeft className="w-6 h-6" />,
    'trending-up': () => <TrendingUp className="w-6 h-6" />,
    'eye': () => <Eye className="w-6 h-6" />,
    'check': () => <Check className="w-6 h-6" />,
    'baby': () => <Baby className="w-6 h-6" />,
    'users': () => <Users className="w-6 h-6" />,
    'mountain': () => <Mountain className="w-6 h-6" />,
    'thermometer': () => <Thermometer className="w-6 h-6" />,
    'volume-2': () => <Volume2 className="w-6 h-6" />,
    'lightbulb': () => <Lightbulb className="w-6 h-6" />,
    'sun': () => <Sun className="w-6 h-6" />,
    'recycle': () => <RefreshCw className="w-6 h-6" />,
    'umbrella': () => <Umbrella className="w-6 h-6" />,
    'scroll': () => <ScrollText className="w-6 h-6" />,
    'waves': () => <Waves className="w-6 h-6" />
  }
  return iconMap[iconName] || (() => <Check className="w-6 h-6" />)
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Manage Products
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
  const [selectedReasonsToLove, setSelectedReasonsToLove] = useState<Array<{reason: string, description: string}>>([])
  const [reasonsToBuy, setReasonsToBuy] = useState<string[]>([])
  const [newReason, setNewReason] = useState<string>("")

  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const [name, setName] = useState('')
  const [rating, setRating] = useState<number>(4.5)
  const [headline, setHeadline] = useState('Premium Sleep Experience')
  const [longDescription, setLongDescription] = useState('Write a compelling description about comfort, materials and value.')
  
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
    maxHeightHeading: 'Maximum Height',
    weightCapacityHeading: 'Weight Capacity',
    pocketSpringsHeading: 'Pocket Springs',
    comfortLayerHeading: 'Comfort Layer',
    supportLayerHeading: 'Support Layer'
  })

  // Dimension images state
  const [dimensionImages, setDimensionImages] = useState<Array<{
    id: string
    file: File | null
    imageUrl: string
    fileName: string
    fileSize: number
    fileType: string
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
  const [toppers, setToppers] = useState<any[]>([])
  const [loadingMattresses, setLoadingMattresses] = useState(true)
  const [loadingBeds, setLoadingBeds] = useState(true)
  const [loadingSofas, setLoadingSofas] = useState(true)
  const [loadingPillows, setLoadingPillows] = useState(true)
  const [loadingToppers, setLoadingToppers] = useState(true)
  const [selectedRecommendedProducts, setSelectedRecommendedProducts] = useState<any[]>([])

  // Fetch recommended products on component mount
  useEffect(() => {
    fetchRecommendedProducts()
  }, [])

  const addReasonToLove = (reason: string, description: string = '') => {
    setSelectedReasonsToLove(prev => [...prev, { reason, description }])
  }

  const updateReasonToLoveDescription = (index: number, description: string) => {
    setSelectedReasonsToLove(prev => prev.map((item, i) => 
      i === index ? { ...item, description } : item
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
      },
    ]))
  }

  const updateVariant = (id: string, patch: Partial<VariantRow>) => {
    setVariants(v => v.map(row => row.id === id ? { ...row, ...patch } : row))
  }

  const removeVariant = (id: string) => setVariants(v => v.filter(row => row.id !== id))

  const confirmAttributes = () => {
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
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const updateDescriptionParagraph = (index: number, field: 'heading' | 'content' | 'image' | 'uploadedFile', value: string | File | null) => {
    setDescriptionParagraphs(prev => prev.map((para, i) => 
      i === index ? { ...para, [field]: value } : para
    ))
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

  const updateDimension = (field: keyof typeof dimensions, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
  }

  // Dimension images functions
  const addDimensionImage = () => {
    const newImage = {
      id: crypto.randomUUID(),
      file: null,
      imageUrl: '',
      fileName: '',
      fileSize: 0,
      fileType: '',
      sortOrder: dimensionImages.length
    }
    setDimensionImages(prev => [...prev, newImage])
  }

  const updateDimensionImage = (id: string, updates: Partial<typeof dimensionImages[0]>) => {
    setDimensionImages(prev => prev.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ))
  }

  const removeDimensionImage = (id: string) => {
    setDimensionImages(prev => prev.filter(img => img.id !== id))
  }

  const handleDimensionImageUpload = (id: string, file: File) => {
    updateDimensionImage(id, {
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
  }

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

    const resetForm = () => {
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
      maxHeightHeading: 'Maximum Height',
      weightCapacityHeading: 'Weight Capacity',
      pocketSpringsHeading: 'Pocket Springs',
      comfortLayerHeading: 'Comfort Layer',
      supportLayerHeading: 'Support Layer'
    })
    setDimensionImages([])
    setSelectedBunkbedMattresses([])
    setSelectedPopularCategories([])
    setSelectedRecommendedProducts([])
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
    try {
      // 1) Upload any selected files to Supabase Storage and collect public URLs
      const uploadedUrls: string[] = []
      if (uploadedFiles.length > 0) {
        console.log('[Admin Save] Uploading files to Supabase bucket:', process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images', uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })))
        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i]
          const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
          const filePath = `products/${Date.now()}-${i}-${safeName}`
          const { error: uploadError } = await supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .upload(filePath, file, { upsert: true, contentType: file.type })
          if (uploadError) {
            console.error('[Admin Save] Upload error:', uploadError, 'for', filePath)
            continue
          }
          const { data: publicData } = supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .getPublicUrl(filePath)
          console.log('[Admin Save] Public URL for', filePath, '=>', publicData?.publicUrl)
          if (publicData?.publicUrl) uploadedUrls.push(publicData.publicUrl)
        }
        console.log('[Admin Save] Uploaded public URLs:', uploadedUrls)
      }

      // 2) Upload description paragraph files to storage and replace with public URLs
      const descriptionPublicUrls: Array<string | null> = []
      const updatedDescriptionParagraphs = [] as typeof descriptionParagraphs
      for (let i = 0; i < descriptionParagraphs.length; i++) {
        const para = descriptionParagraphs[i]
        let imageUrl = para.image
        if (para.uploadedFile) {
          const file = para.uploadedFile
          const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
          const filePath = `descriptions/${Date.now()}-${i}-${safeName}`
          const { error: descUploadError } = await supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .upload(filePath, file, { upsert: true, contentType: file.type })
          if (descUploadError) {
            console.error('[Admin Save] Description image upload error:', descUploadError, 'for', filePath)
          } else {
            const { data: publicData } = supabase
              .storage
              .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
              .getPublicUrl(filePath)
            console.log('[Admin Save] Description public URL for', filePath, '=>', publicData?.publicUrl)
            imageUrl = publicData?.publicUrl || imageUrl
          }
        }
        descriptionPublicUrls.push(imageUrl || null)
        updatedDescriptionParagraphs.push({ ...para, image: imageUrl || '', uploadedFile: null })
      }

      // 3) Upload dimension images to storage and collect public URLs
      const updatedDimensionImages = [] as typeof dimensionImages
      for (let i = 0; i < dimensionImages.length; i++) {
        const img = dimensionImages[i]
        let imageUrl = img.imageUrl
        if (img.file) {
          const file = img.file
          const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
          const filePath = `dimensions/${Date.now()}-${i}-${safeName}`
          const { error: dimUploadError } = await supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
            .upload(filePath, file, { upsert: true, contentType: file.type })
          if (dimUploadError) {
            console.error('[Admin Save] Dimension image upload error:', dimUploadError, 'for', filePath)
          } else {
            const { data: publicData } = supabase
              .storage
              .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images')
              .getPublicUrl(filePath)
            console.log('[Admin Save] Dimension public URL for', filePath, '=>', publicData?.publicUrl)
            imageUrl = publicData?.publicUrl || imageUrl
          }
        }
        updatedDimensionImages.push({ ...img, imageUrl: imageUrl || '', file: null })
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
        dimensions: {
          ...dimensions,
          // Include editable headings
          mattressSizeHeading: dimensions.mattressSizeHeading,
          maxHeightHeading: dimensions.maxHeightHeading,
          weightCapacityHeading: dimensions.weightCapacityHeading,
          pocketSpringsHeading: dimensions.pocketSpringsHeading,
          comfortLayerHeading: dimensions.comfortLayerHeading,
          supportLayerHeading: dimensions.supportLayerHeading
        },
        dimensionImages: updatedDimensionImages,
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
        }
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
      alert(`Product saved successfully! Product ID: ${result.productId}`)
      
      // Reset form after successful save
      resetForm()
      
    } catch (error) {
      console.error('Error saving product:', error)
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
    <div className="mt-4 space-y-6">
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
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
          
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-2">SKU</th>
                  {useColor && <th className="p-2">Color</th>}
                  {useDepth && <th className="p-2">Depth</th>}
                  {useFirmness && <th className="p-2">Firmness</th>}
                  {useSize && <th className="p-2">Size</th>}
                  <th className="p-2">Length</th>
                  <th className="p-2">Width</th>
                  <th className="p-2">Height</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Original Price</th>
                  <th className="p-2">Now Price</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {variants.map(v => (
                  <tr key={v.id} className="border-t">
                    <td className="p-2 min-w-[120px]"><Input value={v.sku} onChange={e => updateVariant(v.id, { sku: e.target.value })} placeholder="SKU" /></td>
                    {useColor && <td className="p-2 min-w-[140px]"><Input value={v.color || ''} onChange={e => updateVariant(v.id, { color: e.target.value })} placeholder="Color" /></td>}
                    {useDepth && <td className="p-2 min-w-[120px]"><Input value={v.depth || ''} onChange={e => updateVariant(v.id, { depth: e.target.value })} placeholder="Depth" /></td>}
                    {useFirmness && <td className="p-2 min-w-[160px]"><Input value={v.firmness || ''} onChange={e => updateVariant(v.id, { firmness: e.target.value })} placeholder="Firmness" /></td>}
                    {useSize && <td className="p-2 min-w-[140px]"><Input value={v.size || ''} onChange={e => updateVariant(v.id, { size: e.target.value })} placeholder="Size" /></td>}
                    <td className="p-2 min-w-[100px]"><Input value={v.length || ''} onChange={e => updateVariant(v.id, { length: e.target.value })} placeholder="Length" /></td>
                    <td className="p-2 min-w-[100px]"><Input value={v.width || ''} onChange={e => updateVariant(v.id, { width: e.target.value })} placeholder="Width" /></td>
                    <td className="p-2 min-w-[100px]"><Input value={v.height || ''} onChange={e => updateVariant(v.id, { height: e.target.value })} placeholder="Height" /></td>
                    <td className="p-2 min-w-[100px]">
                      <select 
                        value={v.availability ? 'true' : 'false'} 
                        onChange={e => updateVariant(v.id, { availability: e.target.value === 'true' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="p-2 min-w-[140px]"><Input type="number" value={v.originalPrice ?? ''} onChange={e => updateVariant(v.id, { originalPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="Original" /></td>
                    <td className="p-2 min-w-[140px]"><Input type="number" value={v.currentPrice ?? ''} onChange={e => updateVariant(v.id, { currentPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="Now" /></td>
                    <td className="p-2"><Button variant="ghost" onClick={() => removeVariant(v.id)}>Remove</Button></td>
                  </tr>
                ))}
                {variants.length === 0 && (
                  <tr>
                    <td colSpan={1 + (useColor ? 1 : 0) + (useDepth ? 1 : 0) + (useFirmness ? 1 : 0) + (useSize ? 1 : 0) + 4} className="p-4 text-gray-500">
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
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
             {getFeatureCardsForCategory(selectedCategory).map((feature) => {
               const isSelected = selectedReasonsToLove.some(item => item.reason === feature.title)
               const IconComponent = getIconComponent(feature.icon)
               
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
                       addReasonToLove(feature.title, feature.description)
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

      {/* Dimensions & Specifications */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Dimensions & Specifications</h2>
        <p className="text-sm text-gray-600 mb-4">Enter product dimensions and technical specifications. You can customize the headings and add multiple images.</p>
        
        {/* Dimension Images Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Dimension Images</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addDimensionImage}
            >
              Add Image
            </Button>
          </div>
          
          {dimensionImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {dimensionImages.map((image, index) => (
                <div key={image.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDimensionImage(image.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Upload Image</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleDimensionImageUpload(image.id, file)
                        }}
                        className="w-full text-sm"
                      />
                    </div>
                    
                    {image.file && (
                      <div className="text-xs text-gray-600">
                        <p><strong>File:</strong> {image.fileName}</p>
                        <p><strong>Size:</strong> {(image.fileSize / 1024).toFixed(1)} KB</p>
                        <p><strong>Type:</strong> {image.fileType}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Dimensions Grid with Editable Headings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Height</Label>
            <Input 
              value={dimensions.height} 
              onChange={e => updateDimension('height', e.target.value)}
              placeholder="25 cm"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Length</Label>
            <Input 
              value={dimensions.length} 
              onChange={e => updateDimension('length', e.target.value)}
              placeholder="L 190cm"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Width</Label>
            <Input 
              value={dimensions.width} 
              onChange={e => updateDimension('width', e.target.value)}
              placeholder="135cm"
            />
          </div>
          
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
                value={dimensions.maxHeightHeading} 
                onChange={e => updateDimension('maxHeightHeading', e.target.value)}
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
      </Card>

      {/* Popular Categories */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
        <p className="text-sm text-gray-600 mb-4">Select which popular categories this product should appear in. These categories are shown on the product pages.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        <p className="text-sm text-gray-600 mb-4">These products will appear in the sidebar when customers add this mattress to their basket.</p>
        
        <div className="space-y-4">
          {/* Mattresses */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Mattresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingMattresses ? (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">Loading mattresses...</div>
                </div>
              ) : mattresses.length > 0 ? (
                mattresses.map((product) => (
                  <div key={product.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">£{product.currentPrice?.toFixed(2) || '0.00'}</div>
                    <button
                      onClick={() => handleRecommendedProductSelect(product)}
                      className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">No mattresses found</div>
                </div>
              )}
            </div>
          </div>

          {/* Beds */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Beds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingBeds ? (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">Loading beds...</div>
                </div>
              ) : beds.length > 0 ? (
                beds.map((product) => (
                  <div key={product.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">£{product.currentPrice?.toFixed(2) || '0.00'}</div>
                    <button
                      onClick={() => handleRecommendedProductSelect(product)}
                      className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">No beds found</div>
                </div>
              )}
            </div>
          </div>

          {/* Sofas */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Sofas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingSofas ? (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">Loading sofas...</div>
                </div>
              ) : sofas.length > 0 ? (
                sofas.map((product) => (
                  <div key={product.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">£{product.currentPrice?.toFixed(2) || '0.00'}</div>
                    <button
                      onClick={() => handleRecommendedProductSelect(product)}
                      className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">No sofas found</div>
                </div>
              )}
            </div>
          </div>

          {/* Pillows */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Pillows</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingPillows ? (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">Loading pillows...</div>
                </div>
              ) : pillows.length > 0 ? (
                pillows.map((product) => (
                  <div key={product.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">£{product.currentPrice?.toFixed(2) || '0.00'}</div>
                    <button
                      onClick={() => handleRecommendedProductSelect(product)}
                      className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">No pillows found</div>
                </div>
              )}
            </div>
          </div>

          {/* Toppers */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Toppers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loadingToppers ? (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">Loading toppers...</div>
                </div>
              ) : toppers.length > 0 ? (
                toppers.map((product) => (
                  <div key={product.id} className="p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">£{product.currentPrice?.toFixed(2) || '0.00'}</div>
                    <button
                      onClick={() => handleRecommendedProductSelect(product)}
                      className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-500">No toppers found</div>
                </div>
              )}
            </div>
          </div>
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
          <div className="md:col-span-2">
            <div className="font-semibold mb-2">Product Images</div>
            
            {/* URL Input */}
            <div className="mb-4">
              <Label className="text-sm text-gray-600 mb-2 block">Add Image URLs</Label>
              <div className="flex gap-2 mb-3">
                <Input placeholder="https://..." value={newImage} onChange={e => setNewImage(e.target.value)} />
                <Button onClick={() => { if (newImage.trim()) { setImages(imgs => [...imgs, newImage.trim()]); setNewImage('') } }}>Add URL</Button>
              </div>
              {images.length > 0 && (
                <ul className="space-y-2">
                  {images.map((url, idx) => (
                    <li key={`${url}-${idx}`} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded">
                      <span className="truncate text-sm text-gray-700">{url}</span>
                      <Button variant="ghost" size="sm" onClick={() => setImages(imgs => imgs.filter((_, i) => i !== idx))}>Remove</Button>
                    </li>
                  ))}
                </ul>
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
                    <li key={`${file.name}-${idx}`} className="flex items-center justify-between gap-2 p-2 bg-blue-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-800">{file.name}</span>
                        <span className="text-xs text-blue-600">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeUploadedFile(idx)}>Remove</Button>
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
              </div>
            </div>
          </div>
        </div>

                 <div className="mt-4 flex gap-2">
           <Button onClick={handleSave}>Save {categories.find(c => c.value === selectedCategory)?.label}</Button>
           <Button variant="secondary" onClick={resetForm}>Reset Form</Button>
         </div>
      </Card>
    </div>
  )
}


