"use client"
import { WeatherWidget } from "@/components/weather-widget"
import { QuickActions } from "@/components/quick-actions"
import { ServiceCards } from "@/components/service-cards"
import { useAppStore } from "@/lib/store"
import { getGreeting } from "@/lib/weather"
import { LogOut } from "lucide-react"

interface MainScreenProps {
  onOrdersClick: () => void
  onWakeupClick: () => void
  onAboutClick: () => void
  onBreakfastClick: () => void
  onConciergeClick: () => void
  onServicesClick: () => void
  onLogout: () => void
}

export function MainScreen({
  onOrdersClick,
  onWakeupClick,
  onAboutClick,
  onBreakfastClick,
  onConciergeClick,
  onServicesClick,
  onLogout,
}: MainScreenProps) {
  const guest = useAppStore((state) => state.guest)
  const greeting = getGreeting()

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-6 pb-6 space-y-8">
        <div className="flex items-center justify-center relative">
          <img src="/images/vidi-logo-beige.png" alt="VIDI" className="h-10" />
          <button
            onClick={onLogout}
            className="absolute right-0 p-2 text-foreground hover:text-primary transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl font-semibold text-foreground">
              {greeting}, {guest?.name}
            </h1>
            <div className="px-3 py-1 border-2 border-primary rounded-lg inline-block whitespace-nowrap">
              <p className="text-2xl font-semibold text-primary">{guest?.roomNumber}</p>
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
          />
        </div>
      </div>
    </div>
  )
}
