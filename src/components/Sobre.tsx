import { ArrowUpRight, Code2, Cpu, MapPin, Radar, Users, Wrench } from "lucide-react"
import SectionHeader from "./SectionHeader"

const flow = [
  { icon: Code2, code: "DEV.01", title: "Desenvolvimento", text: "Sites, sistemas e aplicações digitais" },
  { icon: Wrench, code: "LAB.02", title: "Manutenção", text: "Hardware, computadores e notebooks" },
  { icon: Cpu, code: "AUTO.03", title: "Automações", text: "Processos inteligentes e integrados" },
  { icon: Users, code: "HUB.04", title: "Suporte", text: "Atendimento próximo e personalizado" },
]

export default function Sobre() {
  return (
    <section id="sobre" className="experience-section about-section">
      <div className="section-track" aria-hidden="true"><span>02</span></div>
      <div className="content-shell">
        <SectionHeader
          index="02"
          eyebrow="Centro de operações"
          title="Tecnologia, inovação e atendimento próximo."
          description="A TJL conecta diferentes frentes para transformar necessidades reais em soluções modernas, funcionais e acessíveis."
        />

        <div className="about-grid">
          <div className="about-story">
            <div className="terminal-label">TJL / MANIFESTO</div>
            <p>
              Somos uma empresa especializada no desenvolvimento de soluções digitais e serviços de tecnologia.
              Trabalhamos com criação de sites, manutenção de computadores, desenvolvimento de sistemas e automações
              personalizadas para empresas e profissionais.
            </p>
            <p>
              Entendemos cada contexto antes de projetar. O resultado é tecnologia <strong>sob medida</strong>,
              acompanhada por pessoas que permanecem próximas em todas as etapas.
            </p>
            <div className="about-pulse"><i /><span>Necessidade</span><b /><span>Estratégia</span><b /><span>Solução</span></div>
          </div>

          <div className="about-flow">
            <div className="flow-spine" />
            {flow.map(({ icon: Icon, code, title, text }, index) => (
              <article key={code} className="flow-module" style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}>
                <span className="flow-code">{code}</span>
                <Icon />
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>

        <div className="location-terminal">
          <div className="location-radar"><Radar /><span /><i /></div>
          <div><small>CIDADE</small><strong>Bilac · São Paulo</strong></div>
          <div><small>COORDENADA LOCAL</small><strong>Rua XV de Novembro, 283</strong></div>
          <div><small>ATENDIMENTO</small><strong className="status-online"><i /> Presencial disponível</strong></div>
          <a href="https://maps.google.com/?q=Rua+XV+de+Novembro,+283,+Bilac,+São+Paulo" target="_blank" rel="noopener noreferrer">
            <MapPin /> Abrir localização <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}
