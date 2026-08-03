import { ArrowUpRight, Check, Code2, Wrench } from "lucide-react"
import { frentes, type ServiceArea } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

const icons: Record<ServiceArea, typeof Wrench> = { hardware: Wrench, software: Code2 }

/**
 * A dualidade da empresa aparece antes de qualquer lista de serviço: quem
 * chega com notebook quebrado e quem chega com projeto de sistema precisam
 * se reconhecer na primeira tela depois do hero.
 */
export default function Frentes() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="frentes" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>02</span></div>
      <div className="content-shell">
        <SectionHeader
          index="02"
          eyebrow="Nossas frentes"
          title="Uma empresa, duas especializações."
          description="A loja física que conserta a sua máquina e a equipe que desenvolve o seu sistema. Mesma casa, mesmo padrão de entrega."
        />

        {/* rv-sides: os dois cards entram de fora para dentro */}
        <div ref={ref} className={`fronts-grid rv rv-sides ${inView ? "is-in" : ""}`}>
          {frentes.map((frente) => {
            const Icon = icons[frente.area]
            return (
              <article className="front-card" key={frente.area}>
                <header>
                  <span className="front-icon"><Icon aria-hidden="true" /></span>
                  <span className="terminal-label">{frente.numero}</span>
                </header>
                <h3>{frente.titulo}</h3>
                <p>{frente.desc}</p>
                <ul className="front-list">
                  {frente.itens.map((item) => (
                    <li key={item}><Check aria-hidden="true" />{item}</li>
                  ))}
                </ul>
                <a href={frente.href} className="front-link">
                  Ver o que fazemos <ArrowUpRight aria-hidden="true" />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
