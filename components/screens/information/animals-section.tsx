"use client"

import { Heart, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

export function AnimalsSection() {
  return (
    <div className="px-4 py-2 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Проживание с животными</h2>
        <p className="text-sm text-muted-foreground">Условия и правила размещения с питомцами</p>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground mb-2">💰 Стоимость</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">1 000 ₽ за сутки</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">При проживании в течение месяца — не выше 7 000 ₽</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">В номере может жить не более одного животного</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        <h3 className="font-semibold text-foreground">✅ Услуги для питомцев</h3>
        <div className="space-y-2">
          {[
            "Подстилка или пелёнка под миски",
            "Миски для еды и воды",
            "Удобная лежанка",
            "Гигиенические пакеты",
            "Одноразовые впитывающие пеленки",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        <h3 className="font-semibold text-foreground">🧼 Правила поведения и гигиены</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm text-foreground">
              Номера убираются только если питомца <strong>нет в помещении</strong>, либо он находится в{" "}
              <strong>переноске или в клетке</strong>, при присутствии владельца. Время уборки нужно согласовать с
              администрацией.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm text-foreground">
              Если питомец любит спать на кровати, диване или ковре — просьба использовать пелёнку или подстилку.
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        <h3 className="font-semibold text-foreground">🚷 Места и ограничения</h3>
        <div className="space-y-2">
          {[
            "Животное не может находиться в общественных помещениях (ресторан, кафе, фитнес-центр)",
            "При перемещении по коридорам, лифтам или лобби — животное должно быть на поводке или в сумке-переноске",
            "Купать питомца в ванной комнате номера нежелательно",
            "Выгул собак на территории отеля запрещён; в случае нарушения — штраф 10 000 ₽",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 border border-destructive/20">
        <h3 className="font-semibold text-foreground mb-2">⚠️ Ответственность</h3>
        <p className="text-sm text-foreground">
          Вы несёте ответственность за: повреждения имущества, загрязнения, шум или другие неудобства, которые может
          вызвать ваш питомец.
        </p>
      </div>
    </div>
  )
}
