import { useEffect, useState } from "react"

export default function LoadingExperience() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false
    return !sessionStorage.getItem("base4-intro-seen")
  })
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!visible) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      sessionStorage.setItem("base4-intro-seen", "1")
      setVisible(false)
      return
    }
    const phaseTimers = [350, 850, 1350].map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay),
    )
    const finish = window.setTimeout(() => {
      sessionStorage.setItem("base4-intro-seen", "1")
      setVisible(false)
    }, 2100)
    return () => {
      phaseTimers.forEach(window.clearTimeout)
      window.clearTimeout(finish)
    }
  }, [visible])

  if (!visible) return null

  const skip = () => {
    sessionStorage.setItem("base4-intro-seen", "1")
    setVisible(false)
  }

  return (
    <div className="boot-screen" role="dialog" aria-label="Inicialização da interface BASE4">
      <button type="button" className="boot-skip" onClick={skip}>Pular</button>
      <div className="boot-frame">
        <div className="boot-code">SYS.BASE4 / 18.2026 / BILAC.SP</div>
        <div className={`boot-logo ${phase >= 1 ? "is-ready" : ""}`}>BASE4</div>
        <div className="boot-line"><span /></div>
        <div className="boot-log" aria-live="polite">
          <span className={phase >= 1 ? "active" : ""}>Inicializando interface</span>
          <span className={phase >= 2 ? "active" : ""}>Conectando serviços</span>
          <span className={phase >= 3 ? "active success" : ""}>Sistema disponível</span>
        </div>
      </div>
    </div>
  )
}
