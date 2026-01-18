"use client"

import { useState } from "react"
import { ArrowLeft, Car, UtensilsCrossed, Map, Heart, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

interface ConciergeScreenProps {
  onBack: () => void
}

type ServiceType = "taxi" | "restaurant" | "excursion" | "decoration" | null

export function ConciergeScreen({ onBack }: ConciergeScreenProps) {
  const [activeService, setActiveService] = useState<ServiceType>(null)
  const [taxiDate, setTaxiDate] = useState("")
  const [taxiTime, setTaxiTime] = useState("")
  const [taxiAddress, setTaxiAddress] = useState("")
  const [taxiComment, setTaxiComment] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [restaurantGuests, setRestaurantGuests] = useState("")
  const [restaurantDate, setRestaurantDate] = useState("")
  const [restaurantTime, setRestaurantTime] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const { addOrder, guest } = useAppStore()

  const services = [
    { id: "taxi", icon: Car, title: "Такси", subtitle: "Заказать трансфер", working: true },
    { id: "restaurant", icon: UtensilsCrossed, title: "Рестораны", subtitle: "Забронировать столик", working: true },
    { id: "excursion", icon: Map, title: "Экскурсии", subtitle: "Обзорные и тематические", working: false },
    { id: "decoration", icon: Heart, title: "Украшение", subtitle: "Оформление номера", working: false },
  ]

  const handleServiceClick = (serviceId: string, working: boolean) => {
    if (!working) {
      setShowUnavailable(true)
      setTimeout(() => setShowUnavailable(false), 2000)
      return
    }
    setActiveService(serviceId as ServiceType)
  }

  const handleTaxiSubmit = () => {
    addOrder({
      type: "taxi",
      details: `Такси: ${taxiAddress}, ${taxiDate} в ${taxiTime}${taxiComment ? `, Комментарий: ${taxiComment}` : ""}`,
      date: taxiDate,
      time: taxiTime,
      status: "pending",
    })
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setActiveService(null)
      setTaxiDate("")
      setTaxiTime("")
      setTaxiAddress("")
      setTaxiComment("")
    }, 2000)
  }

  const handleRestaurantSubmit = () => {
    addOrder({
      type: "restaurant",
      details: `Ресторан ${restaurantName}, ${restaurantGuests} гостей, ${restaurantDate} в ${restaurantTime}`,
      date: restaurantDate,
      time: restaurantTime,
      status: "pending",
    })
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setActiveService(null)
      setRestaurantName("")
      setRestaurantGuests("")
      setRestaurantDate("")
      setRestaurantTime("")
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Заявка отправлена!</h2>
          <p className="text-muted-foreground mt-2">Мы свяжемся с вами в ближайшее время</p>
        </motion.div>
      </div>
    )
  }

  if (activeService === "taxi") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center justify-between p-4" style={{ paddingTop: `calc(1.5rem + 5rem)` }}>
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Заказ такси</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Дата</label>
            <Input
              type="date"
              value={taxiDate}
              onChange={(e) => setTaxiDate(e.target.value)}
              className="bg-card border-border text-foreground h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Время</label>
            <Input
              type="time"
              value={taxiTime}
              onChange={(e) => setTaxiTime(e.target.value)}
              className="bg-card border-border text-foreground h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Место назначения</label>
            <Input
              placeholder="Например: Эрмитаж"
              value={taxiAddress}
              onChange={(e) => setTaxiAddress(e.target.value)}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Комментарий (необязательно)</label>
            <textarea
              placeholder="Дополнительная информация"
              value={taxiComment}
              onChange={(e) => setTaxiComment(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground text-sm h-20 resize-none"
            />
          </div>
        </div>
        <div className="p-4">
          <Button
            onClick={handleTaxiSubmit}
            disabled={!taxiDate || !taxiTime || !taxiAddress}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Заказать такси
          </Button>
        </div>
      </div>
    )
  }

  if (activeService === "restaurant") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center justify-between p-4" style={{ paddingTop: `calc(1.5rem + 5rem)` }}>
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Бронь столика</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          <Input
            placeholder="Название ресторана"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
          />
          <Input
            placeholder="Количество гостей"
            value={restaurantGuests}
            onChange={(e) => setRestaurantGuests(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
          />
          <Input
            type="date"
            value={restaurantDate}
            onChange={(e) => setRestaurantDate(e.target.value)}
            className="bg-card border-border text-foreground h-12"
          />
          <Input
            type="time"
            value={restaurantTime}
            onChange={(e) => setRestaurantTime(e.target.value)}
            className="bg-card border-border text-foreground h-12"
          />
        </div>
        <div className="p-4">
          <Button
            onClick={handleRestaurantSubmit}
            disabled={!restaurantName || !restaurantGuests || !restaurantDate || !restaurantTime}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Забронировать
          </Button>
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
        <h1 className="text-lg font-semibold text-foreground">Консьерж</h1>
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
