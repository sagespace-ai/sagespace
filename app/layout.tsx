import type React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { AppearanceProvider } from '@/lib/contexts/AppearanceContext'
import { SkipToContent } from '@/components/accessibility/SkipToContent'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SageSpace - Your Cosmic AI Journey',
  description:
    'Navigate through an immersive universe of specialized AI sages. Train, quest, and grow in the cosmic gamified AI platform.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.className} bg-black text-white min-h-screen`}
      >
        <SkipToContent />
        <AppearanceProvider>
          <div className="relative min-h-screen">
            {/* Cosmic starfield background on all pages */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              {[...Array(150)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                />
              ))}
            </div>

            {/* Purple/cyan cosmic gradient overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none z-0" />

            {/* Content with relative positioning */}
            <div className="relative z-10">
              <main id="main-content">{children}</main>
            </div>
          </div>
          <Toaster />
        </AppearanceProvider>
      </body>
    </html>
  )
}
