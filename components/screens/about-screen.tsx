"use client"

import { ArrowLeft, MapPin, Phone, Mail, Clock } from "lucide-react"
import { VidiLogo } from "@/components/ui/vidi-logo"

interface AboutScreenProps {
  onBack: () => void
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Об отеле</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="text-center">
          <VidiLogo className="w-32 h-auto mx-auto text-primary mb-2" />
          <p className="text-muted-foreground">Бутик-отель в центре Санкт-Петербурга</p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Адрес</h3>
                <a
                  href="https://yandex.ru/maps/org/vidi/110414477756/?ll=30.386341%2C59.929277&z=16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm mt-1 block hover:underline"
                >
                  Херсонский пр-д, 6 стр. 1
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Телефон</h3>
                <a href="tel:+78126795772" className="text-primary text-sm mt-1 block">
                  +7 (812) 679-57-72
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Email</h3>
                <a href="mailto:reception@vidi-hotel.ru" className="text-primary text-sm mt-1 block">
                  reception@vidi-hotel.ru
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Режим работы</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Ресепшен: круглосуточно
                  <br />
                  Завтрак: 07:00 – 11:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
