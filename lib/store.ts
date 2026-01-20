import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Guest {
  name: string
  roomNumber: string
  checkoutDate: string // ISO date format
  telegramId?: string
  checkInDate?: string // ISO date format
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  type: "breakfast" | "taxi" | "restaurant" | "wakeup" | "supplies"
  items?: OrderItem[]
  details: string
  time?: string
  date?: string
  status: "pending" | "confirmed" | "completed"
  createdAt: string
}

export interface Alarm {
  id: string
  date: string
  time: string
  comment: string
  createdAt: string
}

interface AppState {
  guest: Guest | null
  orders: Order[]
  cart: OrderItem[]
  alarms: Alarm[]
  isAuthenticated: boolean
  setGuest: (guest: Guest) => void
  logout: () => void
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void
  addToCart: (item: OrderItem) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  addAlarm: (alarm: Omit<Alarm, "id" | "createdAt">) => void
  removeAlarm: (alarmId: string) => void
  deleteOrder: (orderId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      guest: null,
      orders: [],
      cart: [],
      alarms: [],
      isAuthenticated: false,
      setGuest: (guest) => set({ guest, isAuthenticated: true }),
      logout: () => set({ guest: null, isAuthenticated: false, cart: [], alarms: [] }),
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: `order-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ orders: [...get().orders, newOrder] })
      },
      deleteOrder: (orderId) => {
        set({ orders: get().orders.filter((o) => o.id !== orderId) })
      },
      addToCart: (item) => {
        const cart = get().cart
        const existingItem = cart.find((i) => i.id === item.id)
        if (existingItem) {
          set({
            cart: cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
          })
        } else {
          set({ cart: [...cart, { ...item, quantity: 1 }] })
        }
      },
      removeFromCart: (itemId) => {
        set({ cart: get().cart.filter((i) => i.id !== itemId) })
      },
      updateCartQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          set({ cart: get().cart.filter((i) => i.id !== itemId) })
        } else {
          set({
            cart: get().cart.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
          })
        }
      },
      clearCart: () => set({ cart: [] }),
      addAlarm: (alarm) => {
        const newAlarm: Alarm = {
          ...alarm,
          id: `alarm-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ alarms: [...get().alarms, newAlarm] })
      },
      removeAlarm: (alarmId) => {
        set({ alarms: get().alarms.filter((a) => a.id !== alarmId) })
      },
    }),
    {
      name: "vidi-hotel-storage",
    },
  ),
)
