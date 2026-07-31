import { useEffect, type CSSProperties } from "react"

/**
 * Fundo do site: azul quase preto com os dois azuis num só campo, pontos de
 * luz no azul claro como detalhe, e um grão fino por cima.
 *
 * Histórico das tentativas, para não repetir:
 * · grade em perspectiva + orbes + feixes + brilho no cursor → cara de template;
 * · curvas de nível por toda a página → poluído;
 * · uma elipse de luz só no alto → dava para ver onde acabava, e o fundo lia
 *   como duas faixas de cor separadas.
 *
 * Agora a luz vem de camadas amplas que se sobrepõem no próprio degradê (ver
 * --ambient-bg), então não há emenda entre o escuro e o claro. Os pontos são o
 * único elemento discreto por cima.
 *
 * O grão não é enfeite: um degradê escuro e amplo mostra faixas de banding em
 * tela de 8 bits, e a textura quebra essas faixas.
 */

/**
 * Pontos de luz em posições irregulares.
 *
 * As coordenadas saem de multiplicadores irracionais tomados módulo 1: dá uma
 * distribuição que não repete nem alinha, e é determinística — o desenho é
 * sempre o mesmo, sem depender de sorteio.
 */
const DOTS = Array.from({ length: 26 }, (_, index) => {
  const i = index + 1
  const left = ((i * 0.6180339887) % 1) * 100
  const top = ((i * 0.4142135624) % 1) * 100
  const size = 1 + ((i * 0.7320508076) % 1) * 2.2
  const opacity = 0.16 + ((i * 0.2360679775) % 1) * 0.26
  return {
    left: `${left.toFixed(2)}%`,
    top: `${top.toFixed(2)}%`,
    size: `${size.toFixed(2)}px`,
    opacity: opacity.toFixed(3),
    // um em cada quatro respira, com fases diferentes
    alive: index % 4 === 1,
    delay: `${-(index % 7) * 1.6}s`,
  }
})

export default function AmbientExperience() {
  useEffect(() => {
    // Máquina modesta, dados economizados ou movimento reduzido: o site inteiro
    // entra em perfil leve. O CSS decide o que desligar a partir desta classe.
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
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-dots">
        {DOTS.map((dot, index) => (
          <i
            key={index}
            className={dot.alive ? "is-alive" : undefined}
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              animationDelay: dot.alive ? dot.delay : undefined,
              "--o": dot.opacity,
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="ambient-noise" />
    </div>
  )
}
