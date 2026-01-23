"use client"

import { useAppStore } from "@/lib/store"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export function StayWidget({ index, total }: { index: number; total: number }) {
  const guest = useAppStore((state) => state.guest)

  if (!guest?.checkInDate || !guest?.checkoutDate || !guest?.roomCategory) {
    return (
      <div className="bg-card rounded-xl p-4 flex items-center justify-center h-[110px] relative">
        <p className="text-muted-foreground text-sm">Нет данных о проживании</p>
        <Indicators index={index} total={total} />
      </div>
    )
  }

  const checkIn = new Date(guest.checkInDate)
  const checkOut = new Date(guest.checkoutDate)

  const dateRange = `${format(checkIn, "d MMM", { locale: ru })} — ${format(checkOut, "d MMM", { locale: ru })}`
  const timeRange = `${format(checkIn, "HH:mm")} — ${format(checkOut, "HH:mm")}`

  return (
    <div className="bg-card rounded-xl p-4 flex items-center justify-between h-[110px] relative">
      {/* LEFT — CATEGORY */}
      <div className="flex flex-col">
        <p className="text-xl font-semibold text-foreground">{guest.roomCategory}</p>
      </div>

      {/* DIVIDER */}
      <div className="h-full border-l border-border/40 mx-4" />

      {/* RIGHT — DATES */}
      <div className="flex flex-col text-right">
        <p className="text-sm font-medium text-foreground">{dateRange}</p>
        <p className="text-xs text-muted-foreground">{timeRange}</p>
      </div>

      {/* INDICATORS */}
      <Indicators index={index} total={total} />
    </div>
  )
}

function Indicators({ index, total }: { index: number; total: number }) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-0.5 w-4 rounded-full transition-all ${
            i === index ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  )
}
