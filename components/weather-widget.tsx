"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Cloud } from "lucide-react"
import { getWeather, type WeatherData } from "@/lib/weather"

const weatherIcons: Record<string, React.ReactNode> = {
  cloudy: <Cloud className="w-6 h-6 text-primary" />,
  snow: <Cloud className="w-6 h-6 text-primary" />,
  clear: <Cloud className="w-6 h-6 text-primary" />,
  overcast: <Cloud className="w-6 h-6 text-primary" />,
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
      <div className="flex items-center gap-2 bg-card rounded-xl p-3 animate-pulse">
        <div className="w-6 h-6 bg-muted rounded-full" />
        <div className="space-y-1 flex-1">
          <div className="w-24 h-3 bg-muted rounded" />
          <div className="w-16 h-2 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="bg-card rounded-xl p-3 flex items-center gap-3">
      {weatherIcons[weather.icon]}
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">Санкт-Петербург</p>
        <p className="text-lg font-semibold text-foreground">
          {weather.temp > 0 ? "+" : ""}
          {weather.temp}°
        </p>
        <p className="text-xs text-muted-foreground">{weather.description}</p>
      </div>
    </div>
  )
}
