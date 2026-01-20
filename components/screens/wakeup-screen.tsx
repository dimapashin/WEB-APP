"use client"

import { useState } from "react"
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import { sendToTelegram } from "@/lib/telegram-service"

interface WakeupScreenProps {
  onBack: () => void
}

export function WakeupScreen({ onBack }: WakeupScreenProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("08:00")
  const [comment, setComment] = useState("")
  const [orderSuccess, setOrderSuccess] = useState(false)
  const { addAlarm, removeAlarm, addOrder, guest, alarms } = useAppStore()

  const handleSubmit = async () => {
    if (!selectedDate) return

    addAlarm({
      date: selectedDate,
      time: selectedTime,
      comment,
    })

    const orderDetails = `Будильник на ${selectedDate} в ${selectedTime}${comment ? `. Комментарий: ${comment}` : ""}`

    addOrder({
      type: "wakeup",
      details: orderDetails,
      time: selectedTime,
      date: selectedDate,
      status: "confirmed",
    })

    // Send to Telegram
    if (guest) {
      await sendToTelegram({
        type: "wakeup",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: orderDetails,
        date: selectedDate,
        time: selectedTime,
      })
    }

    setSelectedDate("")
    setSelectedTime("08:00")
    setComment("")
    setOrderSuccess(true)
    setTimeout(() => {
      setOrderSuccess(false)
    }, 2000)
  }

  const handleCancelAlarm = async (alarmId: string) => {
    // Find the alarm to be cancelled
    const alarmToCancel = alarms.find(alarm => alarm.id === alarmId);
    
    if (alarmToCancel && guest) {
      // Send cancellation notification to Telegram
      await sendToTelegram({
        type: "wakeup",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: `Отмена будильника на ${alarmToCancel.date} в ${alarmToCancel.time}${alarmToCancel.comment ? `. Комментарий: ${alarmToCancel.comment}` : ""}`,
        date: alarmToCancel.date,
        time: alarmToCancel.time,
      });
    }
    
    // Remove the alarm from store
    removeAlarm(alarmId)
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Будильник установлен!</h2>
          <p className="text-muted-foreground mt-2">
            Позвоним в номер {guest?.roomNumber} в {selectedTime}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col app-screen">
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Будильник</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {alarms.length > 0 ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Установленные будильники</label>
            <div className="space-y-2">
              {alarms.map((alarm) => (
                <div key={alarm.id} className="bg-card rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {alarm.date} в {alarm.time}
                    </p>
                    {alarm.comment && <p className="text-sm text-muted-foreground">{alarm.comment}</p>}
                  </div>
                  <button
                    onClick={() => handleCancelAlarm(alarm.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={() => {
                // Clear form for adding new alarm
                setSelectedDate("")
                setSelectedTime("08:00")
                setComment("")
              }}
              className="w-full mt-6 h-12 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Добавить будильник
            </Button>

            {/* Form only shows after clicking "Add alarm" */}
            {selectedDate === "" && selectedTime === "08:00" && comment === "" ? null : (
              <div className="space-y-4 mt-6 pt-6 border-t border-border">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Дата</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-card border-border text-foreground h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Время</label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-card border-border text-foreground h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Комментарий (необязательно)</label>
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
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Дата</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-card border-border text-foreground h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Время</label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-card border-border text-foreground h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Комментарий (необязательно)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительная информация"
                className="w-full bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground text-sm h-20 resize-none"
              />
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        {alarms.length === 0 && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedDate}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Установить будильник
          </Button>
        )}
      </div>
    </div>
  )
}
