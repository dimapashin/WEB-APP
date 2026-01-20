"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Info as InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { breakfastComplexes } from "@/lib/breakfast-data"
import { BreakfastDetailsModal } from "@/components/breakfast-details-modal"
import { motion, AnimatePresence } from "framer-motion"
import { useT } from "@/lib/i18n"
import { sendToTelegram } from "@/lib/telegram-service"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
  const [isScrolling, setIsScrolling] = useState(false)
  const t = useT()

  // из useAppStore берем только то, что используется
  const { cart, addToCart, updateCartQuantity, clearCart, guest } = useAppStore()

  const selectedItem = breakfastComplexes[selectedIndex]
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartItem = selectedItem ? cart.find((item) => item.id === selectedItem.id) : undefined

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

    // Check if guest is staying in the hotel on the selected date
    if (guest?.checkInDate && guest?.checkoutDate) {
      const selectedDate = new Date(checkoutDate);
      const checkInDate = new Date(guest.checkInDate);
      const checkOutDate = new Date(guest.checkoutDate);

      if (selectedDate < checkInDate || selectedDate > checkOutDate) {
        alert(t("breakfast.date_error") || "Вы не проживаете в отеле в эти даты");
        return;
      }
    }

    const cartItems = cart.map((item) => `${item.name} x${item.quantity}`).join(", ")

    // Send to Telegram
    if (guest) {
      await sendToTelegram({
        type: "breakfast",
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        details: `Завтраки: ${cartItems}. Дата: ${checkoutDate}`,
        date: checkoutDate,
        amount: cartTotal,
        paymentMethod: paymentMethod,
        telegramId: guest.telegramId,
      })
    }

    // Show payment unavailable notification instead of real payment
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
    <div className="min-h-screen bg-background flex flex-col app-screen breakfast-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ paddingTop: `calc(1.5rem + 5rem)` }}>
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
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

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={false}
          noSwiping={false}
          centeredSlides={true}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
          className="mySwiper"
        >
          {breakfastComplexes.map((complex, index) => (
            <SwiperSlide key={complex.id}>
              <div className="flex justify-center py-4 px-4">
                <motion.img
                  src={complex.image}
                  alt={complex.name}
                  className="w-full max-w-sm aspect-video rounded-2xl object-cover shadow-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 !w-10 !h-10 !rounded-full !bg-background/80 !backdrop-blur-sm !border-border !hover:bg-primary/10 !text-foreground !flex !items-center !justify-center">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <div className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 !w-10 !h-10 !rounded-full !bg-background/80 !backdrop-blur-sm !border-border !hover:bg-primary/10 !text-foreground !flex !items-center !justify-center">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Content + Add to Cart */}
      <div className="flex-1 px-4 pb-4">
        {selectedItem && (
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
                      {t("breakfast.add_to_cart")}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Cart Summary */}
      {cartCount > 0 && !showCart && (
        <div className="p-4 border-t border-border">
          <Button
            onClick={() => setShowCart(true)}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t("breakfast.cart")} · {cartTotal} ₽
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
              <h2 className="text-xl font-semibold text-foreground mb-4">{t("breakfast.cart")}</h2>
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
                  <span className="text-muted-foreground">{t("breakfast.total")}</span>
                  <span className="text-xl font-semibold text-foreground">{cartTotal} ₽</span>
                </div>
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t("breakfast.proceed_to_checkout")}
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

      {/* Checkout Modal */}
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
              <h2 className="text-xl font-semibold text-foreground mb-6">{t("breakfast.checkout_title")}</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    {t("breakfast.date")}
                  </label>
                  <Input
                    type="date"
                    value={checkoutDate}
                    onChange={(e) => setCheckoutDate(e.target.value)}
                    className="bg-background border-border text-foreground h-12 w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    {t("breakfast.payment_method")}
                  </label>
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
                        <p className="font-medium">{t("breakfast.card_payment")}</p>
                        <p className="text-sm text-muted-foreground">{t("common.card_payment")}</p>
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
                        <p className="font-medium">{t("breakfast.sbp_payment")}</p>
                        <p className="text-sm text-muted-foreground">{t("breakfast.sbp_description")}</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">{t("breakfast.total")}</span>
                    <span className="font-medium text-foreground">{cartTotal} ₽</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckoutSubmit}
                  disabled={!checkoutDate || !paymentMethod}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {t("breakfast.pay")} {cartTotal} ₽
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
