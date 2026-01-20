"use client"

import { useState } from "react"
import { useT } from "@/lib/i18n"
import { ChevronLeft, Wifi, Star, Gift, Heart } from "lucide-react"
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
    icon: Wifi,
    component: <WifiSection />,
  },
  {
    id: "feedback",
    title: "Оставить отзыв",
    subtitle: "Поделитесь впечатлениями",
    icon: Star,
    component: <FeedbackSection />,
  },
  {
    id: "offers",
    title: "Акции",
    subtitle: "Специальные предложения",
    icon: Gift,
    component: <OffersSection />,
  },
  {
    id: "animals",
    title: "Проживание с животными",
    subtitle: "Условия для питомцев",
    icon: Heart,
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
          className="min-h-screen bg-background flex flex-col"
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
            {...fadeInUp(0.1)}
            className="flex-1 overflow-y-auto px-4 pt-2 pb-[env(safe-area-inset-bottom)]"
          >
            {selectedCard.component}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  /* ---------------------- MAIN SCREEN ---------------------- */

  return (
    <motion.div
      {...screenTransition}
      className="min-h-screen bg-background flex flex-col"
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
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-[env(safe-area-inset-bottom)] space-y-4">
        {INFORMATION_CARDS.map((card, index) => {
          const isFeedback = card.id === "feedback"

          return (
            <motion.button
              key={card.id}
              {...fadeInUp(index * 0.05)}
              {...tap}
              onClick={() => setActiveCard(card.id)}
              className={`
                w-full rounded-2xl p-4 flex items-center gap-4 transition-all
                ${isFeedback
                  ? "bg-primary/10 border border-primary/20 shadow-md backdrop-blur-sm"
                  : "bg-card/60 border border-border/60 shadow-sm backdrop-blur-sm"
                }
                hover:bg-card/80
              `}
            >
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${isFeedback ? "bg-primary/20" : "bg-primary/10"}
                `}
              >
                <card.icon className="w-6 h-6 text-primary" />
              </div>

              <div className="text-left flex-1">
                <h3
                  className={`
                    font-medium text-foreground
                    ${isFeedback ? "text-primary" : ""}
                  `}
                >
                  {card.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
