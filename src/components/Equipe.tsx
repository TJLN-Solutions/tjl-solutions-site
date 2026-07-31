import { Phone } from "lucide-react"
import { areas, baseMessage, team, whatsappUrl } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * Quatro pessoas, com a frente de cada uma visível. O telefone é link de
 * WhatsApp: o visitante que já sabe com quem quer falar não precisa descer
 * até a seção de contato.
 */
export default function Equipe() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="equipe" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>05</span></div>
      <div className="content-shell">
        <SectionHeader
          index="05"
          eyebrow="Equipe"
          title="Quem resolve o seu problema."
          description="Time pequeno e direto: você fala com quem executa o serviço, não com intermediário."
        />

        <div ref={ref} className={`crew-grid rv ${inView ? "is-in" : ""}`}>
          {team.map((member) => (
            <article className="crew-card" key={member.name}>
              <header>
                <span className="crew-avatar" aria-hidden="true">{member.name.slice(0, 2)}</span>
                <span className="terminal-label">{areas[member.area].short}</span>
              </header>
              <h3>{member.name}</h3>
              <p className="crew-role">{member.role}</p>
              <p className="crew-bio">{member.bio}</p>
              <a
                className="crew-phone"
                href={whatsappUrl(member.phone, baseMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone aria-hidden="true" />
                {member.display}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
