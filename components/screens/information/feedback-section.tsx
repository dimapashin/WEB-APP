"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { sendToTelegram, sendFeedbackRequest } from "@/lib/telegram-service"
import { useAppStore } from "@/lib/store"
import { Star, ExternalLink } from "lucide-react"

const QUESTIONS = [
  { id: "hotel", text: "Как вам общее впечатление от отеля?" },
  { id: "cleanliness", text: "Оцените чистоту в номере" },
  { id: "service", text: "Оцените работу персонала" },
  { id: "comfort", text: "Удобство расположения и комфорт" },
  { id: "app", text: "Оцените это приложение (мы его тестируем)" },
]

export function FeedbackSection() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
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

    const details = QUESTIONS.map((q) => `${q.text}: ${ratings[q.id]}/10`).join("\n")

    const success = await sendToTelegram({
      type: "feedback",
      roomNumber: guest?.roomNumber || "Не указан",
      guestName: guest?.name || "Не указан",
      details: `Средняя оценка: ${average.toFixed(1)}/10\n\n${details}`,
      amount: average,
    })

    if (success) {
      setSubmitted(true)
      if (average >= 5.6) {
        setShowExternalLinks(true)
      }
    }
  }

  // Check if guest has checked out
  const hasCheckedOut = guest?.checkoutDate
    ? new Date(guest.checkoutDate) < new Date()
    : false

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Ваше мнение важно для нас</h2>
        <p className="text-sm text-muted-foreground">Помогите нам стать лучше! Оцените ваш опыт проживания</p>
      </div>

      {!submitted ? (
        <>
          <div className="space-y-6">
            {QUESTIONS.map((question) => (
              <div key={question.id} className="bg-card rounded-2xl p-4 space-y-3">
                <p className="font-medium text-foreground">{question.text}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(question.id, star)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        ratings[question.id] >= star
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted text-muted-foreground hover:bg-primary/20"
                      }`}
                    >
                      <Star className={`w-5 h-5 ${ratings[question.id] >= star ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {ratings[question.id] ? `${ratings[question.id]}/10` : "Не оценено"}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Средний балл:</span>
              <span className="text-2xl font-semibold text-primary">{calculateAverage().toFixed(1)}/10</span>
            </div>
            {calculateAverage() >= 5.6 && calculateAverage() > 0 && (
              <p className="text-sm text-primary mt-2">Спасибо за высокую оценку! 💫</p>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
            Отправить отзыв
          </Button>
        </>
      ) : (
        <div className="bg-card rounded-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 text-primary fill-current" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Спасибо за ваш отзыв!</h3>
          <p className="text-sm text-muted-foreground">
            {calculateAverage() >= 5.6
              ? "Мы рады, что вам понравилось! Оставьте отзыв на популярных платформах:"
              : "Ваше мнение поможет нам стать лучше!"}
          </p>
        </div>
      )}

      {showExternalLinks && (
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Оставьте отзыв на популярных платформах:</h3>
          <div className="space-y-2">
            <a
              href="https://yandex.ru/maps/org/vidi/110414477756/reviews/?ll=30.386341%2C59.929277&z=16"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-background rounded-xl hover:bg-primary/10 transition-colors"
            >
              <span className="font-medium text-foreground">Яндекс.Карты</span>
              <ExternalLink className="w-4 h-4 text-primary" />
            </a>
            <a
              href="https://2gis.ru/spb/firm/70000001103373570/30.386513%2C59.929473?m=30.387239%2C59.929522%2F18.51"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-background rounded-xl hover:bg-primary/10 transition-colors"
            >
              <span className="font-medium text-foreground">2ГИС</span>
              <ExternalLink className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
      )}

      {hasCheckedOut && !submitted && (
        <div className="bg-card rounded-2xl p-4 border border-primary/20">
          <p className="text-sm text-foreground mb-3">
            Мы видим, что вы уже выехали из отеля. Пожалуйста, пройдите мини-опрос:
          </p>
          <Button
            onClick={async () => {
              if (guest?.telegramId && guest?.name) {
                const success = await sendFeedbackRequest(guest.telegramId, guest.name)
                if (success) {
                  alert("✅ Опрос отправлен в Telegram! Проверьте ваши сообщения.")
                } else {
                  alert("❌ Ошибка отправки опроса. Попробуйте позже.")
                }
              } else {
                alert("Пожалуйста, свяжите ваш Telegram в настройках")
              }
            }}
            variant="outline"
            className="w-full"
          >
            Пройти опрос в Telegram
          </Button>
        </div>
      )}
    </div>
  )
}
