"use client"

import { WeatherWidget } from "@/components/weather-widget"
import { QuickActions } from "@/components/quick-actions"
import { ServiceCards } from "@/components/service-cards"
import { useAppStore } from "@/lib/store"
import { getGreeting } from "@/lib/weather"
import { useT, useLanguage } from "@/lib/i18n"
import { LogOut, Languages } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn, tap } from "@/lib/animations"
import { useState, useRef, useEffect } from "react"

// TEMPORARY STAY WIDGET (design later)
function StayWidget() {
  return (
    <div className="bg-card rounded-xl p-4 flex items-center justify-center h-[110px]">
      <p className="text-foreground opacity-60">Stay widget placeholder</p>
    </div>
  )
}

// WIDGET STACK
function WidgetStack() {
  const widgets = [<WeatherWidget key="weather" />, <StayWidget key="stay" />]
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const onScroll = () => {
    if (!ref.current) return
    const scrollLeft = ref.current.scrollLeft
    const width = ref.current.clientWidth
    const newIndex = Math.round(scrollLeft / width)
    setIndex(newIndex)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        className="
          flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide
          -mx-4 px-4
        "
        style={{ scrollBehavior: "smooth" }}
      >
        {widgets.map((widget, i) => (
          <div key={i} className="snap-start w-full shrink-0">
            {widget}
          </div>
        ))}
      </div>

      {/* PAGE INDICATORS */}
      <div className="flex justify-center gap-2 pt-1">
        {widgets.map((_, i) => (
          <div
            key={i}
            className={`
              h-2 w-2 rounded-full transition-all
              ${i === index ? "bg-primary" : "bg-muted-foreground/30"}
            `}
          />
        ))}
      </div>
    </div>
  )
}

interface MainScreenProps {
  onOrdersClick: () => void
  onWakeupClick: () => void
  onAboutClick: () => void
  onBreakfastClick: () => void
  onConciergeClick: () => void
  onServicesClick: () => void
  onInformationClick: () => void
  onLogout: () => void
}

export function MainScreen({
  onOrdersClick,
  onWakeupClick,
  onAboutClick,
  onBreakfastClick,
  onConciergeClick,
  onServicesClick,
  onInformationClick,
  onLogout,
}: MainScreenProps) {
  const guest = useAppStore((state) => state.guest)
  const t = useT()
  const { language, setLanguage } = useLanguage()

  return (
    <motion.div
      key={language}
      {...fadeIn}
      className="min-h-screen bg-background app-screen flex flex-col"
    >
      {/* HEADER */}
      <div
        className="px-4 pb-4 flex items-center justify-center relative"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)",
        }}
      >
        {/* Language Switch */}
        <motion.button
          onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
          className="absolute left-4 h-9 w-14 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-all duration-200 shadow-sm flex items-center justify-center gap-1 rounded-md"
          {...tap}
        >
          <Languages className="w-4 h-4" />
          <span className="text-xs">{language === "ru" ? "EN" : "RU"}</span>
        </motion.button>

        {/* Logo */}
        <img src="/images/vidi-logo-beige.png" alt="VIDI" className="h-12" />

        {/* Logout */}
        <motion.button
          onClick={onLogout}
          className="absolute right-4 h-9 p-2 text-foreground hover:text-primary transition-colors flex items-center"
          {...tap}
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>

      {/* MAIN CONTENT */}
      <div
        className="px-4 pb-[env(safe-area-inset-bottom)] space-y-7 main-screen-content"
        style={{
          marginTop: "10px",
        }}
      >
        {/* Greeting + Room */}
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              {t(`main.greeting_${getGreetingType()}`)}, {guest?.name}
            </h1>

            {/* UPDATED ROOM BADGE */}
            <div
              className="
                px-3 py-1
                rounded-xl
                bg-card/40
                border border-border/40
                shadow-sm
                backdrop-blur-sm
                inline-block
                whitespace-nowrap
              "
            >
              <p className="text-base font-semibold text-foreground">
                {guest?.roomNumber}
              </p>
            </div>
          </div>
        </div>

        {/* WIDGET STACK */}
        <WidgetStack />

        {/* Quick Actions */}
        <div className="space-y-3">
          <QuickActions
            onOrdersClick={onOrdersClick}
            onWakeupClick={onWakeupClick}
            onAboutClick={onAboutClick}
          />
        </div>

        {/* Service Cards */}
        <div className="space-y-3">
          <ServiceCards
            onBreakfastClick={onBreakfastClick}
            onConciergeClick={onConciergeClick}
            onServicesClick={onServicesClick}
            onInformationClick={onInformationClick}
          />
        </div>
      </div>
    </motion.div>
  )
}

function getGreetingType(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}
