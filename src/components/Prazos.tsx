import { useState } from "react"
import { prazos, type ServiceArea } from "../data"
import AreaTabs from "./AreaTabs"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * Prazo e garantia por serviço, em tabela. É a informação que o cliente
 * pergunta no WhatsApp antes de qualquer coisa — deixá-la escrita economiza
 * a pergunta e evita promessa verbal.
 */
export default function Prazos() {
  const [area, setArea] = useState<ServiceArea>("hardware")
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="prazos" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>09</span></div>
      <div className="content-shell">
        <SectionHeader
          index="09"
          eyebrow="Prazos e garantia"
          title="Transparência antes de começar."
          description="Prazos de referência. Caso específico pode variar — e é sempre confirmado antes de o serviço iniciar."
        />

        <AreaTabs value={area} onChange={setArea} controls="prazos-tabela" />

        <div
          ref={ref}
          className={`rv ${inView ? "is-in" : ""}`}
          id="prazos-tabela"
          role="tabpanel"
          aria-labelledby={`prazos-tabela-tab-${area}`}
        >
          <div className="data-table-wrap">
            <table className="data-table">
              <caption className="sr-only">
                Prazo e garantia por serviço da frente de {area === "hardware" ? "hardware" : "software"}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Serviço</th>
                  <th scope="col">Prazo</th>
                  <th scope="col">Garantia</th>
                </tr>
              </thead>
              <tbody>
                {prazos[area].map((linha) => (
                  <tr key={`${area}-${linha.servico}`}>
                    <td>{linha.servico}</td>
                    <td className="is-mono">{linha.prazo}</td>
                    <td className="is-mono">{linha.garantia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
