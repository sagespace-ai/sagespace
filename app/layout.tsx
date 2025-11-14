import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from "react-hot-toast"
import "./globals.css"
import { CommandBar } from "@/components/navigation/CommandBar"
import { GlobalSpotifyPlayer } from "@/components/GlobalSpotifyPlayer"
import { CosmicBackground } from "@/components/CosmicBackground"

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
      <body className={`${geistSans.className} bg-black text-white`}>
        <CosmicBackground />
        <div className="relative z-10">
          <CommandBar />
          {children}
          <Toaster />
          <GlobalSpotifyPlayer />
        </div>
      </body>
    </html>
  )
}
