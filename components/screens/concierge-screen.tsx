"use client"

import { useState } from "react"
import { ArrowLeft, Car, UtensilsCrossed, Map, Heart, Check, AlertCircle, MapPin, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { sendToTelegram } from "@/lib/telegram-service"
import { tours, decorations, type Tour, type Decoration } from "@/lib/tours-decorations-data"

interface ConciergeScreenProps {
  onBack: () => void
}

type ServiceType = "taxi" | "restaurant" | "excursion" | "decoration" | null

const POPULAR_DESTINATIONS = [
  { name: "Аэропорт Пулково (LED)", icon: "✈️", time: "30 мин" },
  { name: "Московский вокзал", icon: "🚂", time: "15 мин" },
  { name: "Эрмитаж", icon: "🏛️", time: "10 мин" },
  { name: "Петропавловская крепость", icon: "🏰", time: "12 мин" },
  { name: "Невский проспект", icon: "🛍️", time: "8 мин" },
  { name: "Мариинский театр", icon: "🎭", time: "18 мин" },
  { name: "Лахта Центр", icon: "🏙️", time: "25 мин" },
  { name: "Крестовский остров", icon: "⚽", time: "20 мин" },
]

const POPULAR_RESTAURANTS = [
  { name: "Cococo", icon: "🍽️", cuisine: "Русская кухня", rating: "4.8" },
  { name: "Mansarda", icon: "🍷", cuisine: "Европейская", rating: "4.7" },
  { name: "Ginza Project", icon: "🍣", cuisine: "Японская", rating: "4.6" },
  { name: "Terrassa", icon: "🌆", cuisine: "Европейская", rating: "4.9" },
  { name: "Palkin", icon: "🥂", cuisine: "Русская кухня", rating: "4.8" },
  { name: "Bellevue", icon: "🍾", cuisine: "Французская", rating: "4.7" },
]

export function ConciergeScreen({ onBack }: ConciergeScreenProps) {
  const [activeService, setActiveService] = useState<ServiceType>(null)
  const [taxiDate, setTaxiDate] = useState("")
  const [taxiTime, setTaxiTime] = useState("10:00")
  const [taxiAddress, setTaxiAddress] = useState("")
  const [taxiSuggestions, setTaxiSuggestions] = useState<string[]>([])
  const [taxiComment, setTaxiComment] = useState("")
  const [needChildSeat, setNeedChildSeat] = useState(false)
  const [restaurantName, setRestaurantName] = useState("")
  const [restaurantSuggestions, setRestaurantSuggestions] = useState<string[]>([])
  const [restaurantGuests, setRestaurantGuests] = useState("")
  const [restaurantDate, setRestaurantDate] = useState("")
  const [restaurantTime, setRestaurantTime] = useState("19:00")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const { addOrder, guest } = useAppStore()

  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [selectedDecoration, setSelectedDecoration] = useState<Decoration | null>(null)

  const services = [
    { id: "taxi", icon: Car, title: "Такси", subtitle: "Заказать трансфер", working: true },
    { id: "restaurant", icon: UtensilsCrossed, title: "Рестораны", subtitle: "Забронировать столик", working: true },
    { id: "excursion", icon: Map, title: "Экскурсии", subtitle: "Обзорные и тематические", working: false },
    { id: "decoration", icon: Heart, title: "Украшение", subtitle: "Оформление номера", working: false },
  ]

  const handleServiceClick = (serviceId: string, working: boolean) => {
    if (serviceId === "excursion") {
      setActiveService("excursion")
      return
    }
    if (serviceId === "decoration") {
      setActiveService("decoration")
      return
    }
    if (!working) {
      setShowUnavailable(true)
      setTimeout(() => setShowUnavailable(false), 2000)
      return
    }
    setActiveService(serviceId as ServiceType)
  }

  const handleTaxiSubmit = async () => {
    if (!taxiDate || !taxiTime || !taxiAddress) return

    let orderDetails = `Адрес: ${taxiAddress}, Время: ${taxiTime}`
    if (taxiComment) orderDetails += `, Комментарий: ${taxiComment}`
    if (needChildSeat) orderDetails += `, Нужно детское кресло`

    addOrder({
      type: "taxi",
      details: orderDetails,
      date: taxiDate,
      time: taxiTime,
      status: "pending",
    })

    // Send to Telegram
    if (guest) {
      await sendToTelegram({
        type: "taxi",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: orderDetails,
        date: taxiDate,
        time: taxiTime,
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
      setTaxiSuggestions([])
      setNeedChildSeat(false)
    }, 2000)
  }

  const handleRestaurantSubmit = async () => {
    if (!restaurantName || !restaurantGuests || !restaurantDate || !restaurantTime) return

    const orderDetails = `Ресторан ${restaurantName}, ${restaurantGuests} гостей, ${restaurantDate} в ${restaurantTime}`
    
    addOrder({
      type: "restaurant",
      details: orderDetails,
      date: restaurantDate,
      time: restaurantTime,
      status: "pending",
    })

    // Send to Telegram
    if (guest) {
      await sendToTelegram({
        type: "restaurant",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: orderDetails,
        date: restaurantDate,
        time: restaurantTime,
      })
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setActiveService(null)
      setRestaurantName("")
      setRestaurantGuests("")
      setRestaurantDate("")
      setRestaurantTime("19:00")
      setRestaurantSuggestions([])
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
      <div className="min-h-screen bg-background flex flex-col app-screen">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Заказ такси</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block mb-2">Дата</label>
            <Input
              type="date"
              value={taxiDate}
              onChange={(e) => setTaxiDate(e.target.value)}
              className="bg-card border-border text-foreground h-12 w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block mb-2">Время</label>
            <Input
              type="time"
              value={taxiTime}
              onChange={(e) => setTaxiTime(e.target.value)}
              className="bg-card border-border text-foreground h-12 w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block mb-2">Место назначения</label>
            <Input
              placeholder="Например: Эрмитаж"
              value={taxiAddress}
              onChange={(e) => setTaxiAddress(e.target.value)}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12 w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block mb-2">Комментарий (необязательно)</label>
            <textarea
              placeholder="Класс авто, детское кресло, особые пожелания"
              value={taxiComment}
              onChange={(e) => setTaxiComment(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground text-sm min-h-[120px] resize-none"
            />
          </div>
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="child-seat"
              checked={needChildSeat}
              onCheckedChange={(checked) => setNeedChildSeat(checked as boolean)}
              className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="child-seat" className="text-sm text-foreground leading-tight">
              Нужно детское кресло
            </label>
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
      <div className="min-h-screen bg-background flex flex-col app-screen">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Бронь столика</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* Modern Header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Бронирование ресторана</h2>
              <p className="text-sm text-muted-foreground">Мы поможем забронировать столик</p>
            </div>
          </div>

          {/* Restaurant Name with Suggestions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Название ресторана</label>
            <div className="relative">
              <Input
                placeholder="Введите название или выберите из популярных..."
                value={restaurantName}
                onChange={(e) => {
                  setRestaurantName(e.target.value)
                  const filtered = POPULAR_RESTAURANTS.filter((r) =>
                    r.name.toLowerCase().includes(e.target.value.toLowerCase())
                  ).map((r) => r.name)
                  setRestaurantSuggestions(filtered.slice(0, 5))
                }}
                onFocus={() => {
                  if (restaurantName) {
                    const filtered = POPULAR_RESTAURANTS.filter((r) =>
                      r.name.toLowerCase().includes(restaurantName.toLowerCase())
                    ).map((r) => r.name)
                    setRestaurantSuggestions(filtered.slice(0, 5))
                  }
                }}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
              />
              {restaurantSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden z-50 shadow-lg">
                  {restaurantSuggestions.map((suggestion, idx) => {
                    const restaurant = POPULAR_RESTAURANTS.find((r) => r.name === suggestion)
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setRestaurantName(suggestion)
                          setRestaurantSuggestions([])
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{restaurant?.icon}</span>
                            <div>
                              <p className="text-foreground font-medium">{suggestion}</p>
                              <p className="text-xs text-muted-foreground">{restaurant?.cuisine}</p>
                            </div>
                          </div>
                          <span className="text-xs text-primary">⭐ {restaurant?.rating}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Popular Restaurants */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Популярные рестораны:</p>
            <div className="grid grid-cols-2 gap-3">
              {POPULAR_RESTAURANTS.slice(0, 4).map((restaurant, idx) => (
                <button
                  key={idx}
                  onClick={() => setRestaurantName(restaurant.name)}
                  className="bg-card border border-border rounded-xl p-3 text-left hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{restaurant.icon}</span>
                    <span className="text-xs text-primary">⭐ {restaurant.rating}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{restaurant.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{restaurant.cuisine}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Guests, Date and Time */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Количество гостей</label>
              <Input
                placeholder="2"
                value={restaurantGuests}
                onChange={(e) => setRestaurantGuests(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Дата</label>
                <Input
                  type="date"
                  value={restaurantDate}
                  onChange={(e) => setRestaurantDate(e.target.value)}
                  className="bg-card border-border text-foreground h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Время</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="time"
                    value={restaurantTime}
                    onChange={(e) => setRestaurantTime(e.target.value)}
                    className="bg-card border-border text-foreground h-12 pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <Button
            onClick={handleRestaurantSubmit}
            disabled={!restaurantName || !restaurantGuests || !restaurantDate || !restaurantTime}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-base font-semibold"
          >
            Забронировать столик
          </Button>
        </div>
      </div>
    )
  }

  if (activeService === "excursion") {
    return (
      <div className="min-h-screen bg-background app-screen">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Экскурсии</h1>
          <div className="w-10" />
        </div>
        <div className="px-4 py-6 space-y-4 overflow-y-auto">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className={`bg-card rounded-2xl overflow-hidden border ${
                tour.unavailable ? "opacity-70 grayscale" : ""
              } border-border`}
            >
              <div className="relative">
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Map className="w-16 h-16 text-muted-foreground" />
                </div>
                {tour.unavailable && (
                  <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Скоро
                  </div>
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
                  <Button
                    disabled={tour.unavailable}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {tour.unavailable ? "Скоро доступно" : "Забронировать"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activeService === "decoration") {
    return (
      <div className="min-h-screen bg-background app-screen">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setActiveService(null)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Украшение номера</h1>
          <div className="w-10" />
        </div>
        <div className="px-4 py-6 space-y-4 overflow-y-auto">
          {decorations.map((decoration) => (
            <div
              key={decoration.id}
              className={`bg-card rounded-2xl overflow-hidden border ${
                decoration.unavailable ? "opacity-70 grayscale" : ""
              } border-border`}
            >
              <div className="relative">
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Heart className="w-16 h-16 text-muted-foreground" />
                </div>
                {decoration.unavailable && (
                  <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Скоро
                  </div>
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
                  <Button
                    disabled={decoration.unavailable}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {decoration.unavailable ? "Скоро доступно" : "Заказать"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background app-screen">
      <div className="flex items-center justify-between p-4">
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
