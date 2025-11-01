import type { Metadata } from 'next'
import { Inter, Poppins, Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { AuthProvider } from "@/lib/auth-context"
import { ManagerAuthProvider } from "@/lib/manager-auth-context"
import Header from "@/components/header"
import { TrustBadgesSection } from "@/components/trust-badges-section"
import { Footer } from "@/components/footer"
import { CartNotificationWrapper } from "@/components/cart-notification-wrapper"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { HydrationBoundary } from "@/components/hydration-boundary"
import { PopupCoordinator } from "@/components/popup-coordinator"
import Chatbot from "@/components/chatbot"
import { SeoDefault } from '@/components/seo-default'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap'
})

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Bedora Living - Premium Mattresses, Beds & Sofas',
  description: 'Shop premium mattresses, beds, sofas, and bedding at Bedora Living. Free delivery, great prices, and trusted comfort.',
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.bedoraliving.co.uk',
    siteName: 'Bedora Living',
    title: 'Bedora Living - Premium Mattresses, Beds & Sofas',
    description: 'Shop premium mattresses, beds, sofas, and bedding at Bedora Living. Free delivery, great prices, and trusted comfort.',
    images: [
      {
        url: 'https://www.bedoraliving.co.uk/logo.png',
        width: 1200,
        height: 630,
        alt: 'Bedora Living Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bedora Living - Premium Mattresses, Beds & Sofas',
    description: 'Shop premium mattresses, beds, sofas, and bedding at Bedora Living. Free delivery, great prices, and trusted comfort.',
    images: ['https://www.bedoraliving.co.uk/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-52LS9T6M');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#f97316" />
        <meta name="application-name" content="Bedora Living" />
        <meta name="apple-mobile-web-app-title" content="Bedora Living" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-TileImage" content="/favicon-192x192.png" />
        <meta property="og:image" content="https://www.bedoraliving.co.uk/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Bedora Living Logo" />
        <meta property="og:site_name" content="Bedora Living" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:site" content="@bedoraliving" />
        <meta name="twitter:creator" content="@bedoraliving" />
        <style dangerouslySetInnerHTML={{
          __html: `
html {
  font-family: ${outfit.style.fontFamily};
  --font-inter: ${inter.variable};
  --font-poppins: ${poppins.variable};
  --font-outfit: ${outfit.variable};
  --font-playfair: ${playfair.variable};
}
          `
        }} />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${outfit.variable} ${playfair.variable}`} suppressHydrationWarning={true}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-52LS9T6M"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <HydrationBoundary>
          <AuthProvider>
            <ManagerAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <SeoDefault />
                  <Header />
                  <TrustBadgesSection />
                  {children}
                  <Footer />
                  <CartNotificationWrapper />
                  <PopupCoordinator />
                  <Chatbot />
                  <PerformanceMonitor />
                </WishlistProvider>
              </CartProvider>
            </ManagerAuthProvider>
          </AuthProvider>
        </HydrationBoundary>
      </body>
    </html>
  )
}
