"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { useT, useLanguage } from "@/lib/i18n"
import { CheckoutDatesScreen } from "./checkout-dates-screen"
import { Languages } from "lucide-react"

export function AuthScreen({ onSuccess }) {
  const [name, setName] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState("credentials")

  const setGuest = useAppStore((s) => s.setGuest)
  const t = useT()
  const { language, setLanguage } = useLanguage()

  const nameRef = useRef(null)
  const roomRef = useRef(null)

  const handleFocus = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 250)
  }

  const isValid = name.trim() && roomNumber.trim() && agreed

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError("")

    await new Promise((r) => setTimeout(r, 700))

    if (!/^\d{3,4}$/.test(roomNumber)) {
      setError(t("auth.invalid_room"))
      setLoading(false)
      return
    }

    setLoading(false)
    setStep("dates")
  }

  const handleDatesConfirm = (checkInDate, checkoutDate) => {
    setGuest({
      name: name.trim(),
      roomNumber,
      checkInDate,
      checkoutDate,
      telegramId: String(Date.now()),
    })
    onSuccess()
  }

  if (step === "dates") {
    return (
      <CheckoutDatesScreen
        guestName={name}
        roomNumber={roomNumber}
        onConfirm={handleDatesConfirm}
        onBack={() => setStep("credentials")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col app-screen px-6 pb-[env(safe-area-inset-bottom)]">

      {/* HEADER WITH LANGUAGE SWITCH */}
      <div
        className="flex justify-end pt-[calc(env(safe-area-inset-top)+1rem)] pb-6"
      >
        <Button
          onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
          variant="outline"
          size="icon"
          className="h-9 w-16 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold shadow-sm"
        >
          <Languages className="w-4 h-4 mr-1" />
          <span className="text-xs">{language === "ru" ? "EN" : "RU"}</span>
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto space-y-10">

        {/* LOGO */}
        <div className="text-center">
          <img
            src="/images/vidi-logo-beige.png"
            alt="VIDI"
            className="h-10 mx-auto mb-4"
          />
          <p className="text-muted-foreground">{t("welcome")}</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">

          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.name_placeholder")}
            </label>

            <div className="bg-card/60 border border-border/60 rounded-xl h-12 flex items-center px-4 shadow-sm backdrop-blur-sm">
              <Input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => handleFocus(nameRef)}
                placeholder={t("auth.name_placeholder")}
                className="bg-transparent border-none h-full px-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          {/* ROOM NUMBER */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("auth.room_placeholder")}
            </label>

            <div className={`bg-card/60 border rounded-xl h-12 flex items-center px-4 shadow-sm backdrop-blur-sm ${
              error ? "border-destructive" : "border-border/60"
            }`}>
              <Input
                ref={roomRef}
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                onFocus={() => handleFocus(roomRef)}
                placeholder={t("auth.room_placeholder")}
                className="bg-transparent border-none h-full px-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          {/* AGREEMENT */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v)}
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

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? t("auth.entering") : t("auth.enter")}
          </Button>
        </form>
      </div>
    </div>
  )
}
