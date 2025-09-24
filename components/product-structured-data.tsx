"use client"

import { ProductJsonLd, BreadcrumbJsonLd } from 'next-seo'

interface BreadcrumbItem {
  position: number
  name: string
  item: string
}

interface ProductStructuredDataProps {
  breadcrumb: BreadcrumbItem[]
  name: string
  images: string[]
  description: string
  brandName: string
  ratingValue: number
  reviewCount: number
  price: string
  url: string
}

export function ProductStructuredData(props: ProductStructuredDataProps) {
  const {
    breadcrumb,
    name,
    images,
    description,
    brandName,
    ratingValue,
    reviewCount,
    price,
    url,
  } = props

  return (
    <>
      <BreadcrumbJsonLd itemListElements={breadcrumb} />
      <ProductJsonLd
        productName={name}
        images={images}
        description={description}
        brand={{ name: brandName }}
        aggregateRating={{ ratingValue, reviewCount }}
        offers={{ price, priceCurrency: 'GBP', availability: 'http://schema.org/InStock', url }}
      />
    </>
  )
}


