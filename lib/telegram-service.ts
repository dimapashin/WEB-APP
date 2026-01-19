const BOT_TOKEN = "8594370320:AAG-BYVZXyzxn_U3Ie5Jv6w_H7JltfFTYEk"
const RECEPTION_CHAT_ID = "-1003540162741"

const THREAD_IDS = {
  RECEPTION: 454,   // 🛎️ Заявки (Утюг, Wi-Fi, Завтраки)
  TAXI: 452,        // 🚕 Такси  
  WAKEUP: 450,      // ⏰ Будильники
  REVIEWS: 447,     // ⭐️ Отзывы
}

export interface NotificationData {
  type: string
  roomNumber: string
  guestName: string
  details: string
  date?: string
  time?: string
  amount?: number
  paymentMethod?: string
  userId?: string
}

function getThreadIdForType(type: string): number {
  switch (type) {
    case "breakfast":
    case "iron":
    case "supplies":
    case "wifi":
      return THREAD_IDS.RECEPTION
    case "taxi":
      return THREAD_IDS.TAXI
    case "wakeup":
      return THREAD_IDS.WAKEUP
    case "feedback":
      return THREAD_IDS.REVIEWS
    default:
      return THREAD_IDS.RECEPTION
  }
}

export async function sendToTelegram(orderData: NotificationData): Promise<boolean> {
  const typeLabels: Record<string, string> = {
    breakfast: "🥐 Завтрак",
    taxi: "🚕 Такси",
    restaurant: "🍽️ Ресторан",
    wakeup: "⏰ Будильник",
    iron: "👔 Утюг и гладильная доска",
    supplies: "🛒 Доп. услуги",
    wifi: "📶 Wi-Fi",
    feedback: "⭐ Обратная связь",
  }

  const typeLabel = typeLabels[orderData.type] || orderData.type
  const threadId = getThreadIdForType(orderData.type)

  let message = `🛎️ НОВАЯ ЗАЯВКА | ${typeLabel.split(' ')[1]}\n`
  message += `────────────────\n`
  message += `• 🏨 Комната: ${orderData.roomNumber}\n`
  message += `• 👤 Гость: ${orderData.userId ? `[${orderData.guestName}](tg://user?id=${orderData.userId})` : orderData.guestName}\n`
  message += `• 🗓️ Дата: ${orderData.date || new Date().toLocaleDateString('ru-RU')}\n`
  if (orderData.time) {
    message += `• 🕒 Время: ${orderData.time}\n`
  }
  message += `• 📍 Детали: ${orderData.details}\n`
  if (orderData.amount) {
    message += `• 💰 Сумма: ${orderData.amount} ₽\n`
  }
  if (orderData.paymentMethod) {
    message += `• 💳 Оплата: ${orderData.paymentMethod === "card" ? "Банковская карта" : "СБП"}\n`
  }
  message += `────────────────\n`
  message += `⏱️ ${new Date().toLocaleString("ru-RU")}`

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: RECEPTION_CHAT_ID,
        message_thread_id: threadId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    })

    const result = await response.json()
    return result.ok === true
  } catch (error) {
    console.error("Ошибка отправки в Telegram:", error)
    return false
  }
}

// Функция для отправки опроса гостю (если у него есть telegram_id)
export async function sendFeedbackRequest(
  guestTelegramId: string,
  guestName: string
): Promise<boolean> {
  const message = `Привет, ${guestName}!\nВы недавно останавливались в отеле VIDI.\nПожалуйста, оцените ваше пребывание по 10-балльной шкале.`

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: guestTelegramId,
        text: message,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "1", callback_data: "rate_1" },
              { text: "2", callback_data: "rate_2" },
              { text: "3", callback_data: "rate_3" },
              { text: "4", callback_data: "rate_4" },
              { text: "5", callback_data: "rate_5" },
            ],
            [
              { text: "6", callback_data: "rate_6" },
              { text: "7", callback_data: "rate_7" },
              { text: "8", callback_data: "rate_8" },
              { text: "9", callback_data: "rate_9" },
              { text: "10", callback_data: "rate_10" },
            ],
          ],
        },
      }),
    })

    return (await response.json()).ok === true
  } catch (error) {
    console.error("Ошибка отправки опроса:", error)
    return false
  }
}
