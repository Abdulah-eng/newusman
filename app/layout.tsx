import type { Metadata } from 'next'
import { Inter, Poppins, Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { AuthProvider } from "@/lib/auth-context"
import Header from "@/components/header"
import { TrustBadgesSection } from "@/components/trust-badges-section"
import { Footer } from "@/components/footer"
import { CartNotificationWrapper } from "@/components/cart-notification-wrapper"
import { AuthPopupWrapper } from "@/components/auth-popup-wrapper"

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
  title: 'Usman Mattresses - Premium Mattresses & Bedding',
  description: 'Discover premium mattresses, bedding, and bedroom furniture at Usman Mattresses. Quality sleep solutions for every home.',
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <style>{`
html {
  font-family: ${outfit.style.fontFamily};
  --font-inter: ${inter.variable};
  --font-poppins: ${poppins.variable};
  --font-outfit: ${outfit.variable};
  --font-playfair: ${playfair.variable};
}
        `}</style>
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${outfit.variable} ${playfair.variable}`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <TrustBadgesSection />
              {children}
              <Footer />
              <CartNotificationWrapper />
              <AuthPopupWrapper />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
