import { UserCheck, Lightbulb, Headphones, Settings } from 'lucide-react'

const items = [
  {
    icon: UserCheck,
    title: 'Atendimento personalizado',
    desc: 'Analisamos cada projeto individualmente para oferecer uma solução adequada à necessidade do cliente.',
  },
  {
    icon: Lightbulb,
    title: 'Soluções modernas',
    desc: 'Utilizamos tecnologias atuais para desenvolver projetos rápidos, seguros e visualmente profissionais.',
  },
  {
    icon: Headphones,
    title: 'Suporte próximo',
    desc: 'Nossa equipe está disponível para orientar o cliente durante todas as etapas do projeto.',
  },
  {
    icon: Settings,
    title: 'Projetos sob medida',
    desc: 'Cada sistema, site ou automação pode ser personalizado conforme a realidade do negócio.',
  },
]

export default function Diferenciais() {
  return (
    <section
      className="py-28 relative"
      style={{
        background: 'linear-gradient(180deg, #020814 0%, rgba(3,40,80,0.15) 50%, #020814 100%)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block mb-4 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded"
            style={{ color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', fontFamily: "'Exo 2', sans-serif" }}
          >
            Nossos diferenciais
          </div>
          <h2 className="section-title">Por que escolher a TJL?</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="card-tech p-7 text-center group">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, rgba(3,105,161,${0.5 + i * 0.1}), rgba(14,165,233,0.15))`,
                  border: '1px solid rgba(14,165,233,0.25)',
                  boxShadow: '0 0 30px rgba(14,165,233,0.08)',
                }}
              >
                <Icon size={26} style={{ color: '#0ea5e9' }} />
              </div>
              <h3
                className="font-bold text-base mb-3"
                style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,240,255,0.6)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
