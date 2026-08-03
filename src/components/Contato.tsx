import { useState, type ChangeEvent, type FormEvent } from "react"
import { AlertCircle, ArrowUpRight, CheckCircle2, Code2, MessageCircle, Phone, Radio, RadioTower, Wrench } from "lucide-react"
import { areas, baseMessage, serviceOptions, team, teamByArea, whatsappUrl, type ServiceArea } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

const areaIcon: Record<ServiceArea, typeof Wrench> = { hardware: Wrench, software: Code2 }
const areaKeys = Object.keys(areas) as ServiceArea[]

type Fields = { nome: string; empresa: string; telefone: string; servico: string; mensagem: string }
type Errors = Partial<Record<keyof Fields, string>>
const emptyFields: Fields = { nome: "", empresa: "", telefone: "", servico: "", mensagem: "" }

export default function Contato() {
  // Começa sem contato escolhido: o formulário só é montado depois que o
  // visitante decide com quem falar. Trocar de contato depois disso não
  // remonta o formulário, então a animação de entrada roda uma única vez e
  // nada do que já foi digitado se perde.
  const [ref, inView] = useInView<HTMLDivElement>()
  const [selected, setSelected] = useState<number | null>(null)
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const active = selected === null ? null : team[selected]

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

  // Avisa quando o serviço escolhido é atendido por uma frente diferente da
  // do contato selecionado — evita que o pedido chegue a quem não cuida dele.
  const chosenService = serviceOptions.find((item) => item.label === fields.servico)
  const wrongArea =
    active && chosenService?.area && chosenService.area !== active.area ? chosenService.area : null
  const suggested = wrongArea ? teamByArea(wrongArea)[0] : null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!active) return
    const next: Errors = {}
    if (fields.nome.trim().length < 2) next.nome = "Informe seu nome."
    const phoneDigits = fields.telefone.replace(/\D/g, "")
    if (phoneDigits.length < 10 || phoneDigits.length > 11) next.telefone = "Informe um telefone válido com DDD."
    if (!fields.servico) next.servico = "Selecione um serviço."
    if (!fields.mensagem.trim()) next.mensagem = "Mensagem é obrigatória."
    setErrors(next)
    if (Object.keys(next).length) return
    const message = `Olá! Tenho interesse nos serviços da BASE4 SYSTEMS.\n\nNome: ${fields.nome}${fields.empresa ? `\nEmpresa: ${fields.empresa}` : ""}\nTelefone: ${fields.telefone}\nServiço de interesse: ${fields.servico}\n\n${fields.mensagem}`
    window.open(whatsappUrl(active.phone, message), "_blank", "noopener,noreferrer")
    setSent(true)
  }

  return (
    <section id="contato" className="experience-section contact-section">
      <div className="section-track" aria-hidden="true"><span>18</span></div>
      <div className="content-shell">
        <SectionHeader index="18" eyebrow="Central de comunicação" title="Inicie uma conexão com a BASE4." description="Escolha um contato ou descreva o seu projeto. A solicitação será encaminhada diretamente pelo WhatsApp." />
        {/* Entra como bloco único: revelar as duas metades por dentro deixaria
            a moldura aparecendo vazia antes de se preencher. */}
        <div ref={ref} className={`rv ${inView ? "is-in" : ""}`}>
        <div className="contact-center">
          <div className="contact-operators">
            <div className="terminal-label">ATENDIMENTO POR ÁREA / {String(team.length).padStart(2, "0")}</div>

            {areaKeys.map((key) => {
              const Icon = areaIcon[key]
              return (
                <div className="operator-group" key={key} role="group" aria-labelledby={`area-${key}`}>
                  <p className="operator-group-title" id={`area-${key}`}><Icon aria-hidden="true" />{areas[key].label}</p>
                  <p className="operator-group-desc">{areas[key].desc}</p>
                  {teamByArea(key).map((member) => {
                    const index = team.indexOf(member)
                    return (
                      <button
                        type="button"
                        key={member.name}
                        className={`operator ${selected === index ? "active" : ""}`}
                        aria-pressed={selected === index}
                        aria-controls="project-request"
                        onClick={() => setSelected(index)}
                      >
                        <span className="operator-avatar">{member.name[0]}</span>
                        {/* A frente de atuação é da dupla, não da pessoa: fica no
                            cabeçalho do grupo. Repeti-la aqui daria o mesmo texto
                            nos dois cards, sem distinguir ninguém. */}
                        <span><strong>{member.name}</strong><em><Phone />{member.display}</em></span>
                        <i /><Radio />
                      </button>
                    )
                  })}
                </div>
              )
            })}

            {active && (
              <a
                className="operator-connect"
                href={whatsappUrl(active.phone, baseMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle /> Conectar com {active.name} <ArrowUpRight />
              </a>
            )}
            <div className="connection-status">
              {active
                ? <><span><i /> {areas[active.area].label}</span><strong>{active.display}</strong></>
                : <span className="is-idle">Nenhum contato selecionado</span>}
            </div>
          </div>

          <div className="project-request" id="project-request">
            {!active ? (
              <div className="request-standby">
                <div className="standby-dish" aria-hidden="true"><RadioTower /><i /><span /></div>
                <p className="standby-label">Canal em espera</p>
                <h3>Escolha com quem falar.</h3>
                <p className="standby-text">
                  Selecione um contato ao lado e o formulário de solicitação abre aqui,
                  já direcionado para a pessoa certa.
                </p>
              </div>
            ) : sent ? (
              <div className="request-success">
                <CheckCircle2 />
                <span>TRANSMISSÃO INICIADA</span>
                <h3>Solicitação preparada com sucesso.</h3>
                <p>Uma janela do WhatsApp foi aberta para concluir o envio à nossa equipe.</p>
                <button type="button" onClick={() => { setSent(false); setFields(emptyFields) }}>Nova solicitação</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="request-form">
                <div className="request-head" style={{ "--i": 0 } as React.CSSProperties}>
                  <span>PROJECT.REQUEST · {active.name.toUpperCase()}</span>
                  <small>Todos os campos com * são obrigatórios</small>
                </div>
                <div className="field-grid">
                  <Field label="Nome *" error={errors.nome} index={1}><input id="nome" value={fields.nome} onChange={set("nome")} autoComplete="name" placeholder="Seu nome" /></Field>
                  <Field label="Empresa" index={2}><input id="empresa" value={fields.empresa} onChange={set("empresa")} autoComplete="organization" placeholder="Nome da empresa" /></Field>
                  <Field label="Telefone ou WhatsApp *" error={errors.telefone} index={3}><input id="telefone" value={fields.telefone} onChange={set("telefone")} inputMode="tel" autoComplete="tel" placeholder="(xx) xxxxx-xxxx" /></Field>
                  <Field label="Serviço de interesse *" error={errors.servico} index={4}>
                    <select id="servico" value={fields.servico} onChange={set("servico")}><option value="">Selecione um serviço</option>{serviceOptions.map((item) => <option key={item.label}>{item.label}</option>)}</select>
                  </Field>
                </div>
                {wrongArea && suggested && (
                  <p className="request-route" role="status">
                    <AlertCircle aria-hidden="true" />
                    {/* "fica com" evita concordância de gênero: o nome do serviço
                        é variável ("Manutenção" é feminino, "Desenvolvimento" não). */}
                    <span>
                      <strong>{fields.servico}</strong> fica com a frente{" "}
                      {areas[wrongArea].label}. {active.name} cuida de{" "}
                      {areas[active.area].label}.
                    </span>
                    <button type="button" onClick={() => setSelected(team.indexOf(suggested))}>
                      Falar com {suggested.name}
                    </button>
                  </p>
                )}

                <Field label="Mensagem *" error={errors.mensagem} index={5}><textarea id="mensagem" value={fields.mensagem} onChange={set("mensagem")} rows={5} placeholder="Descreva o que você precisa..." /></Field>
                <button type="submit" className="request-submit" style={{ "--i": 6 } as React.CSSProperties}>
                  <span>Enviar solicitação para {active.name}</span><MessageCircle />
                </button>
              </form>
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, index = 0, children }: { label: string; error?: string; index?: number; children: React.ReactElement<{ id: string }> }) {
  const id = children.props.id
  return (
    <label
      className={`request-field ${error ? "has-error" : ""}`}
      htmlFor={id}
      style={{ "--i": index } as React.CSSProperties}
    >
      <span>{label}</span>{children}
      {error && <small><AlertCircle />{error}</small>}
    </label>
  )
}
