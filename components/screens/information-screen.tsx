"use client"

import { useState } from "react"
import { useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Wifi, Star, Gift, Heart } from "lucide-react"
import { WifiSection } from "./information/wifi-section"
import { FeedbackSection } from "./information/feedback-section"
import { OffersSection } from "./information/offers-section"
import { AnimalsSection } from "./information/animals-section"

interface InformationScreenProps {
  onBack: () => void
}

const SECTIONS = [
  { id: "wifi", title: "Wi-Fi", icon: Wifi, component: <WifiSection /> },
  { id: "feedback", title: "Оставить отзыв", icon: Star, component: <FeedbackSection /> },
  { id: "offers", title: "Акции", icon: Gift, component: <OffersSection /> },
  { id: "animals", title: "Проживание с животными", icon: Heart, component: <AnimalsSection /> },
]

export function InformationScreen({ onBack }: InformationScreenProps) {
  const t = useT()
  const [activeSection, setActiveSection] = useState("wifi")

  return (
    <div className="min-h-screen bg-background app-screen">
      <div className="flex items-center justify-between p-4">
        <Button onClick={onBack} variant="ghost" className="p-2 h-auto text-foreground hover:text-primary">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{t("information.title")}</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 pb-6">
        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="overflow-y-auto">
          {SECTIONS.find((s) => s.id === activeSection)?.component}
        </div>
      </div>
    </div>
  )
}
