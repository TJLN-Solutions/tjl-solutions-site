import { numeros } from "../data"
import Counter from "./Counter"
import useInView from "../hooks/useInView"

/**
 * Faixa de prova, entre as frentes e a história da empresa. Fica fora do
 * ritmo de `experience-section` de propósito: é um respiro curto entre dois
 * blocos densos, não uma seção com título próprio.
 */
export default function Numeros() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="numeros" className="metrics-strip">
      <div className="content-shell">
        <p className="terminal-label metrics-label">Uma trajetória construída caso a caso</p>
        {/* rv-zoom: os números crescem para o lugar em vez de subir */}
        <div ref={ref} className={`metrics-grid rv rv-zoom ${inView ? "is-in" : ""}`}>
          {numeros.map((item) => (
            <div className="metric-card" key={item.label}>
              <strong><Counter value={item.valor} suffix={item.sufixo} /></strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
