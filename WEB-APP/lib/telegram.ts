export async function sendOrderToTelegram(orderDetails: {
  type: string
  guestName: string
  roomNumber: string
  details: string
  date?: string
  time?: string
  paymentMethod?: string
  [key: string]: unknown
}) {
  try {
    const response = await fetch("/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDetails),
    })

    if (!response.ok) {
      console.error("[v0] Telegram API error:", response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Failed to send order to Telegram:", error)
    return false
  }
}
