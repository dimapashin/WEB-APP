"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { useT } from "@/lib/i18n"

export function CheckoutDatesScreen({ onConfirm, onBack }) {
  const t = useT()

  const today = new Date()
  const tomorrow = new Date(Date.now() + 86400000)

  const [checkInDate, setCheckInDate] = useState<Date | null>(today)
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(tomorrow)

  const isValid = checkInDate && checkoutDate && checkoutDate > checkInDate

  const dragControls = useDragControls()
  const sheetRef = useRef(null)

  return (
    <AnimatePresence>
      {/* Затемнённый фон */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onBack}
      />

      {/* Bottom-sheet */}
      <motion.div
        ref={sheetRef}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120) onBack()
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-card rounded-t-3xl shadow-xl
          max-h-[85vh] overflow-y-auto
          pb-8 px-6 pt-4
        "
        style={{
          boxShadow: "0 -20px 40px rgba(0,0,0,0.25)" // iOS‑тень сверху
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grabber + Header */}
        <div
          className="w-full flex flex-col items-center mb-4"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-10 h-1.5 bg-muted-foreground/40 rounded-full mb-3" />
          <h2 className="text-lg font-semibold text-foreground">
            {t("auth.dates_title")}
          </h2>
        </div>

        {/* Дата заезда */}
        <div className="space-y-2 mb-6">
          <p className="text-sm text-muted-foreground">{t("auth.checkin")}</p>

          <motion.div
            key={checkInDate?.toString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl overflow-hidden border border-border/60 bg-card/50"
          >
            <div className="max-h-[260px] overflow-y-auto">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                fromDate={new Date()}
              />
            </div>
          </motion.div>
        </div>

        {/* Дата выезда */}
        <div className="space-y-2 mb-6">
          <p className="text-sm text-muted-foreground">{t("auth.checkout")}</p>

          <motion.div
            key={checkoutDate?.toString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl overflow-hidden border border-border/60 bg-card/50"
          >
            <div className="max-h-[260px] overflow-y-auto">
              <Calendar
                mode="single"
                selected={checkoutDate}
                onSelect={setCheckoutDate}
                fromDate={checkInDate || new Date()}
              />
            </div>
          </motion.div>
        </div>

        {/* Подтвердить */}
        <Button
          disabled={!isValid}
          onClick={() => onConfirm(checkInDate, checkoutDate)}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {t("auth.confirm")}
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
