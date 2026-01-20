// src/lib/animations.ts

// Единый переход экрана (вход снизу, выход вниз)
export const screenTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.32,
    ease: [0.4, 0, 0.2, 1], // iOS-like ease
  },
}

// Плавное появление элементов списка (карточки, кнопки)
export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.28,
    delay,
    ease: [0.4, 0, 0.2, 1],
  },
})

// Простое появление без движения
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.25,
    ease: "easeOut",
  },
}

// Лёгкое масштабирование (для логотипа, модалок)
export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: {
    duration: 0.28,
    ease: [0.4, 0, 0.2, 1],
  },
}

// Микроанимация для кнопок
export const tap = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.12 },
}
