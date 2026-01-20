"use client"

import { ChevronLeft, MapPin, Phone, Mail } from "lucide-react"
import { VidiLogo } from "@/components/ui/vidi-logo"
import { useT } from "@/lib/i18n"

interface AboutScreenProps {
  onBack: () => void
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  const t = useT()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ paddingTop: `calc(1.5rem + 5rem)` }}
      >
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{t("about.title")}</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-4 py-2 space-y-6">

        {/* Logo + description */}
        <div className="text-center pt-4">
          <VidiLogo className="w-28 h-auto mx-auto text-primary mb-2" />
          <p className="text-muted-foreground text-sm">{t("about.description")}</p>
        </div>

        {/* Address */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Адрес</h3>
              <a
                href="https://yandex.ru/maps/org/vidi/110414477756/?ll=30.386341%2C59.929277&z=16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm mt-1 block hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(
                    "https://yandex.ru/maps/org/vidi/110414477756/?ll=30.386341%2C59.929277&z=16",
                    "_blank"
                  )
                }}
              >
                Херсонский пр-д, 6 стр. 1
              </a>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t("about.phone")}</h3>
              <a
                href="tel:+78126795772"
                className="text-primary text-sm mt-1 block hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = "tel:+78126795772"
                }}
              >
                +7 (812) 679-57-72
              </a>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t("about.email")}</h3>
              <a
                href="mailto:reception@vidi-hotel.ru"
                className="text-primary text-sm mt-1 block hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = "mailto:reception@vidi-hotel.ru"
                }}
              >
                reception@vidi-hotel.ru
              </a>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="bg-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Ресепшен</h3>
              <p className="text-sm text-muted-foreground">Круглосуточно</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Завтрак</h3>
              <p className="text-sm text-muted-foreground">Ежедневно с 7:00 до 11:00</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
