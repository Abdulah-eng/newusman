"use client"

import { DefaultSeo } from 'next-seo'
import SEO from '@/../next-seo.config'

export function SeoDefault() {
  return <DefaultSeo {...SEO} />
}


