import { useState, type FormEvent } from 'react'
import { MessageCircle, CheckCircle, AlertCircle, Phone } from 'lucide-react'

type TeamMember = { name: string; phone: string; display: string }

const team: TeamMember[] = [
  { name: 'Apollo', phone: '5518996460473', display: '+55 18 99646-473' },
  { name: 'Leonardo', phone: '5518996311838', display: '+55 18 99631-1838' },
  { name: 'Thiago', phone: '5518996980211', display: '+55 18 99698-0211' },
]

const BASE_MSG = encodeURIComponent('Olá! Encontrei o contato pelo site da TJL e gostaria de conhecer melhor os serviços da empresa.')

const serviceOptions = [
  'Desenvolvimento de site',
  'Manutenção de hardware',
  'Desenvolvimento de automação',
  'TJL Charge',
  'Outro',
]

type Fields = {
  nome: string
  empresa: string
  telefone: string
  servico: string
  mensagem: string
}

type Errors = Partial<Record<keyof Fields, string>>

export default function Contato() {
  const [fields, setFields] = useState<Fields>({
    nome: '', empresa: '', telefone: '', servico: '', mensagem: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const validate = (): boolean => {
    const e: Errors = {}
    if (fields.nome.trim().length < 2) e.nome = 'Informe seu nome.'
    const phoneDigits = fields.telefone.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) e.telefone = 'Informe um telefone válido com DDD.'
    if (!fields.servico) e.servico = 'Selecione um serviço.'
    if (!fields.mensagem.trim()) e.mensagem = 'Mensagem é obrigatória.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const msg = `Olá! Tenho interesse nos serviços da TJL Tecnologia.\n\nNome: ${fields.nome}${fields.empresa ? '\nEmpresa: ' + fields.empresa : ''}\nTelefone: ${fields.telefone}\nServiço de interesse: ${fields.servico}\n\n${fields.mensagem}`
    window.open(`https://wa.me/5518996460473?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value
    if (key === 'telefone') {
      const digits = value.replace(/\D/g, '').slice(0, 11)
      value = digits.length <= 10
        ? digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, ddd, first, last) =>
            [ddd && `(${ddd}`, ddd.length === 2 && ') ', first, last && `-${last}`].filter(Boolean).join(''))
        : digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
    }
    setFields(f => ({ ...f, [key]: value }))
    setErrors(err => ({ ...err, [key]: undefined }))
  }

  const inputClass = (key: keyof Fields) =>
    `w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 ${errors[key] ? 'border-red-500' : 'border-blue-900/40 focus:border-blue-400'}`

  const inputStyle = {
    background: 'rgba(4,13,30,0.8)',
    border: '1px solid rgba(14,165,233,0.2)',
    color: '#e2f0ff',
    fontFamily: "'Inter', sans-serif",
  }
  const inputFocusStyle = {
    outline: 'none',
  }

  return (
    <section
      id="contato"
      className="py-28 relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(3,105,161,0.12) 0%, transparent 60%), #020814',
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
            Fale com a gente
          </div>
          <h2 className="section-title mb-4">Vamos transformar sua ideia em uma solução?</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(226,240,255,0.65)' }}>
            Entre em contato com nossa equipe, explique o que você precisa e solicite um orçamento sem compromisso.
          </p>
        </div>

        {/* Team cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {team.map(({ name, phone, display }) => (
            <div key={name} className="card-tech p-6 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                  boxShadow: '0 0 20px rgba(14,165,233,0.3)',
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {name[0]}
              </div>
              <h3
                className="font-bold text-lg mb-1"
                style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
              >
                {name}
              </h3>
              <div className="flex items-center justify-center gap-1 mb-5 text-sm" style={{ color: '#7dd3fc' }}>
                <Phone size={12} />
                {display}
              </div>
              <a
                href={`https://wa.me/${phone}?text=${BASE_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center text-sm py-2.5"
              >
                <MessageCircle size={15} />
                Falar com {name}
              </a>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(4,13,30,0.8)',
              border: '1px solid rgba(14,165,233,0.2)',
              boxShadow: '0 0 40px rgba(14,165,233,0.08)',
            }}
          >
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle size={56} className="mx-auto mb-5" style={{ color: '#0ea5e9' }} />
                <h3
                  className="font-bold text-xl mb-3"
                  style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
                >
                  Solicitação enviada com sucesso!
                </h3>
                <p style={{ color: 'rgba(226,240,255,0.7)' }}>
                  Nossa equipe entrará em contato em breve.
                </p>
                <button
                  onClick={() => { setSent(false); setFields({ nome: '', empresa: '', telefone: '', servico: '', mensagem: '' }) }}
                  className="btn-outline mt-6"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h3
                  className="font-bold text-lg mb-6"
                  style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
                >
                  Envie uma solicitação
                </h3>

                {/* Nome */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }} htmlFor="nome">
                    Nome *
                  </label>
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    value={fields.nome}
                    onChange={set('nome')}
                    placeholder="Seu nome"
                    className={inputClass('nome')}
                    style={{ ...inputStyle, borderColor: errors.nome ? '#ef4444' : 'rgba(14,165,233,0.2)' }}
                    onFocus={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 2px rgba(14,165,233,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = errors.nome ? '#ef4444' : 'rgba(14,165,233,0.2)'; e.target.style.boxShadow = 'none' }}
                    aria-describedby={errors.nome ? 'nome-error' : undefined}
                  />
                  {errors.nome && (
                    <p id="nome-error" className="flex items-center gap-1 text-xs mt-1" style={{ color: '#f87171' }}>
                      <AlertCircle size={12} /> {errors.nome}
                    </p>
                  )}
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }} htmlFor="empresa">
                    Empresa <span style={{ color: 'rgba(226,240,255,0.4)' }}>(opcional)</span>
                  </label>
                  <input
                    id="empresa"
                    type="text"
                    autoComplete="organization"
                    value={fields.empresa}
                    onChange={set('empresa')}
                    placeholder="Nome da sua empresa"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 2px rgba(14,165,233,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(14,165,233,0.2)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }} htmlFor="telefone">
                    Telefone ou WhatsApp *
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={fields.telefone}
                    onChange={set('telefone')}
                    placeholder="(xx) xxxxx-xxxx"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{ ...inputStyle, borderColor: errors.telefone ? '#ef4444' : 'rgba(14,165,233,0.2)' }}
                    onFocus={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 2px rgba(14,165,233,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = errors.telefone ? '#ef4444' : 'rgba(14,165,233,0.2)'; e.target.style.boxShadow = 'none' }}
                    aria-describedby={errors.telefone ? 'telefone-error' : undefined}
                  />
                  {errors.telefone && (
                    <p id="telefone-error" className="flex items-center gap-1 text-xs mt-1" style={{ color: '#f87171' }}>
                      <AlertCircle size={12} /> {errors.telefone}
                    </p>
                  )}
                </div>

                {/* Serviço */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }} htmlFor="servico">
                    Serviço de interesse *
                  </label>
                  <select
                    id="servico"
                    value={fields.servico}
                    onChange={set('servico')}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                    style={{ ...inputStyle, borderColor: errors.servico ? '#ef4444' : 'rgba(14,165,233,0.2)' }}
                    onFocus={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 2px rgba(14,165,233,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = errors.servico ? '#ef4444' : 'rgba(14,165,233,0.2)'; e.target.style.boxShadow = 'none' }}
                    aria-describedby={errors.servico ? 'servico-error' : undefined}
                  >
                    <option value="" style={{ background: '#040d1e' }}>Selecione um serviço</option>
                    {serviceOptions.map(s => (
                      <option key={s} value={s} style={{ background: '#040d1e' }}>{s}</option>
                    ))}
                  </select>
                  {errors.servico && (
                    <p id="servico-error" className="flex items-center gap-1 text-xs mt-1" style={{ color: '#f87171' }}>
                      <AlertCircle size={12} /> {errors.servico}
                    </p>
                  )}
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }} htmlFor="mensagem">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    value={fields.mensagem}
                    onChange={set('mensagem')}
                    placeholder="Descreva o que você precisa..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 resize-none"
                    style={{ ...inputStyle, borderColor: errors.mensagem ? '#ef4444' : 'rgba(14,165,233,0.2)' }}
                    onFocus={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 2px rgba(14,165,233,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = errors.mensagem ? '#ef4444' : 'rgba(14,165,233,0.2)'; e.target.style.boxShadow = 'none' }}
                    aria-describedby={errors.mensagem ? 'mensagem-error' : undefined}
                  />
                  {errors.mensagem && (
                    <p id="mensagem-error" className="flex items-center gap-1 text-xs mt-1" style={{ color: '#f87171' }}>
                      <AlertCircle size={12} /> {errors.mensagem}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  <MessageCircle size={16} />
                  Enviar solicitação
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
