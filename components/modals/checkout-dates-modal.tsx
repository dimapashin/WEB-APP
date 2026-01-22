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

export function CheckoutDatesModal_C({ onConfirm, onClose }: CheckoutDatesModalProps) {
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
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Ultra‑premium модалка */}
      <motion.div
        className="
          fixed left-1/2 top-1/2 z-50 
          w-[92%] max-w-sm 
          -translate-x-1/2 -translate-y-1/2
          rounded-3xl 
          shadow-[0_8px_32px_rgba(0,0,0,0.25)]
          border border-white/20
          bg-white/10 
          backdrop-blur-xl 
          p-8 space-y-8
        "
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white drop-shadow-sm">
            {t("auth.dates_title")}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Поля */}
        <div className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              {t("auth.checkin")}
            </label>
            <div className="rounded-xl overflow-hidden bg-white/20 border border-white/30 backdrop-blur-md">
              <Input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="bg-transparent text-white h-12 w-full px-4 appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              {t("auth.checkout")}
            </label>
            <div className="rounded-xl overflow-hidden bg-white/20 border border-white/30 backdrop-blur-md">
              <Input
                type="date"
                value={checkoutDate}
                min={checkInDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                className="bg-transparent text-white h-12 w-full px-4 appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Кнопка */}
        <Button
          disabled={!isValid || loading}
          onClick={handleSubmit}
          className="w-full h-12 bg-white/90 text-black font-semibold hover:bg-white disabled:opacity-50"
        >
          {loading ? t("auth.confirming") : t("auth.confirm")}
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
