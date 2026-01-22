"use client"

import { Gift, Users, Calendar, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, tap } from "@/lib/animations"

const OFFERS = [
  {
    id: 1,
    title: "-15% при подписке на группу VIDI в ВКонтакте",
    description: "Подпишитесь на нашу группу ВК и получите промокод на скидку 15%",
    icon: Users,
    details: [
      "Подпишитесь на группу ВК: vk.com/vidihotel",
      "Напишите сообщение в группе и запросите промокод",
      "Скидка действует только при бронировании через сайт с промокодом",
    ],
    link: "https://vk.com/vidihotel",
  },
  {
    id: 2,
    title: "Раннее бронирование — скидка 10%",
    description: "Забронируйте апартаменты минимум за 7 дней до заезда и получите скидку 10%",
    icon: Calendar,
    details: [
      "Бронирование минимум за 7 дней до заезда",
      "Скидка 10% на стоимость проживания",
      "Применяется автоматически при бронировании",
    ],
  },
  {
    id: 3,
    title: "-15% при проживании от 5 дней",
    description: "Выгодное предложение для длительного проживания в номерах Smart, Studio, Studio+, Family",
    icon: Gift,
    details: [
      "Применяется к номерам: Smart, Studio, Studio+, Family",
      "Минимальный срок проживания: 5 дней",
      "Скидка 15% на весь период проживания",
    ],
  },
]

export function OffersSection() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div {...fadeInUp(0.05)} className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Акции и специальные предложения</h2>
        <p className="text-sm text-muted-foreground">
          Выгодные условия для вашего комфортного проживания
        </p>
      </motion.div>

      {/* OFFERS LIST */}
      <div className="space-y-6">
        {OFFERS.map((offer, index) => (
          <motion.div
            key={offer.id}
            {...fadeInUp(0.1 + index * 0.05)}
            className="
              bg-card/60 border border-border/60 rounded-2xl p-4
              shadow-sm backdrop-blur-sm space-y-4
            "
          >
            {/* HEADER ROW */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 shadow-sm backdrop-blur-sm flex items-center justify-center shrink-0">
                <offer.icon className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-foreground">{offer.title}</h3>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </div>
            </div>

            {/* DETAILS LIST */}
            <div className="space-y-2">
              {offer.details.map((detail, idx) => (
                <motion.div
                  key={idx}
                  {...fadeInUp(0.15 + idx * 0.03)}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-foreground">{detail}</span>
                </motion.div>
              ))}
            </div>

            {/* LINK */}
            {offer.link && (
              <motion.a
                {...tap}
                href={offer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-between p-3 rounded-xl
                  bg-background/60 border border-border/60 shadow-sm backdrop-blur-sm
                  hover:bg-primary/10 transition-colors
                "
              >
                <span className="font-medium text-foreground">Перейти в группу ВК</span>
                <ExternalLink className="w-4 h-4 text-primary" />
              </motion.a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* Иконка для списка карточек в InformationScreen */
OffersSection.icon = Gift
