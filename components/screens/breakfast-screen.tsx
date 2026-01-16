"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

interface BreakfastScreenProps {
  onBack: () => void
}

const breakfastItems = [
  {
    id: "omelet",
    name: "Омлет с топпингами",
    description: "Пышный омлет с выбором начинок: бекон, грибы, томаты, сыр",
    price: 1100,
    image: "/images/d0-b7-d0-b0-d0-b2-d1-82-d1-80-d0-b0-d0-ba-201.png",
  },
  {
    id: "crepes",
    name: "Блины с соусами",
    description: "Тонкие блины со сметаной, медом и ягодным джемом",
    price: 1100,
    image: "/images/d0-b7-d0-b0-d0-b2-d1-82-d1-80-d0-b0-d0-ba-202.png",
  },
  {
    id: "porridge",
    name: "Каша с ягодами",
    description: "Овсяная каша с семенами льна, свежими ягодами и бананом",
    price: 1100,
    image: "/images/d0-b7-d0-b0-d0-b2-d1-82-d1-80-d0-b0-d0-ba-203.png",
  },
]

export function BreakfastScreen({ onBack }: BreakfastScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutDate, setCheckoutDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "sbp" | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, addOrder, guest } = useAppStore()

  const selectedItem = breakfastItems[selectedIndex]
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

    const { sendOrderToTelegram } = await import("@/lib/telegram")
    await sendOrderToTelegram({
      type: "breakfast",
      guestName: guest?.name || "Unknown",
      roomNumber: guest?.roomNumber || "N/A",
      details: `${cart.map((item) => `${item.name} x${item.quantity}`).join(", ")} на ${checkoutDate}`,
      date: checkoutDate,
      paymentMethod,
    })

    addOrder({
      type: "breakfast",
      items: cart,
      details: `${cart.map((item) => `${item.name} x${item.quantity}`).join(", ")} на ${checkoutDate}`,
      date: checkoutDate,
      paymentMethod,
      status: "pending",
    })
    clearCart()
    setShowCheckout(false)
    setShowCart(false)
    setOrderSuccess(true)
    setTimeout(() => {
      setOrderSuccess(false)
      onBack()
    }, 2000)
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
        setSelectedIndex((selectedIndex + 1) % breakfastItems.length)
      } else {
        // swipe right, go to prev
        setSelectedIndex((selectedIndex - 1 + breakfastItems.length) % breakfastItems.length)
      }
    }
    setIsDragging(false)
  }

  const cartItem = cart.find((item) => item.id === selectedItem.id)

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Заказ оформлен!</h2>
          <p className="text-muted-foreground mt-2">Доставим в номер {guest?.roomNumber}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Завтрак (7:00 - 11:00)</h1>
        <button onClick={() => setShowCart(true)} className="relative p-2 -mr-2">
          <ShoppingCart className="w-6 h-6 text-foreground" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
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
          {breakfastItems.length > 0 && (
            <motion.img
              src={breakfastItems[(selectedIndex - 1 + breakfastItems.length) % breakfastItems.length].image}
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

          {breakfastItems.length > 0 && (
            <motion.img
              src={breakfastItems[(selectedIndex + 1) % breakfastItems.length].image}
              alt="next"
              className="w-32 h-48 rounded-2xl object-cover opacity-40"
              style={{ scale: 0.85 }}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="flex justify-center gap-3 py-4">
        <button
          onClick={() => setSelectedIndex((selectedIndex - 1 + breakfastItems.length) % breakfastItems.length)}
          className="px-4 py-2 rounded-full bg-primary/20 text-primary font-medium"
        >
          ←
        </button>
        <div className="flex gap-2">
          {breakfastItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <button
          onClick={() => setSelectedIndex((selectedIndex + 1) % breakfastItems.length)}
          className="px-4 py-2 rounded-full bg-primary/20 text-primary font-medium"
        >
          →
        </button>
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
            <div>
              <h2 className="text-xl font-semibold text-foreground">{selectedItem.name}</h2>
              <p className="text-muted-foreground mt-1">{selectedItem.description}</p>
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
