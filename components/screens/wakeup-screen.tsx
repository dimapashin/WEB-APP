"use client"

import { useState } from "react"
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { sendToTelegram } from "@/lib/telegram-service"

export function WakeupScreen({ onBack }) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("08:00")
  const [comment, setComment] = useState("")
  const [orderSuccess, setOrderSuccess] = useState(false)

  const { addAlarm, removeAlarm, addOrder, guest, alarms } = useAppStore()

  const handleSubmit = async () => {
    if (!selectedDate) return

    addAlarm({ date: selectedDate, time: selectedTime, comment })

    const details = `Будильник на ${selectedDate} в ${selectedTime}${comment ? `. Комментарий: ${comment}` : ""}`

    addOrder({
      type: "wakeup",
      details,
      time: selectedTime,
      date: selectedDate,
      status: "confirmed",
    })

    if (guest) {
      await sendToTelegram({
        type: "wakeup",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details,
        date: selectedDate,
        time: selectedTime,
      })
    }

    setSelectedDate("")
    setSelectedTime("08:00")
    setComment("")
    setOrderSuccess(true)

    setTimeout(() => setOrderSuccess(false), 2000)
  }

  const handleCancelAlarm = (id) => removeAlarm(id)

  /* ---------------- SUCCESS SCREEN ---------------- */

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl bg-primary/15 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-primary/20">
            <Check className="w-12 h-12 text-primary" />
          </div>

          <h2 className="text-xl font-semibold text-foreground">Будильник установлен!</h2>
          <p className="text-muted-foreground mt-2">
            Позвоним в номер {guest?.roomNumber} в {selectedTime}
          </p>
        </div>
      </motion.div>
    )
  }

  /* ---------------- MAIN SCREEN ---------------- */

  return (
    <div className="min-h-screen bg-background flex flex-col app-screen">

      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 pb-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
      >
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <h1 className="text-lg font-semibold text-foreground">Будильник</h1>

        <div className="w-10" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">

        {/* EXISTING ALARMS */}
        {alarms.length > 0 && (
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Установленные будильники</label>

            <div className="space-y-3">
              {alarms.map((alarm) => (
                <motion.div
                  key={alarm.id}
                  className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {alarm.date} в {alarm.time}
                    </p>
                    {alarm.comment && (
                      <p className="text-sm text-muted-foreground">{alarm.comment}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCancelAlarm(alarm.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={() => {
                setSelectedDate("")
                setSelectedTime("08:00")
                setComment("")
              }}
              className="w-full mt-4 h-12 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Добавить будильник
            </Button>
          </div>
        )}

        {/* FORM */}
        {(alarms.length === 0 || selectedDate || comment) && (
          <div className="space-y-4 pt-4">

            {/* DATE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Дата</label>

              <div className="bg-card/60 border border-border/60 rounded-xl h-12 flex items-center px-4 shadow-sm backdrop-blur-sm">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none text-foreground h-full px-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* TIME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Время</label>

              <div className="bg-card/60 border border-border/60 rounded-xl h-12 flex items-center px-4 shadow-sm backdrop-blur-sm">
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="bg-transparent border-none text-foreground h-full px-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* COMMENT */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Комментарий (необязательно)</label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительная информация"
                className="w-full bg-card/60 border border-border/60 rounded-xl p-3 text-foreground placeholder:text-muted-foreground text-sm h-20 resize-none shadow-sm backdrop-blur-sm"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedDate}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Установить будильник
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
