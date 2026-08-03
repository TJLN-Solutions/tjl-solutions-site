import { useEffect, useRef, useState } from "react"

/** Abaixo desta largura o palco fixo não se sustenta: vira hero comum. */
const LARGURA_MINIMA = 1080

/**
 * Progresso de 0 a 1 da rolagem por dentro de uma seção mais alta que a tela.
 *
 * É o mecanismo por trás do palco fixo: a seção mede várias telas de altura,
 * um filho `position: sticky` fica preso no topo, e este número diz o quanto
 * já se rolou dentro dela. A coreografia toda pendura nesse valor.
 *
 * Duas saídas de segurança devolvem 1 — a cena montada, sem coreografia:
 * telas estreitas, onde a seção alta não existe, e movimento reduzido.
 */
export default function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let frame = 0

    /**
     * Avaliado a cada medição, não uma vez na montagem.
     *
     * Girar o celular ou redimensionar a janela cruza o limite de largura, e
     * com a decisão congelada o hero ficava no modo errado: palco fixo numa
     * tela estreita, ou cena montada num desktop que deveria animar.
     */
    const semCoreografia = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < LARGURA_MINIMA

    const medir = () => {
      if (semCoreografia()) {
        setProgress(1)
        return
      }
      const box = element.getBoundingClientRect()
      const percorrivel = element.offsetHeight - window.innerHeight
      if (percorrivel <= 0) {
        setProgress(1)
        return
      }
      setProgress(Math.min(1, Math.max(0, -box.top / percorrivel)))
    }

    // O scroll dispara muito mais que um quadro: agrupa num rAF para medir
    // uma vez por quadro em vez de uma vez por evento.
    const aoRolar = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener("scroll", aoRolar, { passive: true })
    window.addEventListener("resize", aoRolar)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", aoRolar)
      window.removeEventListener("resize", aoRolar)
    }
  }, [])

  return [ref, progress] as const
}
