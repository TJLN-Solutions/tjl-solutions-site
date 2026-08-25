import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  /**
   * Altura rolável guardada em ref.
   *
   * Lê-la no evento de rolagem custava um reflow forçado por evento: pedir
   * `scrollHeight` obriga o navegador a recalcular o layout de uma página de
   * ~24.000px antes de responder. Ela só muda em resize, então é medida ali.
   */
  const rolavel = useRef(0)

  useEffect(() => {
    let frame = 0

    const medirAltura = () => {
      rolavel.current = document.documentElement.scrollHeight - window.innerHeight
    }

    const aplicar = () => {
      const total = rolavel.current
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0)
      setVisible(window.scrollY > window.innerHeight * 0.65)
    }

    // Rolagem dispara muito mais que um quadro: agrupa num rAF para calcular
    // uma vez por quadro em vez de uma vez por evento.
    const aoRolar = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(aplicar)
    }

    const aoRedimensionar = () => {
      medirAltura()
      aoRolar()
    }

    medirAltura()
    aplicar()
    window.addEventListener("scroll", aoRolar, { passive: true })
    window.addEventListener("resize", aoRedimensionar)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", aoRolar)
      window.removeEventListener("resize", aoRedimensionar)
    }
  }, [])

  return (
    <>
      <div
        className="scroll-progress fixed left-0 right-0 top-0 z-[70] h-0.5"
        aria-hidden="true"
      >
        <div
          className="scroll-progress-bar h-full origin-left transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`scroll-top fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
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
