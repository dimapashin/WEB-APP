"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { AuthScreen } from "@/components/screens/auth-screen"
import { MainScreen } from "@/components/screens/main-screen"
import { BreakfastScreen } from "@/components/screens/breakfast-screen"
import { WakeupScreen } from "@/components/screens/wakeup-screen"
import { AboutScreen } from "@/components/screens/about-screen"
import { OrdersScreen } from "@/components/screens/orders-screen"
import { ConciergeScreen } from "@/components/screens/concierge-screen"
import { ServicesScreen } from "@/components/screens/services-screen"
import { InformationScreen } from "@/components/screens/information-screen"
import { motion, AnimatePresence } from "framer-motion"

type Screen = "auth" | "main" | "breakfast" | "wakeup" | "about" | "orders" | "concierge" | "services" | "information"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth")
  const [mounted, setMounted] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const guest = useAppStore((state) => state.guest)
  const logout = useAppStore((state) => state.logout)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated && guest) {
      // Check if session is still valid
      const checkoutDate = new Date(guest.checkoutDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      checkoutDate.setHours(0, 0, 0, 0)

      if (today > checkoutDate) {
        // Session expired
        setSessionExpired(true)
        logout()
      } else {
        setCurrentScreen("main")
      }
    }
  }, [isAuthenticated, guest]) // Updated dependency array to use guest directly

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (sessionExpired) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <img src="/images/vidi-logo-beige.png" alt="VIDI" className="h-10 mx-auto mb-4" />
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-foreground">Срок проживания истек</h1>
            <p className="text-muted-foreground">
              Ваш срок проживания истек. Для доступа к услугам, пожалуйста, обратитесь на ресепшен.
            </p>
          </div>
          <button
            onClick={() => {
              setSessionExpired(false)
              setCurrentScreen("auth")
            }}
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Новый вход
          </button>
        </div>
      </div>
    )
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.98 },
  }

  const handleLogout = () => {
    logout()
    setCurrentScreen("auth")
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen"
        >
          {currentScreen === "auth" && <AuthScreen onSuccess={() => setCurrentScreen("main")} />}
          {currentScreen === "main" && (
            <MainScreen
              onOrdersClick={() => setCurrentScreen("orders")}
              onWakeupClick={() => setCurrentScreen("wakeup")}
              onAboutClick={() => setCurrentScreen("about")}
              onBreakfastClick={() => setCurrentScreen("breakfast")}
              onConciergeClick={() => setCurrentScreen("concierge")}
              onServicesClick={() => setCurrentScreen("services")}
              onInformationClick={() => setCurrentScreen("information")}
              onLogout={handleLogout}
            />
          )}
          {currentScreen === "breakfast" && <BreakfastScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "wakeup" && <WakeupScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "about" && <AboutScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "orders" && <OrdersScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "concierge" && <ConciergeScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "services" && <ServicesScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "information" && <InformationScreen onBack={() => setCurrentScreen("main")} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
