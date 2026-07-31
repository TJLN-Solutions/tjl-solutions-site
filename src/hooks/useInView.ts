import { useEffect, useRef, useState } from "react"

/**
 * Dispara uma única vez quando o elemento entra na tela.
 *
 * As seções novas revelam o conteúdo em bloco: o observador fica no
 * contêiner e o CSS escalona os filhos por `nth-child`. Isso evita um
 * observador por card e mantém o DOM sem wrapper extra, que quebraria
 * os grids.
 *
 * Regra que orienta o resto do arquivo: conteúdo nunca pode depender de
 * animação para existir. Todo caminho em que o observador não responde
 * termina mostrando o conteúdo, nunca escondendo.
 */
export default function useInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (!("IntersectionObserver" in window)) {
      setInView(true)
      return
    }

    // Conteúdo que já está acima da tela na montagem aparece sem animação.
    // Sem isso, quem chega por link direto (#contato) ou recarrega no meio
    // da página vê tudo o que ficou acima em branco até rolar de volta.
    if (element.getBoundingClientRect().bottom < 0) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(element)

    /**
     * Aba aberta em segundo plano: o navegador congela o quadro e pode não
     * entregar a notificação do observador. Quando a aba finalmente aparece,
     * confere na mão o que já está visível — senão o visitante encontraria
     * blocos em branco até rolar a página.
     */
    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      const node = ref.current
      if (!node) return
      const box = node.getBoundingClientRect()
      if (box.top < window.innerHeight && box.bottom > 0) {
        setInView(true)
        observer.disconnect()
      }
    }

    document.addEventListener("visibilitychange", onVisible)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return [ref, inView] as const
}
