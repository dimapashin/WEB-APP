"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Check, Info as InfoIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { breakfastComplexes } from "@/lib/breakfast-data"
import { BreakfastDetailsModal } from "@/components/breakfast-details-modal"
import { motion, AnimatePresence } from "framer-motion"
import { useT } from "@/lib/i18n"
import { breakfastItems } from "@/lib/breakfast-data" // Import breakfastItems

interface BreakfastScreenProps {
  onBack: () => void
}

interface PaymentNotificationProps {
  isOpen: boolean
  onClose: () => void
}

const PaymentNotification = ({ isOpen, onClose }: PaymentNotificationProps) => {
  const t = useT()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[rgba(15,15,15,0.95)] rounded-xl p-6 max-w-sm space-y-6 border border-border"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <InfoIcon className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-foreground leading-relaxed">{t("breakfast.payment_unavailable")}</p>
            </div>
            <Button
              onClick={onClose}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("breakfast.got_it")}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function BreakfastScreen({ onBack }: BreakfastScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPaymentNotification, setShowPaymentNotification] = useState(false)
  const [checkoutDate, setCheckoutDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "sbp" | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const t = useT()

  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, addOrder, guest } = useAppStore()

  const selectedItem = breakfastComplexes[selectedIndex]
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddToCart = () => {
    addToCart({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: 1,
      image: selectedItem.image,
    })
  }

  const handleCheckoutSubmit = async () => {
    if (!checkoutDate || !paymentMethod) return

    // Show payment unavailable notification instead of processing payment
    setShowPaymentNotification(true)
    clearCart()
    setShowCheckout(false)
    setShowCart(false)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    setDragStart("touches" in e ? e.touches[0].clientX : e.clientX)
  }

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const dragEnd = "changedTouches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX
    const diff = dragStart - dragEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left, go to next
        setSelectedIndex((selectedIndex + 1) % breakfastComplexes.length)
      } else {
        // swipe right, go to prev
        setSelectedIndex((selectedIndex - 1 + breakfastComplexes.length) % breakfastComplexes.length)
      }
    }
    setIsDragging(false)
  }

  const cartItem = cart.find((item) => item.id === selectedItem.id)

  if (orderSuccess) {
    return (
      <>
      <PaymentNotification
        isOpen={showPaymentNotification}
        onClose={() => {
          setShowPaymentNotification(false)
          onBack()
        }}
      />
      <div className="min-h-screen bg-background" />
    </>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ paddingTop: `max(1.5rem, env(safe-area-inset-top))` }}>
        <Button
          onClick={onBack}
          variant="ghost"
          className="p-2 h-auto text-foreground hover:text-primary"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">{t("breakfast.title")}</h1>
        <button onClick={() => setShowCart(true)} className="relative p-2">
          <ShoppingCart className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div
        ref={carouselRef}
        className="relative h-80 overflow-hidden flex items-center justify-center py-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex gap-4 px-4 relative w-full justify-center">
          {breakfastComplexes.length > 0 && (
            <motion.img
              src={breakfastComplexes[(selectedIndex - 1 + breakfastComplexes.length) % breakfastComplexes.length].image}
              alt="prev"
              className="w-32 h-48 rounded-2xl object-cover opacity-40"
              style={{ scale: 0.85 }}
              draggable={false}
            />
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={selectedItem.id}
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-48 h-64 rounded-2xl object-cover shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              draggable={false}
            />
          </AnimatePresence>

          {breakfastComplexes.length > 0 && (
            <motion.img
              src={breakfastComplexes[(selectedIndex + 1) % breakfastComplexes.length].image}
              alt="next"
              className="w-32 h-48 rounded-2xl object-cover opacity-40"
              style={{ scale: 0.85 }}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="flex items-center justify-center gap-3 py-4">
        <Button
          onClick={() => setSelectedIndex((selectedIndex - 1 + breakfastComplexes.length) % breakfastComplexes.length)}
          variant="outline"
          className="w-10 h-10 p-0 flex items-center justify-center text-foreground border-border hover:bg-primary/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex gap-2">
          {breakfastComplexes.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <Button
          onClick={() => setSelectedIndex((selectedIndex + 1) % breakfastComplexes.length)}
          variant="outline"
          className="w-10 h-10 p-0 flex items-center justify-center text-foreground border-border hover:bg-primary/10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">{selectedItem.name}</h2>
                  <p className="text-muted-foreground mt-1 text-sm">{selectedItem.description}</p>
                </div>
              </div>
              <Button
                onClick={() => setShowDetailsModal(true)}
                variant="ghost"
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium text-sm"
              >
                {t("breakfast.details")} →
              </Button>
            </div>
            <div className="bg-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-primary">{selectedItem.price} ₽</span>
                {cartItem ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    <span className="w-6 text-center text-foreground font-medium">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
                  >
                    Добавить
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cart Summary */}
      {cartCount > 0 && !showCart && (
        <div className="p-4 border-t border-border">
          <Button
            onClick={() => setShowCart(true)}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Корзина · {cartTotal} ₽
          </Button>
        </div>
      )}

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && !showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-foreground mb-4">Корзина</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-primary">{item.price} ₽</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 text-foreground" />
                      </button>
                      <span className="w-6 text-center text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 text-primary-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Итого</span>
                  <span className="text-xl font-semibold text-foreground">{cartTotal} ₽</span>
                </div>
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Перейти к оплате
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <BreakfastDetailsModal
        complex={selectedItem}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      {/* Payment Notification */}
      <PaymentNotification
        isOpen={showPaymentNotification}
        onClose={() => {
          setShowPaymentNotification(false)
          onBack()
        }}
      />

      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-card rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-foreground mb-6">Оформление заказа</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Дата доставки</label>
                  <Input
                    type="date"
                    value={checkoutDate}
                    onChange={(e) => setCheckoutDate(e.target.value)}
                    className="bg-background border-border text-foreground h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-3">Способ оплаты</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`w-full p-4 rounded-xl border transition-colors ${
                        paymentMethod === "card"
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-background border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium">Банковская карта</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("sbp")}
                      className={`w-full p-4 rounded-xl border transition-colors ${
                        paymentMethod === "sbp"
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-background border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium">Система быстрых платежей (СБП)</p>
                        <p className="text-sm text-muted-foreground">Быстрая оплата через СБП</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Сумма</span>
                    <span className="font-medium text-foreground">{cartTotal} ₽</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckoutSubmit}
                  disabled={!checkoutDate || !paymentMethod}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Оплатить {cartTotal} ₽
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
