"use client"

import { UtensilsCrossed, ConciergeBell as Concierge, Sparkles, Info } from "lucide-react"
import { useT } from "@/lib/i18n"

interface ServiceCardsProps {
  onBreakfastClick: () => void
  onConciergeClick: () => void
  onServicesClick: () => void
  onInformationClick: () => void
}

export function ServiceCards({ onBreakfastClick, onConciergeClick, onServicesClick, onInformationClick }: ServiceCardsProps) {
  const t = useT()

  const services = [
    {
      icon: UtensilsCrossed,
      titleKey: "services.breakfast",
      subtitle: "7:00 - 11:00",
      onClick: onBreakfastClick,
    },
    {
      icon: Concierge,
      titleKey: "services.concierge",
      subtitle: "Такси, рестораны, экскурсии",
      onClick: onConciergeClick,
    },
    {
      icon: Sparkles,
      titleKey: "services.services",
      subtitle: "Прачечная, уборка, расходники",
      onClick: onServicesClick,
    },
    {
      icon: Info,
      titleKey: "services.information",
      subtitle: "Полезная информация",
      onClick: onInformationClick,
    },
  ]

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <button
          key={service.titleKey}
          onClick={service.onClick}
          className="w-full bg-card rounded-2xl p-5 flex items-center gap-4 transition-scale active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <service.icon className="w-7 h-7 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">{t(service.titleKey)}</h3>
            <p className="text-sm text-muted-foreground">{service.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
