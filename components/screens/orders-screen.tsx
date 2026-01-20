"use client"

import type React from "react"

import {
  ArrowLeft,
  UtensilsCrossed,
  Car,
  AlarmClock,
  Shirt,
  Trash2,
  X,
  Calendar,
  Clock,
} from "lucide-react"

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
import { motion, AnimatePresence } from "framer-motion"

import {
  screenTransition,
  fadeInUp,
  fadeIn,
  tap,
  scaleIn,
} from "@/lib/animations"

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
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId)
    setDeleteConfirm(null)
    setSelectedOrder(null)
  }

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
        <motion.button onClick={onBack} className="p-2 -ml-2" {...tap}>
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </motion.button>

        <h1 className="text-lg font-semibold text-foreground">Мои заказы</h1>

        <div className="w-10" />
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-[env(safe-area-inset-bottom)]">
        {orders.length === 0 ? (
          <motion.div
            {...fadeInUp(0.1)}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">У вас пока нет заказов</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {[...orders]
              .reverse()
              .filter((order) => order.type !== "wakeup")
              .map((order, index) => {
                const Icon = orderIcons[order.type] || UtensilsCrossed
                const date = new Date(order.createdAt)
                const formattedDate = date.toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <motion.button
                    key={order.id}
                    {...fadeInUp(index * 0.05)}
                    {...tap}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-card rounded-2xl p-4 text-left hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-foreground truncate">
                            {order.details}
                          </h3>

                          <span
                            className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${statusColors[order.status]}`}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-1">
                          {formattedDate}
                        </p>
                      </div>

                      <motion.button
                        {...tap}
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirm(order.id)
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    </div>
                  </motion.button>
                )
              })}
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            {...fadeIn}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              {...scaleIn}
              className="w-full bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Детали заказа
                </h2>

                <motion.button
                  {...tap}
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {(() => {
                      const Icon = orderIcons[selectedOrder.type] || UtensilsCrossed
                      return <Icon className="w-6 h-6 text-primary" />
                    })()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Тип заказа
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${statusColors[selectedOrder.status]}`}
                      >
                        {statusLabels[selectedOrder.status]}
                      </span>
                    </div>

                    <p className="text-foreground">{selectedOrder.details}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  {selectedOrder.date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Дата</p>
                        <p className="text-foreground font-medium">
                          {new Date(selectedOrder.date).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Время</p>
                        <p className="text-foreground font-medium">
                          {selectedOrder.time}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Создан</p>
                      <p className="text-foreground font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleString("ru-RU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Удалить заказ?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-muted-foreground">
              Это действие нельзя отменить. Заказ будет удален безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">
              Отмена
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteOrder(deleteConfirm)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
