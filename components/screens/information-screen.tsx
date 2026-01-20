"use client"

import { useState } from "react"
import { useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Wifi, Star, Gift, Heart, Map, UtensilsCrossed, Car, Shirt, Sparkles, ShoppingBag, Brush } from "lucide-react"
import { WifiSection } from "./information/wifi-section"
import { FeedbackSection } from "./information/feedback-section"
import { OffersSection } from "./information/offers-section"
import { AnimalsSection } from "./information/animals-section"

interface InformationScreenProps {
  onBack: () => void
}

// Define sections as cards similar to concierge and services screens
const INFORMATION_CARDS = [
  { id: "wifi", title: "Wi-Fi", subtitle: "Подключение к интернету", icon: Wifi, component: <WifiSection /> },
  { id: "feedback", title: "Оставить отзыв", subtitle: "Поделитесь впечатлениями", icon: Star, component: <FeedbackSection /> },
  { id: "offers", title: "Акции", subtitle: "Специальные предложения", icon: Gift, component: <OffersSection /> },
  { id: "animals", title: "Проживание с животными", subtitle: "Условия для питомцев", icon: Heart, component: <AnimalsSection /> },
]

export function InformationScreen({ onBack }: InformationScreenProps) {
  const t = useT()
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const selectedCard = INFORMATION_CARDS.find(card => card.id === activeCard)

  if (activeCard && selectedCard) {
    return (
      <div className="min-h-screen bg-background flex flex-col app-screen">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setActiveCard(null)} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{selectedCard.title}</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {selectedCard.component}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4">
        <Button onClick={onBack} variant="ghost" className="p-2 h-auto text-foreground hover:text-primary">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{t("information.title")}</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 py-6 space-y-3">
        {INFORMATION_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 transition-scale active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <card.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-medium text-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
