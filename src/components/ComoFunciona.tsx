import { useState } from "react"
import { trilhas, type ServiceArea } from "../data"
import AreaTabs from "./AreaTabs"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * As duas frentes têm caminhos diferentes: uma começa com o cliente trazendo
 * a máquina, a outra com uma conversa de escopo. Mostrar as duas em abas
 * evita oito passos na tela e deixa o visitante ler só a que interessa.
 */
export default function ComoFunciona() {
  const [area, setArea] = useState<ServiceArea>("hardware")
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="como-funciona" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>08</span></div>
      <div className="content-shell">
        <SectionHeader
          index="08"
          eyebrow="Como funciona"
          title="Do problema à solução, em quatro passos."
          description="Sem etapa escondida e sem cobrança antes de você aprovar."
        />

        <AreaTabs value={area} onChange={setArea} controls="trilha-passos" />

        <div
          ref={ref}
          className={`steps-grid rv ${inView ? "is-in" : ""}`}
          id="trilha-passos"
          role="tabpanel"
          aria-labelledby={`trilha-passos-tab-${area}`}
        >
          {trilhas[area].map((passo) => (
            <article className="step-card" key={`${area}-${passo.passo}`}>
              <span className="step-num">{passo.passo}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
