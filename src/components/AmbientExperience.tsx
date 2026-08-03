import { useEffect, useRef } from "react"

/**
 * Fundo animado da marca, na paleta da logo do BASE4 Charge.
 *
 * Peças: grade em perspectiva ao fundo, duas orbes azuis derivando devagar,
 * dois feixes amarelos atravessando na diagonal e um brilho que acompanha o
 * cursor. O amarelo aparece só nos feixes — é o traço da logo em movimento,
 * não cor de área.
 *
 * Em máquina modesta, com dados economizados ou movimento reduzido, o CSS
 * desliga os feixes, a segunda orbe e o brilho do cursor a partir da classe
 * `performance-lite`.
 */
export default function AmbientExperience() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const device = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }
    const lite =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      device.connection?.saveData === true ||
      (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
      (device.deviceMemory !== undefined && device.deviceMemory <= 4)
    document.documentElement.classList.toggle("performance-lite", lite)

    // Sem mouse não há brilho a seguir, e em perfil leve ele nem existe.
    if (lite || !window.matchMedia("(pointer: fine)").matches) return

    // O movimento do ponteiro dispara muito mais que um quadro: agrupa tudo
    // num requestAnimationFrame para não escrever no estilo várias vezes por
    // quadro.
    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        glowRef.current?.style.setProperty("--pointer-x", `${event.clientX}px`)
        glowRef.current?.style.setProperty("--pointer-y", `${event.clientY}px`)
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-beam ambient-beam-a" />
      <div className="ambient-beam ambient-beam-b" />
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div ref={glowRef} className="cursor-glow" />
      <div className="ambient-noise" />
    </div>
  )
}
