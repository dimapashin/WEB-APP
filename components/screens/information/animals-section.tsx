"use client"

import { Heart, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp } from "@/lib/animations"

export function AnimalsSection() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div {...fadeInUp(0.05)} className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Проживание с животными</h2>
        <p className="text-sm text-muted-foreground">
          Условия и правила размещения с питомцами
        </p>
      </motion.div>

      {/* COST */}
      <motion.div
        {...fadeInUp(0.1)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-4"
      >
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">💰 Стоимость</h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-foreground">1 000 ₽ за сутки</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-foreground">
                При проживании в течение месяца — не выше 7 000 ₽
              </span>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">
                В номере может жить не более одного животного
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PET SERVICES */}
      <motion.div
        {...fadeInUp(0.15)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-4"
      >
        <h3 className="font-semibold text-foreground">✅ Услуги для питомцев</h3>

        <div className="space-y-2">
          {[
            "Подстилка или пелёнка под миски",
            "Миски для еды и воды",
            "Удобная лежанка",
            "Гигиенические пакеты",
            "Одноразовые впитывающие пеленки",
          ].map((item, index) => (
            <motion.div
              key={index}
              {...fadeInUp(0.17 + index * 0.03)}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-foreground">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RULES */}
      <motion.div
        {...fadeInUp(0.2)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-4"
      >
        <h3 className="font-semibold text-foreground">🧼 Правила поведения и гигиены</h3>

        <div className="space-y-3">
          {[
            `Номера убираются только если питомца нет в помещении, либо он находится в переноске или в клетке при присутствии владельца. Время уборки нужно согласовать с администрацией.`,
            `Если питомец любит спать на кровати, диване или ковре — просьба использовать пелёнку или подстилку.`,
          ].map((text, index) => (
            <motion.div
              key={index}
              {...fadeInUp(0.22 + index * 0.03)}
              className="flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RESTRICTIONS */}
      <motion.div
        {...fadeInUp(0.25)}
        className="bg-card/60 border border-border/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-4"
      >
        <h3 className="font-semibold text-foreground">🚷 Места и ограничения</h3>

        <div className="space-y-2">
          {[
            "Животное не может находиться в общественных помещениях (ресторан, кафе, фитнес-центр)",
            "При перемещении по коридорам, лифтам или лобби — животное должно быть на поводке или в сумке‑переноске",
            "Купать питомца в ванной комнате номера нежелательно",
            "Выгул собак на территории отеля запрещён; в случае нарушения — штраф 10 000 ₽",
          ].map((item, index) => (
            <motion.div
              key={index}
              {...fadeInUp(0.27 + index * 0.03)}
              className="flex items-start gap-2"
            >
              <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RESPONSIBILITY */}
      <motion.div
        {...fadeInUp(0.3)}
        className="bg-card/60 border border-destructive/20 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-3"
      >
        <h3 className="font-semibold text-foreground">⚠️ Ответственность</h3>

        <p className="text-sm text-foreground">
          Вы несёте ответственность за: повреждения имущества, загрязнения, шум или другие неудобства, которые может вызвать ваш питомец.
        </p>
      </motion.div>
    </div>
  )
}

/* Иконка для списка карточек в InformationScreen */
AnimalsSection.icon = Heart
