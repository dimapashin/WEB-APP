# Руководство по разработке Telegram-бота для уведомлений

## Содержание
1. Создание бота через BotFather
2. Настройка Webhook/Polling
3. Логика уведомлений для администраторов
4. Логика уведомлений для гостя
5. Примеры кода

---

## 1. Создание бота через @BotFather

### Шаги:

1. Откройте Telegram и найдите `@BotFather`
2. Отправьте команду `/newbot`
3. Следуйте инструкциям:
   - Введите имя бота (например: "VIDI Hotel Concierge")
   - Введите username бота (должен заканчиваться на `bot`, например: `vidi_hotel_bot`)
4. BotFather вернет вам **токен бота** (например: `8594370320:AAH-...`)
5. Сохраните токен в переменные окружения: `TELEGRAM_BOT_TOKEN`

### Дополнительные настройки (опционально):

```
/setdescription - установить описание бота
/setabouttext - установить текст "О боте"
/setuserpic - установить фото профиля
/setcommands - установить список команд
```

Пример команд:
```
start - Начать работу с ботом
status - Проверить статус заказа
help - Помощь
```

---

## 2. Настройка Webhook / Polling

### Вариант А: Polling (проще для разработки)

**Принцип:** Бот постоянно запрашивает у Telegram API новые сообщения.

**Преимущества:**
- Проще настроить (не нужен публичный URL)
- Подходит для разработки и тестирования
- Не требует SSL сертификата

**Недостатки:**
- Менее эффективен при большом количестве ботов
- Должен работать постоянно

### Вариант Б: Webhook (рекомендуется для production)

**Принцип:** Telegram отправляет обновления на ваш сервер через HTTP POST.

**Преимущества:**
- Более эффективен
- Мгновенная доставка
- Масштабируемость

**Недостатки:**
- Требуется публичный HTTPS URL
- Сложнее настроить

---

## 3. Пример кода: Базовый бот на Node.js

### Установка зависимостей

```bash
npm install node-telegram-bot-api
# или
npm install telegraf  # более современная альтернатива
```

### Вариант 1: node-telegram-bot-api (Polling)

```typescript
// bot/telegramBot.ts
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  await bot.sendMessage(
    chatId,
    `👋 Добро пожаловать в VIDI Hotel!\n\n` +
    `Для начала работы, пожалуйста, введите номер вашей комнаты:`
  );

  // Сохраняем состояние - ждем номер комнаты
  // Можно использовать Map или БД для хранения состояний
  userStates.set(userId!, 'waiting_room');
});

// Обработка текстовых сообщений (номер комнаты)
bot.on('message', async (msg) => {
  const userId = msg.from?.id;
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  const state = userStates.get(userId!);

  if (state === 'waiting_room') {
    const roomNumber = text.trim();

    // Проверка формата номера комнаты
    if (!/^\d{3,4}$/.test(roomNumber)) {
      await bot.sendMessage(
        chatId,
        '❌ Неверный формат номера комнаты. Попробуйте еще раз:'
      );
      return;
    }

    // Сохранение связи telegram_id ↔ room_number
    await saveUserTelegramId(userId!, roomNumber);

    userStates.delete(userId!);

    await bot.sendMessage(
      chatId,
      `✅ Отлично! Номер комнаты ${roomNumber} привязан.\n\n` +
      `Теперь вы будете получать уведомления о ваших заказах.`
    );
  }
});

// Хранилище состояний (в production используйте Redis или БД)
const userStates = new Map<number, string>();
```

### Вариант 2: Telegraf (более современный)

```typescript
// bot/telegramBot.ts
import { Telegraf, Context } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Хранилище состояний
interface Session {
  state: 'waiting_room' | null;
  roomNumber?: string;
}

const sessions = new Map<number, Session>();

// Middleware для сессий
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (userId && !sessions.has(userId)) {
    sessions.set(userId, { state: null });
  }
  await next();
});

// Команда /start
bot.command('start', async (ctx: Context) => {
  const userId = ctx.from!.id;
  sessions.set(userId, { state: 'waiting_room' });

  await ctx.reply(
    `👋 Добро пожаловать в VIDI Hotel!\n\n` +
    `Для начала работы, пожалуйста, введите номер вашей комнаты:`
  );
});

// Обработка текста
bot.on('text', async (ctx: Context) => {
  const userId = ctx.from!.id;
  const session = sessions.get(userId);

  if (session?.state === 'waiting_room') {
    const roomNumber = ctx.message.text.trim();

    if (!/^\d{3,4}$/.test(roomNumber)) {
      await ctx.reply('❌ Неверный формат номера комнаты. Попробуйте еще раз:');
      return;
    }

    await saveUserTelegramId(userId, roomNumber);
    sessions.set(userId, { state: null, roomNumber });

    await ctx.reply(
      `✅ Отлично! Номер комнаты ${roomNumber} привязан.\n\n` +
      `Теперь вы будете получать уведомления о ваших заказах.`
    );
  }
});

// Запуск бота
bot.launch();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

---

## 4. Логика уведомлений для администраторов

### Отправка уведомлений в группу

```typescript
// services/telegramNotification.ts
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);
const ADMIN_GROUP_ID = process.env.TELEGRAM_ADMIN_GROUP_ID!; // ID группы админов

interface OrderData {
  id: string;
  type: 'breakfast' | 'wakeup' | 'taxi' | 'restaurant';
  guestName: string;
  roomNumber: string;
  date?: string;
  time?: string;
  details: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
}

const orderTypeEmoji: Record<string, string> = {
  breakfast: '🥐',
  wakeup: '⏰',
  taxi: '🚕',
  restaurant: '🍽️',
};

export async function notifyAdmins(order: OrderData): Promise<void> {
  const emoji = orderTypeEmoji[order.type] || '📋';
  
  let message = `🔔 <b>НОВЫЙ ЗАКАЗ #${order.id}</b>\n\n`;
  message += `${emoji} <b>Тип:</b> ${getOrderTypeName(order.type)}\n`;
  message += `👤 <b>Гость:</b> ${order.guestName}\n`;
  message += `🏨 <b>Номер:</b> ${order.roomNumber}\n`;
  
  if (order.date) {
    message += `📅 <b>Дата:</b> ${order.date}\n`;
  }
  
  if (order.time) {
    message += `🕐 <b>Время:</b> ${order.time}\n`;
  }
  
  message += `\n📝 <b>Детали:</b> ${order.details}\n`;
  
  if (order.items && order.items.length > 0) {
    message += `\n<b>Состав заказа:</b>\n`;
    order.items.forEach(item => {
      message += `• ${item.name} x${item.quantity} - ${item.price * item.quantity} ₽\n`;
    });
  }
  
  message += `\n⏱ <i>Время получения:</i> ${new Date().toLocaleString('ru-RU')}`;

  try {
    await bot.sendMessage(ADMIN_GROUP_ID, message, {
      parse_mode: 'HTML',
      disable_notification: false,
    });
    
    console.log(`[Telegram] Notification sent to admin group for order ${order.id}`);
  } catch (error) {
    console.error(`[Telegram] Failed to send notification:`, error);
    throw error;
  }
}

function getOrderTypeName(type: string): string {
  const names: Record<string, string> = {
    breakfast: 'Завтрак',
    wakeup: 'Будильник',
    taxi: 'Такси',
    restaurant: 'Ресторан',
  };
  return names[type] || type;
}
```

### Интеграция с backend (пример)

```typescript
// routes/orders.ts (Express)
import { notifyAdmins } from '../services/telegramNotification';

router.post('/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { type, details, orderDate, orderTime, items } = req.body;

  // Создание заказа в БД
  const order = await prisma.order.create({
    data: {
      user_id: userId,
      type,
      details,
      order_date: orderDate ? new Date(orderDate) : null,
      order_time: orderTime || null,
      status: 'pending',
      items: items ? {
        create: items.map((item: any) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        }))
      } : undefined,
    },
    include: {
      user: true,
      items: true,
    }
  });

  // Отправка уведомления админам
  try {
    await notifyAdmins({
      id: order.id,
      type: order.type as any,
      guestName: order.user.name,
      roomNumber: order.user.room_number,
      date: order.order_date?.toISOString().split('T')[0],
      time: order.order_time,
      details: order.details,
      items: order.items.map(item => ({
        name: item.item_name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    });
  } catch (error) {
    console.error('Failed to notify admins:', error);
    // Не прерываем создание заказа, только логируем
  }

  res.json({ order });
});
```

---

## 5. Логика уведомлений для гостя

### Отправка уведомлений гостю

```typescript
// services/telegramNotification.ts (дополнение)

export async function notifyGuest(
  telegramId: number,
  message: string,
  options?: { parse_mode?: 'HTML' | 'Markdown' }
): Promise<void> {
  try {
    await bot.sendMessage(telegramId, message, {
      parse_mode: options?.parse_mode || 'HTML',
      disable_notification: false,
    });
    
    console.log(`[Telegram] Notification sent to guest ${telegramId}`);
  } catch (error: any) {
    // Если пользователь заблокировал бота, ошибка не критична
    if (error.response?.body?.error_code === 403) {
      console.warn(`[Telegram] Guest ${telegramId} blocked the bot`);
      return;
    }
    console.error(`[Telegram] Failed to send notification to guest:`, error);
    throw error;
  }
}

export async function notifyGuestOrderConfirmation(
  telegramId: number,
  order: OrderData
): Promise<void> {
  const emoji = orderTypeEmoji[order.type] || '📋';
  
  let message = `✅ <b>Ваш заказ подтвержден!</b>\n\n`;
  message += `${emoji} <b>${getOrderTypeName(order.type)}</b>\n`;
  message += `🏨 Номер комнаты: ${order.roomNumber}\n`;
  
  if (order.date) {
    message += `📅 Дата: ${order.date}\n`;
  }
  
  if (order.time) {
    message += `🕐 Время: ${order.time}\n`;
  }
  
  message += `\n📝 ${order.details}\n`;
  message += `\n🔔 Мы уведомим вас, когда заказ будет выполнен.`;

  await notifyGuest(telegramId, message);
}

export async function notifyGuestOrderStatus(
  telegramId: number,
  orderId: string,
  status: 'confirmed' | 'completed' | 'cancelled'
): Promise<void> {
  const statusMessages = {
    confirmed: '✅ Ваш заказ подтвержден и принят в работу.',
    completed: '🎉 Ваш заказ выполнен! Спасибо за использование наших услуг.',
    cancelled: '❌ Ваш заказ отменен. Если у вас есть вопросы, свяжитесь с ресепшеном.',
  };

  const message = `<b>Обновление статуса заказа #${orderId}</b>\n\n${statusMessages[status]}`;

  await notifyGuest(telegramId, message);
}
```

### Интеграция: отправка уведомления гостю при создании заказа

```typescript
// routes/orders.ts (дополнение)
import { notifyAdmins, notifyGuestOrderConfirmation } from '../services/telegramNotification';

router.post('/orders', authenticateToken, async (req, res) => {
  // ... создание заказа ...

  // Отправка уведомления админам
  await notifyAdmins({ ... });

  // Отправка уведомления гостю, если у него есть telegram_id
  if (order.user.telegram_id) {
    try {
      await notifyGuestOrderConfirmation(
        Number(order.user.telegram_id),
        {
          id: order.id,
          type: order.type as any,
          guestName: order.user.name,
          roomNumber: order.user.room_number,
          date: order.order_date?.toISOString().split('T')[0],
          time: order.order_time,
          details: order.details,
          items: order.items.map(item => ({
            name: item.item_name,
            quantity: item.quantity,
            price: Number(item.price),
          })),
        }
      );
    } catch (error) {
      console.error('Failed to notify guest:', error);
      // Не критичная ошибка
    }
  }

  res.json({ order });
});
```

### Пример: Команда для проверки статуса заказа

```typescript
// bot/telegramBot.ts (дополнение)

bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  // Получаем номер комнаты пользователя из БД
  const user = await getUserByTelegramId(userId!);

  if (!user) {
    await bot.sendMessage(
      chatId,
      '❌ Вы не привязали номер комнаты. Используйте /start для начала.'
    );
    return;
  }

  // Получаем последние заказы
  const orders = await getRecentOrders(user.id, 5);

  if (orders.length === 0) {
    await bot.sendMessage(chatId, '📭 У вас пока нет заказов.');
    return;
  }

  let message = `📋 <b>Ваши последние заказы:</b>\n\n`;

  orders.forEach((order, index) => {
    const statusEmoji = {
      pending: '⏳',
      confirmed: '✅',
      completed: '🎉',
      cancelled: '❌',
    }[order.status];

    message += `${statusEmoji} <b>Заказ #${order.id.substring(0, 8)}</b>\n`;
    message += `   ${getOrderTypeName(order.type)}\n`;
    message += `   Статус: ${getOrderStatusName(order.status)}\n`;
    if (order.order_date) {
      message += `   Дата: ${order.order_date.toISOString().split('T')[0]}\n`;
    }
    message += `\n`;
  });

  await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
});
```

---

## 6. Настройка Webhook (для production)

### Пример настройки Webhook

```typescript
// server.ts
import express from 'express';
import { Telegraf } from 'telegraf';

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Middleware для парсинга JSON
app.use(express.json());

// Webhook endpoint
app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// Настройка webhook (выполняется один раз)
bot.telegram.setWebhook(
  `https://yourdomain.com/webhook/${process.env.TELEGRAM_BOT_TOKEN}`
);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Настройка через Bot API напрямую

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourdomain.com/webhook/YOUR_BOT_TOKEN"
  }'
```

---

## 7. Дополнительные рекомендации

### Обработка ошибок

```typescript
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.catch((err, ctx) => {
  console.error('Error in bot:', err);
  ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
});
```

### Логирование

Используйте библиотеку типа `winston` или `pino` для структурированного логирования:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

bot.on('message', (msg) => {
  logger.info('Received message', { userId: msg.from?.id, text: msg.text });
});
```

### Безопасность

1. **Храните токен в переменных окружения** - никогда не коммитьте в код
2. **Валидируйте входящие данные** - проверяйте формат номеров комнат
3. **Ограничьте доступ к боту** - используйте whitelist пользователей (опционально)
4. **Rate limiting** - ограничьте частоту сообщений от одного пользователя

---

## 8. Структура проекта (рекомендация)

```
project/
├── bot/
│   ├── telegramBot.ts       # Основной файл бота
│   ├── commands.ts          # Обработчики команд
│   └── handlers.ts          # Обработчики сообщений
├── services/
│   └── telegramNotification.ts  # Сервис уведомлений
├── models/
│   └── user.ts              # Модели данных
├── .env                     # Переменные окружения
└── package.json
```

---

## 9. Переменные окружения

```env
# .env
TELEGRAM_BOT_TOKEN=8594370320:AAH-...
TELEGRAM_ADMIN_GROUP_ID=-1001234567890
DATABASE_URL=postgresql://...
```

---

## Итоговый результат

После выполнения всех шагов вы получите:

✅ Рабочего Telegram-бота с командами  
✅ Систему уведомлений для администраторов  
✅ Систему уведомлений для гостей  
✅ Привязку telegram_id к номеру комнаты  
✅ Проверку статуса заказов через бота  
✅ Масштабируемую архитектуру для расширения функционала  
