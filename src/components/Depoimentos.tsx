import { Quote } from "lucide-react"
import { depoimentos } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * ⚠️ Os textos em `data.ts` foram gerados como exemplo. Publique apenas
 * depoimento real, com autorização de quem falou — atribuir fala inventada
 * a cliente é problema jurídico, não detalhe de conteúdo.
 */
export default function Depoimentos() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="depoimentos" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>14</span></div>
      <div className="content-shell">
        <SectionHeader
          index="14"
          eyebrow="Depoimentos"
          title="O que dizem os clientes."
        />

        <div ref={ref} className={`quote-grid rv ${inView ? "is-in" : ""}`}>
          {depoimentos.map((item) => (
            <figure className="quote-card" key={item.nome}>
              <Quote className="quote-mark" aria-hidden="true" />
              <blockquote>{item.texto}</blockquote>
              <figcaption>
                <span className="quote-avatar" aria-hidden="true">{item.nome.slice(0, 2)}</span>
                <span>
                  <strong>{item.nome}</strong>
                  <small>{item.contexto}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
