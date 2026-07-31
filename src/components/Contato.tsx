import { useState, type ChangeEvent, type FormEvent } from "react"
import { AlertCircle, ArrowUpRight, CheckCircle2, MessageCircle, Phone, Radio } from "lucide-react"
import { baseMessage, team, whatsappUrl } from "../data"
import SectionHeader from "./SectionHeader"

const serviceOptions = ["Desenvolvimento de site", "Manutenção de hardware", "Desenvolvimento de automação", "BASE4 Charge", "Outro"]
type Fields = { nome: string; empresa: string; telefone: string; servico: string; mensagem: string }
type Errors = Partial<Record<keyof Fields, string>>
const emptyFields: Fields = { nome: "", empresa: "", telefone: "", servico: "", mensagem: "" }

export default function Contato() {
  const [selected, setSelected] = useState(0)
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const set = (key: keyof Fields) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = event.target.value
    if (key === "telefone") {
      const digits = value.replace(/\D/g, "").slice(0, 11)
      value = digits.length <= 10
        ? digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, ddd, first, last) =>
            [ddd && `(${ddd}`, ddd.length === 2 && ") ", first, last && `-${last}`].filter(Boolean).join(""))
        : digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3")
    }
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: Errors = {}
    if (fields.nome.trim().length < 2) next.nome = "Informe seu nome."
    const phoneDigits = fields.telefone.replace(/\D/g, "")
    if (phoneDigits.length < 10 || phoneDigits.length > 11) next.telefone = "Informe um telefone válido com DDD."
    if (!fields.servico) next.servico = "Selecione um serviço."
    if (!fields.mensagem.trim()) next.mensagem = "Mensagem é obrigatória."
    setErrors(next)
    if (Object.keys(next).length) return
    const message = `Olá! Tenho interesse nos serviços da BASE4 SYSTEMS.\n\nNome: ${fields.nome}${fields.empresa ? `\nEmpresa: ${fields.empresa}` : ""}\nTelefone: ${fields.telefone}\nServiço de interesse: ${fields.servico}\n\n${fields.mensagem}`
    window.open(whatsappUrl(team[selected].phone, message), "_blank", "noopener,noreferrer")
    setSent(true)
  }

  return (
    <section id="contato" className="experience-section contact-section">
      <div className="section-track" aria-hidden="true"><span>06</span></div>
      <div className="content-shell">
        <SectionHeader index="06" eyebrow="Central de comunicação" title="Inicie uma conexão com a BASE4." description="Escolha um contato ou descreva o seu projeto. A solicitação será encaminhada diretamente pelo WhatsApp." />
        <div className="contact-center">
          <div className="contact-operators">
            <div className="terminal-label">OPERADORES DISPONÍVEIS / {String(team.length).padStart(2, "0")}</div>
            {team.map((member, index) => (
              <button
                type="button"
                key={member.name}
                className={selected === index ? "active" : ""}
                onClick={() => setSelected(index)}
              >
                <span className="operator-avatar">{member.name[0]}</span>
                <span><small>OPERADOR {String(index + 1).padStart(2, "0")}</small><strong>{member.name}</strong><em><Phone />{member.display}</em></span>
                <i /><Radio />
              </button>
            ))}
            <a
              className="operator-connect"
              href={whatsappUrl(team[selected].phone, baseMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle /> Conectar com {team[selected].name} <ArrowUpRight />
            </a>
            <div className="connection-status"><span><i /> Canal selecionado</span><strong>{team[selected].display}</strong></div>
          </div>

          <div className="project-request">
            {sent ? (
              <div className="request-success">
                <CheckCircle2 />
                <span>TRANSMISSÃO INICIADA</span>
                <h3>Solicitação preparada com sucesso.</h3>
                <p>Uma janela do WhatsApp foi aberta para concluir o envio à nossa equipe.</p>
                <button type="button" onClick={() => { setSent(false); setFields(emptyFields) }}>Nova solicitação</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="request-head"><span>PROJECT.REQUEST</span><small>Todos os campos com * são obrigatórios</small></div>
                <div className="field-grid">
                  <Field label="Nome *" error={errors.nome}><input id="nome" value={fields.nome} onChange={set("nome")} autoComplete="name" placeholder="Seu nome" /></Field>
                  <Field label="Empresa"><input id="empresa" value={fields.empresa} onChange={set("empresa")} autoComplete="organization" placeholder="Nome da empresa" /></Field>
                  <Field label="Telefone ou WhatsApp *" error={errors.telefone}><input id="telefone" value={fields.telefone} onChange={set("telefone")} inputMode="tel" autoComplete="tel" placeholder="(xx) xxxxx-xxxx" /></Field>
                  <Field label="Serviço de interesse *" error={errors.servico}>
                    <select id="servico" value={fields.servico} onChange={set("servico")}><option value="">Selecione um serviço</option>{serviceOptions.map((item) => <option key={item}>{item}</option>)}</select>
                  </Field>
                </div>
                <Field label="Mensagem *" error={errors.mensagem}><textarea id="mensagem" value={fields.mensagem} onChange={set("mensagem")} rows={5} placeholder="Descreva o que você precisa..." /></Field>
                <button type="submit" className="request-submit"><span>Enviar solicitação para {team[selected].name}</span><MessageCircle /></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactElement<{ id: string }> }) {
  const id = children.props.id
  return (
    <label className={`request-field ${error ? "has-error" : ""}`} htmlFor={id}>
      <span>{label}</span>{children}
      {error && <small><AlertCircle />{error}</small>}
    </label>
  )
}
