import { Code2, Wrench } from "lucide-react"
import { tecnologias, type ServiceArea } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

const icons: Record<ServiceArea, typeof Wrench> = { hardware: Wrench, software: Code2 }

/**
 * Marcas atendidas e stack de desenvolvimento. Responde a duas perguntas
 * concretas — "vocês mexem na minha marca?" e "com o que vocês trabalham?" —
 * sem exigir que o visitante pergunte.
 */
export default function Tecnologias() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="tecnologias" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>13</span></div>
      <div className="content-shell">
        <SectionHeader
          index="13"
          eyebrow="Tecnologias"
          title="O que a gente conhece de perto."
          description="Se a sua marca ou a sua stack não estiver na lista, pergunte: a lista é do que aparece com frequência, não um limite."
        />

        <div ref={ref} className={`tech-grid rv ${inView ? "is-in" : ""}`}>
          {tecnologias.map((grupo) => {
            const Icon = icons[grupo.area]
            return (
              <article className="tech-group" key={grupo.titulo}>
                <h3><Icon aria-hidden="true" />{grupo.titulo}</h3>
                <ul className="tech-chips">
                  {grupo.itens.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
