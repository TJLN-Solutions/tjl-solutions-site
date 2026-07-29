import { MapPin, ExternalLink, Navigation } from 'lucide-react'

const MAPS_URL = 'https://maps.google.com/?q=Rua+XV+de+Novembro,+283,+Bilac,+São+Paulo'
const EMBED_URL = 'https://maps.google.com/maps?q=Rua+XV+de+Novembro+283+Bilac+SP&output=embed'

export default function Localizacao() {
  return (
    <section
      id="localizacao"
      className="py-28 relative"
      style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(3,105,161,0.1) 0%, transparent 60%), #020814',
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
            Onde estamos
          </div>
          <h2 className="section-title mb-4">Nossa loja física</h2>
          <p style={{ color: 'rgba(226,240,255,0.65)' }}>
            Venha conhecer nossa loja e conversar pessoalmente com nossa equipe.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Info */}
          <div className="lg:col-span-1 space-y-5">
            <div
              className="rounded-xl p-6"
              style={{
                background: 'rgba(4,13,30,0.8)',
                border: '1px solid rgba(14,165,233,0.2)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                  boxShadow: '0 0 16px rgba(14,165,233,0.4)',
                }}
              >
                <MapPin size={22} color="white" />
              </div>
              <h3
                className="font-bold text-base mb-2"
                style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
              >
                Endereço
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(226,240,255,0.7)' }}>
                Rua XV de Novembro, 283<br />
                Bilac — São Paulo
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-2.5 w-full justify-center"
              >
                <Navigation size={14} />
                Abrir no Google Maps
                <ExternalLink size={12} />
              </a>
            </div>

            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(14,165,233,0.05)',
                border: '1px solid rgba(14,165,233,0.15)',
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,240,255,0.7)' }}>
                Atendimento presencial disponível. Agende uma visita ou apareça diretamente em nossa loja para conversar com nossa equipe.
              </p>
            </div>
          </div>

          {/* Map */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(14,165,233,0.25)',
              boxShadow: '0 0 40px rgba(14,165,233,0.08)',
              height: '400px',
            }}
          >
            <iframe
              src={EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8) brightness(0.9)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização TJL Tecnologia — Rua XV de Novembro, 283, Bilac, SP"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
