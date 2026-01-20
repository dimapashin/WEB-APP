"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  AlarmClock,
  Calendar,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { sendToTelegram } from "@/lib/telegram-service"

import { motion, AnimatePresence } from "framer-motion"
import {
  screenTransition,
  fadeInUp,
  fadeIn,
  tap,
  scaleIn,
} from "@/lib/animations"

interface WakeupScreenProps {
  onBack: () => void
}

export function WakeupScreen({ onBack }: WakeupScreenProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("08:00")
  const [comment, setComment] = useState("")
  const [orderSuccess, setOrderSuccess] = useState(false)

  const { addAlarm, removeAlarm, guest, alarms } = useAppStore()

  const handleSubmit = async () => {
    if (!selectedDate) return

    addAlarm({
      date: selectedDate,
      time: selectedTime,
      comment,
    })

    const orderDetails = `Будильник на ${selectedDate} в ${selectedTime}${
      comment ? `. Комментарий: ${comment}` : ""
    }`

    if (guest) {
      await sendToTelegram({
        type: "wakeup",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: orderDetails,
        date: selectedDate,
        time: selectedTime,
        telegramId: guest.telegramId,
      })
    }

    setSelectedDate("")
    setSelectedTime("08:00")
    setComment("")
    setOrderSuccess(true)

    setTimeout(() => setOrderSuccess(false), 2000)
  }

  const handleCancelAlarm = async (alarmId: string) => {
    const alarmToCancel = alarms.find((a) => a.id === alarmId)

    if (alarmToCancel && guest) {
      await sendToTelegram({
        type: "wakeup",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: `Отмена будильника на ${alarmToCancel.date} в ${alarmToCancel.time}${
          alarmToCancel.comment ? `. Комментарий: ${alarmToCancel.comment}` : ""
        }`,
        date: alarmToCancel.date,
        time: alarmToCancel.time,
        telegramId: guest.telegramId,
      })
    }

    removeAlarm(alarmId)
  }

  /* ---------------- SUCCESS SCREEN ---------------- */

  if (orderSuccess) {
    return (
      <motion.div
        {...fadeIn}
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <motion.div {...scaleIn} className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-xl font-semibold text-foreground">
            Будильник установлен!
          </h2>

          <p className="text-muted-foreground mt-2">
            Позвоним в номер {guest?.roomNumber} в {selectedTime}
          </p>
        </motion.div>
      </motion.div>
    )
  }

  /* ---------------- MAIN SCREEN ---------------- */

  return (
    <motion.div
      {...screenTransition}
      className="min-h-screen bg-background flex flex-col app-screen"
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 pb-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
      >
        <motion.button onClick={onBack} className="p-2 -ml-2" {...tap}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </motion.button>

        <h1 className="text-lg font-semibold text-foreground">Будильник</h1>

        <div className="w-10" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-4 pb-[env(safe-area-inset-bottom)] space-y-6 overflow-y-auto">

        {/* ---------------- EXISTING ALARMS ---------------- */}
        {alarms.length > 0 ? (
          <motion.div {...fadeInUp(0.05)} className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              Установленные будильники
            </label>

            <div className="space-y-4">
              {alarms.map((alarm, index) => {
                const created = new Date(alarm.createdAt)
                const formattedDate = created.toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <motion.div
                    key={alarm.id}
                    {...fadeInUp(index * 0.05)}
                    className="bg-gradient-to-br from-card to-card/80 border border-primary/10 rounded-2xl p-5 shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-md">
                        <AlarmClock className="w-7 h-7 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              {alarm.date}
                            </h3>
                            <p className="text-primary font-medium text-sm mt-0.5">
                              в {alarm.time}
                            </p>
                          </div>

                          <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-primary/20 text-primary border border-primary/30">
                            Подтверждён
                          </span>
                        </div>

                        {alarm.comment && (
                          <p className="text-sm text-muted-foreground mt-2 bg-background/50 rounded-lg p-2 border border-border/50">
                            {alarm.comment}
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground mt-2">
                          {formattedDate}
                        </p>
                      </div>

                      <motion.button
                        {...tap}
                        onClick={() => handleCancelAlarm(alarm.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* ADD NEW ALARM BUTTON */}
            <motion.button
              {...tap}
              onClick={() => {
                setSelectedDate("")
                setSelectedTime("08:00")
                setComment("")
              }}
              className="w-full mt-4 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Добавить будильник
            </motion.button>

            {/* FORM FOR NEW ALARM */}
            {(selectedDate !== "" || comment !== "" || selectedTime !== "08:00") && (
              <motion.div {...fadeInUp(0.1)} className="space-y-4 mt-6 pt-6 border-t border-border">

                {/* DATE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Дата</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg"
                  />
                </div>

                {/* TIME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Время</label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg"
                  />
                </div>

                {/* COMMENT */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Комментарий (необязательно)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Дополнительная информация"
                    className="w-full bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground text-sm h-20 resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!selectedDate}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Установить будильник
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ---------------- NO ALARMS YET ---------------- */
          <motion.div {...fadeInUp(0.05)} className="space-y-4">

            {/* DATE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Дата</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg"
              />
            </div>

            {/* TIME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Время</label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg"
              />
            </div>

            {/* COMMENT */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Комментарий (необязательно)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительная информация"
                className="w-full bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground text-sm h-20 resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedDate}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Установить будильник
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
