import { CreditCard, CheckCircle2, Clock, Sparkles } from 'lucide-react'

const features = [
  'Cadastro e gerenciamento de clientes',
  'Controle de mensalidades e parcelamentos',
  'Acompanhamento de cobranças',
  'Histórico de pagamentos',
  'Lembretes automáticos',
  'Painel de gestão simples e moderno',
  'Relatórios financeiros',
  'Controle de cobranças em atraso',
]

const whatsappMsg = encodeURIComponent('Olá! Tenho interesse em saber mais sobre o TJL Charge.')

export default function Sistemas() {
  return (
    <section
      id="sistemas"
      className="py-28 relative"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(3,105,161,0.12) 0%, transparent 60%), #020814',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-block mb-4 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded"
            style={{ color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', fontFamily: "'Exo 2', sans-serif" }}
          >
            Inovação própria
          </div>
          <h2 className="section-title mb-4">Sistemas desenvolvidos pela TJL</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(226,240,255,0.65)' }}>
            Soluções criadas para facilitar a gestão e automatizar processos do seu negócio.
          </p>
        </div>

        {/* TJL Charge card */}
        <div
          className="relative rounded-2xl p-8 lg:p-12 overflow-hidden max-w-5xl mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(4,13,30,0.95) 0%, rgba(3,40,80,0.5) 100%)',
            border: '1px solid rgba(14,165,233,0.5)',
            boxShadow: '0 0 60px rgba(14,165,233,0.15), inset 0 0 60px rgba(14,165,233,0.03)',
          }}
        >
          {/* Glow corners */}
          <div
            className="absolute top-0 left-0 w-40 h-40 pointer-events-none"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)',
              transform: 'translate(-30%, -30%)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
              transform: 'translate(30%, 30%)',
            }}
          />

          {/* Top edge glow */}
          <div
            className="absolute top-0 left-10 right-10 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #0ea5e9, transparent)' }}
          />

          <div className="relative grid lg:grid-cols-5 gap-10 items-start">
            {/* Left: info */}
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                    boxShadow: '0 0 24px rgba(14,165,233,0.5)',
                  }}
                >
                  <CreditCard size={26} color="white" />
                </div>
                <div>
                  <h3
                    className="font-extrabold text-2xl"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
                  >
                    TJL Charge
                  </h3>
                  <p className="text-xs" style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }}>
                    Sistema de Cobrança Automática
                  </p>
                </div>
                {/* Badge */}
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ml-auto lg:ml-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.25), rgba(14,165,233,0.1))',
                    border: '1px solid rgba(14,165,233,0.6)',
                    color: '#7dd3fc',
                    fontFamily: "'Exo 2', sans-serif",
                    animation: 'pulse-glow 3s infinite',
                  }}
                >
                  <Clock size={12} />
                  Lançamento em breve
                </div>
              </div>

              <p className="mb-3 leading-relaxed" style={{ color: 'rgba(226,240,255,0.75)' }}>
                O TJL Charge é um sistema de cobrança automática desenvolvido para empresas, comércios e profissionais que trabalham com mensalidades, crediários ou parcelamentos próprios.
              </p>
              <p className="mb-8 leading-relaxed" style={{ color: 'rgba(226,240,255,0.75)' }}>
                A plataforma permitirá organizar clientes, controlar cobranças, acompanhar pagamentos e automatizar o envio de lembretes, trazendo mais praticidade, controle e eficiência para o negócio.
              </p>

              <a
                href={`https://wa.me/5518996460473?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Sparkles size={16} />
                Tenho interesse
              </a>
            </div>

            {/* Right: features */}
            <div className="lg:col-span-2">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#0ea5e9', fontFamily: "'Exo 2', sans-serif" }}
              >
                Recursos previstos
              </p>
              <ul className="space-y-3">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(226,240,255,0.8)' }}>
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: '#0ea5e9' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Placeholder for future systems */}
        <p
          className="text-center mt-10 text-sm"
          style={{ color: 'rgba(226,240,255,0.3)', fontFamily: "'Exo 2', sans-serif", letterSpacing: '0.05em' }}
        >
          Novos sistemas em desenvolvimento · Em breve
        </p>
      </div>
    </section>
  )
}
