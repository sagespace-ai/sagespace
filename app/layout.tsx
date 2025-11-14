import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from "react-hot-toast"
import "./globals.css"
import dynamic from 'next/dynamic'
import { AppearanceProvider } from "@/lib/contexts/AppearanceContext"
import { SkipToContent } from "@/components/accessibility/SkipToContent"

const CommandBarWrapper = dynamic(() => import("@/components/navigation/CommandBarWrapper").then(mod => ({ default: mod.CommandBarWrapper })), {
  ssr: false
})
const GlobalSpotifyPlayer = dynamic(() => import("@/components/GlobalSpotifyPlayer").then(mod => ({ default: mod.GlobalSpotifyPlayer })), {
  ssr: false
})
const CosmicBackground = dynamic(() => import("@/components/CosmicBackground").then(mod => ({ default: mod.CosmicBackground })), {
  ssr: false
})
const ObservabilityTracker = dynamic(() => import("@/components/observability-tracker").then(mod => ({ default: mod.ObservabilityTracker })), {
  ssr: false
})

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SageSpace - Your Cosmic AI Journey",
  description: "Navigate through an immersive universe of specialized AI sages",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
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
      <body className={`${geistSans.className} bg-black text-white`}>
        <SkipToContent />
        
        <CosmicBackground />
        <div className="relative z-10">
          <AppearanceProvider>
            <ObservabilityTracker />
            <CommandBarWrapper />
            <main id="main-content">
              {children}
            </main>
            <Toaster />
            <GlobalSpotifyPlayer />
          </AppearanceProvider>
        </div>
      </body>
    </html>
  )
}
