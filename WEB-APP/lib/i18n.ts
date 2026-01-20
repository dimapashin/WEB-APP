import { create } from "zustand"
import { persist } from "zustand/middleware"
import ru from "./i18n/ru.json"
import en from "./i18n/en.json"

export type Language = "ru" | "en"

interface I18nState {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, defaultValue?: string) => string
}

const translations: Record<Language, any> = {
  ru,
  en,
}

const getNestedValue = (obj: any, path: string): string => {
  return path.split(".").reduce((current, part) => current?.[part], obj) ?? path
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      language: (typeof navigator !== "undefined" && navigator.language.startsWith("en")) ? "en" : "ru",
      setLanguage: (language) => set({ language }),
      t: (key, defaultValue) => {
        const language = get().language
        const value = getNestedValue(translations[language], key)
        return value || defaultValue || key
      },
    }),
    {
      name: "vidi-language",
    },
  ),
)

// Helper function for use in components
export const useT = () => {
  return useI18n((state) => state.t)
}

export const useLanguage = () => {
  const language = useI18n((state) => state.language)
  const setLanguage = useI18n((state) => state.setLanguage)
  return { language, setLanguage }
}
