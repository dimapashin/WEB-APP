"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { useT, useLanguage } from "@/lib/i18n"
import { CheckoutDatesScreen } from "./checkout-dates-screen"
import { Languages } from "lucide-react"

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
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 300) // Delay for keyboard animation
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative" style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))", scrollBehavior: "smooth" }}>
      <Button
        onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
        variant="outline"
        size="icon"
        className="absolute right-6 h-9 w-16 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-all duration-200 shadow-sm z-10"
        style={{ top: "max(1.5rem, env(safe-area-inset-top))" }}
      >
        <Languages className="w-4 h-4 mr-1" />
        <span className="text-xs">{language === "ru" ? "EN" : "RU"}</span>
      </Button>
      <div className="w-full max-w-sm space-y-8">
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
    </div>
  )
}
