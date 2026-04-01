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
  title: 'ChipCraft - Chip Education Platform',
  description: 'Master semiconductor and chip design with AI guidance',
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
        </ThemeProvider>
      </body>
    </html>
  )
}
