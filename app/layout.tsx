import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { ClientProviders } from '@/components/providers'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ChipCraft - Nền tảng đào tạo Thiết kế Chip Bán dẫn số 1 Việt Nam',
    template: '%s | ChipCraft'
  },
  description: 'ChipCraft - Học thiết kế chip bán dẫn chuyên sâu với sự hỗ trợ từ AI. Làm chủ Verilog, RTL Design và ASIC Flow ngay hôm nay để trở thành kỹ sư Silicon thực thụ.',
  keywords: ['chip', 'bán dẫn', 'thiết kế chip', 'chipcraft', 'học verilog', 'rtl design', 'asic flow', 'đào tạo bán dẫn'],
  authors: [{ name: 'ChipCraft Team' }],
  creator: 'ChipCraft',
  publisher: 'ChipCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chipcraft.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ChipCraft - Nền tảng đào tạo Thiết kế Chip Bán dẫn số 1 Việt Nam',
    description: 'Học thiết kế chip bán dẫn chuyên sâu với AI. Làm chủ Verilog, RTL Design và ASIC Flow.',
    url: 'https://chipcraft.vercel.app',
    siteName: 'ChipCraft',
    images: [
      {
        url: 'https://cdn.discordapp.com/attachments/1166706277213274122/1488807442220318854/download.png?ex=69ce1f7a&is=69cccdfa&hm=c3028b97efabfff5c3e2cd555e4b6dc864232e05253fe4635f0eb56a02936a03&',
        width: 1200,
        height: 630,
        alt: 'ChipCraft - Semiconductor Design Platform',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChipCraft - Nền tảng đào tạo Thiết kế Chip Bán dẫn số 1 Việt Nam',
    description: 'Học thiết kế chip bán dẫn chuyên sâu với AI. Làm chủ Verilog, RTL Design và ASIC Flow.',
    images: ['https://cdn.discordapp.com/attachments/1166706277213274122/1488807442220318854/download.png?ex=69ce1f7a&is=69cccdfa&hm=c3028b97efabfff5c3e2cd555e4b6dc864232e05253fe4635f0eb56a02936a03&'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnamPro.variable}`}>
      <body className={`${beVietnamPro.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="chipcraft-theme"
        >
          <ClientProviders>
            {children}
            <Analytics />
          </ClientProviders>

          {/* Structured Data (JSON-LD) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "ChipCraft",
                "url": "https://chipcraft.vercel.app",
                "logo": "https://chipcraft.vercel.app/logo.png",
                "description": "Nền tảng đào tạo thiết kế chip bán dẫn số 1 Việt Nam",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Ho Chi Minh City",
                  "addressCountry": "VN"
                },
                "sameAs": [
                  "https://facebook.com/chipcraft",
                  "https://linkedin.com/company/chipcraft",
                  "https://twitter.com/chipcraft"
                ]
              })
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
