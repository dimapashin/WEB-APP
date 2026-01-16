"use client"

import { Phone, ClipboardList, AlarmClock, Info } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface QuickActionProps {
  onOrdersClick: () => void
  onWakeupClick: () => void
  onAboutClick: () => void
}

export function QuickActions({ onOrdersClick, onWakeupClick, onAboutClick }: QuickActionProps) {
  const [showReception, setShowReception] = useState(false)
  const alarms = useAppStore((state) => state.alarms)

  const actions = [
    {
      icon: Phone,
      onClick: () => setShowReception(true),
    },
    {
      icon: ClipboardList,
      onClick: onOrdersClick,
    },
    {
      icon: AlarmClock,
      onClick: onWakeupClick,
      badge: alarms.length > 0 ? alarms.length : undefined,
    },
    {
      icon: Info,
      onClick: onAboutClick,
    },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.icon.name}
            onClick={action.onClick}
            className="relative flex flex-col items-center gap-2 p-3 bg-card rounded-2xl transition-scale active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <action.icon className="w-5 h-5 text-primary" />
            </div>
            {action.badge && (
              <div className="absolute top-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-semibold">
                {action.badge}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={showReception} onOpenChange={setShowReception}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Ресепшен</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">Позвоните нам для любой помощи</p>
            <a href="tel:+78126795772" className="text-2xl font-semibold text-primary">
              +7 (812) 679-57-72
            </a>
          </div>
          <Button
            onClick={() => setShowReception(false)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
