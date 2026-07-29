import { Zap, MapPin, MessageCircle, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre a TJL', href: '#sobre' },
  { label: 'Sistemas', href: '#sistemas' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Contato', href: '#contato' },
]

const team = [
  { name: 'Apollo', phone: '5518996460473', display: '+55 18 99646-473' },
  { name: 'Leonardo', phone: '5518996311838', display: '+55 18 99631-1838' },
  { name: 'Thiago', phone: '5518996980211', display: '+55 18 99698-0211' },
]

const BASE_MSG = encodeURIComponent('Olá! Encontrei o contato pelo site da TJL e gostaria de conhecer melhor os serviços da empresa.')

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative pt-16 pb-8"
      style={{
        background: 'linear-gradient(180deg, #020814 0%, #020c1a 100%)',
        borderTop: '1px solid rgba(14,165,233,0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 0 12px rgba(14,165,233,0.4)' }}
              >
                <Zap size={15} fill="white" color="white" />
              </div>
              <span
                className="font-extrabold text-base tracking-wider"
                style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
              >
                TJL <span style={{ color: '#0ea5e9' }}>Tecnologia</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(226,240,255,0.55)' }}>
              Tecnologia, inovação e soluções para o seu negócio.
            </p>
            <div className="flex items-start gap-2 text-xs" style={{ color: 'rgba(226,240,255,0.45)' }}>
              <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: '#0ea5e9' }} />
              Rua XV de Novembro, 283 — Bilac, SP
            </div>
          </div>

          {/* Nav */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#0ea5e9', fontFamily: "'Exo 2', sans-serif" }}
            >
              Navegação
            </p>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center gap-1 text-sm no-underline transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(226,240,255,0.55)' }}
                  >
                    <ArrowRight size={11} style={{ color: '#0ea5e9' }} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#0ea5e9', fontFamily: "'Exo 2', sans-serif" }}
            >
              Nossa equipe
            </p>
            <ul className="space-y-4">
              {team.map(({ name, phone, display }) => (
                <li key={name}>
                  <p className="text-sm font-medium mb-1" style={{ color: 'rgba(226,240,255,0.8)', fontFamily: "'Exo 2', sans-serif" }}>
                    {name}
                  </p>
                  <p className="text-xs mb-1.5" style={{ color: 'rgba(226,240,255,0.45)' }}>{display}</p>
                  <a
                    href={`https://wa.me/${phone}?text=${BASE_MSG}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs no-underline transition-colors"
                    style={{ color: '#0ea5e9' }}
                  >
                    <MessageCircle size={11} /> WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#0ea5e9', fontFamily: "'Exo 2', sans-serif" }}
            >
              Comece agora
            </p>
            <p className="text-sm mb-5" style={{ color: 'rgba(226,240,255,0.55)' }}>
              Pronto para modernizar seu negócio com tecnologia?
            </p>
            <a href="#contato" className="btn-primary text-sm py-2.5 w-full justify-center">
              Solicitar orçamento
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(14,165,233,0.1)', color: 'rgba(226,240,255,0.35)' }}
        >
          <p>© {year} TJL Tecnologia. Todos os direitos reservados.</p>
          <p>Desenvolvido pela TJL Tecnologia</p>
        </div>
      </div>
    </footer>
  )
}
