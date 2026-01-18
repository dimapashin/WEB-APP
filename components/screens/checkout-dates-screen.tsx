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

export function CheckoutDatesScreen({ guestName, roomNumber, onConfirm, onBack }: CheckoutDatesScreenProps) {
  const t = useT()
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  const [checkInDate, setCheckInDate] = useState(today)
  const [checkoutDate, setCheckoutDate] = useState(tomorrow)
  const [loading, setLoading] = useState(false)

  const isValid = checkInDate && checkoutDate && new Date(checkoutDate) > new Date(checkInDate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirm(checkInDate, checkoutDate)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6" style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="p-2 h-auto text-foreground hover:text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Уточнение дат</h1>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Гость: {guestName}</p>
          <p className="text-sm text-muted-foreground">Комната: {roomNumber}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Дата заезда</label>
            <Input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="bg-card border-border text-foreground h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Дата выезда</label>
            <Input
              type="date"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              className="bg-card border-border text-foreground h-12"
              min={checkInDate}
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 mt-6"
          >
            {loading ? "Подтверждение..." : "Подтвердить"}
          </Button>
        </form>
      </div>
    </div>
  )
}
