import { useEffect, useId, useRef, useState } from 'react'
import ChargeDemo from './ChargeDemo.jsx'
import { capabilities, people, problemsByField } from './data.js'

const BRAND = '/assets/brand/'
const CONTACTS = { hardware: '5518996464731', software: '5518996980211' }
const wa = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
const clamp = value => Math.max(0, Math.min(1, value))

function useScrollProgress(ref) {
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const distance = Math.max(1, rect.height - innerHeight)
      const progress = clamp(-rect.top / distance)
      element.style.setProperty('--progress', progress.toFixed(4))
      element.style.setProperty('--matter', (1 - clamp(progress / .3)).toFixed(4))
      element.style.setProperty('--core', (clamp((progress - .15) / .18) * (1 - clamp((progress - .68) / .14))).toFixed(4))
      element.style.setProperty('--data', clamp((progress - .57) / .2).toFixed(4))
      element.style.setProperty('--energy', clamp((progress - .22) / .46).toFixed(4))
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', request, { passive: true })
    addEventListener('resize', request)
    return () => { removeEventListener('scroll', request); removeEventListener('resize', request); cancelAnimationFrame(frame) }
  }, [ref])
}

function useReveals() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll('[data-reveal]')
    const animatedScenes = document.querySelectorAll('.hero-scene, .transformation-scene, .charge-scene')
    if (reduced) { elements.forEach(el => el.classList.add('is-visible')); return }
    let frame = 0
    const update = () => {
      frame = 0
      elements.forEach(element => {
        const rect = element.getBoundingClientRect()
        if (rect.top < innerHeight * .9 && rect.bottom > 0) element.classList.add('is-visible')
      })
      animatedScenes.forEach(scene => {
        const rect = scene.getBoundingClientRect()
        scene.classList.toggle('scene-offscreen', rect.bottom < -80 || rect.top > innerHeight + 80)
      })
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(update) }
    request()
    addEventListener('scroll', request, { passive: true })
    addEventListener('resize', request)
    return () => { removeEventListener('scroll', request); removeEventListener('resize', request); cancelAnimationFrame(frame) }
  }, [])
}

function Arrow() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg> }
function Plus() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg> }

function Brand({ compact = false, className = '' }) {
  return <a className={`brand ${compact ? 'brand-compact' : ''} ${className}`} href="#inicio" aria-label="BASE4 SYSTEMS — início">
    <img className="brand-symbol" src={`${BRAND}base4-symbol-transparent.png`} alt="" />
    {!compact && <img className="brand-wordmark" src={`${BRAND}base4-wordmark-white.png`} alt="BASE4 SYSTEMS" />}
  </a>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header-shell">
    <Brand />
    <nav className={open ? 'open' : ''} aria-label="Navegação principal">
      <a href="#transformacao" onClick={() => setOpen(false)}>Ecossistema</a><a href="#solucoes" onClick={() => setOpen(false)}>Soluções</a><a href="#charge" onClick={() => setOpen(false)}>Charge</a><a href="#capacidade" onClick={() => setOpen(false)}>Capacidade</a><a href="#presenca" onClick={() => setOpen(false)}>BASE4</a>
    </nav>
    <a className="header-contact" href="#contato">Iniciar conversa <Arrow /></a>
    <button className="menu-button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/></button>
  </header>
}

function Particles({ count = 18 }) { return <div className="particles" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} style={/** @type {React.CSSProperties} */ ({ '--i': i, '--x': `${(i * 47) % 100}%`, '--y': `${(i * 29) % 100}%`, '--o': .18 + (i % 4) * .09 })} />)}</div> }

function HeroScene() {
  const ref = useRef(/** @type {HTMLElement | null} */ (null))
  useScrollProgress(ref)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const move = event => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      element.style.setProperty('--cursor-x', ((event.clientX / innerWidth) - .5).toFixed(3))
      element.style.setProperty('--cursor-y', ((event.clientY / innerHeight) - .5).toFixed(3))
    }
    addEventListener('pointermove', move)
    return () => removeEventListener('pointermove', move)
  }, [])
  return <section className="hero-scene" id="inicio" ref={ref}><div className="hero-sticky">
    <div className="hero-atmosphere"><div className="hero-halo"/><div className="hero-floor"/><Particles count={22}/></div>
    <div className="hero-mark" aria-hidden="true"><div className="mark-echo echo-one"/><div className="mark-echo echo-two"/><img src={`${BRAND}base4-symbol-transparent.png`} alt=""/><div className="mark-scan"/></div>
    <div className="hero-copy"><p className="hero-kicker">BASE4 SYSTEMS</p><h1><span><i>DO HARDWARE</i></span><span><i>AO SOFTWARE.</i></span></h1><p className="hero-subtitle">Estrutura, inteligência e tecnologia conectadas por uma única base.</p></div>
    <div className="hero-actions"><a className="action action-solid" href={wa(CONTACTS.hardware, 'Olá! Preciso de assistência para meu equipamento.')} target="_blank" rel="noreferrer">Preciso de assistência <Arrow /></a><a className="action action-ghost" href={wa(CONTACTS.software, 'Olá! Quero desenvolver um projeto com a BASE4.')} target="_blank" rel="noreferrer">Quero desenvolver um projeto <Arrow /></a></div>
    <p className="hero-footnote">Assistência local em Bilac e região <span/> Desenvolvimento para qualquer lugar</p><div className="scroll-mark"><i/><span>Continue</span></div>
  </div></section>
}

function TransformationScene() {
  const ref = useRef(/** @type {HTMLElement | null} */ (null))
  useScrollProgress(ref)
  const hardware = ['Diagnóstico', 'Reparo', 'Upgrade', 'Recuperação']
  const software = ['Sites', 'Sistemas', 'Automações', 'Integrações']
  return <section className="transformation-scene" id="transformacao" ref={ref}><div className="transformation-sticky">
    <div className="scene-copy scene-copy-matter"><span>MATÉRIA</span><h2>A estrutura<br/>que funciona.</h2><p>Componentes, máquinas e infraestrutura tratados com precisão.</p></div>
    <div className="scene-copy scene-copy-core"><span>UMA ÚNICA BASE</span><h2>Estrutura ganha<br/>inteligência.</h2><p>A luz atravessa o físico. O diagnóstico vira direção.</p></div>
    <div className="scene-copy scene-copy-data"><span>DADOS</span><h2>A inteligência<br/>que evolui.</h2><p>Sistemas e automações passam a mover o negócio.</p></div>
    <div className="matter-object" aria-hidden="true"><div className="metal-column column-a"/><div className="metal-column column-b"/><div className="metal-column column-c"/><div className="metal-base"/></div>
    <div className="transform-core" aria-hidden="true"><div className="core-light"/><img src={`${BRAND}base4-symbol-transparent.png`} alt=""/></div>
    <div className="energy-line" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    <div className="hardware-words" aria-label="Serviços de hardware">{hardware.map((item, index) => <span key={item} style={/** @type {React.CSSProperties} */ ({ '--i': index })}>{item}</span>)}</div>
    <div className="software-words" aria-label="Serviços de software">{software.map((item, index) => <span key={item} style={/** @type {React.CSSProperties} */ ({ '--i': index })}>{item}</span>)}</div>
    <div className="scene-timeline" aria-hidden="true"><span/><i/><i/><i/></div>
  </div></section>
}

function SolutionsScene() {
  const [field, setField] = useState('hardware')
  const [active, setActive] = useState(0)
  const items = problemsByField[field]
  const changeField = value => { setField(value); setActive(0) }
  return <section className="solutions-scene" id="solucoes">
    <div className="scene-heading" data-reveal><p>O QUE RESOLVEMOS</p><h2>Tecnologia começa<br/>com um problema real.</h2></div>
    <div className="solution-switch" role="tablist" aria-label="Área de solução" data-reveal><button role="tab" aria-selected={field === 'hardware'} onClick={() => changeField('hardware')}>Hardware</button><button role="tab" aria-selected={field === 'software'} onClick={() => changeField('software')}>Software</button><i className={field}/></div>
    <div className={`problem-stage ${field}`} data-reveal><div className="problem-list" role="tabpanel">{items.map((item, index) => <button key={item.problem} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{item.problem}</span><Plus /></button>)}</div><div className="answer-stage" aria-live="polite"><span>O caminho BASE4</span><h3 key={`${field}-${active}`}>{items[active].answer}</h3><p>{field === 'hardware' ? 'Atendimento presencial, diagnóstico transparente e orçamento antes da execução.' : 'Descoberta, prototipação e desenvolvimento próximo até a entrega.'}</p><div className="answer-orbit"><i/><i/><i/><span>{field === 'hardware' ? 'Estrutura' : 'Evolução'}</span></div></div></div>
  </section>
}

function ChargeScene() {
  return <section className="charge-scene" id="charge"><div className="charge-heading" data-reveal><span>PRODUTO BASE4 · WIREFRAME NAVEGÁVEL</span><h2>Cobrança que<br/>acontece no fluxo.</h2><p>Explore o fluxo do B4 Charge em um protótipo compacto. Navegue entre indicadores, clientes e parcelas — tudo funciona apenas nesta página e nenhum dado é salvo.</p><a className="action action-dark" href={wa(CONTACTS.hardware, 'Olá! Tenho interesse em conhecer o B4 Charge.')} target="_blank" rel="noreferrer">Conhecer o Charge <Arrow /></a></div><div className="charge-object" data-reveal><div className="charge-device"><ChargeDemo/></div><div className="device-shadow"/><Particles count={12}/></div></section>
}

function CapabilityScene() {
  const [active, setActive] = useState(0)
  return <section className="capability-scene" id="capacidade"><div className="capability-intro" data-reveal><p>CAPACIDADE DE DESENVOLVIMENTO</p><h2>Do código à operação.</h2><span>Sites, sistemas e automações construídos em torno da operação de cada cliente.</span></div><div className="capability-stage" data-reveal><div className="capability-list">{capabilities.map((item, index) => <button key={item.label} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><small>{item.label}</small><strong>{item.title}</strong><span>{item.detail}</span><Arrow /></button>)}</div><div className={`capability-visual visual-${capabilities[active].visual}`}><div className="screen screen-back"><span/><span/><span/></div><div className="screen screen-front"><header><i/><i/><i/><span>{active === 0 ? 'portfoliosaramarques.vercel.app' : 'base4.systems / projeto'}</span></header>{active === 0 ? <a className="portfolio-preview" href="https://portfoliosaramarques.vercel.app/" target="_blank" rel="noreferrer" aria-label="Abrir o portfólio de Sara Marques em uma nova aba"><img src="/assets/projects/sara-portfolio-preview.png" alt="Prévia do portfólio de Sara Marques"/><span className="portfolio-shade"/><span className="portfolio-copy"><small>PROJETO EM DESTAQUE</small><strong>Sara Marques</strong><em>Fotografia e audiovisual</em><b>Visitar site <Arrow/></b></span></a> : <main><span/><strong/><span/><div><i/><i/><i/></div></main>}</div><div className="visual-label">{active === 0 ? 'Clique para visitar' : capabilities[active].label}</div></div></div></section>
}

function PresenceScene() {
  return <section className="presence-scene" id="presenca"><div className="presence-glow"/><div className="presence-heading" data-reveal><p>PRESENÇA</p><h2>Perto na bancada.<br/>Sem fronteiras no código.</h2><span>Você fala com quem entende, executa e acompanha o trabalho.</span></div><div className="presence-content" data-reveal><div className="location-block"><span>Loja física em Bilac</span><h3>Rua XV de Novembro, 283</h3><p>Segunda a sexta · 08h–18h<br/>Sábado · 08h–12h</p><a href="https://www.google.com/maps/dir/?api=1&destination=-21.4055942,-50.4757713" target="_blank" rel="noreferrer">Traçar rota <Arrow /></a><div className="location-line"><i/><span>Atendimento presencial</span><i/></div></div><div className="people-flow">{people.map(person => <a key={person.name} href={wa(person.phone, `Olá, ${person.name}! Encontrei seu contato no site da BASE4.`)} target="_blank" rel="noreferrer"><span>{person.area}</span><strong>{person.name}</strong><small>{person.role}</small><Arrow /></a>)}</div></div><div className="trust-sentence" data-reveal><span>Orçamento antes da execução</span><i/><span>Garantia</span><i/><span>Código-fonte quando aplicável</span><i/><span>Suporte após a entrega</span></div></section>
}

function ContactScene() {
  const [field, setField] = useState('hardware')
  const [sent, setSent] = useState(false)
  const uid = useId()
  const submit = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const message = field === 'hardware' ? `Olá! Sou ${form.get('name')}. Meu equipamento precisa de manutenção: ${form.get('detail')}` : `Olá! Sou ${form.get('name')}. Quero desenvolver um projeto: ${form.get('detail')}`
    setSent(true)
    window.open(wa(CONTACTS[field], message), '_blank', 'noopener,noreferrer')
  }
  return <section className="contact-scene" id="contato"><div className="contact-intro" data-reveal><Brand compact/><p>UMA ÚNICA BASE PARA TODA A SUA TECNOLOGIA.</p><h2>Qual é o seu<br/>próximo passo?</h2></div><form onSubmit={submit} data-reveal><fieldset><legend>Escolha uma entrada</legend><div className="contact-choice"><label className={field === 'hardware' ? 'active' : ''}><input type="radio" name="field" value="hardware" checked={field === 'hardware'} onChange={() => { setField('hardware'); setSent(false) }}/><span>Manutenção de equipamento</span></label><label className={field === 'software' ? 'active' : ''}><input type="radio" name="field" value="software" checked={field === 'software'} onChange={() => { setField('software'); setSent(false) }}/><span>Desenvolvimento de software</span></label></div></fieldset><label htmlFor={`${uid}-name`}>Seu nome</label><input id={`${uid}-name`} name="name" autoComplete="name" required placeholder="Como podemos chamar você?"/><label htmlFor={`${uid}-detail`}>{field === 'hardware' ? 'O que está acontecendo com o equipamento?' : 'O que você quer construir ou melhorar?'}</label><textarea id={`${uid}-detail`} name="detail" rows={3} required placeholder={field === 'hardware' ? 'Conte o modelo e o problema...' : 'Conte o objetivo do projeto...'}/><button type="submit">Continuar no WhatsApp <Arrow /></button><p className={sent ? 'form-feedback visible' : 'form-feedback'} role="status">Mensagem preparada. Conclua o envio no WhatsApp.</p></form></section>
}

function Footer() { return <footer className="site-footer"><Brand/><p>Do componente ao código.</p><nav aria-label="Navegação do rodapé"><a href="#transformacao">Ecossistema</a><a href="#solucoes">Soluções</a><a href="#charge">Charge</a><a href="#presenca">BASE4</a><a href="#contato">Contato</a></nav><div><span>Rua XV de Novembro, 283 · Bilac, SP</span><span>© 2026 BASE4 SYSTEMS</span></div></footer> }

export default function App() { useReveals(); return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header/><main id="conteudo"><HeroScene/><TransformationScene/><SolutionsScene/><ChargeScene/><CapabilityScene/><PresenceScene/><ContactScene/></main><Footer/></> }
