"use client"

import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Shirt,
  Sparkles,
  ShoppingBag,
  Brush,
  Check,
  AlertCircle,
  CheckSquare,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { sendToTelegram } from "@/lib/telegram-service"
import { screenTransition, fadeInUp, fadeIn, tap, scaleIn } from "@/lib/animations"

interface ServicesScreenProps {
  onBack: () => void
}

type ServiceType = "laundry" | "iron" | "supplies" | "cleaning" | null

const TOTAL_IRONS = 10

type SuppliesItem = {
  id: string
  name: string
  price: number
}

const SUPPLIES_ITEMS: SuppliesItem[] = [
  { id: "toothbrush", name: "Зубная щётка", price: 150 },
  { id: "toothpaste", name: "Зубная паста", price: 200 },
  { id: "shampoo", name: "Шампунь", price: 300 },
  { id: "shower-gel", name: "Гель для душа", price: 300 },
  { id: "slippers", name: "Тапочки", price: 250 },
  { id: "robe", name: "Халат", price: 500 },
]

function SuccessScreen({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string
  subtitle?: string
  icon: typeof Check
}) {
  return (
    <motion.div
      {...fadeIn}
      className="min-h-screen bg-background flex items-center justify-center px-6"
    >
      <motion.div {...scaleIn} className="text-center">
        <div className="w-24 h-24 rounded-3xl bg-primary/15 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-primary/20">
          <Icon className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

export function ServicesScreen({ onBack }: ServicesScreenProps) {
  const [activeService, setActiveService] = useState<ServiceType>(null)

  // Iron
  const [selectedTime, setSelectedTime] = useState("10:00")
  const [selectedDate, setSelectedDate] = useState("")
  const [needIron, setNeedIron] = useState(false)
  const [needBoard, setNeedBoard] = useState(false)

  // Supplies
  const [suppliesCart, setSuppliesCart] = useState<Record<string, number>>({})

  // Global states
  const [showSuccess, setShowSuccess] = useState(false)
  const [showReturnSuccess, setShowReturnSuccess] = useState(false)
  const [showUnavailable, setShowUnavailable] = useState(false)

  const { addOrder, guest, orders } = useAppStore()

  const activeIrons = orders.filter(
    (order) =>
      order.type === "iron" &&
      (order.status === "pending" || order.status === "confirmed")
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
    {
      id: "supplies",
      icon: ShoppingBag,
      title: "Расходники",
      subtitle: "Товары для комфорта",
      working: true,
    },
    { id: "cleaning", icon: Brush, title: "Уборка", subtitle: "Дополнительная уборка", working: false },
  ] as const

  const handleServiceClick = (serviceId: string, working: boolean) => {
    if (!working) {
      setShowUnavailable(true)
      setTimeout(() => setShowUnavailable(false), 2000)
      return
    }
    setActiveService(serviceId as ServiceType)
  }

  // Проверка времени доставки утюга
  const isDeliveryTimeValid = () => {
    const [hours, minutes] = selectedTime.split(":").map(Number)
    return hours >= 9 && (hours < 18 || (hours === 18 && minutes === 0))
  }

  const handleIronSubmit = async () => {
    if (!selectedDate || !selectedTime) return
    if (!needIron && !needBoard) return
    if (needIron && !canOrderIron) return
    if (!isDeliveryTimeValid()) return

    const items: string[] = []
    if (needIron) items.push("утюг")
    if (needBoard) items.push("гладильную доску")

    const orderDetails = `${items.join(" и ")} на ${selectedDate} в ${selectedTime}`

    addOrder({
      type: "iron",
      details: orderDetails,
      time: selectedTime,
      date: selectedDate,
      status: "pending",
    })

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
    const ironOrders = orders
      .filter((order) => order.type === "iron" && order.status !== "completed")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (ironOrders.length === 0) return

    const orderToComplete = ironOrders[0]

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

    setShowReturnSuccess(true)
    setTimeout(() => setShowReturnSuccess(false), 2500)
  }

  const handleSuppliesChange = (id: string, delta: number) => {
    setSuppliesCart((prev) => {
      const current = prev[id] ?? 0
      const next = current + delta
      if (next <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  const suppliesTotal = useMemo(() => {
    return Object.entries(suppliesCart).reduce((sum, [id, qty]) => {
      const item = SUPPLIES_ITEMS.find((i) => i.id === id)
      if (!item) return sum
      return sum + item.price * qty
    }, 0)
  }, [suppliesCart])

  const handleSuppliesSubmit = async () => {
    if (!guest) return
    if (!Object.keys(suppliesCart).length) return

    const lines: string[] = []
    Object.entries(suppliesCart).forEach(([id, qty]) => {
      const item = SUPPLIES_ITEMS.find((i) => i.id === id)
      if (!item) return
      lines.push(`${item.name} — ${qty} шт. (${item.price} ₽)`)
    })

    const details = `Расходники:\n${lines.join("\n")}\nИтого: ${suppliesTotal} ₽`

    addOrder({
      type: "supplies",
      details,
      date: new Date().toLocaleDateString("ru-RU"),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      status: "pending",
    })

    await sendToTelegram({
      type: "supplies",
      roomNumber: guest.roomNumber,
      guestName: guest.name,
      details,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      telegramId: guest.telegramId,
    })

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setActiveService(null)
      setSuppliesCart({})
    }, 2000)
  }

  // Success screens
  if (showReturnSuccess) {
    return (
      <SuccessScreen
        icon={CheckSquare}
        title="Утюг будет возвращён"
        subtitle={
          guest?.roomNumber
            ? `Горничная скоро подойдёт в номер ${guest.roomNumber}`
            : "Горничная скоро подойдёт в ваш номер"
        }
      />
    )
  }

  if (showSuccess) {
    return (
      <SuccessScreen
        icon={Check}
        title="Заявка отправлена"
        subtitle="Мы свяжемся с вами в ближайшее время"
      />
    )
  }

  /* ---------------- IRON SCREEN ---------------- */

  if (activeService === "iron") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="iron"
          {...screenTransition}
          className="min-h-screen bg-background flex flex-col app-screen"
        >
          {/* HEADER */}
          <div
            className="flex items-center justify-between px-4 pb-4"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
          >
            <motion.button {...tap} onClick={() => setActiveService(null)} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </motion.button>
            <h1 className="text-lg font-semibold text-foreground">Заказ утюга</h1>
            <div className="w-10" />
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-4 pb-[env(safe-area-inset-bottom)] space-y-6 overflow-y-auto">
            {/* DATE */}
            <motion.div {...fadeInUp(0.05)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Дата</label>
              <div className="bg-card/60 border border-border/60 rounded-xl h-14 flex items-center px-4 shadow-sm backdrop-blur-sm">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none text-foreground h-full px-0 focus-visible:ring-0"
                />
              </div>
            </motion.div>

            {/* TIME */}
            <motion.div {...fadeInUp(0.1)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Время доставки</label>
              <p className="text-sm text-primary">Доступно: 09:00 – 18:00</p>

              <div className="bg-card/60 border border-border/60 rounded-xl h-14 flex items-center px-4 shadow-sm backdrop-blur-sm">
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  min="09:00"
                  max="18:00"
                  className="bg-transparent border-none text-foreground h-full px-0 focus-visible:ring-0"
                />
              </div>

              {!isDeliveryTimeValid() && (
                <motion.div
                  {...fadeInUp(0.15)}
                  className="bg-card/80 border border-yellow-500/60 text-yellow-100 rounded-xl p-3 flex items-center gap-3 text-sm shadow-sm backdrop-blur-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-yellow-300" />
                  <span>
                    Доставка утюга доступна только с 09:00 до 18:00. Пожалуйста, выберите другое время.
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* WHAT YOU NEED */}
            <motion.div {...fadeInUp(0.2)} className="space-y-3 pt-2">
              <label className="text-sm font-medium text-foreground block">
                Что вам нужно?
              </label>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="need-iron"
                  checked={needIron}
                  onCheckedChange={(checked) => setNeedIron(checked as boolean)}
                  className="mt-1 w-5 h-5 rounded-md border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  disabled={!canOrderIron && !needIron}
                />
                <label
                  htmlFor="need-iron"
                  className="text-sm text-foreground leading-tight flex-1"
                >
                  Утюг{" "}
                  {!canOrderIron && !needIron && (
                    <span className="text-destructive">
                      (все заняты, доступно {TOTAL_IRONS} штук)
                    </span>
                  )}
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="need-board"
                  checked={needBoard}
                  onCheckedChange={(checked) => setNeedBoard(checked as boolean)}
                  className="mt-1 w-5 h-5 rounded-md border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="need-board"
                  className="text-sm text-foreground leading-tight flex-1"
                >
                  Гладильная доска
                </label>
              </div>
            </motion.div>
          </div>

          {/* ACTIONS */}
          <div className="p-4 space-y-3">
            <motion.button
              {...tap}
              onClick={handleIronSubmit}
              disabled={
                !selectedDate ||
                !selectedTime ||
                (!needIron && !needBoard) ||
                !isDeliveryTimeValid()
              }
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-xl text-base font-semibold"
            >
              Заказать{" "}
              {needIron && needBoard
                ? "утюг и доску"
                : needIron
                ? "утюг"
                : "гладильную доску"}
            </motion.button>

            {orders.some(
              (order) => order.type === "iron" && order.status !== "completed"
            ) && (
              <Button
                onClick={handleReturnIron}
                variant="outline"
                className="w-full h-12 border-primary text-primary hover:bg-primary/10 rounded-xl"
              >
                Вернуть утюг
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  /* ---------------- SUPPLIES SCREEN ---------------- */

  if (activeService === "supplies") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="supplies"
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
            <h1 className="text-lg font-semibold text-foreground">Расходники</h1>
            <div className="w-10" />
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-4 pb-[env(safe-area-inset-bottom)] space-y-6 overflow-y-auto">
            <motion.p
              {...fadeInUp(0.02)}
              className="text-sm text-muted-foreground"
            >
              Выберите необходимые товары. Оплата может быть добавлена к счёту номера
              или оформлена отдельно на стойке.
            </motion.p>

            <div className="grid grid-cols-2 gap-4">
              {SUPPLIES_ITEMS.map((item, index) => {
                const qty = suppliesCart[item.id] ?? 0
                return (
                  <motion.div
                    key={item.id}
                    {...fadeInUp(0.04 + index * 0.04)}
                    className="bg-card/80 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm flex flex-col"
                  >
                    <div className="w-full aspect-square bg-muted/40 rounded-xl mb-3 flex items-center justify-center text-xs text-muted-foreground">
                      Фото товара
                    </div>
                    <h3 className="font-medium text-foreground text-sm mb-1">
                      {item.name}
                    </h3>
                    <p className="text-primary text-sm mb-3">{item.price} ₽</p>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      {qty > 0 ? (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-border"
                            onClick={() => handleSuppliesChange(item.id, -1)}
                          >
                            -
                          </Button>
                          <span className="text-sm font-semibold text-foreground">
                            {qty} шт.
                          </span>
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleSuppliesChange(item.id, 1)}
                          >
                            +
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full h-9 rounded-lg text-xs"
                          onClick={() => handleSuppliesChange(item.id, 1)}
                        >
                          Добавить
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* CART SUMMARY */}
          <AnimatePresence>
            {Object.keys(suppliesCart).length > 0 && (
              <motion.div
                {...fadeInUp(0)}
                className="border-t border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] space-y-2"
              >
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Итого к заказу</span>
                  <span className="text-foreground font-semibold">
                    {suppliesTotal} ₽
                  </span>
                </div>
                <motion.button
                  {...tap}
                  onClick={handleSuppliesSubmit}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold"
                >
                  Оформить заказ
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    )
  }

  /* ---------------- MAIN SERVICES LIST ---------------- */

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="services-main"
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
          <h1 className="text-lg font-semibold text-foreground">Доп. услуги</h1>
          <div className="w-10" />
        </div>

        {/* SERVICES LIST */}
        <div className="px-4 pb-[env(safe-area-inset-bottom)] space-y-3">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              {...fadeInUp(index * 0.05)}
              {...tap}
              onClick={() => handleServiceClick(service.id, service.working)}
              className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors shadow-sm"
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
    </AnimatePresence>
  )
}
