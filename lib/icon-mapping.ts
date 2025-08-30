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
    'springs': () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={sizeClasses[size]}>
        <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
        <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
        <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
        <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
      </svg>
    ),
    'brain': () => <Brain className={sizeClasses[size]} />,
    'sliders': () => <SlidersHorizontal className={sizeClasses[size]} />,
    'grid': () => <Grid className={sizeClasses[size]} />,
    'rotate': () => <RefreshCw className={sizeClasses[size]} />,
    'layers': () => <Layers className={sizeClasses[size]} />,
    'droplet': () => <Droplet className={sizeClasses[size]} />,
    'leaf': () => <Leaf className={sizeClasses[size]} />,
    'arrow-left-right': () => <ArrowLeftRight className={sizeClasses[size]} />,
    'snowflake': () => <Snowflake className={sizeClasses[size]} />,
    'gem': () => <Gem className={sizeClasses[size]} />,
    'heart': () => <Heart className={sizeClasses[size]} />,
    'shield': () => <Shield className={sizeClasses[size]} />,
    'feather': () => <Feather className={sizeClasses[size]} />,
    'badge': () => <Award className={sizeClasses[size]} />,
    'package-open': () => <PackageOpen className={sizeClasses[size]} />,
    'moon': () => <Moon className={sizeClasses[size]} />,
    'crown': () => <Crown className={sizeClasses[size]} />,
    'tree': () => <Trees className={sizeClasses[size]} />,
    'zap': () => <Zap className={sizeClasses[size]} />,
    'package': () => <Package className={sizeClasses[size]} />,
    'sliders-horizontal': () => <SlidersHorizontal className={sizeClasses[size]} />,
    'wrench': () => <Wrench className={sizeClasses[size]} />,
    'palette': () => <Palette className={sizeClasses[size]} />,
    'minimize': () => <Minimize className={sizeClasses[size]} />,
    'award': () => <Award className={sizeClasses[size]} />,
    'truck': () => <Truck className={sizeClasses[size]} />,
    'star': () => <Star className={sizeClasses[size]} />,
    'clock': () => <Clock className={sizeClasses[size]} />,
    'corner': () => <CornerDownLeft className={sizeClasses[size]} />,
    'trending-up': () => <TrendingUp className={sizeClasses[size]} />,
    'eye': () => <Eye className={sizeClasses[size]} />,
    'check': () => <Check className={sizeClasses[size]} />,
    'baby': () => <Baby className={sizeClasses[size]} />,
    'users': () => <Users className={sizeClasses[size]} />,
    'mountain': () => <Mountain className={sizeClasses[size]} />,
    'thermometer': () => <Thermometer className={sizeClasses[size]} />,
    'volume-2': () => <Volume2 className={sizeClasses[size]} />,
    'lightbulb': () => <Lightbulb className={sizeClasses[size]} />,
    'sun': () => <Sun className={sizeClasses[size]} />,
    'recycle': () => <RefreshCw className={sizeClasses[size]} />,
    'umbrella': () => <Umbrella className={sizeClasses[size]} />,
    'scroll': () => <ScrollText className={sizeClasses[size]} />,
    'waves': () => <Waves className={sizeClasses[size]} />,
    'shield-check': () => <ShieldCheck className={sizeClasses[size]} />,
    'sprout': () => <Sprout className={sizeClasses[size]} />,
    'dollar-sign': () => <DollarSign className={sizeClasses[size]} />,
    'bed': () => <Bed className={sizeClasses[size]} />,
    'radio': () => <Radio className={sizeClasses[size]} />,
    'maximize': () => <Maximize className={sizeClasses[size]} />,
    'ruler': () => <Ruler className={sizeClasses[size]} />,
    'home': () => <Home className={sizeClasses[size]} />,
    'square': () => <Square className={sizeClasses[size]} />,
    'volume-x': () => <VolumeX className={sizeClasses[size]} />,
    'scroll-text': () => <ScrollText className={sizeClasses[size]} />,
    'settings': () => <Settings className={sizeClasses[size]} />,
    'circle': () => <Circle className={sizeClasses[size]} />,
    
    // Legacy icon names (for backward compatibility)
    'memory-foam': () => <Brain className={sizeClasses[size]} />,
    'pocket-springs': () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={sizeClasses[size]}>
        <rect x="2" y="8" width="20" height="8" rx="1" ry="1"/>
        <path d="M4 10h2M8 10h2M12 10h2M16 10h2M20 10h2"/>
        <rect x="2" y="12" width="20" height="4" rx="1" ry="1"/>
        <path d="M4 14h2M8 14h2M12 14h2M16 14h2M20 14h2"/>
      </svg>
    ),
    'cooling': () => <Snowflake className={sizeClasses[size]} />,
    'edge-support': () => <Shield className={sizeClasses[size]} />,
    'orthopedic': () => <Heart className={sizeClasses[size]} />,
    'anti-bacterial': () => <ShieldCheck className={sizeClasses[size]} />,
    'hypoallergenic': () => <Feather className={sizeClasses[size]} />,
    'eco-friendly': () => <Leaf className={sizeClasses[size]} />,
    'removable-cover': () => <PackageOpen className={sizeClasses[size]} />,
    'value': () => <DollarSign className={sizeClasses[size]} />,
    'luxury': () => <Gem className={sizeClasses[size]} />,
    'delivery': () => <Truck className={sizeClasses[size]} />,
    'warranty': () => <Award className={sizeClasses[size]} />,
    'durability': () => <Zap className={sizeClasses[size]} />,
    'quality': () => <Award className={sizeClasses[size]} />,
    'comfort': () => <Bed className={sizeClasses[size]} />,
    'firmness': () => <Shield className={sizeClasses[size]} />,
    'support': () => <Heart className={sizeClasses[size]} />,
    'construction': () => <Wrench className={sizeClasses[size]} />,
    'design': () => <Palette className={sizeClasses[size]} />,
    'upholstery': () => <Package className={sizeClasses[size]} />,
    'metal': () => <Shield className={sizeClasses[size]} />,
    'wood': () => <Trees className={sizeClasses[size]} />,
    'solid-wood': () => <Trees className={sizeClasses[size]} />,
    'adjustable': () => <SlidersHorizontal className={sizeClasses[size]} />,
    'adjustable-base': () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={sizeClasses[size]}>
        <path d="M3 14h18"/>
        <path d="M5 10h8l2 2"/>
        <rect x="3" y="14" width="18" height="4" rx="1"/>
      </svg>
    ),
    'easy-assembly': () => <Wrench className={sizeClasses[size]} />,
    'headboard': () => <Package className={sizeClasses[size]} />,
    'upholstered': () => <Package className={sizeClasses[size]} />,
    'frame': () => <Shield className={sizeClasses[size]} />,
    'built': () => <Wrench className={sizeClasses[size]} />,
    'style': () => <Palette className={sizeClasses[size]} />,
    'breathable': () => <Waves className={sizeClasses[size]} />,
    'air': () => <Waves className={sizeClasses[size]} />,
    'temperature': () => <Snowflake className={sizeClasses[size]} />,
    'gel': () => <Snowflake className={sizeClasses[size]} />,
    'bacterial': () => <ShieldCheck className={sizeClasses[size]} />,
    'microbial': () => <ShieldCheck className={sizeClasses[size]} />,
    'organic': () => <Leaf className={sizeClasses[size]} />,
    'sustainable': () => <Leaf className={sizeClasses[size]} />,
    'bamboo': () => <Leaf className={sizeClasses[size]} />,
    'waterproof': () => <Umbrella className={sizeClasses[size]} />,
    'cover': () => <Umbrella className={sizeClasses[size]} />,
    'shipping': () => <Truck className={sizeClasses[size]} />,
    'washable': () => <PackageOpen className={sizeClasses[size]} />,
    'removable': () => <PackageOpen className={sizeClasses[size]} />,
    'price': () => <DollarSign className={sizeClasses[size]} />,
    'save': () => <DollarSign className={sizeClasses[size]} />,
    'durable': () => <Zap className={sizeClasses[size]} />,
    'long-lasting': () => <Zap className={sizeClasses[size]} />,
    'premium': () => <Gem className={sizeClasses[size]} />,
    'solid-wood': () => <Trees className={sizeClasses[size]} />,
    'orth': () => <Heart className={sizeClasses[size]} />,
    'allergen': () => <Feather className={sizeClasses[size]} />,
    'hypo': () => <Feather className={sizeClasses[size]} />
  }
  
  return iconMap[iconName.toLowerCase()] || (() => <Star className={sizeClasses[size]} />)
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
