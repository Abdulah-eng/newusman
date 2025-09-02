// Centralized "Features You Will Love" card definitions to keep add and edit forms in sync
// Extracted from the add-product form (app/admin/page.tsx)

export type FeatureCard = { id: string; title: string; description: string; icon: string }

export const HARDCODED_FEATURE_CARDS: Record<string, FeatureCard[]> = {
  mattresses: [
    { id: 'pocket-springs', title: 'Pocket Springs', description: 'Individually pocketed springs work to give you support exactly where you need it.', icon: 'springs' },
    { id: 'memory-foam', title: 'Memory Foam', description: 'Contours to your body for personalized comfort and pressure relief.', icon: 'brain' },
    { id: 'medium-firmness', title: 'Medium Firmness', description: 'Perfect balance of comfort and support for most sleepers.', icon: 'sliders' },
    { id: 'quilted-edge', title: 'Quilted Tape Edge', description: 'Premium edge-to-edge comfort with reinforced stitching.', icon: 'grid' },
    { id: 'rotate-feature', title: 'Rotate Feature', description: 'Easy rotation for even wear and extended mattress life.', icon: 'rotate' },
    { id: 'recon-foam', title: 'Recon Foam', description: 'High-quality recycled foam for sustainable comfort.', icon: 'layers' },
    { id: 'blue-foam', title: 'Blue Foam', description: 'Premium blue foam for enhanced comfort and support.', icon: 'droplet' },
    { id: 'coil-spring', title: 'Coil Spring', description: 'Traditional coil springs for classic support.', icon: 'springs' },
    { id: 'latex-foam', title: 'Latex Foam', description: 'Natural latex for responsive and durable comfort.', icon: 'leaf' },
    { id: 'reflex-foam', title: 'Reflex Foam', description: 'High-density foam for superior support and durability.', icon: 'arrow-left-right' },
    { id: 'cool-blue-foam', title: 'Cool Blue Foam', description: 'Temperature-regulating foam for cool sleep.', icon: 'snowflake' },
    { id: 'high-density-memory', title: 'High Density Memory', description: 'Premium memory foam for lasting comfort and support.', icon: 'layers' },
    { id: '3-zone-support', title: '3-Zone Support', description: 'Targeted support zones for optimal body alignment.', icon: 'grid' },
    { id: '5-zone-support', title: '5-Zone Support', description: 'Advanced support zones for superior comfort.', icon: 'grid' },
    { id: '7-zone-support', title: '7-Zone Support', description: 'Precision-engineered support zones for perfect alignment.', icon: 'grid' },
    { id: 'geltech-foam', title: 'GelTech Foam', description: 'Advanced gel-infused foam for temperature regulation.', icon: 'droplet' },
    { id: 'marble-gel', title: 'Marble Gel', description: 'Luxury marble gel for premium comfort and cooling.', icon: 'gem' },
    { id: 'foam-encapsulated', title: 'Foam Encapsulated', description: 'Foam-encapsulated springs for enhanced edge support.', icon: 'springs' },
    { id: 'soft-firm', title: 'Soft Firm', description: 'Gentle firmness for side sleepers and lighter individuals.', icon: 'sliders' },
    { id: 'medium-firm', title: 'Medium Firm', description: 'Balanced firmness for combination sleepers.', icon: 'sliders' },
    { id: 'firm', title: 'Firm', description: 'Firm support for back sleepers and heavier individuals.', icon: 'sliders' },
    { id: 'eco-friendly', title: 'Eco Friendly', description: 'Environmentally conscious materials and manufacturing.', icon: 'leaf' },
    { id: 'waterproof-cover', title: 'Waterproof Cover', description: 'Protective waterproof cover for easy maintenance.', icon: 'umbrella' },
    { id: 'removable-cover', title: 'Removable Cover', description: 'Easy-to-remove cover for convenient cleaning.', icon: 'scroll' },
    { id: 'washable-cover', title: 'Washable Cover', description: 'Machine-washable cover for simple care.', icon: 'waves' },
    { id: 'double-side', title: 'Double Side', description: 'Reversible design for extended mattress life.', icon: 'arrow-left-right' },
    { id: 'rolled-up', title: 'Rolled Up', description: 'Convenient rolled packaging for easy handling.', icon: 'scroll' },
    { id: '8-zone-support', title: '8-Zone Support', description: 'Advanced support system for ultimate comfort.', icon: 'grid' },
    { id: '10-zone-support', title: '10-Zone Support', description: 'Premium support system for luxury comfort.', icon: 'grid' },
    { id: 'revo-vasco-foam', title: 'Revo Vasco Foam', description: 'Innovative foam technology for superior comfort.', icon: 'brain' },
    { id: 'comfort-foam', title: 'Comfort Foam', description: 'Specially formulated foam for maximum comfort.', icon: 'heart' },
    { id: 'gel-infused', title: 'Gel Infused', description: 'Gel-infused technology for temperature regulation.', icon: 'droplet' },
    { id: 'polyester-fillings', title: 'Polyester Fillings', description: 'Soft and durable polyester fiber fillings.', icon: 'layers' }
  ],
  // Other categories intentionally abbreviated here; they already render correctly
  pillows: [
    { id: 'bounce-back', title: 'Bounce Back', description: 'Returns to shape quickly for consistent comfort.', icon: 'arrow-left-right' },
    { id: 'box-support', title: 'Box Support', description: 'Structured support for better neck alignment.', icon: 'package-open' },
    { id: 'classic-moulded', title: 'Classic Moulded', description: 'Moulded construction for consistent shape.', icon: 'layers' },
    { id: 'deep-sleep', title: 'Deep Sleep', description: 'Designed to help you sleep deeper and longer.', icon: 'moon' },
    { id: 'memory-flake', title: 'Memory Flake', description: 'Flake fill adapts to personalize support.', icon: 'snowflake' },
    { id: 'memory-foam-pillow', title: 'Memory Foam', description: 'Contours to your head and neck for support.', icon: 'layers' },
    { id: 'memory-laytech', title: 'Memory Laytech', description: 'Blend of memory and latex-like responsiveness.', icon: 'brain' },
    { id: 'pure-luxury', title: 'Pure Luxury', description: 'Indulgent finish and superior materials.', icon: 'gem' },
    { id: 'soft-touch', title: 'Soft Touch', description: 'Ultra-soft outer for cozy comfort.', icon: 'feather' },
    { id: 'super-support', title: 'Super Support', description: 'Firm support to keep posture aligned.', icon: 'shield' },
    { id: 'value-pillow', title: 'Value Pillow', description: 'Quality comfort without the premium price.', icon: 'badge' },
    { id: 'shredded-foam', title: 'Shredded Foam', description: 'Shredded fill for airflow and adjustability.', icon: 'layers' },
    { id: 'recon-shredded-foam', title: 'Recon Shredded Foam', description: 'Supportive blend of recycled foam pieces.', icon: 'layers' },
    { id: 'bamboo-pillow', title: 'Bamboo Pillow', description: 'Bamboo cover for breathable softness.', icon: 'leaf' },
    { id: 'polyester-filling', title: 'Polyester Filling', description: 'Soft, durable polyester fiber fill.', icon: 'feather' },
    { id: 'next-day-delivery', title: 'Next Day Delivery', description: 'Get it delivered as soon as tomorrow.', icon: 'truck' },
    { id: 'box-packed', title: 'Box Packed', description: 'Neatly packed for safe arrival.', icon: 'package-open' },
    { id: 'luxury-cover', title: 'Luxury Cover', description: 'Elevated look and feel with luxury cover.', icon: 'gem' },
    { id: 'hotel-vibe', title: 'Hotel Vibe', description: 'Experience 5-star comfort at home.', icon: 'crown' }
  ],
  beds: [
    { id: 'solid-wood', title: 'Solid Wood Construction', description: 'Built with premium solid wood for lasting durability.', icon: 'trees' },
    { id: 'metal-frame', title: 'Metal Frame', description: 'Sturdy metal construction for reliable support.', icon: 'zap' },
    { id: 'upholstered-headboard', title: 'Upholstered Headboard', description: 'Soft, comfortable headboard for cozy bedtime.', icon: 'heart' },
    { id: 'storage-drawers', title: 'Storage Drawers', description: 'Built-in storage for organized bedroom space.', icon: 'package' },
    { id: 'adjustable-height', title: 'Adjustable Height', description: 'Customizable height for perfect positioning.', icon: 'sliders-horizontal' },
    { id: 'easy-assembly', title: 'Easy Assembly', description: 'Simple setup for quick bed installation.', icon: 'wrench' },
    { id: 'anti-slip-feet', title: 'Anti-Slip Feet', description: 'Non-slip feet prevent unwanted movement.', icon: 'shield' },
    { id: 'modern-design', title: 'Modern Design', description: 'Contemporary styling that complements any bedroom.', icon: 'palette' },
    { id: 'space-efficient', title: 'Space Efficient', description: 'Compact design maximizes bedroom space.', icon: 'minimize' },
    { id: 'warranty-coverage', title: 'Warranty Coverage', description: 'Protected by comprehensive warranty terms.', icon: 'award' },
    { id: 'fast-delivery', title: 'Fast Delivery', description: 'Quick shipping to get your order fast.', icon: 'truck' },
    { id: 'secure-packaging', title: 'Secure Packaging', description: 'Carefully packaged to ensure safe delivery.', icon: 'package' },
    { id: 'professional-finish', title: 'Professional Finish', description: 'High-quality finish for a polished look.', icon: 'star' },
    { id: 'easy-maintenance', title: 'Easy Maintenance', description: 'Simple care requirements for long-lasting use.', icon: 'wrench' },
    { id: 'long-lasting', title: 'Long Lasting', description: 'Built to provide years of reliable service.', icon: 'clock' },
    { id: 'stable-support', title: 'Stable Support', description: 'Steady foundation for optimal mattress performance.', icon: 'layers' }
  ],
  sofas: [
    { id: 'premium-fabric', title: 'Premium Fabric', description: 'High-quality fabric for luxurious comfort and style.', icon: 'star' },
    { id: 'leather-upholstery', title: 'Leather Upholstery', description: 'Premium leather for sophisticated elegance.', icon: 'gem' },
    { id: 'memory-foam-cushions', title: 'Memory Foam Cushions', description: 'Adaptive cushions that contour to your body.', icon: 'brain' },
    { id: 'high-density-foam', title: 'High-Density Foam', description: 'Durable foam for long-lasting comfort.', icon: 'layers' },
    { id: 'pocket-springs-sofa', title: 'Pocket Springs', description: 'Individual springs for superior support and comfort.', icon: 'springs' },
    { id: 'reclining-mechanism', title: 'Reclining Mechanism', description: 'Smooth reclining for ultimate relaxation.', icon: 'arrow-left-right' },
    { id: 'power-recline', title: 'Power Recline', description: 'Electric reclining for effortless comfort.', icon: 'zap' },
    { id: 'built-in-storage', title: 'Built-in Storage', description: 'Convenient storage for living room organization.', icon: 'package' },
    { id: 'convertible-design', title: 'Convertible Design', description: 'Versatile design for multiple seating options.', icon: 'arrow-left-right' },
    { id: 'sleeping-function', title: 'Sleeping Function', description: 'Converts to a comfortable sleeping surface.', icon: 'moon' },
    { id: 'pull-out-bed', title: 'Pull-Out Bed', description: 'Easy-to-use pull-out bed mechanism.', icon: 'package-open' },
    { id: 'sectional-design', title: 'Sectional Design', description: 'Modular design for flexible seating arrangements.', icon: 'grid' },
    { id: 'modular-configuration', title: 'Modular Configuration', description: 'Customizable configuration to fit your space.', icon: 'grid' },
    { id: 'corner-unit', title: 'Corner Unit', description: 'Perfect for corner spaces and L-shaped layouts.', icon: 'corner' },
    { id: 'chaise-lounge', title: 'Chaise Lounge', description: 'Extended seating for ultimate relaxation.', icon: 'heart' },
    { id: 'ottoman-storage', title: 'Ottoman Storage', description: 'Storage ottoman for hidden organization.', icon: 'package' },
    { id: 'coffee-table-storage', title: 'Coffee Table Storage', description: 'Storage coffee table for living room organization.', icon: 'package' },
    { id: 'arm-storage', title: 'Arm Storage', description: 'Convenient arm storage for remote controls and magazines.', icon: 'package' },
    { id: 'cup-holders', title: 'Cup Holders', description: 'Built-in cup holders for beverage convenience.', icon: 'droplet' },
    { id: 'wireless-charging', title: 'Wireless Charging', description: 'Built-in wireless charging for your devices.', icon: 'zap' },
    { id: 'bluetooth-speakers', title: 'Bluetooth Speakers', description: 'Integrated speakers for entertainment convenience.', icon: 'volume-2' },
    { id: 'led-lighting', title: 'LED Lighting', description: 'Ambient lighting for mood enhancement.', icon: 'lightbulb' },
    { id: 'massage-function', title: 'Massage Function', description: 'Built-in massage for ultimate relaxation.', icon: 'heart' },
    { id: 'heating-function', title: 'Heating Function', description: 'Heated seating for cold weather comfort.', icon: 'thermometer' },
    { id: 'cooling-function', title: 'Cooling Function', description: 'Cooled seating for hot weather comfort.', icon: 'snowflake' },
    { id: 'anti-stain-fabric', title: 'Anti-Stain Fabric', description: 'Stain-resistant fabric for easy maintenance.', icon: 'shield' },
    { id: 'pet-friendly-material', title: 'Pet-Friendly Material', description: 'Durable material that withstands pet activity.', icon: 'heart' },
    { id: 'easy-clean-fabric', title: 'Easy Clean Fabric', description: 'Simple cleaning for busy households.', icon: 'droplet' },
    { id: 'removable-covers', title: 'Removable Covers', description: 'Easy-to-remove covers for convenient cleaning.', icon: 'package-open' },
    { id: 'washable-covers', title: 'Washable Covers', description: 'Machine-washable covers for simple care.', icon: 'waves' },
    { id: 'stain-resistant', title: 'Stain Resistant', description: 'Resistant to stains and spills for lasting beauty.', icon: 'shield' },
    { id: 'fade-resistant', title: 'Fade Resistant', description: 'Color-fast fabric that maintains its beauty.', icon: 'sun' },
    { id: 'wrinkle-resistant', title: 'Wrinkle Resistant', description: 'Wrinkle-free fabric for always-perfect appearance.', icon: 'shield' },
    { id: 'anti-allergenic', title: 'Anti-Allergenic', description: 'Hypoallergenic materials for sensitive individuals.', icon: 'feather' },
    { id: 'hypoallergenic', title: 'Hypoallergenic', description: 'Safe for allergy sufferers and sensitive skin.', icon: 'feather' },
    { id: 'eco-friendly-sofa', title: 'Eco-Friendly', description: 'Environmentally conscious materials and processes.', icon: 'leaf' },
    { id: 'sustainable-fabric', title: 'Sustainable Fabric', description: 'Responsibly sourced materials for eco-conscious living.', icon: 'leaf' },
    { id: 'recycled-materials', title: 'Recycled Materials', description: 'Made with recycled materials for environmental responsibility.', icon: 'recycle' },
    { id: 'organic-cotton', title: 'Organic Cotton', description: 'Natural organic cotton for pure comfort.', icon: 'leaf' },
    { id: 'natural-linen', title: 'Natural Linen', description: 'Natural linen for breathable luxury.', icon: 'leaf' },
    { id: 'synthetic-blend', title: 'Synthetic Blend', description: 'Durable synthetic blend for lasting performance.', icon: 'layers' },
    { id: 'performance-fabric', title: 'Performance Fabric', description: 'High-performance fabric for active lifestyles.', icon: 'zap' }
  ],
  toppers: [
    { id: 'memory-foam-topper', title: 'Memory Foam', description: 'Contours to your body for personalized comfort.', icon: 'brain' },
    { id: 'gel-infused-topper', title: 'Gel Infused', description: 'Gel-infused technology for temperature regulation.', icon: 'droplet' },
    { id: 'latex-topper', title: 'Latex', description: 'Natural latex for responsive and durable comfort.', icon: 'leaf' },
    { id: 'wool-topper', title: 'Wool', description: 'Natural wool for temperature regulation and comfort.', icon: 'feather' },
    { id: 'bamboo-topper', title: 'Bamboo', description: 'Bamboo fiber for breathable softness.', icon: 'leaf' },
    { id: 'cotton-topper', title: 'Cotton', description: 'Natural cotton for soft, breathable comfort.', icon: 'feather' },
    { id: 'silk-topper', title: 'Silk', description: 'Luxurious silk for ultimate comfort and elegance.', icon: 'gem' },
    { id: 'polyester-topper', title: 'Polyester', description: 'Durable polyester for long-lasting comfort.', icon: 'layers' },
    { id: 'hybrid-design', title: 'Hybrid Design', description: 'Combination of materials for optimal comfort.', icon: 'layers' },
    { id: 'cooling-technology', title: 'Cooling Technology', description: 'Advanced cooling for temperature regulation.', icon: 'snowflake' },
    { id: 'temperature-regulation', title: 'Temperature Regulation', description: 'Maintains optimal sleeping temperature.', icon: 'thermometer' },
    { id: 'moisture-wicking', title: 'Moisture Wicking', description: 'Wicks away moisture for dry comfort.', icon: 'droplet' },
    { id: 'anti-bacterial', title: 'Anti-Bacterial', description: 'Bacterial-resistant for hygienic sleep.', icon: 'shield' },
    { id: 'anti-dust-mite', title: 'Anti-Dust Mite', description: 'Dust-mite resistant for allergy sufferers.', icon: 'shield' },
    { id: 'hypoallergenic-topper', title: 'Hypoallergenic', description: 'Safe for sensitive skin and allergy sufferers.', icon: 'feather' },
    { id: 'pressure-relief', title: 'Pressure Relief', description: 'Relieves pressure points for comfortable sleep.', icon: 'heart' },
    { id: 'pain-relief', title: 'Pain Relief', description: 'Alleviates pain for restful sleep.', icon: 'heart' },
    { id: 'joint-support', title: 'Joint Support', description: 'Supports joints for comfortable sleep.', icon: 'heart' },
    { id: 'back-support', title: 'Back Support', description: 'Provides back support for proper alignment.', icon: 'heart' },
    { id: 'hip-support', title: 'Hip Support', description: 'Supports hips for comfortable sleep.', icon: 'heart' },
    { id: 'shoulder-support', title: 'Shoulder Support', description: 'Supports shoulders for proper alignment.', icon: 'heart' }
  ]
}

// Additional mattress feature labels (mirrors the checkbox list in the forms)
const ADDITIONAL_MATTRESS_FEATURE_LABELS: string[] = [
  'Cooling Technology','Temperature Regulation','Moisture Wicking','Anti-Bacterial','Anti-Dust Mite','Hypoallergenic',
  'Pressure Relief','Pain Relief','Joint Support','Back Support','Hip Support','Shoulder Support','Spine Alignment','Posture Support',
  'Motion Isolation','Edge Support','Non-Slip Base','Elastic Straps','Zipper Closure','Removable Cover','Washable Cover','Waterproof',
  'Stain Resistant','Anti-Odor','Anti-Static','Eco-Friendly','Organic Materials','Natural Fibers','Sustainable','Biodegradable',
  'Recycled Materials','Certified Organic','OEKO-TEX Certified','GOTS Certified','Fair Trade','Handmade','Customizable','Personalized',
  'Orthopedic Support','Medical Grade','Professional Quality','Expert Design','Scientific Approach','Research Based','Clinically Tested',
  'Doctor Recommended','Chiropractor Approved','Physical Therapist Recommended'
]

// Map a label to one of the simple icon keys used by the edit form
const pickIconForLabel = (label: string): string => {
  const t = label.toLowerCase()
  if (t.includes('spring')) return 'springs'
  if (t.includes('memory') || t.includes('foam')) return 'brain'
  if (t.includes('zone') || t.includes('tape') || t.includes('section') || t.includes('grid')) return 'grid'
  if (t.includes('rotate') || t.includes('double') || t.includes('rolled') || t.includes('convert')) return 'refresh-cw'
  if (t.includes('cool') || t.includes('temperature') || t.includes('gel')) return 'snowflake'
  if (t.includes('water') || t.includes('wash') || t.includes('remov') || t.includes('zipper') || t.includes('cover') || t.includes('package')) return 'package'
  if (t.includes('edge') || t.includes('anti') || t.includes('guard') || t.includes('shield')) return 'shield'
  if (t.includes('support') || t.includes('firm') || t.includes('orthopedic') || t.includes('posture') || t.includes('alignment')) return 'sliders-horizontal'
  if (t.includes('motion') || t.includes('isolation')) return 'zap'
  if (t.includes('eco') || t.includes('organic') || t.includes('natural') || t.includes('sustain') || t.includes('recycle') || t.includes('bamboo')) return 'leaf'
  if (t.includes('thermo') || t.includes('heat')) return 'thermometer'
  return 'grid'
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const getFeatureCardsForCategory = (category: string): FeatureCard[] => {
  const key = (category || '').toLowerCase()
  const base = HARDCODED_FEATURE_CARDS[key] || HARDCODED_FEATURE_CARDS.mattresses
  if (key !== 'mattresses') return base

  // Build additional mattress cards from labels, skipping ones already present
  const existingTitles = new Set(base.map(c => c.title.toLowerCase()))
  const extraCards: FeatureCard[] = ADDITIONAL_MATTRESS_FEATURE_LABELS
    .filter(label => !existingTitles.has(label.toLowerCase()))
    .map(label => ({
      id: slugify(label),
      title: label,
      description: label, // keep concise; UI already shows description text
      icon: pickIconForLabel(label)
    }))

  return [...base, ...extraCards]
}


