"use client"

import { useState } from "react"
import { ArrowLeft, Shirt, Sparkles, ShoppingBag, Brush, Check, AlertCircle, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { sendToTelegram } from "@/lib/telegram-service"

interface ServicesScreenProps {
  onBack: () => void
}

type ServiceType = "laundry" | "iron" | "supplies" | "cleaning" | null

const TOTAL_IRONS = 10

export function ServicesScreen({ onBack }: ServicesScreenProps) {
  const [activeService, setActiveService] = useState<ServiceType>(null)
  const [selectedTime, setSelectedTime] = useState("10:00")
  const [selectedDate, setSelectedDate] = useState("")
  const [needIron, setNeedIron] = useState(false)
  const [needBoard, setNeedBoard] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const { addOrder, guest, orders } = useAppStore()

  // Подсчет активных утюгов (в заказах со статусом pending или confirmed)
  const activeIrons = orders.filter(
    (order) => order.type === "iron" && (order.status === "pending" || order.status === "confirmed")
  ).length

  const canOrderIron = activeIrons < TOTAL_IRONS

  const services = [
    { id: "laundry", icon: Shirt, title: "Прачечная", subtitle: "Стирка и химчистка", working: false },
    {
      id: "iron",
      icon: Sparkles,
      title: "Утюг и гладильная доска",
      subtitle: "Работает с 9:00 до 18:00",
      working: true,
    },
    { id: "supplies", icon: ShoppingBag, title: "Расходники", subtitle: "Товары для комфорта", working: true },
    { id: "cleaning", icon: Brush, title: "Уборка", subtitle: "Дополнительная уборка", working: false },
  ]

  const handleServiceClick = (serviceId: string, working: boolean) => {
    if (!working) {
      setShowUnavailable(true)
      setTimeout(() => setShowUnavailable(false), 2000)
      return
    }
    if (serviceId === "supplies") {
      setActiveService("supplies")
    } else {
      setActiveService(serviceId as ServiceType)
    }
  }

  const handleIronSubmit = async () => {
    if (!selectedDate || !selectedTime) return
    if (!needIron && !needBoard) {
      alert("Пожалуйста, выберите утюг или гладильную доску")
      return
    }
    if (needIron && !canOrderIron) {
      alert(`Все утюги заняты (доступно ${TOTAL_IRONS} штук). Пожалуйста, дождитесь возврата или закажите только гладильную доску.`)
      return
    }

    const items = []
    if (needIron) items.push("утюг")
    if (needBoard) items.push("гладильная доска")
    const orderDetails = `${items.join(" и ")} на ${selectedDate} в ${selectedTime}`

    addOrder({
      type: "iron",
      details: orderDetails,
      time: selectedTime,
      date: selectedDate,
      status: "pending",
    })

    // Send to Telegram
    if (guest) {
      await sendToTelegram({
        type: "iron",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: orderDetails,
        date: selectedDate,
        time: selectedTime,
        telegramId: guest.telegramId,
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setActiveService(null)
      setSelectedDate("")
      setSelectedTime("10:00")
      setNeedIron(false)
      setNeedBoard(false)
    }, 2000)
  }

  const handleReturnIron = async () => {
    // Найти последний заказ утюга этого гостя
    const ironOrders = orders
      .filter((order) => order.type === "iron" && order.status !== "completed")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (ironOrders.length === 0) {
      alert("У вас нет активных заказов утюга")
      return
    }

    // Помечаем как выполненный
    const orderToComplete = ironOrders[0]
    // TODO: Обновить статус заказа в store (нужно добавить updateOrderStatus)
    
    if (guest) {
      await sendToTelegram({
        type: "iron",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: `Возврат утюга (заказ от ${orderToComplete.date} в ${orderToComplete.time})`,
        date: orderToComplete.date,
        time: orderToComplete.time,
        telegramId: guest.telegramId,
      })
    }
    
    alert("Утюг возвращен! Спасибо.")
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Заказ оформлен!</h2>
          <p className="text-muted-foreground mt-2">Доставим в номер {guest?.roomNumber}</p>
        </motion.div>
      </div>
    )
  }

  if (activeService === "iron") {
    return (
      <div className="min-h-screen bg-background flex flex-col app-screen">
        <div className="flex items-center justify-between p-4" style={{ paddingTop: `calc(1.5rem + 5rem)` }}>
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Заказ утюга</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Дата</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-card border-border text-foreground h-12 w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Время доставки</label>
            <p className="text-sm text-primary">Доступно: 09:00 – 18:00</p>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min="09:00"
              max="18:00"
              className="bg-card border-border text-foreground h-12 w-full"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-foreground block">Что вам нужно?</label>
            <div className="flex items-start gap-3">
              <Checkbox
                id="need-iron"
                checked={needIron}
                onCheckedChange={(checked) => setNeedIron(checked as boolean)}
                className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                disabled={!canOrderIron && !needIron}
              />
              <label htmlFor="need-iron" className="text-sm text-foreground leading-tight flex-1">
                Утюг {!canOrderIron && !needIron && <span className="text-destructive">(все заняты, доступно {TOTAL_IRONS} штук)</span>}
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="need-board"
                checked={needBoard}
                onCheckedChange={(checked) => setNeedBoard(checked as boolean)}
                className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="need-board" className="text-sm text-foreground leading-tight flex-1">
                Гладильная доска
              </label>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Button
            onClick={handleIronSubmit}
            disabled={!selectedDate || !selectedTime || (!needIron && !needBoard)}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Заказать {needIron && needBoard ? "утюг и доску" : needIron ? "утюг" : "гладильную доску"}
          </Button>
          {orders.some((order) => order.type === "iron" && order.status !== "completed") && (
            <Button
              onClick={handleReturnIron}
              variant="outline"
              className="w-full h-12 border-primary text-primary hover:bg-primary/10"
            >
              Вернуть утюг
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (activeService === "supplies") {
    return (
      <div className="min-h-screen bg-background flex flex-col app-screen">
        <div className="flex items-center justify-between p-4" style={{ paddingTop: `calc(1.5rem + 5rem)` }}>
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Расходники</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 px-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Зубная щётка", price: 150 },
              { name: "Зубная паста", price: 200 },
              { name: "Шампунь", price: 300 },
              { name: "Гель для душа", price: 300 },
              { name: "Тапочки", price: 250 },
              { name: "Халат", price: 500 },
            ].map((item) => (
              <button
                key={item.name}
                className="bg-card rounded-2xl p-4 text-left transition-scale active:scale-[0.98]"
              >
                <div className="w-full aspect-square bg-muted rounded-xl mb-3" />
                <h3 className="font-medium text-foreground">{item.name}</h3>
                <p className="text-primary">{item.price} ₽</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4" style={{ paddingTop: `calc(1.5rem + 5rem)` }}>
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Доп. услуги</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 py-2 space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceClick(service.id, service.working)}
            className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 transition-scale active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <service.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-medium text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.subtitle}</p>
            </div>
            {!service.working && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Скоро</span>
            )}
          </button>
        ))}
      </div>

      {/* Unavailable Toast */}
      <AnimatePresence>
        {showUnavailable && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-4 right-4 bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground">Услуга временно недоступна</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
