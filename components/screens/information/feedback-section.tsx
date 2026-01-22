"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendToTelegram, sendFeedbackRequest } from "@/lib/telegram-service"
import { useAppStore } from "@/lib/store"
import { Star, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
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
  const [showExternalLinks, setShowExternalLinks] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { guest } = useAppStore()

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
      setSubmitted(true)
      if (average >= 5.6) {
        setShowExternalLinks(true)
      }
    }
  }

  const hasCheckedOut = guest?.checkoutDate
    ? new Date(guest.checkoutDate) < new Date()
    : false

  /* ---------------- SUCCESS SCREEN ---------------- */

  if (submitted) {
    return (
      <motion.div {...fadeInUp(0.05)} className="space-y-6">
        <motion.div
          {...scaleIn}
          className="bg-card/60 border border-border/60 rounded-2xl p-6 shadow-sm backdrop-blur-sm text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto shadow-sm backdrop-blur-sm">
            <Star className="w-8 h-8 text-primary fill-current" />
          </div>

          <h3 className="text-lg font-semibold text-foreground">Спасибо за ваш отзыв!</h3>

          <p className="text-sm text-muted-foreground">
            {calculateAverage() >= 5.6
              ? "Мы рады, что вам понравилось! Оставьте отзыв на популярных платформах:"
              : "Ваше мнение поможет нам стать лучше!"}
          </p>
        </motion.div>

        {showExternalLinks && (
          <motion.div
            {...fadeInUp(0.1)}
            className="bg-card/60 border border-primary/20 rounded-2xl p-6 shadow-sm backdrop-blur-sm space-y-4"
          >
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Поделитесь отзывом на популярных платформах!
              </h3>
              <p className="text-sm text-muted-foreground">
                Ваш отзыв поможет другим гостям выбрать наш отель
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  name: "Яндекс.Карты",
                  link: "https://yandex.ru/maps/org/vidi/110414477756/reviews/?ll=30.386341%2C59.929277&z=16",
                },
                {
                  name: "2ГИС",
                  link: "https://2gis.ru/spb/firm/70000001103373570/30.386513%2C59.929473?m=30.387239%2C59.929522%2F18.51",
                },
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  {...fadeInUp(0.12 + index * 0.04)}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-between p-3 rounded-xl
                    bg-background/60 border border-border/60 shadow-sm backdrop-blur-sm
                    hover:bg-primary/10 transition-colors
                  "
                >
                  <span className="font-medium text-foreground">{item.name}</span>
                  <ExternalLink className="w-4 h-4 text-primary" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  /* ---------------- MAIN FORM ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div {...fadeInUp(0.05)} className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Ваше мнение важно для нас</h2>
        <p className="text-sm text-muted-foreground">
          Помогите нам стать лучше! Оцените ваш опыт проживания
        </p>
      </motion.div>

      {/* QUESTIONS */}
      <motion.div {...fadeInUp(0.1)} className="space-y-6">
        {QUESTIONS.map((question, index) => (
          <motion.div
            key={question.id}
            {...fadeInUp(0.12 + index * 0.04)}
            className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-3"
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

      {/* GENERAL COMMENT */}
      <motion.div
        {...fadeInUp(0.2)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-3"
      >
        <label className="text-sm font-medium text-foreground">Комментарий (необязательно)</label>
        <Textarea
          placeholder="Поделитесь подробностями о вашем опыте..."
          value={comments["general"] || ""}
          onChange={(e) =>
            setComments((prev) => ({ ...prev, ["general"]: e.target.value }))
          }
          className="bg-background/40 border-border/60 text-foreground min-h-[100px] resize-none rounded-xl"
        />
      </motion.div>

      {/* STAFF COMMENT */}
      <motion.div
        {...fadeInUp(0.25)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-3"
      >
        <label className="text-sm font-medium text-foreground">
          Кого из сотрудников вы хотели бы выделить? (необязательно)
        </label>
        <Textarea
          placeholder="Укажите имя сотрудника и чем он вам запомнился..."
          value={staffComment}
          onChange={(e) => setStaffComment(e.target.value)}
          className="bg-background/40 border-border/60 text-foreground min-h-[80px] resize-none rounded-xl"
        />
      </motion.div>

      {/* SUBMIT BUTTON */}
      <motion.button
        {...tap}
        onClick={handleSubmit}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold"
      >
        Отправить отзыв
      </motion.button>

      {/* TELEGRAM SURVEY */}
      {hasCheckedOut && (
        <motion.div
          {...fadeInUp(0.3)}
          className="bg-card/60 border border-primary/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-3"
        >
          <p className="text-sm text-foreground">
            Мы видим, что вы уже выехали из отеля. Пожалуйста, пройдите мини‑опрос:
          </p>

          <Button
            {...tap}
            variant="outline"
            className="w-full rounded-xl"
            onClick={async () => {
              if (guest?.telegramId && guest?.name) {
                const ok = await sendFeedbackRequest(guest.telegramId, guest.name)
                if (ok) {
                  alert("Опрос отправлен в Telegram! Проверьте ваши сообщения.")
                } else {
                  alert("Ошибка отправки опроса. Попробуйте позже.")
                }
              } else {
                alert("Пожалуйста, свяжите ваш Telegram в настройках")
              }
            }}
          >
            Пройти опрос в Telegram
          </Button>
        </motion.div>
      )}
    </div>
  )
}

/* Иконка для списка карточек в InformationScreen */
FeedbackSection.icon = Star
