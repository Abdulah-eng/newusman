import React from 'react'
import {
  Brain,
  Shield,
  SlidersHorizontal,
  Grid,
  RefreshCw,
  Layers,
  Droplet,
  Leaf,
  ArrowLeftRight,
  Snowflake,
  Gem,
  Heart,
  Award,
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
  Umbrella,
  ScrollText,
  Waves,
  ShieldCheck,
  Sprout,
  DollarSign,
  Bed,
  Radio,
  Maximize,
  Ruler,
  Home,
  Square,
  VolumeX,
  Scroll,
  Settings,
  Circle
} from 'lucide-react'

// Centralized icon mapping utility for consistent icon usage across all components
export const getIconComponent = (iconName: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8 sm:h-10 sm:w-10'
  }
  
  const iconMap: { [key: string]: any } = {
    // Core feature icons
    'springs': () => React.createElement('svg', {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      className: sizeClasses[size]
    }, [
      React.createElement('rect', { x: "2", y: "8", width: "20", height: "8", rx: "1", ry: "1" }),
      React.createElement('path', { d: "M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2" }),
      React.createElement('rect', { x: "2", y: "12", width: "20", height: "4", rx: "1", ry: "1" }),
      React.createElement('path', { d: "M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2" })
    ]),
    'brain': () => React.createElement(Brain, { className: sizeClasses[size] }),
    'sliders': () => React.createElement(SlidersHorizontal, { className: sizeClasses[size] }),
    'grid': () => React.createElement(Grid, { className: sizeClasses[size] }),
    'rotate': () => React.createElement(RefreshCw, { className: sizeClasses[size] }),
    'layers': () => React.createElement(Layers, { className: sizeClasses[size] }),
    'droplet': () => React.createElement(Droplet, { className: sizeClasses[size] }),
    'leaf': () => React.createElement(Leaf, { className: sizeClasses[size] }),
    'arrow-left-right': () => React.createElement(ArrowLeftRight, { className: sizeClasses[size] }),
    'snowflake': () => React.createElement(Snowflake, { className: sizeClasses[size] }),
    'gem': () => React.createElement(Gem, { className: sizeClasses[size] }),
    'heart': () => React.createElement(Heart, { className: sizeClasses[size] }),
    'shield': () => React.createElement(Shield, { className: sizeClasses[size] }),
    'feather': () => React.createElement(Feather, { className: sizeClasses[size] }),
    'badge': () => React.createElement(Award, { className: sizeClasses[size] }),
    'package-open': () => React.createElement(PackageOpen, { className: sizeClasses[size] }),
    'moon': () => React.createElement(Moon, { className: sizeClasses[size] }),
    'crown': () => React.createElement(Crown, { className: sizeClasses[size] }),
    'tree': () => React.createElement(Trees, { className: sizeClasses[size] }),
    'zap': () => React.createElement(Zap, { className: sizeClasses[size] }),
    'package': () => React.createElement(Package, { className: sizeClasses[size] }),
    'sliders-horizontal': () => React.createElement(SlidersHorizontal, { className: sizeClasses[size] }),
    'wrench': () => React.createElement(Wrench, { className: sizeClasses[size] }),
    'palette': () => React.createElement(Palette, { className: sizeClasses[size] }),
    'minimize': () => React.createElement(Minimize, { className: sizeClasses[size] }),
    'award': () => React.createElement(Award, { className: sizeClasses[size] }),
    'truck': () => React.createElement(Truck, { className: sizeClasses[size] }),
    'star': () => React.createElement(Star, { className: sizeClasses[size] }),
    'clock': () => React.createElement(Clock, { className: sizeClasses[size] }),
    'corner': () => React.createElement(CornerDownLeft, { className: sizeClasses[size] }),
    'trending-up': () => React.createElement(TrendingUp, { className: sizeClasses[size] }),
    'eye': () => React.createElement(Eye, { className: sizeClasses[size] }),
    'check': () => React.createElement(Check, { className: sizeClasses[size] }),
    'baby': () => React.createElement(Baby, { className: sizeClasses[size] }),
    'users': () => React.createElement(Users, { className: sizeClasses[size] }),
    'mountain': () => React.createElement(Mountain, { className: sizeClasses[size] }),
    'thermometer': () => React.createElement(Thermometer, { className: sizeClasses[size] }),
    'volume-2': () => React.createElement(Volume2, { className: sizeClasses[size] }),
    'lightbulb': () => React.createElement(Lightbulb, { className: sizeClasses[size] }),
    'sun': () => React.createElement(Sun, { className: sizeClasses[size] }),
    'recycle': () => React.createElement(RefreshCw, { className: sizeClasses[size] }),
    'umbrella': () => React.createElement(Umbrella, { className: sizeClasses[size] }),
    'scroll': () => React.createElement(ScrollText, { className: sizeClasses[size] }),
    'waves': () => React.createElement(Waves, { className: sizeClasses[size] }),
    'shield-check': () => React.createElement(ShieldCheck, { className: sizeClasses[size] }),
    'sprout': () => React.createElement(Sprout, { className: sizeClasses[size] }),
    'dollar-sign': () => React.createElement(DollarSign, { className: sizeClasses[size] }),
    'bed': () => React.createElement(Bed, { className: sizeClasses[size] }),
    'radio': () => React.createElement(Radio, { className: sizeClasses[size] }),
    'maximize': () => React.createElement(Maximize, { className: sizeClasses[size] }),
    'ruler': () => React.createElement(Ruler, { className: sizeClasses[size] }),
    'home': () => React.createElement(Home, { className: sizeClasses[size] }),
    'square': () => React.createElement(Square, { className: sizeClasses[size] }),
    'volume-x': () => React.createElement(VolumeX, { className: sizeClasses[size] }),
    'scroll-text': () => React.createElement(ScrollText, { className: sizeClasses[size] }),
    'settings': () => React.createElement(Settings, { className: sizeClasses[size] }),
    'circle': () => React.createElement(Circle, { className: sizeClasses[size] }),
    
    // Legacy icon names (for backward compatibility)
    'memory-foam': () => React.createElement(Brain, { className: sizeClasses[size] }),
    'pocket-springs': () => React.createElement('svg', {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      className: sizeClasses[size]
    }, [
      React.createElement('rect', { x: "2", y: "8", width: "20", height: "8", rx: "1", ry: "1" }),
      React.createElement('path', { d: "M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2" }),
      React.createElement('rect', { x: "2", y: "12", width: "20", height: "4", rx: "1", ry: "1" }),
      React.createElement('path', { d: "M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2" })
    ]),
    'cooling': () => React.createElement(Snowflake, { className: sizeClasses[size] }),
    'edge-support': () => React.createElement(Shield, { className: sizeClasses[size] }),
    'orthopedic': () => React.createElement(Heart, { className: sizeClasses[size] }),
    'anti-bacterial': () => React.createElement(ShieldCheck, { className: sizeClasses[size] }),
    'hypoallergenic': () => React.createElement(Feather, { className: sizeClasses[size] }),
    'eco-friendly': () => React.createElement(Leaf, { className: sizeClasses[size] }),
    'removable-cover': () => React.createElement(PackageOpen, { className: sizeClasses[size] }),
    'value': () => React.createElement(DollarSign, { className: sizeClasses[size] }),
    'luxury': () => React.createElement(Gem, { className: sizeClasses[size] }),
    'delivery': () => React.createElement(Truck, { className: sizeClasses[size] }),
    'warranty': () => React.createElement(Award, { className: sizeClasses[size] }),
    'durability': () => React.createElement(Zap, { className: sizeClasses[size] }),
    'quality': () => React.createElement(Award, { className: sizeClasses[size] }),
    'comfort': () => React.createElement(Bed, { className: sizeClasses[size] }),
    'firmness': () => React.createElement(Shield, { className: sizeClasses[size] }),
    'support': () => React.createElement(Heart, { className: sizeClasses[size] }),
    'construction': () => React.createElement(Wrench, { className: sizeClasses[size] }),
    'design': () => React.createElement(Palette, { className: sizeClasses[size] }),
    'upholstery': () => React.createElement(Package, { className: sizeClasses[size] }),
    'metal': () => React.createElement(Shield, { className: sizeClasses[size] }),
    'wood': () => React.createElement(Trees, { className: sizeClasses[size] }),
    'solid-wood': () => React.createElement(Trees, { className: sizeClasses[size] }),
    'adjustable': () => React.createElement(SlidersHorizontal, { className: sizeClasses[size] }),
    'adjustable-base': () => React.createElement('svg', {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      className: sizeClasses[size]
    }, [
      React.createElement('path', { d: "M3 14h18" }),
      React.createElement('path', { d: "M5 10h8l2 2" }),
      React.createElement('rect', { x: "3", y: "14", width: "18", height: "4", rx: "1" })
    ]),
    'easy-assembly': () => React.createElement(Wrench, { className: sizeClasses[size] }),
    'headboard': () => React.createElement(Package, { className: sizeClasses[size] }),
    'upholstered': () => React.createElement(Package, { className: sizeClasses[size] }),
    'frame': () => React.createElement(Shield, { className: sizeClasses[size] }),
    'built': () => React.createElement(Wrench, { className: sizeClasses[size] }),
    'style': () => React.createElement(Palette, { className: sizeClasses[size] }),
    'breathable': () => React.createElement(Waves, { className: sizeClasses[size] }),
    'air': () => React.createElement(Waves, { className: sizeClasses[size] }),
    'temperature': () => React.createElement(Snowflake, { className: sizeClasses[size] }),
    'gel': () => React.createElement(Snowflake, { className: sizeClasses[size] }),
    'bacterial': () => React.createElement(ShieldCheck, { className: sizeClasses[size] }),
    'microbial': () => React.createElement(ShieldCheck, { className: sizeClasses[size] }),
    'organic': () => React.createElement(Leaf, { className: sizeClasses[size] }),
    'sustainable': () => React.createElement(Leaf, { className: sizeClasses[size] }),
    'bamboo': () => React.createElement(Leaf, { className: sizeClasses[size] }),
    'waterproof': () => React.createElement(Umbrella, { className: sizeClasses[size] }),
    'cover': () => React.createElement(Umbrella, { className: sizeClasses[size] }),
    'shipping': () => React.createElement(Truck, { className: sizeClasses[size] }),
    'washable': () => React.createElement(PackageOpen, { className: sizeClasses[size] }),
    'removable': () => React.createElement(PackageOpen, { className: sizeClasses[size] }),
    'price': () => React.createElement(DollarSign, { className: sizeClasses[size] }),
    'save': () => React.createElement(DollarSign, { className: sizeClasses[size] }),
    'durable': () => React.createElement(Zap, { className: sizeClasses[size] }),
    'long-lasting': () => React.createElement(Zap, { className: sizeClasses[size] }),
    'premium': () => React.createElement(Gem, { className: sizeClasses[size] }),
    'solid-wood': () => React.createElement(Trees, { className: sizeClasses[size] }),
    'orth': () => React.createElement(Heart, { className: sizeClasses[size] }),
    'allergen': () => React.createElement(Feather, { className: sizeClasses[size] }),
    'hypo': () => React.createElement(Feather, { className: sizeClasses[size] })
  }
  
  return iconMap[iconName.toLowerCase()] || (() => React.createElement(Star, { className: sizeClasses[size] }))
}

// Smart icon detection based on text content (fallback when no specific icon is provided)
export const getSmartIcon = (text: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const lowerText = text.toLowerCase()
  
  // Memory foam and related
  if (lowerText.includes('memory') || lowerText.includes('foam')) {
    return getIconComponent('brain', size)
  }
  
  // Springs and coils
  if (lowerText.includes('pocket') || lowerText.includes('spring') || lowerText.includes('coil')) {
    return getIconComponent('springs', size)
  }
  
  // Cooling and breathability
  if (lowerText.includes('cool') || lowerText.includes('breath') || lowerText.includes('air')) {
    return getIconComponent('waves', size)
  }
  
  // Temperature regulation
  if (lowerText.includes('gel') || lowerText.includes('temperature')) {
    return getIconComponent('snowflake', size)
  }
  
  // Edge support
  if (lowerText.includes('edge')) {
    return getIconComponent('shield', size)
  }
  
  // Firmness and support
  if (lowerText.includes('firm') || lowerText.includes('support') || lowerText.includes('orth')) {
    return getIconComponent('sliders', size)
  }
  
  // Anti-bacterial and health
  if (lowerText.includes('anti') || lowerText.includes('bacterial') || lowerText.includes('microbial')) {
    return getIconComponent('shield-check', size)
  }
  
  // Hypoallergenic
  if (lowerText.includes('hypo') || lowerText.includes('allergen')) {
    return getIconComponent('feather', size)
  }
  
  // Eco-friendly and organic
  if (lowerText.includes('eco') || lowerText.includes('organic') || lowerText.includes('sustain') || lowerText.includes('bamboo')) {
    return getIconComponent('leaf', size)
  }
  
  // Warranty and quality
  if (lowerText.includes('warranty')) {
    return getIconComponent('award', size)
  }
  
  // Delivery and shipping
  if (lowerText.includes('delivery') || lowerText.includes('shipping')) {
    return getIconComponent('truck', size)
  }
  
  // Washable and removable
  if (lowerText.includes('washable') || lowerText.includes('removable') || lowerText.includes('cover')) {
    return getIconComponent('package-open', size)
  }
  
  // Value and pricing
  if (lowerText.includes('value') || lowerText.includes('price') || lowerText.includes('save')) {
    return getIconComponent('dollar-sign', size)
  }
  
  // Durability
  if (lowerText.includes('durable') || lowerText.includes('long')) {
    return getIconComponent('zap', size)
  }
  
  // Luxury and premium
  if (lowerText.includes('luxury') || lowerText.includes('premium')) {
    return getIconComponent('gem', size)
  }
  
  // Wood and materials
  if (lowerText.includes('wood') || lowerText.includes('solid wood')) {
    return getIconComponent('tree', size)
  }
  
  // Metal and frame
  if (lowerText.includes('metal') || lowerText.includes('frame')) {
    return getIconComponent('shield', size)
  }
  
  // Upholstery and headboard
  if (lowerText.includes('upholstered') || lowerText.includes('headboard')) {
    return getIconComponent('package', size)
  }
  
  // Construction and building
  if (lowerText.includes('construction') || lowerText.includes('built')) {
    return getIconComponent('wrench', size)
  }
  
  // Design and style
  if (lowerText.includes('design') || lowerText.includes('style')) {
    return getIconComponent('palette', size)
  }
  
  // Easy assembly
  if (lowerText.includes('easy') && lowerText.includes('assembly')) {
    return getIconComponent('wrench', size)
  }
  
  // Adjustable features
  if (lowerText.includes('adjustable') && (lowerText.includes('height') || lowerText.includes('base'))) {
    return getIconComponent('sliders', size)
  }
  
  // Default fallback - use a meaningful icon instead of a tick mark
  return getIconComponent('star', size)
}

// Get icon for a feature, prioritizing specific icon names over smart detection
export const getFeatureIcon = (label: string, iconName?: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  // If we have a specific icon name, use it
  if (iconName) {
    return getIconComponent(iconName, size)
  }
  
  // Otherwise, use smart detection
  return getSmartIcon(label, size)
}
