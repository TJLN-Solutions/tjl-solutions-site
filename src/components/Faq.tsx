import { ArrowUpRight, Plus } from "lucide-react"
import { baseMessage, faq, primaryPhone, whatsappUrl } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * Acordeão em `<details>`: abre sem JavaScript, é indexável e o teclado já
 * navega por padrão. Não force um único item aberto — quem compara respostas
 * quer duas abertas ao mesmo tempo.
 */
export default function Faq() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="faq" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>17</span></div>
      <div className="content-shell">
        <SectionHeader
          index="17"
          eyebrow="Perguntas frequentes"
          title="O que perguntam antes de fechar."
        />

        <div ref={ref} className={`faq-list rv ${inView ? "is-in" : ""}`}>
          {faq.map((item) => (
            <details key={item.pergunta}>
              <summary>
                <span>{item.pergunta}</span>
                <Plus aria-hidden="true" />
              </summary>
              <p className="faq-answer">{item.resposta}</p>
            </details>
          ))}
        </div>

        <div className="faq-foot">
          <p>Não encontrou o que procurava?</p>
          <a
            className="btn-line"
            href={whatsappUrl(primaryPhone, baseMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fazer uma pergunta <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
