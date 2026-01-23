"use client"

import { useAppStore } from "@/lib/store"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export function StayWidget() {
  const guest = useAppStore((state) => state.guest)

  if (!guest?.checkIn || !guest?.checkOut || !guest?.roomCategory) {
    return (
      <div className="bg-card rounded-xl p-4 flex items-center justify-center h-[110px]">
        <p className="text-muted-foreground text-sm">Нет данных о проживании</p>
      </div>
    )
  }

  const checkInDate = new Date(guest.checkIn)
  const checkOutDate = new Date(guest.checkOut)

  const dateRange = `${format(checkInDate, "d MMM", { locale: ru })} — ${format(
    checkOutDate,
    "d MMM",
    { locale: ru }
  )}`

  const timeRange = `${format(checkInDate, "HH:mm")} — ${format(checkOutDate, "HH:mm")}`

  return (
    <div className="bg-card rounded-xl p-4 flex items-center justify-between h-[110px]">
      {/* LEFT SIDE — CATEGORY */}
      <div className="flex flex-col">
        <p className="text-xl font-semibold text-foreground leading-tight">
          {guest.roomCategory}
        </p>
      </div>

      {/* DIVIDER */}
      <div className="h-full border-l border-border/40 mx-4" />

      {/* RIGHT SIDE — DATES */}
      <div className="flex flex-col text-right">
        <p className="text-sm font-medium text-foreground">{dateRange}</p>
        <p className="text-xs text-muted-foreground">{timeRange}</p>
      </div>
    </div>
  )
}
