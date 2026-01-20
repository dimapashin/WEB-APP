"use client"

import { Gift, Users, Calendar, ExternalLink } from "lucide-react"

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
    details: ["Бронирование минимум за 7 дней до заезда", "Скидка 10% на стоимость проживания", "Применяется автоматически при бронировании"],
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
    <div className="px-4 py-2 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Акции и специальные предложения</h2>
        <p className="text-sm text-muted-foreground">Выгодные условия для вашего комфортного проживания</p>
      </div>

      <div className="space-y-4">
        {OFFERS.map((offer) => (
          <div key={offer.id} className="bg-card rounded-2xl p-4 space-y-3 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <offer.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{offer.title}</h3>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </div>
            </div>
            <div className="space-y-2 pl-15">
              {offer.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-sm text-foreground">{detail}</span>
                </div>
              ))}
              {offer.note && (
                <p className="text-xs text-muted-foreground mt-2 italic">{offer.note}</p>
              )}
            </div>
            {offer.link && (
              <a
                href={offer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary text-sm font-medium hover:underline"
              >
                Перейти в группу ВК
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
