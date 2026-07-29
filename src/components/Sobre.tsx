import { MapPin, ExternalLink, Code, Wrench, Cpu, Users } from 'lucide-react'

const highlights = [
  { icon: Code, label: 'Desenvolvimento', desc: 'Sites, sistemas e aplicações digitais' },
  { icon: Wrench, label: 'Manutenção', desc: 'Hardware, computadores e notebooks' },
  { icon: Cpu, label: 'Automações', desc: 'Processos inteligentes e integrados' },
  { icon: Users, label: 'Suporte', desc: 'Atendimento próximo e personalizado' },
]

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="py-28 relative"
      style={{
        background: 'radial-gradient(ellipse at 80% 50%, rgba(3,105,161,0.1) 0%, transparent 60%), #020814',
      }}
    >
      {/* Divider top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div
              className="inline-block mb-4 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded"
              style={{ color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', fontFamily: "'Exo 2', sans-serif" }}
            >
              Quem somos
            </div>
            <h2 className="section-title mb-6">
              Tecnologia, inovação e atendimento próximo
            </h2>
            <p className="mb-5 leading-relaxed" style={{ color: 'rgba(226,240,255,0.75)' }}>
              A TJL Tecnologia é uma empresa especializada no desenvolvimento de soluções digitais e serviços de tecnologia. Trabalhamos com criação de sites, manutenção de computadores, desenvolvimento de sistemas e automações personalizadas para empresas e profissionais.
            </p>
            <p className="mb-10 leading-relaxed" style={{ color: 'rgba(226,240,255,0.75)' }}>
              Nosso objetivo é entender as necessidades de cada cliente e desenvolver soluções modernas, funcionais e acessíveis, sempre com atendimento próximo e personalizado.
            </p>

            {/* Location card */}
            <div
              className="glass-light rounded-xl p-6 glow-border"
              style={{ border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)' }}
                >
                  <MapPin size={20} style={{ color: '#0ea5e9' }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1" style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }}>
                    Visite nossa loja
                  </p>
                  <p className="text-sm mb-3" style={{ color: 'rgba(226,240,255,0.7)' }}>
                    Rua XV de Novembro, 283 — Bilac, São Paulo
                  </p>
                  <a
                    href="https://maps.google.com/?q=Rua+XV+de+Novembro,+283,+Bilac,+São+Paulo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Ver localização <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: highlights grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card-tech p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(3,105,161,0.5), rgba(14,165,233,0.2))',
                    border: '1px solid rgba(14,165,233,0.3)',
                  }}
                >
                  <Icon size={22} style={{ color: '#0ea5e9' }} />
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
                >
                  {label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,240,255,0.6)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
