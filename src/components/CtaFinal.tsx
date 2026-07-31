import { Code2, Wrench } from "lucide-react"
import { ctaMessages, teamByArea, whatsappUrl } from "../data"
import useInView from "../hooks/useInView"

/**
 * Fechamento da página com as duas portas de entrada, cada uma já apontando
 * para a dupla certa — quem chega até aqui não deveria precisar descobrir
 * com quem falar de novo.
 */
export default function CtaFinal() {
  const [ref, inView] = useInView<HTMLDivElement>()

  const hardware = teamByArea("hardware")[0]
  const software = teamByArea("software")[0]

  return (
    <section id="pronto" className="final-cta">
      <div className="content-shell">
        <div ref={ref} className={`rv ${inView ? "is-in" : ""}`}>
          <p className="terminal-label">Pronto para começar?</p>
          <h2>Seu problema tem solução. Vamos conversar.</h2>
          <p className="final-cta-text">
            Computador com defeito ou projeto de sistema em mente — fale direto com
            quem cuida da sua frente. Atendimento em Bilac e região, e
            desenvolvimento para qualquer lugar.
          </p>
          <div className="final-cta-actions">
            <a
              className="btn-signal"
              href={whatsappUrl(hardware.phone, ctaMessages.hardware)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Wrench aria-hidden="true" /> Meu PC tem problema
            </a>
            <a
              className="btn-line"
              href={whatsappUrl(software.phone, ctaMessages.software)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code2 aria-hidden="true" /> Quero um sistema
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
