"use client"

import { UtensilsCrossed, ConciergeBell as Concierge, Sparkles } from "lucide-react"

interface ServiceCardsProps {
  onBreakfastClick: () => void
  onConciergeClick: () => void
  onServicesClick: () => void
}

export function ServiceCards({ onBreakfastClick, onConciergeClick, onServicesClick }: ServiceCardsProps) {
  const services = [
    {
      icon: UtensilsCrossed,
      title: "Завтрак",
      subtitle: "7:00 - 11:00",
      onClick: onBreakfastClick,
    },
    {
      icon: Concierge,
      title: "Консьерж",
      subtitle: "Такси, рестораны, экскурсии",
      onClick: onConciergeClick,
    },
    {
      icon: Sparkles,
      title: "Доп. услуги",
      subtitle: "Прачечная, уборка, расходники",
      onClick: onServicesClick,
    },
  ]

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <button
          key={service.title}
          onClick={service.onClick}
          className="w-full bg-card rounded-2xl p-5 flex items-center gap-4 transition-scale active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <service.icon className="w-7 h-7 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
            <p className="text-sm text-muted-foreground">{service.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
