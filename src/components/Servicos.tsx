import { useState } from "react"
import { ArrowUpRight, Check, Code2, Cpu, Globe2, Monitor, Network, ScanLine } from "lucide-react"
import { services } from "../data"
import SectionHeader from "./SectionHeader"

function ServiceVisual({ type }: { type: string }) {
  if (type === "sites") return (
    <div className="service-visual browser-visual">
      <div className="browser-bar"><i /><i /><i /><span>base4.systems/project</span></div>
      <div className="browser-layout"><aside /><main><span /><strong /><div><i /><i /><i /></div></main></div>
      <Code2 className="visual-icon" /><small>RESPONSIVE / ONLINE</small>
    </div>
  )
  if (type === "hardware") return (
    <div className="service-visual hardware-visual">
      <div className="hardware-core"><Cpu /><span className="scan" /></div>
      <div className="hardware-stat stat-a"><small>CPU</small><strong>38%</strong></div>
      <div className="hardware-stat stat-b"><small>RAM</small><strong>64%</strong></div>
      <div className="hardware-stat stat-c"><small>SSD</small><strong>OK</strong></div>
      <ScanLine className="visual-icon" /><small>DIAGNÓSTICO EM TEMPO REAL</small>
    </div>
  )
  return (
    <div className="service-visual automation-visual">
      <div className="auto-node n1"><span>ENTRADA</span></div><div className="auto-node n2"><span>PROCESSO</span></div>
      <div className="auto-node n3"><span>AÇÃO</span></div><div className="auto-node n4"><span>RESULTADO</span></div>
      <svg viewBox="0 0 500 280"><path d="M95 65 C180 65 160 140 250 140 S320 220 405 220 M95 65 C150 65 185 210 250 210 S345 65 405 65" /></svg>
      <Network className="visual-icon" /><small>WORKFLOW / 04 NÓS ATIVOS</small>
    </div>
  )
}

export default function Servicos() {
  const [active, setActive] = useState(0)
  const service = services[active]
  return (
    <section id="servicos" className="experience-section services-section">
      <div className="section-track" aria-hidden="true"><span>04</span></div>
      <div className="content-shell">
        <SectionHeader index="04" eyebrow="Soluções modulares" title="Escolha uma frente. Veja o sistema responder." description="Projetos personalizados de acordo com as necessidades de cada cliente." />
        <div className="services-console">
          <div className="service-selector" role="tablist" aria-label="Serviços da BASE4">
            {services.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={active === index}
                key={item.id}
                className={active === index ? "active" : ""}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
              >
                <span>{item.id}</span><div><strong>{item.title}</strong><small>{item.short}</small></div><ArrowUpRight />
              </button>
            ))}
          </div>
          <div className="service-detail" role="tabpanel">
            <div className="service-detail-copy">
              <div className="terminal-label">MODULE / {service.id}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="service-benefits">
                {service.items.map((item) => <span key={item}><Check />{item}</span>)}
              </div>
              <div className="service-bottom">
                <span><small>INVESTIMENTO</small>Valor a ser negociado</span>
                <a href={`https://wa.me/5518996460473?text=${encodeURIComponent(service.whatsapp)}`} target="_blank" rel="noopener noreferrer">
                  Solicitar orçamento <ArrowUpRight />
                </a>
              </div>
            </div>
            <ServiceVisual type={service.key} />
          </div>
        </div>
      </div>
    </section>
  )
}
