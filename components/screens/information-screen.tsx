"use client"

import { useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface InformationScreenProps {
  onBack: () => void
}

export function InformationScreen({ onBack }: InformationScreenProps) {
  const t = useT()

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-4 flex items-center gap-3" style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}>
        <Button
          onClick={onBack}
          variant="ghost"
          className="p-2 h-auto text-foreground hover:text-primary"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{t("information.title")}</h1>
      </div>

      <div className="px-4 pb-6 space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <p className="text-muted-foreground text-center leading-relaxed">
            {t("information.coming_soon")}
          </p>
        </div>
      </div>
    </div>
  )
}
