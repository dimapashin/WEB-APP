"use client"

import type React from "react"

import { ArrowLeft, UtensilsCrossed, Car, AlarmClock, Shirt, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAppStore } from "@/lib/store"

interface OrdersScreenProps {
  onBack: () => void
}

const orderIcons: Record<string, React.ElementType> = {
  breakfast: UtensilsCrossed,
  taxi: Car,
  wakeup: AlarmClock,
  iron: Shirt,
}

const statusLabels: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  completed: "Выполнен",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-primary/20 text-primary",
  completed: "bg-[#4CAF50]/20 text-[#4CAF50]",
}

export function OrdersScreen({ onBack }: OrdersScreenProps) {
  const orders = useAppStore((state) => state.orders)
  const deleteOrder = useAppStore((state) => state.deleteOrder)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId)
    setDeleteConfirm(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4" style={{ paddingTop: `calc(1.5rem + 5rem)` }}>
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Мои заказы</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 py-2">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">У вас пока нет заказов</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...orders].reverse().map((order) => {
              const Icon = orderIcons[order.type] || UtensilsCrossed
              const date = new Date(order.createdAt)
              const formattedDate = date.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })

              return (
                <div key={order.id} className="bg-card rounded-2xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-foreground truncate">{order.details}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(order.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Удалить заказ?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Это действие нельзя отменить. Заказ будет удален безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteOrder(deleteConfirm)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
