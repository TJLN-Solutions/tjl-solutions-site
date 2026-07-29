import { Globe, Monitor, Cpu, ArrowRight } from 'lucide-react'

type Service = {
  icon: typeof Globe
  title: string
  desc: string
  items: string[]
  whatsapp: string
}

const services: Service[] = [
  {
    icon: Globe,
    title: 'Desenvolvimento de sites',
    desc: 'Criação de sites modernos, responsivos e profissionais para empresas, lojas, escritórios, prestadores de serviços e portfólios.',
    items: [
      'Sites institucionais',
      'Landing pages',
      'Portfólios profissionais',
      'Catálogos digitais',
      'Integração com WhatsApp',
      'Formulários de contato',
      'Hospedagem e publicação',
    ],
    whatsapp: 'Olá! Gostaria de solicitar um orçamento para desenvolvimento de site.',
  },
  {
    icon: Monitor,
    title: 'Manutenção de hardware',
    desc: 'Serviços de manutenção, diagnóstico e melhoria de computadores e notebooks.',
    items: [
      'Formatação e instalação de sistemas',
      'Limpeza interna',
      'Troca de componentes',
      'Instalação de SSD e memória RAM',
      'Diagnóstico de problemas',
      'Otimização de computadores',
      'Backup e recuperação de arquivos',
    ],
    whatsapp: 'Olá! Gostaria de solicitar um orçamento para manutenção de hardware.',
  },
  {
    icon: Cpu,
    title: 'Desenvolvimento de automações',
    desc: 'Criação de automações personalizadas para reduzir tarefas manuais, organizar processos e melhorar a produtividade.',
    items: [
      'Automação de cobranças',
      'Integração entre sistemas',
      'Envio automático de mensagens',
      'Organização de dados',
      'Automatização de tarefas administrativas',
      'Fluxos personalizados para empresas',
    ],
    whatsapp: 'Olá! Gostaria de solicitar um orçamento para desenvolvimento de automação.',
  },
]

export default function Servicos() {
  return (
    <section
      id="servicos"
      className="py-28 relative"
      style={{
        background: 'radial-gradient(ellipse at 70% 30%, rgba(3,105,161,0.1) 0%, transparent 60%), #020814',
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
            O que fazemos
          </div>
          <h2 className="section-title mb-4">Serviços oferecidos</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(226,240,255,0.65)' }}>
            Soluções personalizadas de acordo com as necessidades de cada cliente.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, items, whatsapp }) => (
            <div key={title} className="card-tech p-7 flex flex-col">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(3,105,161,0.6), rgba(14,165,233,0.2))',
                  border: '1px solid rgba(14,165,233,0.3)',
                  boxShadow: '0 0 20px rgba(14,165,233,0.1)',
                }}
              >
                <Icon size={24} style={{ color: '#0ea5e9' }} />
              </div>

              <h3
                className="font-bold text-lg mb-3"
                style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(226,240,255,0.65)' }}>
                {desc}
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(226,240,255,0.7)' }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: '#0ea5e9' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5 border-t" style={{ borderColor: 'rgba(14,165,233,0.15)' }}>
                <p className="text-xs mb-4" style={{ color: 'rgba(226,240,255,0.4)', fontFamily: "'Exo 2', sans-serif" }}>
                  Valor a ser negociado
                </p>
                <a
                  href={`https://wa.me/5518996460473?text=${encodeURIComponent(whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center text-sm py-2.5"
                >
                  Solicitar orçamento <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
