"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useT } from "@/lib/i18n"
import { ChevronLeft } from "lucide-react"

interface CheckoutDatesScreenProps {
  guestName: string
  roomNumber: string
  onConfirm: (checkInDate: string, checkoutDate: string) => void
  onBack: () => void
}

export function CheckoutDatesScreen({
  guestName,
  roomNumber,
  onConfirm,
  onBack,
}: CheckoutDatesScreenProps) {
  const t = useT()
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  const [checkInDate, setCheckInDate] = useState(today)
  const [checkoutDate, setCheckoutDate] = useState(tomorrow)
  const [loading, setLoading] = useState(false)

  const isValid =
    checkInDate &&
    checkoutDate &&
    new Date(checkoutDate) > new Date(checkInDate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirm(checkInDate, checkoutDate)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 pb-[env(safe-area-inset-bottom)] pt-[calc(env(safe-area-inset-top)+2rem)]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          className="p-2 h-auto text-foreground hover:text-primary"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          {t("auth.dates_title")}
        </h1>
        <div className="w-10" />
      </div>

      {/* CARD */}
      <div className="bg-card/60 border border-border/60 rounded-2xl shadow-sm backdrop-blur-sm p-5 space-y-4 mb-8">
        <p className="text-sm text-muted-foreground">
          {t("auth.guest")}: {guestName}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("auth.room")}: {roomNumber}
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* CHECK-IN */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.checkin")}
          </label>
          <div className="rounded-xl overflow-hidden border border-border/60 bg-card/50">
            <Input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="bg-transparent text-foreground h-12 w-full px-4 appearance-none"
            />
          </div>
        </div>

        {/* CHECK-OUT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("auth.checkout")}
          </label>
          <div className="rounded-xl overflow-hidden border border-border/60 bg-card/50">
            <Input
              type="date"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              min={checkInDate}
              className="bg-transparent text-foreground h-12 w-full px-4 appearance-none"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={!isValid || loading}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? t("auth.confirming") : t("auth.confirm")}
        </Button>
      </form>
    </div>
  )
}
