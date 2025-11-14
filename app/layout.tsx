import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from "react-hot-toast"
import "./globals.css"
import { AppearanceProvider } from "@/lib/contexts/AppearanceContext"
import { SkipToContent } from "@/components/accessibility/SkipToContent"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SageSpace - Your Cosmic AI Journey",
  description: "Navigate through an immersive universe of specialized AI sages. Train, quest, and grow in the cosmic gamified AI platform.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${geistSans.className} bg-black text-white min-h-screen`}>
        <SkipToContent />
        <AppearanceProvider>
          <main id="main-content">
            {children}
          </main>
          <Toaster />
        </AppearanceProvider>
      </body>
    </html>
  )
}
