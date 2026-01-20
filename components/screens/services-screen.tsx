"use client"

import { useState } from "react"
import { ArrowLeft, Shirt, Sparkles, ShoppingBag, Brush, Check, AlertCircle, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { sendToTelegram } from "@/lib/telegram-service"

interface ServicesScreenProps {
  onBack: () => void
}

type ServiceType = "laundry" | "supplies" | "cleaning" | null


export function ServicesScreen({ onBack }: ServicesScreenProps) {
  const [activeService, setActiveService] = useState<ServiceType>(null)
  const [selectedTime, setSelectedTime] = useState("10:00")
  const [selectedDate, setSelectedDate] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const { addOrder, guest, orders } = useAppStore()

  const services = [
    { id: "laundry", icon: Shirt, title: "Прачечная", subtitle: "Стирка и химчистка", working: false },
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



  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Заказ оформлен!</h2>
          <p className="text-muted-foreground mt-2">Доставим в номер {guest?.roomNumber}</p>
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
        <div className="flex-1 px-4 py-2">
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
      {showUnavailable && (
        <div className="fixed bottom-6 left-4 right-4 bg-card border border-border rounded-2xl p-4 flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground">Услуга временно недоступна</span>
        </div>
      )}
    </div>
  )
}
