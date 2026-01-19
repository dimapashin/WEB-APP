"use client"
import { WeatherWidget } from "@/components/weather-widget"
import { QuickActions } from "@/components/quick-actions"
import { ServiceCards } from "@/components/service-cards"
import { useAppStore } from "@/lib/store"
import { getGreeting } from "@/lib/weather"
import { useT, useLanguage } from "@/lib/i18n"
import { LogOut, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const greeting = getGreeting()
  const t = useT()
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-background app-screen">
      <div className="px-4 py-4 flex items-center justify-center relative">
        <Button
          onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
          variant="outline"
          size="icon"
          className="absolute left-4 h-9 w-16 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-all duration-200 shadow-sm"
        >
          <Languages className="w-4 h-4 mr-1" />
          <span className="text-xs">{language === "ru" ? "EN" : "RU"}</span>
        </Button>
        <img src="/images/vidi-logo-beige.png" alt="VIDI" className="h-10" />
        <button
          onClick={onLogout}
          className="absolute right-4 p-2 text-foreground hover:text-primary transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl font-semibold text-foreground">
              {t(`main.greeting_${getGreetingType()}`)}, {guest?.name}
            </h1>
            <div className="px-2.5 py-0.5 border-2 border-primary rounded-lg inline-block whitespace-nowrap">
              <p className="text-sm font-semibold text-primary">{guest?.roomNumber}</p>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <WeatherWidget />

        {/* Quick Actions */}
        <div className="space-y-3">
          <QuickActions onOrdersClick={onOrdersClick} onWakeupClick={onWakeupClick} onAboutClick={onAboutClick} />
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
    </div>
  )
}

function getGreetingType(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}
