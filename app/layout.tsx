import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppWrapper } from "./app-wrapper"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "VIDI Hotel",
  description: "Цифровой консьерж отеля VIDI",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F0F0F",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased min-h-screen`}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  )
}
