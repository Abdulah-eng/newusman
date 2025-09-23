import { DefaultSeoProps } from 'next-seo'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000'

const config: DefaultSeoProps = {
  titleTemplate: '%s | Bedora Living',
  defaultTitle: 'Bedora Living – Premium Mattresses, Beds & Sofas',
  description: 'Shop premium mattresses, beds, sofas, and bedding at Bedora Living. Free delivery, great prices, and trusted comfort.',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: 'Bedora Living',
    images: [
      { url: `${siteUrl}/mattress-image.svg`, width: 1200, height: 630, alt: 'Bedora Living' }
    ]
  },
  twitter: {
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    { name: 'theme-color', content: '#f97316' },
    { name: 'application-name', content: 'Bedora Living' }
  ],
}

export default config


