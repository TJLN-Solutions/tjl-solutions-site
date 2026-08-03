import { ArrowUpRight } from "lucide-react"
import { investimento, primaryPhone, whatsappUrl, type ServiceArea } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

const order: ServiceArea[] = ["hardware", "software"]

const mensagem =
  "Olá! Vi as faixas de preço no site da BASE4 e gostaria de um orçamento."

/**
 * Faixas de preço em vez de valor fechado: o serviço depende do equipamento
 * e do escopo, mas deixar a página sem nenhum número obriga o visitante a
 * pedir orçamento só para descobrir se cabe no bolso dele.
 */
export default function Investimento() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="investimento" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>10</span></div>
      <div className="content-shell">
        <SectionHeader
          index="10"
          eyebrow="Faixas de investimento"
          title="Preço à vista, sem surpresa no fim."
          description="Valores de referência para você se situar. Todo projeto recebe orçamento próprio e aprovação prévia."
        />

        <div ref={ref} className={`price-grid rv ${inView ? "is-in" : ""}`}>
          {order.map((area) => {
            const bloco = investimento[area]
            return (
              <article className="price-card" key={area}>
                <h3>{bloco.titulo}</h3>
                <dl className="price-list">
                  {bloco.itens.map((item) => (
                    <div key={item.servico}>
                      <dt>{item.servico}</dt>
                      <dd>{item.faixa}</dd>
                    </div>
                  ))}
                </dl>
                <p className="price-note">{bloco.nota}</p>
              </article>
            )
          })}
        </div>

        <div className="price-cta">
          <a
            className="btn-signal"
            href={whatsappUrl(primaryPhone, mensagem)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar orçamento gratuito <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
