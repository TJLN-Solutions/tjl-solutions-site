import { useEffect, useRef, useState } from "react"

type Props = {
  /** Valor final. Números grandes saem abreviados: 2400 → 2,4k. */
  value: number
  suffix?: string
  duration?: number
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

const format = (value: number) =>
  value >= 1000
    ? `${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k`
    : String(Math.round(value))

/**
 * Conta de zero até o valor quando entra na tela, uma vez só.
 *
 * Aqui o número é informação, não enfeite: qualquer caminho em que a
 * animação não rode precisa terminar no valor final. Mostrar "0+" porque o
 * observador não respondeu seria pior que não animar.
 */
export default function Counter({ value, suffix = "", duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (reduceMotion() || !("IntersectionObserver" in window)) {
      setCurrent(value)
      return
    }

    // Já passou da tela (link direto, recarga no meio da página): mostra o
    // número pronto, sem contagem.
    if (element.getBoundingClientRect().bottom < 0) {
      setCurrent(value)
      return
    }

    let frame = 0
    let start = 0

    const step = (now: number) => {
      if (!start) start = now
      const progress = Math.min(1, (now - start) / duration)
      // desacelera no fim, no mesmo espírito do --ease do projeto
      setCurrent(value * (1 - Math.pow(1 - progress, 3)))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    const run = () => {
      cancelAnimationFrame(frame)
      start = 0
      frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        run()
        observer.disconnect()
      }
    }, { threshold: 0.4 })

    observer.observe(element)

    /** Aba em segundo plano congela o quadro: ao voltar, confere na mão. */
    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      const node = ref.current
      if (!node) return
      const box = node.getBoundingClientRect()
      if (box.top < window.innerHeight && box.bottom > 0) {
        run()
        observer.disconnect()
      }
    }

    document.addEventListener("visibilitychange", onVisible)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisible)
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref}>
      {format(current)}
      {suffix}
    </span>
  )
}
