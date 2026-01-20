"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Cloud } from "lucide-react"
import { getWeather, type WeatherData } from "@/lib/weather"

const weatherIcons: Record<string, React.ReactNode> = {
  cloudy: <Cloud className="w-16 h-16 text-primary" />,
  snow: <Cloud className="w-16 h-16 text-primary" />,
  clear: <Cloud className="w-16 h-16 text-primary" />,
  overcast: <Cloud className="w-16 h-16 text-primary" />,
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWeather().then((data) => {
      setWeather(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-4 bg-card rounded-xl p-4 animate-pulse">
        <div className="space-y-2 flex-1">
          <div className="w-24 h-3 bg-muted rounded" />
          <div className="w-16 h-3 bg-muted rounded" />
          <div className="w-20 h-2 bg-muted rounded" />
        </div>
        <div className="w-16 h-16 bg-muted rounded-full flex-shrink-0" />
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="bg-card rounded-xl p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">Санкт-Петербург</p>
        <p className="text-2xl font-semibold text-foreground">
          {weather.temp > 0 ? "+" : ""}
          {weather.temp}°
        </p>
        <p className="text-sm text-muted-foreground">{weather.description}</p>
      </div>
      <div className="flex-shrink-0">{weatherIcons[weather.icon]}</div>
    </div>
  )
}
