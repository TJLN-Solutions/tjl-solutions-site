import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
      setProgress(Math.min(100, Math.max(0, nextProgress)))
      setVisible(window.scrollY > window.innerHeight * 0.65)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <>
      <div
        className="fixed left-0 right-0 top-0 z-[70] h-0.5 bg-blue-950/30"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-blue-700 via-sky-400 to-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.85)] transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/40 bg-navy-900/90 text-sky-200 shadow-[0_0_24px_rgba(14,165,233,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-label="Voltar ao início"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
      >
        <ArrowUp size={19} />
      </button>
    </>
  )
}
