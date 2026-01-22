"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendToTelegram } from "@/lib/telegram-service"
import { useAppStore } from "@/lib/store"
import { Wifi, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, tap } from "@/lib/animations"

export function WifiSection() {
  const [voucher, setVoucher] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { guest } = useAppStore()

  const handleConnectWifi = async () => {
    if (!voucher.trim()) {
      alert("Пожалуйста, введите номер ваучера")
      return
    }

    setIsLoading(true)

    const ok = await sendToTelegram({
      type: "wifi",
      roomNumber: guest?.roomNumber || "Не указан",
      guestName: guest?.name || "Не указан",
      details: `Ваучер: ${voucher}. Запрос на подключение к сети Wi-Fi "VIDI".`,
      telegramId: guest?.telegramId,
    })

    setIsLoading(false)

    if (ok) {
      setSuccess(true)
      setVoucher("")
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert("❌ Ошибка отправки заявки. Пожалуйста, позвоните на ресепшен.")
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER TEXT */}
      <motion.div {...fadeInUp(0.05)} className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Бесплатный Wi‑Fi “VIDI”</h2>
        <p className="text-sm text-muted-foreground">
          Подключитесь к нашей сети для быстрого интернета
        </p>
      </motion.div>

      {/* STEPS CARD */}
      <motion.div
        {...fadeInUp(0.1)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-4"
      >
        {[
          {
            num: "1",
            title: "Найдите сеть",
            text: (
              <>
                В настройках Wi‑Fi выберите сеть{" "}
                <strong className="text-foreground">“VIDI”</strong>
              </>
            ),
          },
          {
            num: "2",
            title: "Введите ваучер",
            text: "После подключения откроется страница авторизации",
          },
          {
            num: "3",
            title: "Или используйте форму ниже",
            text: "Мы подключим вас удалённо",
          },
        ].map((step, index) => (
          <motion.div
            key={step.num}
            {...fadeInUp(0.12 + index * 0.04)}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm backdrop-blur-sm">
              <span className="text-primary font-semibold text-sm">{step.num}</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-medium text-foreground">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* VOUCHER FORM */}
      <motion.div
        {...fadeInUp(0.2)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-4"
      >
        <h3 className="font-semibold text-foreground">Подключение по ваучеру</h3>

        <Input
          type="text"
          placeholder="Введите номер вашего ваучера"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          className="bg-background/40 border-border/60 text-foreground h-12 rounded-xl"
        />

        {success ? (
          <motion.div
            {...fadeInUp(0.25)}
            className="flex items-center gap-2 text-primary bg-primary/10 border border-primary/20 rounded-xl p-3 shadow-sm backdrop-blur-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">
              Заявка отправлена! Мы подключим Wi‑Fi в течение 15 минут.
            </span>
          </motion.div>
        ) : (
          <motion.button
            {...tap}
            onClick={handleConnectWifi}
            disabled={isLoading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold disabled:opacity-50"
          >
            {isLoading ? "Отправка..." : "Подключить Wi‑Fi"}
          </motion.button>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Если у вас нет ваучера, обратитесь на ресепшен для получения доступа
        </p>
      </motion.div>
    </div>
  )
}

/*  
  Чтобы InformationScreen мог отображать иконку Wi‑Fi в списке карточек,
  добавляем статическое поле icon:
*/
WifiSection.icon = Wifi
