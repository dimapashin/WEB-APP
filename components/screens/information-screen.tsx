"use client"

import { useState } from "react"
import { useT } from "@/lib/i18n"
import { ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { WifiSection } from "./information/wifi-section"
import { FeedbackSection } from "./information/feedback-section"
import { OffersSection } from "./information/offers-section"
import { AnimalsSection } from "./information/animals-section"

import {
  screenTransition,
  fadeInUp,
  tap,
} from "@/lib/animations"

interface InformationScreenProps {
  onBack: () => void
}

const INFORMATION_CARDS = [
  {
    id: "wifi",
    title: "Wi‑Fi",
    subtitle: "Подключение к интернету",
    icon: WifiSection.icon,
    component: <WifiSection />,
  },
  {
    id: "feedback",
    title: "Оставить отзыв",
    subtitle: "Поделитесь впечатлениями",
    icon: FeedbackSection.icon,
    component: <FeedbackSection />,
  },
  {
    id: "offers",
    title: "Акции",
    subtitle: "Специальные предложения",
    icon: OffersSection.icon,
    component: <OffersSection />,
  },
  {
    id: "animals",
    title: "Проживание с животными",
    subtitle: "Условия для питомцев",
    icon: AnimalsSection.icon,
    component: <AnimalsSection />,
  },
]

export function InformationScreen({ onBack }: InformationScreenProps) {
  const t = useT()
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const selectedCard = INFORMATION_CARDS.find((card) => card.id === activeCard)

  /* ---------------------- SUBSCREEN ---------------------- */

  if (activeCard && selectedCard) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCard}
          {...screenTransition}
          className="min-h-screen bg-background flex flex-col app-screen"
        >
          {/* HEADER */}
          <div
            className="flex items-center justify-between px-4 pb-4"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
          >
            <motion.button {...tap} onClick={() => setActiveCard(null)} className="p-2 -ml-2">
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </motion.button>

            <h1 className="text-lg font-semibold text-foreground">
              {selectedCard.title}
            </h1>

            <div className="w-10" />
          </div>

          {/* CONTENT */}
          <motion.div
            {...fadeInUp(0.05)}
            className="flex-1 overflow-y-auto px-4 pb-[env(safe-area-inset-bottom)] space-y-6"
          >
            {selectedCard.component}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  /* ---------------------- MAIN SCREEN ---------------------- */

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="information-main"
        {...screenTransition}
        className="min-h-screen bg-background flex flex-col app-screen"
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between px-4 pb-4"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
        >
          <motion.button {...tap} onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <h1 className="text-lg font-semibold text-foreground">
            {t("information.title")}
          </h1>

          <div className="w-10" />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 pb-[env(safe-area-inset-bottom)] space-y-3">
          {INFORMATION_CARDS.map((card, index) => (
            <motion.button
              key={card.id}
              {...fadeInUp(index * 0.05)}
              {...tap}
              onClick={() => setActiveCard(card.id)}
              className="
                w-full bg-card rounded-2xl p-4 flex items-center gap-4
                hover:bg-card/80 transition-colors shadow-sm
              "
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <card.icon className="w-6 h-6 text-primary" />
              </div>

              <div className="text-left flex-1">
                <h3 className="font-medium text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.subtitle}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
