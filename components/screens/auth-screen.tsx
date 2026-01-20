"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { useT, useLanguage } from "@/lib/i18n"
import { Languages } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AuthScreenProps {
  onSuccess: () => void
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [name, setName] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"credentials" | "dates">("credentials")
  const setGuest = useAppStore((state) => state.setGuest)
  const t = useT()
  const { language, setLanguage } = useLanguage()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const roomInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleInputFocus = (inputRef: React.RefObject<HTMLInputElement>) => {
    // Просто убираем эту функцию, чтобы не вызывать прокрутку при фокусировке
    // которая приводит к "прыжкам" элементов при открытии клавиатуры
  }

  const isValid = name.trim() && roomNumber.trim() && agreed

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError("")

    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo, accept any 3-4 digit room number
    if (!/^\d{3,4}$/.test(roomNumber)) {
      setError(t("auth.invalid_room"))
      setLoading(false)
      return
    }

    setLoading(false)
    setStep("dates")
  }

  const handleDatesConfirm = (checkInDate: string, checkoutDate: string) => {
    setGuest({
      name: name.trim(),
      roomNumber,
      checkInDate,
      checkoutDate,
      telegramId: String(Date.now()), // Placeholder for Telegram ID
    })
    onSuccess()
  }

  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const [checkInDate, setCheckInDate] = useState(today)
  const [checkoutDate, setCheckoutDate] = useState(tomorrow)
  const datesValid = checkInDate && checkoutDate && new Date(checkoutDate) > new Date(checkInDate)

  const handleDatesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (datesValid) {
      handleDatesConfirm(checkInDate, checkoutDate)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 relative auth-screen" style={{ 
      scrollBehavior: "smooth",
      justifyContent: "flex-start",
      paddingTop: "calc(1.5rem + 0.625rem + 0.3125rem + env(safe-area-inset-top))"
    }}>
      <Button
        onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
        variant="outline"
        size="icon"
        className="absolute left-4 h-9 w-16 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-all duration-200 shadow-sm z-10"
      >
        <Languages className="w-4 h-4 mr-1" />
        <span className="text-xs">{language === "ru" ? "EN" : "RU"}</span>
      </Button>
      <div className="w-full max-w-sm mx-auto space-y-8 mt-8" style={{ maxWidth: '100%' }}>
        <div className="text-center">
          <img src="/images/vidi-logo-beige.png" alt="VIDI" className="h-10 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("welcome")}</p>
        </div>

        <form ref={formRef} onSubmit={handleCredentialsSubmit} className="space-y-4" style={{ position: "relative" }}>
          <div>
            <Input
              ref={nameInputRef}
              placeholder={t("auth.name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => handleInputFocus(nameInputRef)}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
            />
          </div>
          <div>
            <Input
              ref={roomInputRef}
              placeholder={t("auth.room_placeholder")}
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value.replace(/\D/g, ""))}
              onFocus={() => handleInputFocus(roomInputRef)}
              inputMode="numeric"
              className={`bg-card border-border text-foreground placeholder:text-muted-foreground h-12 ${
                error ? "border-destructive" : ""
              }`}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="agree" className="text-sm text-muted-foreground leading-tight">
              {t("auth.agree")}{" "}
              <a
                href="https://vidi-hotel.ru/personal-data-processing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {t("auth.privacy_policy")}
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? t("auth.entering") : t("auth.enter")}
          </Button>
        </form>
      </div>

      {/* Dates Modal */}
      <AnimatePresence>
        {step === "dates" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setStep("credentials")}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full space-y-4 border border-border mx-auto"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 'calc(100vw - 3rem)' }}
            >
              <h2 className="text-lg font-semibold text-foreground text-center">Уточнение дат</h2>
              <form onSubmit={handleDatesSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Дата заезда</label>
                  <Input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="bg-background border-border text-foreground h-12 w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Дата выезда</label>
                  <Input
                    type="date"
                    value={checkoutDate}
                    onChange={(e) => setCheckoutDate(e.target.value)}
                    className="bg-background border-border text-foreground h-12 w-full"
                    min={checkInDate}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!datesValid}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Подтвердить
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
