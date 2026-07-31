import { Lightbulb } from "lucide-react"
import { dicas } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * Conteúdo útil que não vende nada. Serve para busca e, sobretudo, mostra
 * domínio técnico sem precisar afirmar que existe.
 */
export default function Dicas() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="dicas" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>16</span></div>
      <div className="content-shell">
        <SectionHeader
          index="16"
          eyebrow="Dicas técnicas"
          title="Cuide bem do seu equipamento."
          description="Três hábitos que evitam a maior parte dos problemas que chegam à nossa bancada."
        />

        <div ref={ref} className={`tips-grid rv ${inView ? "is-in" : ""}`}>
          {dicas.map((dica) => (
            <article className="tip-card" key={dica.numero}>
              <header>
                <Lightbulb aria-hidden="true" />
                <span className="terminal-label">Dica {dica.numero}</span>
              </header>
              <h3>{dica.titulo}</h3>
              <p>{dica.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
