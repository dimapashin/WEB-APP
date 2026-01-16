export interface WeatherData {
  temp: number
  description: string
  icon: string
  city: string
}

export async function getWeather(): Promise<WeatherData> {
  try {
    // Using weather API with fallback to mock data
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=59.9311&longitude=30.3609&current=temperature_2m,weather_code&timezone=Europe/Moscow",
    )

    if (!response.ok) throw new Error("Failed to fetch weather")

    const data = await response.json()
    const temp = Math.round(data.current.temperature_2m)
    const weatherCode = data.current.weather_code

    // Map WMO weather codes to descriptions and icons
    const getWeatherDescription = (code: number) => {
      if (code === 0 || code === 1) return { description: "Ясно", icon: "clear" }
      if (code === 2 || code === 3) return { description: "Облачно", icon: "cloudy" }
      if (code === 45 || code === 48) return { description: "Туман", icon: "cloudy" }
      if (code >= 51 && code <= 67) return { description: "Дождь", icon: "cloudy" }
      if ((code >= 71 && code <= 77) || code === 80 || code === 81 || code === 82)
        return { description: "Снег", icon: "snow" }
      if (code >= 80 && code <= 82) return { description: "Ливень", icon: "cloudy" }
      return { description: "Пасмурно", icon: "overcast" }
    }

    const weather = getWeatherDescription(weatherCode)

    return {
      temp,
      description: weather.description,
      icon: weather.icon,
      city: "Санкт-Петербург",
    }
  } catch (error) {
    console.warn("Failed to fetch real weather, using mock data", error)
    return {
      temp: -2,
      description: "Облачно",
      icon: "cloudy",
      city: "Санкт-Петербург",
    }
  }
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "Доброе утро"
  if (hour >= 12 && hour < 17) return "Добрый день"
  if (hour >= 17 && hour < 22) return "Добрый вечер"
  return "Доброй ночи"
}
