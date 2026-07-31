import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

type Theme = "light" | "dark"

const getTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem("base4-theme", theme)
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  }, [theme])

  const nextTheme = theme === "dark" ? "light" : "dark"

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Ativar modo ${nextTheme === "light" ? "claro" : "escuro"}`}
      title={`Ativar modo ${nextTheme === "light" ? "claro" : "escuro"}`}
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      <span>{theme === "dark" ? "Claro" : "Escuro"}</span>
    </button>
  )
}
