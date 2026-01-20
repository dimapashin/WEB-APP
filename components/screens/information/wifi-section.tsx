"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendToTelegram } from "@/lib/telegram-service"
import { useAppStore } from "@/lib/store"
import { Wifi, CheckCircle2 } from "lucide-react"

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

    const success = await sendToTelegram({
      type: "wifi",
      roomNumber: guest?.roomNumber || "Не указан",
      guestName: guest?.name || "Не указан",
      details: `Ваучер: ${voucher}. Запрос на подключение к сети Wi-Fi "VIDI".`,
    })

    setIsLoading(false)

    if (success) {
      setSuccess(true)
      setVoucher("")
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert("❌ Ошибка отправки заявки. Пожалуйста, позвоните на ресепшен.")
    }
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Бесплатный Wi-Fi "VIDI"</h2>
        <p className="text-sm text-muted-foreground">Подключитесь к нашей сети для быстрого интернета</p>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Найдите сеть</h4>
              <p className="text-sm text-muted-foreground mt-1">
                В настройках Wi-Fi выберите сеть <strong className="text-foreground">"VIDI_Hotel"</strong>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Введите ваучер</h4>
              <p className="text-sm text-muted-foreground mt-1">После подключения откроется страница авторизации</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Или используйте форму ниже</h4>
              <p className="text-sm text-muted-foreground mt-1">Мы подключим вас удаленно</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        <h3 className="font-semibold text-foreground">Подключение по ваучеру</h3>
        <Input
          type="text"
          placeholder="Введите номер вашего ваучера"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          className="bg-background border-border text-foreground h-12"
        />
        {success ? (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">Заявка отправлена! Мы подключим Wi-Fi в течение 15 минут.</span>
          </div>
        ) : (
          <Button onClick={handleConnectWifi} disabled={isLoading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
            {isLoading ? "Отправка..." : "Подключить Wi-Fi"}
          </Button>
        )}
        <p className="text-xs text-muted-foreground text-center">
          Если у вас нет ваучера, обратитесь на ресепшен для получения доступа
        </p>
      </div>
    </div>
  )
}
