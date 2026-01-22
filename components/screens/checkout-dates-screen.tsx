"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { motion, AnimatePresence } from "framer-motion"
import { useT } from "@/lib/i18n"

export function CheckoutDatesScreen({ onConfirm, onBack }) {
  const t = useT()
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null)

  const isValid = checkInDate && checkoutDate && checkoutDate > checkInDate

  return (
    <AnimatePresence>
      {/* Затемнённый фон */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
        onClick={onBack}
      >
        {/* Модальное окно */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-2xl p-6 w-full max-w-sm mx-auto shadow-lg backdrop-blur-sm space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-foreground text-center">
            {t("auth.dates_title")}
          </h2>

          {/* Дата заезда */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("auth.checkin")}</p>

            <div className="rounded-xl overflow-hidden border border-border/60 bg-card/50">
              <div className="max-h-[260px] overflow-y-auto">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  fromDate={new Date()}
                />
              </div>
            </div>
          </div>

          {/* Дата выезда */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("auth.checkout")}</p>

            <div className="rounded-xl overflow-hidden border border-border/60 bg-card/50">
              <div className="max-h-[260px] overflow-y-auto">
                <Calendar
                  mode="single"
                  selected={checkoutDate}
                  onSelect={setCheckoutDate}
                  fromDate={checkInDate || new Date()}
                />
              </div>
            </div>
          </div>

          {/* Подтвердить */}
          <Button
            disabled={!isValid}
            onClick={() => onConfirm(checkInDate, checkoutDate)}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {t("auth.confirm")}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
