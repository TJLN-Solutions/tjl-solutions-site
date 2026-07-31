import { Headphones, Lightbulb, Settings, UserCheck } from "lucide-react"
import SectionHeader from "./SectionHeader"

const modules = [
  { id: "BASE4-01", icon: UserCheck, title: "Atendimento personalizado", desc: "Analisamos cada projeto individualmente para oferecer uma solução adequada à necessidade do cliente." },
  { id: "BASE4-02", icon: Lightbulb, title: "Soluções modernas", desc: "Utilizamos tecnologias atuais para desenvolver projetos rápidos, seguros e visualmente profissionais." },
  { id: "BASE4-03", icon: Headphones, title: "Suporte próximo", desc: "Nossa equipe está disponível para orientar o cliente durante todas as etapas do projeto." },
  { id: "BASE4-04", icon: Settings, title: "Projetos sob medida", desc: "Cada sistema, site ou automação pode ser personalizado conforme a realidade do negócio." },
]

export default function Diferenciais() {
  return (
    <section id="diferenciais" className="experience-section modules-section">
      <div className="section-track" aria-hidden="true"><span>15</span></div>
      <div className="content-shell">
        <SectionHeader index="15" eyebrow="Arquitetura humana" title="Quatro módulos. Uma forma própria de trabalhar." />
        <div className="technology-modules">
          <svg viewBox="0 0 1000 350" aria-hidden="true"><path d="M120 175 H880 M250 175 V70 M500 175 V280 M750 175 V70" /></svg>
          {modules.map(({ id, icon: Icon, title, desc }, index) => (
            <article key={id} className={`technology-module module-${index + 1}`}>
              <div><span>{id}</span><i /></div>
              <Icon />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
