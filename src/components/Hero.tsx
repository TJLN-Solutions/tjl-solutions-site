import { useState, type PointerEvent } from "react"
import { ArrowDownRight, ArrowUpRight, Cpu, Globe2, MonitorCog, Network, Zap } from "lucide-react"

const nodes = [
  { label: "Sites", desc: "Presença digital responsiva", icon: Globe2, className: "node-sites" },
  { label: "Sistemas", desc: "Ferramentas sob medida", icon: MonitorCog, className: "node-sistemas" },
  { label: "Automações", desc: "Fluxos que executam sozinhos", icon: Network, className: "node-automacoes" },
  { label: "Hardware", desc: "Diagnóstico e performance", icon: Cpu, className: "node-hardware" },
  { label: "TJL Charge", desc: "Cobranças mais inteligentes", icon: Zap, className: "node-charge" },
]

export default function Hero() {
  const [focused, setFocused] = useState("TJL Charge")

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    event.currentTarget.style.setProperty("--tilt-x", `${y * -6}deg`)
    event.currentTarget.style.setProperty("--tilt-y", `${x * 7}deg`)
  }

  return (
    <section id="inicio" className="hero-shell">
      <div className="hero-coordinates">21°24&apos;15.0&quot;S · 50°28&apos;19.2&quot;W <span>ONLINE</span></div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="hero-kicker"><i /> Ecossistema digital · Bilac, SP</div>
          <p className="hero-brand">TJL Tecnologia</p>
          <h1>Tecnologia que <span>transforma ideias</span> em soluções.</h1>
          <p className="hero-description">
            Desenvolvemos sites, sistemas e automações, além de cuidar da manutenção de computadores,
            conectando estratégia e tecnologia para movimentar negócios.
          </p>
          <div className="hero-actions">
            <a href="#servicos" className="btn-signal">Explorar soluções <ArrowDownRight /></a>
            <a href="#contato" className="btn-line">Solicitar orçamento <ArrowUpRight /></a>
          </div>
          <div className="hero-metrics">
            <div><strong>05</strong><span>frentes conectadas</span></div>
            <div><strong>01</strong><span>equipe próxima</span></div>
            <div><strong>24/7</strong><span>ideias em movimento</span></div>
          </div>
        </div>

        <div className="digital-core-wrap" onPointerMove={tilt} onPointerLeave={(e) => {
          e.currentTarget.style.setProperty("--tilt-x", "0deg")
          e.currentTarget.style.setProperty("--tilt-y", "0deg")
        }}>
          <div className="core-interface">
            <div className="core-corner core-corner-tl" />
            <div className="core-corner core-corner-br" />
            <svg className="core-links" viewBox="0 0 600 600" aria-hidden="true">
              <circle cx="300" cy="300" r="178" />
              <circle cx="300" cy="300" r="112" />
              <path d="M300 300 L142 135 M300 300 L475 130 M300 300 L510 325 M300 300 L400 505 M300 300 L125 430" />
            </svg>
            <div className="core-center">
              <span>SYSTEM</span>
              <strong>TJL</strong>
              <small>{focused}</small>
            </div>
            {nodes.map(({ label, desc, icon: Icon, className }) => (
              <button
                type="button"
                key={label}
                className={`core-node ${className} ${focused === label ? "active" : ""}`}
                onMouseEnter={() => setFocused(label)}
                onFocus={() => setFocused(label)}
                onClick={() => setFocused(label)}
              >
                <Icon />
                <span><b>{label}</b><small>{desc}</small></span>
              </button>
            ))}
            <div className="core-readout">
              <span>NODE STATUS</span><b>CONNECTED</b>
            </div>
          </div>
        </div>
      </div>
      <a className="hero-scroll" href="#sobre"><span>SCROLL TO DISCOVER</span><i /></a>
    </section>
  )
}
