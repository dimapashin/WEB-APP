import { type NextRequest, NextResponse } from "next/server"

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8594370320:AAG-BYVZXyzxn_U3Ie5Jv6w_H7JltfFTYEk"
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003540162741"

const typeLabels: Record<string, string> = {
  breakfast: "🥐 Завтрак",
  taxi: "🚕 Такси",
  restaurant: "🍽️ Ресторан",
  wakeup: "⏰ Будильник",
  supplies: "🛒 Доп. услуги",
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      type = "unknown",
      guestName = "Unknown",
      roomNumber = "N/A",
      details = "No details",
      date = "",
      time = "",
      paymentMethod = "",
    } = data

    const typeLabel = typeLabels[type] || type
    let message = `<b>Новый заказ</b>\n\n`
    message += `<b>Тип:</b> ${typeLabel}\n`
    message += `<b>Гость:</b> ${guestName}\n`
    message += `<b>Номер комнаты:</b> ${roomNumber}\n`
    message += `<b>Деталии:</b> ${details}\n`

    if (date) message += `<b>Дата:</b> ${date}\n`
    if (time) message += `<b>Время:</b> ${time}\n`
    if (paymentMethod) message += `<b>Способ оплаты:</b> ${paymentMethod === "card" ? "Банковская карта" : "СБП"}\n`

    message += `\n<i>Время получения:</i> ${new Date().toLocaleString("ru-RU")}`

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Telegram API error:", response.statusText)
      return NextResponse.json({ success: false, error: "Failed to send message to Telegram" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Telegram route error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
