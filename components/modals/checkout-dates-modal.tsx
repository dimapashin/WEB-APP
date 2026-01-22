"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useT } from "@/lib/i18n"

interface CheckoutDatesModalProps {
  onConfirm: (checkIn: string, checkout: string) => void
  onClose: () => void
}

export function CheckoutDatesModal({ onConfirm, onClose }: CheckoutDatesModalProps) {
  const t = useT()

  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  const [checkInDate, setCheckInDate] = useState(today)
  const [checkoutDate, setCheckoutDate] = useState(tomorrow)
  const [loading, setLoading] = useState(false)

  const isValid = new Date(checkoutDate) > new Date(checkInDate)

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    onConfirm(checkInDate, checkoutDate)
  }

  return (
    <AnimatePresence>
      {/* Затемнение */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Модалка */}
      <motion.div
        className="
          fixed left-1/2 top-1/2 z-50 
          w-[92%] max-w-sm 
          -translate-x-1/2 -translate-y-1/2
          bg-card/90 backdrop-blur-xl 
          border border-border/40 
          rounded-2xl shadow-2xl shadow-black/40
          p-7 space-y-7
        "
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Выбор дат проживания
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/30 transition"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Поля */}
        <div className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Дата заезда
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Дата выезда
            </label>
            <div className="rounded-xl overflow-hidden border border-border/60 bg-card/50">
              <Input
                type="date"
                value={checkoutDate}
                min={checkInDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                className="bg-transparent text-foreground h-12 w-full px-4 appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Кнопка */}
        <Button
          disabled={!isValid || loading}
          onClick={handleSubmit}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Подтверждение..." : "Подтвердить"}
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
