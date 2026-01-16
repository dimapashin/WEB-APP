"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"

interface AuthScreenProps {
  onSuccess: () => void
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [name, setName] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const setGuest = useAppStore((state) => state.setGuest)

  const isValid = name.trim() && roomNumber.trim() && agreed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError("")

    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo, accept any 3-4 digit room number
    if (!/^\d{3,4}$/.test(roomNumber)) {
      setError("Неверный номер комнаты")
      setLoading(false)
      return
    }

    setGuest({ name: name.trim(), roomNumber })
    onSuccess()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/images/vidi-logo-beige.png" alt="VIDI" className="h-10 mx-auto mb-4" />
          <p className="text-muted-foreground">Добро пожаловать</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
            />
          </div>
          <div>
            <Input
              placeholder="Номер комнаты"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value.replace(/\D/g, ""))}
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
              Я согласен с{" "}
              <a
                href="https://vidi-hotel.ru/personal-data-processing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                политикой обработки персональных данных
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  )
}
