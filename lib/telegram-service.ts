const BOT_TOKEN = "8594370320:AAG-BYVZXyzxn_U3Ie5Jv6w_H7JltfFTYEk"
const RECEPTION_CHAT_ID = "-1003540162741"

// ID тем (forum topics) в рабочей группе
const THREAD_RECEPTION = 454   // 🛎 Заявки (УТЮГ, Wi-Fi, Завтраки)
const THREAD_TAXI = 452        // 🚕 Такси
const THREAD_WAKEUP = 450      // ⏰ Будильники
const THREAD_REVIEWS = 447     // ⭐️ Отзывы

export interface NotificationData {
  type: string
  roomNumber: string
  guestName: string
  details: string
  date?: string
  time?: string
  amount?: number
  paymentMethod?: string
  telegramId?: string
  messageThreadId?: number
  replyToMessageId?: number
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

  // Определяем тему для разных типов заявок
  let messageThreadId: number | undefined
  if (orderData.type === "taxi") {
    messageThreadId = THREAD_TAXI
  } else if (orderData.type === "wakeup") {
    messageThreadId = THREAD_WAKEUP
  } else if (orderData.type === "feedback") {
    messageThreadId = THREAD_REVIEWS
  } else {
    messageThreadId = THREAD_RECEPTION
  }

  // Если указан messageThreadId в данных, используем его (для ответов)
  if (orderData.messageThreadId !== undefined) {
    messageThreadId = orderData.messageThreadId
  }

  // Формируем кликабельное имя гостя (если есть telegramId)
  const guestNameLink = orderData.telegramId 
    ? `[${orderData.guestName}](tg://user?id=${orderData.telegramId})`
    : orderData.guestName

  // Компактный формат сообщения
  let message = `${typeLabel}\n`
  message += `━━━━━━━━━━━━━━\n`
  message += `👤 Гость: ${guestNameLink}\n`
  message += `🏠 Номер: ${orderData.roomNumber}\n`
  message += `📝 ${orderData.details}\n`
  
  if (orderData.date) message += `📅 ${orderData.date}`
  if (orderData.time) message += orderData.date ? ` в ${orderData.time}\n` : `⏰ ${orderData.time}\n`
  if (orderData.amount) message += `💰 ${orderData.amount} ₽\n`
  if (orderData.paymentMethod) {
    message += `💳 ${orderData.paymentMethod === "card" ? "Банковская карта" : "СБП"}\n`
  }
  message += `\n🕐 ${new Date().toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`

  try {
    const payload: any = {
      chat_id: RECEPTION_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }

    // Добавляем тему, если указана
    if (messageThreadId !== undefined) {
      payload.message_thread_id = messageThreadId
    }

    // Если это ответ на сообщение (для отмены будильника)
    if (orderData.replyToMessageId !== undefined) {
      payload.reply_to_message_id = orderData.replyToMessageId
    }

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
