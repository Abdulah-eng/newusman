import { getFeatureCardsForCategory } from './feature-cards'

export const CATEGORY_FEATURES: Record<string, string[]> = {
  beds: [
    'Solid Wood Construction','Metal Frame','Upholstered Headboard','Storage Drawers','Adjustable Height','Easy Assembly','Tool-Free Setup','Anti-Slip Feet','Reinforced Joints','Durable Finish','Modern Design','Classic Style','Contemporary Look','Rustic Charm','Minimalist Design','Space Saving','Under Bed Storage','Headboard Storage','Footboard Storage','Side Rails','Center Support','Slat System','Box Spring Compatible','Platform Bed','Low Profile','High Profile','Canopy Style','Four Poster','Sleigh Bed','Panel Bed','Mission Style','Shaker Style','Industrial Look','Scandinavian Design','French Country','Traditional English','Italian Design','Asian Inspired','Bohemian Style','Vintage Charm','Art Deco','Mid-Century Modern'
  ],
  sofas: [
    'Premium Fabric','Leather Upholstery','Memory Foam Cushions','High-Density Foam','Pocket Springs','Reclining Mechanism','Power Recline','USB Charging','Built-in Storage','Convertible Design','Sleeping Function','Pull-Out Bed','Futon Style','Sectional Design','Modular Configuration','Corner Unit','Chaise Lounge','Ottoman Storage','Coffee Table Storage','Console Storage','Arm Storage','Cup Holders','Wireless Charging','Bluetooth Speakers','LED Lighting','Massage Function','Heating Function','Cooling Function','Anti-Stain Fabric','Pet-Friendly Material','Easy Clean Fabric','Removable Covers','Washable Covers','Stain Resistant','Fade Resistant','Wrinkle Resistant','Anti-Allergenic','Hypoallergenic','Eco-Friendly Materials','Sustainable Fabric','Recycled Materials','Organic Cotton','Natural Linen','Synthetic Blend','Performance Fabric',
    // Added common sofa features
    'Durable Frame Construction','Comfortable Backrest & Armrest','Supportive Seating Base','Space-Saving Design','Stylish Modern Look','Versatile Use','Ergonomic Design','Compact Dual Function','Hidden Storage','Easy Assembled','Delivery Flat Pack'
  ],
  pillows: [
    'Memory Foam','Gel Infused','Down Filling','Feather Blend','Synthetic Fill','Bamboo Cover','Cotton Cover','Silk Cover','Linen Cover','Cooling Technology','Temperature Regulation','Moisture Wicking','Anti-Bacterial','Anti-Dust Mite','Hypoallergenic','Orthopedic Support','Neck Support','Cervical Support','Lumbar Support','Side Sleeper','Back Sleeper','Stomach Sleeper','Combination Sleeper','Adjustable Height','Removable Cover','Washable Cover','Quick Dry','Anti-Odor','Anti-Static','Eco-Friendly','Organic Materials','Natural Fillings','Sustainable','Biodegradable','Recycled Materials','Certified Organic','OEKO-TEX Certified','GOTS Certified','Fair Trade','Handmade','Customizable','Personalized'
  ],
  toppers: [
    'Memory Foam','Gel Infused','Latex','Wool','Bamboo','Cotton','Silk','Polyester','Hybrid Design','Cooling Technology','Temperature Regulation','Moisture Wicking','Anti-Bacterial','Anti-Dust Mite','Hypoallergenic','Pressure Relief','Pain Relief','Joint Support','Back Support','Hip Support','Shoulder Support','Spine Alignment','Posture Support','Motion Isolation','Edge Support','Non-Slip Base','Gripper Backing','Elastic Straps','Zipper Closure','Removable Cover','Washable Cover','Waterproof','Stain Resistant','Anti-Odor','Anti-Static','Eco-Friendly','Organic Materials','Natural Fibers','Sustainable','Biodegradable','Recycled Materials','Certified Organic','OEKO-TEX Certified','GOTS Certified','Fair Trade','Handmade'
  ],
  bunkbeds: [
    'Space-Saving','Multiple Sleeping Levels','Solid Wood Frames','Metal Frames','Single Over Double','Single Over Single','Triple Bunk','Futon Bunk','Flat-Pack','Ladder or Steps','Guard Rails','Slatted Base','Easy-Clean Finishes','Heavy-Duty Bolts & Joints','Easy Assemble'
  ]
}

export const getFeaturesForCategory = (category: string): string[] => {
  const key = (category || '').toLowerCase()
  if (key === 'mattresses') {
    // Derive from feature cards to guarantee coverage; titles are user-facing labels
    const cards = getFeatureCardsForCategory('mattresses')
    const titles = Array.from(new Set(cards.map(c => c.title)))
    return titles
  }
  if (key === 'sofas') {
    // Derive from centralized feature cards as primary, then merge with list above
    const cards = getFeatureCardsForCategory('sofas')
    const titles = Array.from(new Set(cards.map(c => c.title)))
    const hardcoded = CATEGORY_FEATURES.sofas
    const merged = Array.from(new Set([...(titles || []), ...hardcoded]))
    return merged
  }
  return CATEGORY_FEATURES[key] || CATEGORY_FEATURES.beds
}


