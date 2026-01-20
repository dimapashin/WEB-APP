"use client"

import { ChevronLeft, MapPin, Phone, Mail } from "lucide-react"
import { VidiLogo } from "@/components/ui/vidi-logo"
import { useT } from "@/lib/i18n"
import { motion } from "framer-motion"
import { screenTransition, fadeInUp, tap, scaleIn } from "@/lib/animations"

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
          {t("about.title")}
        </h1>

        <div className="w-10" />
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-[env(safe-area-inset-bottom)] space-y-8">

        {/* Logo + Description */}
        <motion.div className="text-center space-y-3" {...fadeInUp(0.05)}>
          <motion.div {...scaleIn}>
            <VidiLogo className="w-28 h-auto mx-auto text-primary mb-2" />
          </motion.div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("about.description")}
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="space-y-4">
          {[
            {
              icon: <MapPin className="w-5 h-5 text-primary" />,
              title: "Адрес",
              content: "Херсонский пр-д, 6 стр. 1",
              link: "https://yandex.ru/maps/org/vidi/110414477756/?ll=30.386341%2C59.929277&z=16",
            },
            {
              icon: <Phone className="w-5 h-5 text-primary" />,
              title: t("about.phone"),
              content: "+7 (812) 679-57-72",
              link: "tel:+78126795772",
            },
            {
              icon: <Mail className="w-5 h-5 text-primary" />,
              title: t("about.email"),
              content: "reception@vidi-hotel.ru",
              link: "mailto:reception@vidi-hotel.ru",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeInUp(0.1 + i * 0.05)}
              className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{item.title}</h3>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm mt-1 block hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(item.link, "_blank")
                    }}
                  >
                    {item.content}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          {...fadeInUp(0.25)}
          className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Ресепшен</h3>
              <p className="text-sm text-muted-foreground">Круглосуточно</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Завтрак</h3>
              <p className="text-sm text-muted-foreground">Ежедневно с 7:00 до 11:00</p>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div {...fadeInUp(0.3)} className="space-y-3">
          <h3 className="text-sm font-medium text-foreground px-2">
            {t("about.follow_us")}
          </h3>

          <div className="flex justify-center gap-6">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shadow-sm backdrop-blur-sm"
                title={link.label}
                {...fadeInUp(0.35 + i * 0.05)}
              >
                <img src={link.icon} alt={link.label} className="w-9 h-9" />
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
