"use client"

import { Phone, ClipboardList, AlarmClock, Info } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"

interface QuickActionProps {
  onOrdersClick: () => void
  onWakeupClick: () => void
  onAboutClick: () => void
}

export function QuickActions({ onOrdersClick, onWakeupClick, onAboutClick }: QuickActionProps) {
  const [showReception, setShowReception] = useState(false)
  const alarms = useAppStore((state) => state.alarms)
  const t = useT()

  const actions = [
    {
      icon: Phone,
      onClick: () => setShowReception(true),
      titleKey: "quick_actions.reception",
    },
    {
      icon: ClipboardList,
      onClick: onOrdersClick,
      titleKey: "quick_actions.orders",
    },
    {
      icon: AlarmClock,
      onClick: onWakeupClick,
      titleKey: "quick_actions.wakeup",
      badge: alarms.length > 0 ? alarms.length : undefined,
    },
    {
      icon: Info,
      onClick: onAboutClick,
      titleKey: "quick_actions.about",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.titleKey}
            onClick={action.onClick}
            className="relative flex flex-col items-center gap-2 p-3 bg-card rounded-2xl transition-scale active:scale-95"
            title={t(action.titleKey)}
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
            <DialogTitle className="text-foreground">{t("quick_actions.reception")}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4 space-y-4">
            <p className="text-muted-foreground">Позвоните нам для любой помощи</p>
            <a
              href="tel:+78126795772"
              className="block text-2xl font-semibold text-primary hover:text-primary/80 transition-colors"
            >
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
