import { Layers } from "lucide-react"
import { portfolio } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * Projetos entregues. A miniatura é um bloco gráfico e não uma foto:
 * enquanto não houver captura real de cada projeto, um placeholder honesto
 * é melhor que imagem de banco que finge ser o trabalho da empresa.
 */
export default function Portfolio() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="portfolio" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>11</span></div>
      <div className="content-shell">
        <SectionHeader
          index="11"
          eyebrow="Portfólio"
          title="Projetos entregues, com código na mão do cliente."
          description="Cada entrega inclui código-fonte, documentação e suporte pós-entrega."
        />

        <div ref={ref} className={`work-grid rv ${inView ? "is-in" : ""}`}>
          {portfolio.map((projeto) => (
            <article className="work-card" key={projeto.numero}>
              <div className="work-thumb" aria-hidden="true">
                <Layers />
                <span className="work-thumb-code">PROJ. {projeto.numero}</span>
              </div>
              <div className="work-body">
                <span className="terminal-label">{projeto.categoria}</span>
                <h3>{projeto.titulo}</h3>
                <p>{projeto.desc}</p>
                <ul className="work-stack">
                  {projeto.stack.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
