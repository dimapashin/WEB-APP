"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendToTelegram, sendFeedbackRequest } from "@/lib/telegram-service"
import { useAppStore } from "@/lib/store"
import { Star, ExternalLink, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, tap, scaleIn } from "@/lib/animations"

const QUESTIONS = [
  { id: "hotel", text: "Как вам общее впечатление от отеля?" },
  { id: "cleanliness", text: "Оцените чистоту в номере" },
  { id: "service", text: "Оцените работу персонала" },
  { id: "comfort", text: "Удобство расположения и комфорт" },
  { id: "app", text: "Оцените это приложение (мы его тестируем)" },
]

export function FeedbackSection() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [staffComment, setStaffComment] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false)
  const { guest } = useAppStore()

  // сохраняем факт отправки в localStorage по ключу проживания
  const stayKey = guest?.roomNumber ? `feedback_${guest.roomNumber}` : "feedback_default"

  useEffect(() => {
    const saved = localStorage.getItem(stayKey)
    if (saved === "true") setHasSubmittedBefore(true)
  }, [stayKey])

  const handleRatingChange = (questionId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateAverage = () => {
    const values = Object.values(ratings)
    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  const handleSubmit = async () => {
    const average = calculateAverage()
    const allRated = QUESTIONS.every((q) => ratings[q.id])

    if (!allRated) {
      alert("Пожалуйста, ответьте на все вопросы")
      return
    }

    let details = QUESTIONS.map((q) => `${q.text}: ${ratings[q.id]}/10`).join("\n")

    if (comments["general"]) {
      details += `\n\nКомментарий: ${comments["general"]}`
    }

    if (staffComment) {
      details += `\n\nВыделенный сотрудник: ${staffComment}`
    }

    const success = await sendToTelegram({
      type: "feedback",
      roomNumber: guest?.roomNumber || "Не указан",
      guestName: guest?.name || "Не указан",
      details: `Средняя оценка: ${average.toFixed(1)}/10\n\n${details}`,
      amount: average,
      telegramId: guest?.telegramId,
    })

    if (success) {
      localStorage.setItem(stayKey, "true")
      setHasSubmittedBefore(true)

      if (average >= 5.6) {
        setShowModal(true)
      } else {
        alert("Спасибо за ваш отзыв! Мы обязательно учтём ваше мнение.")
      }
    }
  }

  /* ---------------------- ЭКРАН-НАПОМИНАНИЕ ---------------------- */

  if (hasSubmittedBefore) {
    return (
      <motion.div {...fadeInUp(0.05)} className="space-y-6">
        <motion.div
          {...scaleIn}
          className="bg-card rounded-2xl p-6 shadow-sm space-y-4 text-center"
        >
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 text-primary fill-current" />
          </div>

          <h3 className="text-lg font-semibold text-foreground">
            Спасибо, что поделились мнением!
          </h3>

          <p className="text-sm text-muted-foreground">
            Если у вас есть минутка, вы можете оставить отзыв на популярных платформах — это помогает другим гостям.
          </p>

          <div className="space-y-2">
            <motion.a
              {...tap}
              href="https://yandex.ru/maps/org/vidi/110414477756/reviews/?ll=30.386341%2C59.929277&z=16"
              target="_blank"
              className="flex items-center justify-between p-3 rounded-xl bg-background border border-border shadow-sm hover:bg-primary/10 transition-colors"
            >
              <span className="font-medium text-foreground">Яндекс.Карты</span>
              <ExternalLink className="w-4 h-4 text-primary" />
            </motion.a>

            <motion.a
              {...tap}
              href="https://2gis.ru/spb/firm/70000001103373570/30.386513%2C59.929473?m=30.387239%2C59.929522%2F18.51"
              target="_blank"
              className="flex items-center justify-between p-3 rounded-xl bg-background border border-border shadow-sm hover:bg-primary/10 transition-colors"
            >
              <span className="font-medium text-foreground">2ГИС</span>
              <ExternalLink className="w-4 h-4 text-primary" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  /* ---------------------- ОСНОВНАЯ ФОРМА ---------------------- */

  return (
    <>
      <div className="space-y-6">
        <motion.div {...fadeInUp(0.05)} className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Ваше мнение важно для нас</h2>
          <p className="text-sm text-muted-foreground">
            Помогите нам стать лучше! Оцените ваш опыт проживания
          </p>
        </motion.div>

        <motion.div {...fadeInUp(0.1)} className="space-y-6">
          {QUESTIONS.map((question, index) => (
            <motion.div
              key={question.id}
              {...fadeInUp(0.12 + index * 0.04)}
              className="bg-card rounded-2xl p-4 shadow-sm space-y-3"
            >
              <p className="font-medium text-foreground">{question.text}</p>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {[1,2,3,4,5,6,7,8,9,10].map((star) => {
                  const active = ratings[question.id] >= star
                  return (
                    <motion.button
                      key={star}
                      {...tap}
                      whileHover={{ scale: 1.08 }}
                      onClick={() => handleRatingChange(question.id, star)}
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        transition-all
                        ${active
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted text-muted-foreground hover:bg-primary/20"
                        }
                      `}
                    >
                      <Star className={`w-3.5 h-3.5 ${active ? "fill-current" : ""}`} />
                    </motion.button>
                  )
                })}
              </div>

              <div className="text-sm text-muted-foreground">
                {ratings[question.id] ? `${ratings[question.id]}/10` : "Не оценено"}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeInUp(0.2)} className="bg-card rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-sm font-medium text-foreground">Комментарий (необязательно)</label>
          <Textarea
            placeholder="Поделитесь подробностями о вашем опыте..."
            value={comments["general"] || ""}
            onChange={(e) =>
              setComments((prev) => ({ ...prev, ["general"]: e.target.value }))
            }
            className="bg-background border-border text-foreground min-h-[100px] resize-none rounded-xl"
          />
        </motion.div>

        <motion.div {...fadeInUp(0.25)} className="bg-card rounded-2xl p-4 shadow-sm space-y-3">
          <label className="text-sm font-medium text-foreground">
            Кого из сотрудников вы хотели бы выделить? (необязательно)
          </label>
          <Textarea
            placeholder="Укажите имя сотрудника и чем он вам запомнился..."
            value={staffComment}
            onChange={(e) => setStaffComment(e.target.value)}
            className="bg-background border-border text-foreground min-h-[80px] resize-none rounded-xl"
          />
        </motion.div>

        <motion.button
          {...tap}
          onClick={handleSubmit}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold"
        >
          Отправить отзыв
        </motion.button>
      </div>

      {/* ---------------------- МОДАЛКА ---------------------- */}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              {...scaleIn}
              className="bg-card rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-border/40 w-full max-w-sm space-y-5"
            >
              <div className="flex justify-end">
                <button onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-primary fill-current" />
              </div>

              <h3 className="text-lg font-semibold text-center text-foreground">
                Спасибо за ваш отзыв!
              </h3>

              <p className="text-sm text-muted-foreground text-center">
                Хотите поделиться им на Яндекс.Картах или 2ГИС? Это помогает другим гостям.
              </p>

              <div className="space-y-3">
                <motion.a
                  {...tap}
                  href="https://yandex.ru/maps/org/vidi/110414477756/reviews/?ll=30.386341%2C59.929277&z=16"
                  target="_blank"
                  className="w-full h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2 font-medium"
                >
                  Оставить отзыв на Яндекс.Картах
                  <ExternalLink className="w-4 h-4" />
                </motion.a>

                <motion.a
                  {...tap}
                  href="https://2gis.ru/spb/firm/70000001103373570/30.386513%2C59.929473?m=30.387239%2C59.929522%2F18.51"
                  target="_blank"
                  className="w-full h-12 bg-background border border-border rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-primary/10 transition-colors"
                >
                  Оставить отзыв в 2ГИС
                  <ExternalLink className="w-4 h-4 text-primary" />
                </motion.a>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full text-sm text-muted-foreground mt-1"
                >
                  Не сейчас
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

FeedbackSection.icon = Star
