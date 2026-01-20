"use client"

import { ChevronLeft, MapPin, Phone, Mail } from "lucide-react"
import { VidiLogo } from "@/components/ui/vidi-logo"
import { Button } from "@/components/ui/button"
import { useT } from "@/lib/i18n"

interface AboutScreenProps {
  onBack: () => void
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  const t = useT()

  const socialLinks = [
    {
      icon: "/icons/telegram-icon.svg",
      url: "https://t.me/Vidi_Hotel",
      label: "Telegram",
    },
    {
      icon: "/icons/vk-icon.svg",
      url: "https://vk.com/vidihotel",
      label: "VK",
    },
    {
      icon: "/icons/max-icon.svg",
      url: "https://max.ru/u/f9LHodD0cOJ4faT1vazTiGU79fO2d-jquRp4IYdrH8rANDb8AqlLKaVCsOI",
      label: "Max",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4">
        <Button onClick={onBack} variant="ghost" className="p-2 h-auto text-foreground hover:text-primary">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{t("about.title")}</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 py-2 space-y-6">
        <div className="text-center">
          <VidiLogo className="w-20 h-auto mx-auto text-primary mb-2" />
          <p className="text-muted-foreground text-sm">{t("about.description")}</p>
        </div>

        <div className="space-y-4">
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
                  className="text-primary text-sm mt-1 block hover:underline"
                >
                  Херсонский пр-д, 6 стр. 1
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{t("about.phone")}</h3>
                <a href="tel:+78126795772" className="text-primary text-sm mt-1 block hover:underline">
                  +7 (812) 679-57-72
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{t("about.email")}</h3>
                <a href="mailto:reception@vidi-hotel.ru" className="text-primary text-sm mt-1 block hover:underline">
                  reception@vidi-hotel.ru
                </a>
              </div>
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

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground px-2">{t("about.follow_us")}</h3>
          <div className="flex justify-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                title={link.label}
              >
                <img src={link.icon} alt={link.label} className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
