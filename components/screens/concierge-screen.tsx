"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Car,
  UtensilsCrossed,
  Map,
  Heart,
  Check,
  AlertCircle,
  Minus,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { sendToTelegram } from "@/lib/telegram-service"

import { tours, decorations } from "@/lib/tours-decorations-data"

import { motion, AnimatePresence } from "framer-motion"
import {
  screenTransition,
  fadeInUp,
  fadeIn,
  tap,
  scaleIn,
} from "@/lib/animations"

type ServiceType = "taxi" | "restaurant" | "excursion" | "decoration" | null

export function ConciergeScreen({ onBack }: { onBack: () => void }) {
  const [activeService, setActiveService] = useState<ServiceType>(null)

  // Taxi
  const [taxiDate, setTaxiDate] = useState("")
  const [taxiTime, setTaxiTime] = useState("10:00")
  const [taxiAddress, setTaxiAddress] = useState("")
  const [taxiComment, setTaxiComment] = useState("")
  const [needChildSeat, setNeedChildSeat] = useState(false)

  // Restaurant
  const [restaurantName, setRestaurantName] = useState("")
  const [restaurantGuests, setRestaurantGuests] = useState("1")
  const [restaurantDate, setRestaurantDate] = useState("")
  const [restaurantTime, setRestaurantTime] = useState("19:00")

  const [showSuccess, setShowSuccess] = useState(false)
  const [showUnavailable, setShowUnavailable] = useState(false)

  const { addOrder, guest } = useAppStore()

  const services = [
    { id: "taxi", icon: Car, title: "Такси", subtitle: "Заказать трансфер", working: true },
    { id: "restaurant", icon: UtensilsCrossed, title: "Рестораны", subtitle: "Забронировать столик", working: true },
    { id: "excursion", icon: Map, title: "Экскурсии", subtitle: "Обзорные и тематические", working: false },
    { id: "decoration", icon: Heart, title: "Украшение", subtitle: "Оформление номера", working: false },
  ]

  const handleServiceClick = (id: string, working: boolean) => {
    if (!working) {
      setShowUnavailable(true)
      setTimeout(() => setShowUnavailable(false), 2000)
      return
    }
    setActiveService(id as ServiceType)
  }

  const handleTaxiSubmit = async () => {
    if (!taxiDate || !taxiTime || !taxiAddress) return

    let details = `Адрес: ${taxiAddress}, Время: ${taxiTime}`
    if (taxiComment) details += `, Комментарий: ${taxiComment}`
    if (needChildSeat) details += `, Нужно детское кресло`

    addOrder({
      type: "taxi",
      details,
      date: taxiDate,
      time: taxiTime,
      status: "pending",
    })

    if (guest) {
      await sendToTelegram({
        type: "taxi",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details,
        date: taxiDate,
        time: taxiTime,
        telegramId: guest.telegramId,
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setActiveService(null)
      setTaxiDate("")
      setTaxiTime("10:00")
      setTaxiAddress("")
      setTaxiComment("")
      setNeedChildSeat(false)
    }, 2000)
  }

  const handleRestaurantSubmit = async () => {
    if (!restaurantName || !restaurantGuests || !restaurantDate || !restaurantTime) return

    const details = `Ресторан: ${restaurantName}, Гостей: ${restaurantGuests}, Время: ${restaurantTime}`

    addOrder({
      type: "restaurant",
      details,
      date: restaurantDate,
      time: restaurantTime,
      status: "pending",
    })

    if (guest) {
      await sendToTelegram({
        type: "restaurant",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details,
        date: restaurantDate,
        time: restaurantTime,
        telegramId: guest.telegramId,
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setActiveService(null)
      setRestaurantName("")
      setRestaurantGuests("1")
      setRestaurantDate("")
      setRestaurantTime("19:00")
    }, 2000)
  }

  /* ---------------- SUCCESS SCREEN ---------------- */

  if (showSuccess) {
    return (
      <motion.div {...fadeIn} className="min-h-screen bg-background flex items-center justify-center">
        <motion.div {...scaleIn} className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Заявка отправлена!</h2>
          <p className="text-muted-foreground mt-2">Мы свяжемся с вами в ближайшее время</p>
        </motion.div>
      </motion.div>
    )
  }

  /* ---------------- TAXI ---------------- */

  if (activeService === "taxi") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="taxi" {...screenTransition} className="min-h-screen bg-background flex flex-col app-screen">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 pb-4"
               style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}>
            <motion.button {...tap} onClick={() => setActiveService(null)} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-semibold text-foreground">Заказ такси</h1>
            <div className="w-10" />
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-4 pb-[env(safe-area-inset-bottom)] space-y-4 overflow-y-auto">

            <motion.div {...fadeInUp(0.05)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Дата</label>
              <Input type="date" value={taxiDate} onChange={(e) => setTaxiDate(e.target.value)}
                     className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg" />
            </motion.div>

            <motion.div {...fadeInUp(0.1)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Время</label>
              <Input type="time" value={taxiTime} onChange={(e) => setTaxiTime(e.target.value)}
                     className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg" />
            </motion.div>

            <motion.div {...fadeInUp(0.15)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Место назначения</label>
              <Input placeholder="Например: Эрмитаж" value={taxiAddress}
                     onChange={(e) => setTaxiAddress(e.target.value)}
                     className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12 w-full" />
            </motion.div>

            <motion.div {...fadeInUp(0.2)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Комментарий (необязательно)</label>
              <textarea
                placeholder="Класс авто, детское кресло, особые пожелания"
                value={taxiComment}
                onChange={(e) => setTaxiComment(e.target.value)}
                className="w-full bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground text-sm min-h-[120px] resize-none"
              />
            </motion.div>

            <motion.div {...fadeInUp(0.25)} className="flex items-start gap-3 pt-2">
              <Checkbox
                id="child-seat"
                checked={needChildSeat}
                onCheckedChange={(checked) => setNeedChildSeat(checked as boolean)}
                className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="child-seat" className="text-sm text-foreground leading-tight">
                Нужно детское кресло
              </label>
            </motion.div>

          </div>

          <div className="p-4">
            <motion.button {...tap}
              onClick={handleTaxiSubmit}
              disabled={!taxiDate || !taxiTime || !taxiAddress}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-xl">
              Заказать такси
            </motion.button>
          </div>

        </motion.div>
      </AnimatePresence>
    )
  }

  /* ---------------- RESTAURANT ---------------- */

  if (activeService === "restaurant") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="restaurant" {...screenTransition}
                    className="min-h-screen bg-background flex flex-col app-screen">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 pb-4"
               style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}>
            <motion.button {...tap} onClick={() => setActiveService(null)} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-semibold text-foreground">Бронь столика</h1>
            <div className="w-10" />
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-4 pb-[env(safe-area-inset-bottom)] space-y-6 overflow-y-auto">

            <motion.div {...fadeInUp(0.05)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Название ресторана</label>
              <Input
                placeholder="Введите название ресторана"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
              />
            </motion.div>

            <motion.div {...fadeInUp(0.1)} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Количество гостей</label>

                <div className="flex items-center gap-4">

                  <motion.button {...tap}
                    onClick={() => {
                      const num = parseInt(restaurantGuests) || 1
                      if (num > 1) setRestaurantGuests(String(num - 1))
                    }}
                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <Minus className="w-4 h-4 text-foreground" />
                  </motion.button>

                  <span className="w-10 text-center text-lg font-semibold text-foreground">
                    {restaurantGuests}
                  </span>

                  <motion.button {...tap}
                    onClick={() => {
                      const num = parseInt(restaurantGuests) || 0
                      setRestaurantGuests(String(num + 1))
                    }}
                    className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md">
                    <Plus className="w-4 h-4 text-primary-foreground" />
                  </motion.button>

                </div>
              </div>

              <motion.div {...fadeInUp(0.15)} className="space-y-2">
                <label className="text-sm font-medium text-foreground">Дата</label>
                <Input
                  type="date"
                  value={restaurantDate}
                  onChange={(e) => setRestaurantDate(e.target.value)}
                  className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg"
                />
              </motion.div>

              <motion.div {...fadeInUp(0.2)} className="space-y-2">
                <label className="text-sm font-medium text-foreground">Время</label>
                <Input
                  type="time"
                  value={restaurantTime}
                  onChange={(e) => setRestaurantTime(e.target.value)}
                  className="bg-card text-foreground h-12 w-full px-4 border border-border rounded-lg"
                />
              </motion.div>

            </motion.div>
          </div>

          <div className="p-4 border-t border-border">
            <motion.button {...tap}
              onClick={handleRestaurantSubmit}
              disabled={!restaurantName || !restaurantGuests || !restaurantDate || !restaurantTime}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-base font-semibold rounded-xl">
              Забронировать столик
            </motion.button>
          </div>

        </motion.div>
      </AnimatePresence>
    )
  }

  /* ---------------- EXCURSIONS ---------------- */

  if (activeService === "excursion") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="excursion" {...screenTransition}
                    className="min-h-screen bg-background app-screen flex flex-col">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 pb-4"
               style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}>
            <motion.button {...tap} onClick={() => setActiveService(null)} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-semibold text-foreground">Экскурсии</h1>
            <div className="w-10" />
          </div>

          {/* CONTENT */}
          <div className="px-4 pb-[env(safe-area-inset-bottom)] space-y-4 overflow-y-auto">
            {tours.map((tour, index) => (
              <motion.div
                key={tour.id}
                {...fadeInUp(index * 0.05)}
                className={`bg-card rounded-2xl overflow-hidden border ${
                  tour.unavailable ? "opacity-70 grayscale" : ""
                } border-border`}
              >
                <div className="relative">
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Map className="w-16 h-16 text-muted-foreground" />
                  </div>

                  {tour.unavailable && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        animation: "breathing 2.8s ease-in-out infinite",
                      }}
                    >
                      Скоро
                    </motion.div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{tour.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tour.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.slice(0, 3).map((highlight, idx) => (
                      <span key={idx} className="text-xs bg-muted text-foreground px-2 py-1 rounded-full">
                        ✓ {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">🕐 {tour.duration}</p>
                      <p className="text-sm font-semibold text-primary">{tour.price}</p>
                    </div>

                    <motion.button
                      {...tap}
                      disabled={tour.unavailable}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-xl px-4 py-2 text-sm font-medium"
                    >
                      {tour.unavailable ? "Скоро доступно" : "Забронировать"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </AnimatePresence>
    )
  }

   /* ---------------- DECORATION ---------------- */

  if (activeService === "decoration") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="decoration"
          {...screenTransition}
          className="min-h-screen bg-background app-screen flex flex-col"
        >
          {/* HEADER */}
          <div
            className="flex items-center justify-between px-4 pb-4"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
          >
            <motion.button {...tap} onClick={() => setActiveService(null)} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-semibold text-foreground">Украшение номера</h1>
            <div className="w-10" />
          </div>

          {/* CONTENT */}
          <div className="px-4 pb-[env(safe-area-inset-bottom)] space-y-4 overflow-y-auto">
            {decorations.map((decoration, index) => (
              <motion.div
                key={decoration.id}
                {...fadeInUp(index * 0.05)}
                className={`bg-card rounded-2xl overflow-hidden border ${
                  decoration.unavailable ? "opacity-70 grayscale" : ""
                } border-border`}
              >
                <div className="relative">
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Heart className="w-16 h-16 text-muted-foreground" />
                  </div>

                  {decoration.unavailable && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        animation: "breathing 2.8s ease-in-out infinite",
                      }}
                    >
                      Скоро
                    </motion.div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{decoration.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{decoration.description}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">Включает:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {decoration.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <p className="text-lg font-semibold text-primary">{decoration.price}</p>

                    <motion.button
                      {...tap}
                      disabled={decoration.unavailable}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-xl px-4 py-2 text-sm font-medium"
                    >
                      {decoration.unavailable ? "Скоро доступно" : "Заказать"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  /* ---------------- MAIN SCREEN ---------------- */

  return (
    <motion.div
      {...screenTransition}
      className="min-h-screen bg-background app-screen flex flex-col"
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 pb-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
      >
        <motion.button {...tap} onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </motion.button>

        <h1 className="text-lg font-semibold text-foreground">Консьерж</h1>

        <div className="w-10" />
      </div>

      {/* SERVICES */}
      <div className="px-4 pb-[env(safe-area-inset-bottom)] space-y-3">
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            {...fadeInUp(index * 0.05)}
            {...tap}
            onClick={() => handleServiceClick(service.id, service.working)}
            className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <service.icon className="w-6 h-6 text-primary" />
            </div>

            <div className="text-left flex-1">
              <h3 className="font-medium text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.subtitle}</p>
            </div>

            {!service.working && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ animation: "breathing 2.8s ease-in-out infinite" }}
                className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
              >
                Скоро
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Unavailable Toast */}
      <AnimatePresence>
        {showUnavailable && (
          <motion.div
            {...fadeInUp(0)}
            className="fixed bottom-6 left-4 right-4 bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground">Услуга временно недоступна</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}


