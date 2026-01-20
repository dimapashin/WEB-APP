"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Info as InfoIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { breakfastComplexes } from "@/lib/breakfast-data"
import { BreakfastDetailsModal } from "@/components/breakfast-details-modal"

import { motion, AnimatePresence } from "framer-motion"
import { useT } from "@/lib/i18n"
import { sendToTelegram } from "@/lib/telegram-service"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

import {
  screenTransition,
  fadeInUp,
  fadeIn,
  tap,
  scaleIn,
} from "@/lib/animations"

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
          {...fadeIn}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            {...scaleIn}
            className="bg-[rgba(15,15,15,0.95)] rounded-xl p-6 max-w-sm space-y-6 border border-border"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <InfoIcon className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-foreground leading-relaxed">
                {t("breakfast.payment_unavailable")}
              </p>
            </div>

            <motion.button
              {...tap}
              onClick={onClose}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              {t("breakfast.got_it")}
            </motion.button>
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

  const t = useT()
  const { cart, addToCart, updateCartQuantity, clearCart, guest } = useAppStore()

  const selectedItem = breakfastComplexes[selectedIndex]
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartItem = selectedItem ? cart.find((i) => i.id === selectedItem.id) : undefined

  const handleAddToCart = () => {
    if (!selectedItem) return
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

    if (guest?.checkInDate && guest?.checkoutDate) {
      const selectedDateObj = new Date(checkoutDate)
      const checkInDate = new Date(guest.checkInDate)
      const checkOutDate = new Date(guest.checkoutDate)

      if (selectedDateObj < checkInDate || selectedDateObj > checkOutDate) {
        alert(t("breakfast.date_error"))
        return
      }
    }

    const cartItems = cart.map((item) => `${item.name} x${item.quantity}`).join(", ")

    if (guest) {
      await sendToTelegram({
        type: "breakfast",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: `Завтраки: ${cartItems}. Дата: ${checkoutDate}`,
        date: checkoutDate,
        amount: cartTotal,
        paymentMethod,
        telegramId: guest.telegramId,
      })
    }

    setShowPaymentNotification(true)
    clearCart()
    setShowCheckout(false)
    setShowCart(false)
  }

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
    <motion.div
      {...screenTransition}
      className="min-h-screen bg-background flex flex-col app-screen breakfast-screen"
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 pb-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
      >
        <motion.button {...tap} onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </motion.button>

        <h1 className="text-lg font-semibold text-foreground">
          {t("breakfast.title")}
        </h1>

        <motion.button {...tap} onClick={() => setShowCart(true)} className="relative p-2">
          <ShoppingCart className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
              {cartCount}
            </span>
          )}
        </motion.button>
      </div>
      {/* CAROUSEL */}
      <div className="relative w-full overflow-hidden pb-6">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={false}
          centeredSlides={true}
          onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
          className="mySwiper"
        >
          {breakfastComplexes.map((complex) => (
            <SwiperSlide key={complex.id}>
              <div className="flex justify-center py-4 px-4">
                <motion.img
                  key={complex.id}
                  src={complex.image}
                  alt={complex.name}
                  className="w-full max-w-sm aspect-[4/3] rounded-2xl object-cover shadow-2xl border border-border/50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.jpg"
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* iOS-style pagination */}
        <div className="flex justify-center gap-2 mt-2">
          {breakfastComplexes.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`transition-all h-1.5 rounded-full ${
                i === selectedIndex ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CONTENT + ADD TO CART */}
      <div className="flex-1 px-4 pb-4">
        {selectedItem && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedItem.id}
              {...fadeInUp(0.05)}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Title + Description */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {selectedItem.name}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <motion.button
                  {...tap}
                  onClick={() => setShowDetailsModal(true)}
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium text-sm -ml-1"
                >
                  {t("breakfast.details")} →
                </motion.button>
              </div>

              {/* Price + Quantity */}
              <motion.div
                {...fadeInUp(0.1)}
                className="bg-card/60 rounded-2xl p-5 space-y-4 border border-border shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">

                  {/* Price */}
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-primary">
                      {selectedItem.price} ₽
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      за порцию
                    </span>
                  </div>

                  {/* Stepper */}
                  {cartItem ? (
                    <div className="flex items-center gap-4">

                      <motion.button
                        {...tap}
                        onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        <Minus className="w-5 h-5 text-foreground" />
                      </motion.button>

                      <span className="w-8 text-center text-foreground font-semibold text-lg">
                        {cartItem.quantity}
                      </span>

                      <motion.button
                        {...tap}
                        onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                      >
                        <Plus className="w-5 h-5 text-primary-foreground" />
                      </motion.button>

                    </div>
                  ) : (
                    <motion.button
                      {...tap}
                      onClick={handleAddToCart}
                      className="bg-primary text-primary-foreground rounded-xl px-8 py-6 h-auto font-semibold shadow-md hover:bg-primary/90 transition-all"
                    >
                      {t("breakfast.add_to_cart")}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Cart Summary */}
      {cartCount > 0 && !showCart && (
        <motion.div {...fadeInUp(0.1)} className="p-4 border-t border-border">
          <motion.button
            {...tap}
            onClick={() => setShowCart(true)}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
          >
            {t("breakfast.cart")} · {cartTotal} ₽
          </motion.button>
        </motion.div>
      )}
      {/* CART MODAL */}
      <AnimatePresence>
        {showCart && !showCheckout && (
          <motion.div
            {...fadeIn}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="w-full bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto border-t border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t("breakfast.cart")}
              </h2>

              {/* ITEMS */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    {...fadeInUp(0.05)}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4 bg-background/50 rounded-xl p-3 border border-border/50"
                  >
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-border/50"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-primary font-medium">{item.price} ₽</p>
                    </div>

                    {/* STEPPER */}
                    <div className="flex items-center gap-3 bg-card rounded-xl p-2 border border-border">
                      <motion.button
                        {...tap}
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </motion.button>

                      <span className="w-8 text-center text-foreground font-semibold">
                        {item.quantity}
                      </span>

                      <motion.button
                        {...tap}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-primary-foreground" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-6 p-4 bg-card/50 rounded-xl border border-border/50">
                  <span className="text-lg font-semibold text-foreground">
                    {t("breakfast.total")}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {cartTotal} ₽
                  </span>
                </div>

                <motion.button
                  {...tap}
                  onClick={() => setShowCheckout(true)}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-semibold rounded-xl"
                >
                  {t("breakfast.proceed_to_checkout")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            {...fadeIn}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="w-full bg-card rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto border-t border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t("breakfast.checkout_title")}
              </h2>

              <div className="space-y-6">

                {/* DATE */}
                <motion.div {...fadeInUp(0.05)} className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    {t("breakfast.date")}
                  </label>

                  <div className="relative overflow-hidden rounded-lg border border-border">
                    <Input
                      type="date"
                      value={checkoutDate}
                      onChange={(e) => setCheckoutDate(e.target.value)}
                      className="bg-background text-foreground h-12 w-full px-4 appearance-none"
                    />
                  </div>
                </motion.div>

                {/* PAYMENT METHOD */}
                <motion.div {...fadeInUp(0.1)} className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    {t("breakfast.payment_method")}
                  </label>

                  <div className="space-y-3">

                    {/* CARD */}
                    <motion.button
                      {...tap}
                      onClick={() => setPaymentMethod("card")}
                      className={`w-full p-4 rounded-xl border transition-colors text-left ${
                        paymentMethod === "card"
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium">{t("breakfast.card_payment")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("common.card_payment")}
                      </p>
                    </motion.button>

                    {/* SBP */}
                    <motion.button
                      {...tap}
                      onClick={() => setPaymentMethod("sbp")}
                      className={`w-full p-4 rounded-xl border transition-colors text-left ${
                        paymentMethod === "sbp"
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium">{t("breakfast.sbp_payment")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("breakfast.sbp_description")}
                      </p>
                    </motion.button>

                  </div>
                </motion.div>

                {/* TOTAL */}
                <motion.div
                  {...fadeInUp(0.15)}
                  className="bg-card/50 rounded-xl p-4 border border-border/50"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">
                      {t("breakfast.total")}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {cartTotal} ₽
                    </span>
                  </div>
                </motion.div>

                {/* SUBMIT */}
                <motion.button
                  {...tap}
                  onClick={handleCheckoutSubmit}
                  disabled={!checkoutDate || !paymentMethod}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-xl font-semibold"
                >
                  {t("breakfast.pay")} {cartTotal} ₽
                </motion.button>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* DETAILS MODAL */}
      <BreakfastDetailsModal
        complex={selectedItem}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      {/* PAYMENT NOTIFICATION */}
      <PaymentNotification
        isOpen={showPaymentNotification}
        onClose={() => {
          setShowPaymentNotification(false)
          onBack()
        }}
      />
    </motion.div>
  )
}
