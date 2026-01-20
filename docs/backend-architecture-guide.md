# Руководство по архитектуре Backend, БД и личного кабинета

## Вариант А: Полноценный бэкенд

### Стек технологий
- **Backend**: Node.js с Express или NestJS
- **База данных**: PostgreSQL (рекомендуется) или MySQL
- **ORM**: Prisma, TypeORM или Sequelize
- **Аутентификация**: JWT токены
- **API**: RESTful API или GraphQL

### Схема базы данных

#### Таблица `users` (Пользователи)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE,
  name VARCHAR(255) NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  check_in_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_telegram_id (telegram_id),
  INDEX idx_room_number (room_number)
);
```

#### Таблица `orders` (Заказы)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'breakfast', 'wakeup', 'taxi', etc.
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  details TEXT,
  order_date DATE,
  order_time TIME,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_order_date (order_date)
);
```

#### Таблица `order_items` (Позиции заказа)
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id VARCHAR(255) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Таблица `sessions` (Сессии)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(512) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

#### Таблица `notifications` (Уведомления)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_read (read)
);
```

### API Endpoints

#### Аутентификация
```
POST /api/auth/login
Body: { name, roomNumber, checkInDate, checkoutDate }
Response: { token, user, expiresAt }

POST /api/auth/logout
Headers: { Authorization: Bearer <token> }

GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { user }
```

#### Заказы
```
GET /api/orders
Headers: { Authorization: Bearer <token> }
Response: { orders: [] }

POST /api/orders
Headers: { Authorization: Bearer <token> }
Body: { type, details, orderDate, orderTime, items: [] }
Response: { order }

GET /api/orders/:id
Headers: { Authorization: Bearer <token> }
Response: { order }

PATCH /api/orders/:id/status
Headers: { Authorization: Bearer <token> }
Body: { status }
Response: { order }
```

#### Профиль
```
GET /api/profile
Headers: { Authorization: Bearer <token> }
Response: { user, orders: [], notifications: [] }

PATCH /api/profile
Headers: { Authorization: Bearer <token> }
Body: { phone, email, telegramId }
Response: { user }
```

### Пример кода для аутентификации (Express + Prisma)

```typescript
// routes/auth.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

router.post('/login', async (req, res) => {
  const { name, roomNumber, checkInDate, checkoutDate } = req.body;

  // Валидация
  if (!name || !roomNumber || !checkInDate || !checkoutDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Проверка дат
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkout = new Date(checkoutDate);
  checkout.setHours(0, 0, 0, 0);

  if (checkout < today) {
    return res.status(400).json({ error: 'Checkout date has passed' });
  }

  // Поиск или создание пользователя
  let user = await prisma.user.findUnique({
    where: { room_number: roomNumber }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        room_number: roomNumber,
        check_in_date: new Date(checkInDate),
        checkout_date: new Date(checkoutDate),
      }
    });
  } else {
    // Обновление данных
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        check_in_date: new Date(checkInDate),
        checkout_date: new Date(checkoutDate),
      }
    });
  }

  // Создание сессии
  const token = jwt.sign(
    { userId: user.id, telegramId: user.telegram_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.create({
    data: {
      user_id: user.id,
      token,
      expires_at: expiresAt,
    }
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      roomNumber: user.room_number,
      checkInDate: user.check_in_date,
      checkoutDate: user.checkout_date,
    },
    expiresAt,
  });
});

export default router;
```

### Middleware для проверки токена

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Проверка сессии в БД
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Проверка даты выезда
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkoutDate = new Date(session.user.checkout_date);
    checkoutDate.setHours(0, 0, 0, 0);

    if (today > checkoutDate) {
      return res.status(403).json({ error: 'Session expired - checkout date passed' });
    }

    // Обновление last_used_at
    await prisma.session.update({
      where: { id: session.id },
      data: { last_used_at: new Date() }
    });

    req.user = session.user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
```

### Хранение токенов на фронтенде

**Рекомендуемый подход:**
1. **HttpOnly Cookies** (безопаснее для production)
   - Токен устанавливается сервером в cookie с флагом `httpOnly`
   - Недоступен из JavaScript, защита от XSS
   - Автоматически отправляется с каждым запросом

2. **localStorage** (проще для разработки)
   - Хранить токен в `localStorage.getItem('token')`
   - Отправлять в заголовке `Authorization: Bearer <token>`
   - Уязвим к XSS, но проще в реализации

### Логика автоматического входа по telegram_id

```typescript
// routes/auth.ts (дополнительный endpoint)
router.post('/telegram-auth', async (req, res) => {
  const { telegramId } = req.body;

  const user = await prisma.user.findUnique({
    where: { telegram_id: BigInt(telegramId) }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Проверка даты выезда
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkoutDate = new Date(user.checkout_date);
  checkoutDate.setHours(0, 0, 0, 0);

  if (today > checkoutDate) {
    return res.status(403).json({ error: 'Checkout date has passed' });
  }

  // Создание токена и сессии
  const token = jwt.sign(
    { userId: user.id, telegramId: user.telegram_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.create({
    data: {
      user_id: user.id,
      token,
      expires_at: expiresAt,
    }
  });

  res.json({ token, user, expiresAt });
});
```

---

## Вариант Б: Backend-as-a-Service (BaaS)

### Supabase

#### Настройка проекта
1. Создать проект на [supabase.com](https://supabase.com)
2. Перейти в раздел "SQL Editor"
3. Выполнить SQL миграции (аналогичные схемам выше)
4. Настроить Row Level Security (RLS) политики

#### Пример подключения на фронтенде

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Аутентификация
export async function login(name: string, roomNumber: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${roomNumber}@temp.hotel`,
    password: `temp_${roomNumber}`
  });
  // Или использовать кастомную аутентификацию через функции
}

// Получение заказов
export async function getOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return data;
}
```

#### RLS политики (пример)

```sql
-- Пользователи могут видеть только свои заказы
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Пользователи могут создавать заказы только для себя
CREATE POLICY "Users can insert own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);
```

### Firebase

#### Настройка
1. Создать проект в Firebase Console
2. Включить Authentication (Email/Password или Anonymous)
3. Создать Firestore Database
4. Настроить правила безопасности

#### Пример кода

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Аутентификация
export async function loginAnonymously(roomNumber: string) {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

// Создание заказа
export async function createOrder(orderData: any) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: new Date(),
    userId: auth.currentUser?.uid,
  });
  return docRef.id;
}
```

---

## Механизм личного кабинета

### Последовательность действий пользователя

1. **Авторизация**
   - Пользователь вводит имя и номер комнаты
   - Фронтенд отправляет `POST /api/auth/login`
   - Сервер проверяет/создает пользователя
   - Сервер создает сессию и возвращает токен
   - Фронтенд сохраняет токен

2. **Привязка Telegram ID (опционально)**
   - После успешной авторизации пользователь может связать Telegram
   - Фронтенд отправляет `PATCH /api/profile { telegramId }`
   - Сервер обновляет `users.telegram_id`

3. **Доступ к истории**
   - При загрузке приложения фронтенд проверяет наличие токена
   - Если токен есть, отправляется `GET /api/auth/me`
   - Сервер проверяет токен и возвращает данные пользователя
   - При заходе в раздел "Заказы" — `GET /api/orders`

4. **Автоматическая проверка даты выезда**
   - При каждом запросе middleware проверяет `checkout_date`
   - Если дата выезда прошла, возвращается 403
   - Фронтенд перенаправляет на экран авторизации

### Где хранить session token

**Рекомендация для production: HttpOnly Cookies**

```typescript
// Backend (Express)
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
});

// Frontend - автоматически отправляется с каждым запросом
fetch('/api/orders', {
  credentials: 'include' // Важно!
});
```

**Для разработки: localStorage**

```typescript
// Frontend
localStorage.setItem('token', token);

fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

## Рекомендации по выбору

**Выбирайте Вариант А (Полноценный бэкенд), если:**
- Нужен полный контроль над логикой
- Требуется сложная бизнес-логика
- Планируется масштабирование
- Есть команда backend-разработчиков

**Выбирайте Вариант Б (Supabase/Firebase), если:**
- Нужно быстро запустить проект
- Минимальная команда разработки
- Не требуется сложная логика
- Важна скорость разработки

---

## Дополнительные рекомендации

1. **Безопасность**
   - Всегда валидируйте входные данные на сервере
   - Используйте HTTPS в production
   - Регулярно ротируйте JWT секреты
   - Ограничивайте частоту запросов (rate limiting)

2. **Масштабирование**
   - Используйте кэширование (Redis) для сессий
   - Настройте мониторинг и логирование
   - Рассмотрите использование очередей (RabbitMQ, Bull) для уведомлений

3. **Тестирование**
   - Напишите unit-тесты для бизнес-логики
   - Интеграционные тесты для API
   - E2E тесты для критичных сценариев
