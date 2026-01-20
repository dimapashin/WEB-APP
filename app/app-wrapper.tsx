"use client"

import { useEffect, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showSplash && <SplashScreen />}
      {!showSplash && children}
    </>
  )
}
