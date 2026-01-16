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
import { motion, AnimatePresence } from "framer-motion"

type Screen = "auth" | "main" | "breakfast" | "wakeup" | "about" | "orders" | "concierge" | "services"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth")
  const [mounted, setMounted] = useState(false)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const logout = useAppStore((state) => state.logout)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) {
      setCurrentScreen("main")
    }
  }, [isAuthenticated])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
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
          transition={{ duration: 0.2 }}
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
              onLogout={handleLogout}
            />
          )}
          {currentScreen === "breakfast" && <BreakfastScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "wakeup" && <WakeupScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "about" && <AboutScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "orders" && <OrdersScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "concierge" && <ConciergeScreen onBack={() => setCurrentScreen("main")} />}
          {currentScreen === "services" && <ServicesScreen onBack={() => setCurrentScreen("main")} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
