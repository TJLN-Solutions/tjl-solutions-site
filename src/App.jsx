import { useEffect, useId, useRef, useState } from 'react'
import ChargeDemo from './ChargeDemo.jsx'
import { chargeRevealAt } from './chargeDemoData.js'
import { capabilities, people, problemsByField } from './data.js'
import { buildWhatsAppUrl, contactPhones, validateContact } from './formLogic.js'

const BRAND = '/assets/brand/'
const CONTACTS = contactPhones
const wa = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
const clamp = value => Math.max(0, Math.min(1, value))

function useDesktopSceneMotion(ref, { pointer = false, phases = false } = {}) {
  useEffect(() => {
    const desktop = matchMedia('(min-width: 1101px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const clearMotion = element => {
      for (const property of ['--progress', '--build', '--matter', '--core', '--data', '--energy', '--final', '--cursor-x', '--cursor-y']) element.style.removeProperty(property)
    }
    const update = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      if (!desktop.matches || reduced.matches) { clearMotion(element); return }
      const rect = element.getBoundingClientRect()
      const progress = clamp(-rect.top / Math.max(1, rect.height - innerHeight))
      element.style.setProperty('--progress', progress.toFixed(4))
      if (phases) {
        element.style.setProperty('--build', clamp(progress / .14).toFixed(4))
        element.style.setProperty('--matter', (1 - clamp((progress - .18) / .13)).toFixed(4))
        element.style.setProperty('--core', (clamp((progress - .2) / .12) * (1 - clamp((progress - .55) / .13))).toFixed(4))
        element.style.setProperty('--data', (clamp((progress - .51) / .13) * (1 - clamp((progress - .79) / .11))).toFixed(4))
        element.style.setProperty('--energy', (clamp((progress - .15) / .17) * (1 - clamp((progress - .72) / .16))).toFixed(4))
        element.style.setProperty('--final', clamp((progress - .82) / .12).toFixed(4))
      }
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(update) }
    const move = event => {
      const element = ref.current
      if (!pointer || !element || !desktop.matches || reduced.matches) return
      const rect = element.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight) return
      element.style.setProperty('--cursor-x', ((event.clientX / innerWidth) - .5).toFixed(3))
      element.style.setProperty('--cursor-y', ((event.clientY / innerHeight) - .5).toFixed(3))
    }

    update()
    addEventListener('scroll', request, { passive: true })
    addEventListener('resize', request)
    if (pointer) addEventListener('pointermove', move, { passive: true })
    desktop.addEventListener('change', request)
    reduced.addEventListener('change', request)
    return () => {
      removeEventListener('scroll', request)
      removeEventListener('resize', request)
      if (pointer) removeEventListener('pointermove', move)
      desktop.removeEventListener('change', request)
      reduced.removeEventListener('change', request)
      cancelAnimationFrame(frame)
    }
  }, [phases, pointer, ref])
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
    <img className="brand-symbol" src={`${BRAND}base4-symbol-transparent.png`} width="1090" height="1067" decoding="async" alt="" />
    {!compact && <img className="brand-wordmark" src={`${BRAND}base4-wordmark-white.png`} width="1010" height="99" decoding="async" alt="BASE4 SYSTEMS" />}
  </a>
}

const NAV_ITEMS = [['Ecossistema', '#transformacao'], ['Soluções', '#solucoes'], ['Charge', '#charge'], ['Capacidade', '#capacidade'], ['BASE4', '#presenca']]

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  const menuPanel = useRef(null)
  const closeReason = useRef('cancel')
  const closeMenu = () => { closeReason.current = 'cancel'; setOpen(false) }
  const navigateMenu = event => {
    const href = event.currentTarget.getAttribute('href')
    if (!href) return
    closeReason.current = 'navigate'
    setOpen(false)
    window.setTimeout(() => {
      const target = document.querySelector(href)
      if (!target) return
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }, 0)
  }
  useEffect(() => {
    if (!open) return undefined
    closeReason.current = 'cancel'
    const trigger = menuButton.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = menuPanel.current
    const focusables = () => [...(panel?.querySelectorAll('a,button') || [])]
    focusables()[0]?.focus()
    const handleKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
      if (closeReason.current !== 'navigate') trigger?.focus()
    }
  }, [open])
  return <header className="header-shell">
    <Brand />
    <nav className="desktop-nav" aria-label="Navegação principal">{NAV_ITEMS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    <a className="header-contact" href="#contato">Iniciar conversa <Arrow /></a>
    <button ref={menuButton} className="menu-button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(current => !current)}><span/><span/></button>
    {open && <div className="mobile-menu-layer" onMouseDown={event => { if (event.target === event.currentTarget) closeMenu() }}><nav id="mobile-navigation" ref={menuPanel} aria-label="Navegação móvel">{NAV_ITEMS.map(([label, href]) => <a key={href} href={href} onClick={navigateMenu}>{label}</a>)}<a className="mobile-menu-cta" href="#contato" onClick={navigateMenu}>Iniciar conversa <Arrow/></a></nav></div>}
  </header>
}

function Particles({ count = 18 }) { return <div className="particles" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} style={/** @type {React.CSSProperties} */ ({ '--i': i, '--x': `${(i * 47) % 100}%`, '--y': `${(i * 29) % 100}%`, '--o': .18 + (i % 4) * .09 })} />)}</div> }

function HeroScene() {
  const ref = useRef(/** @type {HTMLElement | null} */ (null))
  useDesktopSceneMotion(ref, { pointer: true })
  return <section className="hero-scene" id="inicio" ref={ref} tabIndex={-1}><div className="hero-sticky">
    <div className="hero-atmosphere"><div className="hero-halo"/><div className="hero-floor"/><Particles count={22}/></div>
    <div className="hero-mark" aria-hidden="true"><div className="mark-echo echo-one"/><div className="mark-echo echo-two"/><img src={`${BRAND}base4-symbol-transparent.png`} width="1090" height="1067" fetchPriority="high" alt=""/><div className="mark-scan"/></div>
    <div className="hero-content"><div className="hero-copy"><p className="hero-kicker">BASE4 SYSTEMS</p><h1><span><i>DO HARDWARE</i></span><span><i>AO SOFTWARE.</i></span></h1><p className="hero-subtitle">Estrutura, inteligência e tecnologia conectadas por uma única base.</p></div>
    <div className="hero-actions"><a className="action action-solid" href={wa(CONTACTS.hardware, 'Olá! Preciso de assistência para meu equipamento.')} target="_blank" rel="noreferrer">Preciso de assistência <Arrow /></a><a className="action action-ghost" href={wa(CONTACTS.software, 'Olá! Quero desenvolver um projeto com a BASE4.')} target="_blank" rel="noreferrer">Quero desenvolver um projeto <Arrow /></a></div>
    <p className="hero-footnote">Assistência local em Bilac e região <span/> Desenvolvimento para qualquer lugar</p></div><div className="scroll-mark"><i/><span>Continue</span></div>
  </div></section>
}

function TransformationScene() {
  const ref = useRef(/** @type {HTMLElement | null} */ (null))
  useDesktopSceneMotion(ref, { phases: true })
  return <section className="transformation-scene" id="transformacao" ref={ref} tabIndex={-1}><div className="transformation-sticky">
    <article className="transformation-card matter-card">
      <div className="scene-copy scene-copy-matter"><span>MATÉRIA</span><h2>A estrutura<br/>que funciona.</h2><p>Componentes, máquinas e infraestrutura tratados com precisão.</p></div>
      <div className="matter-object" aria-hidden="true">
        <img className="scene-asset" src="/assets/scene/base4-hardware-assembly.webp" width="1280" height="853" loading="lazy" decoding="async" alt=""/>
        <span className="hardware-scan"/>
      </div>
    </article>
    <article className="transformation-card core-card">
      <div className="scene-copy scene-copy-core"><span>UMA ÚNICA BASE</span><h2>A base<br/>que conecta.</h2><p>Estrutura e inteligência trabalhando como uma única solução.</p></div>
      <div className="transform-core" aria-hidden="true"><div className="core-light"/><img src={`${BRAND}base4-symbol-transparent.png`} width="1090" height="1067" loading="lazy" decoding="async" alt=""/></div>
    </article>
    <article className="transformation-card data-card">
      <div className="scene-copy scene-copy-data"><span>INTELIGÊNCIA</span><h2>A inteligência<br/>que evolui.</h2><p>Sistemas e automações que transformam tecnologia em resultado.</p></div>
      <div className="data-visual" aria-hidden="true">
        <img className="scene-asset" src="/assets/scene/base4-digital-interface.webp" width="1280" height="853" loading="lazy" decoding="async" alt=""/>
        <span className="data-pulse"/>
      </div>
      <div className="mobile-final"><span>BASE4 SYSTEMS</span><strong>Da máquina que sustenta<br/><em>ao sistema que impulsiona.</em></strong><small>Tecnologia de ponta a ponta.</small></div>
    </article>
    <article className="transformation-card final-card">
      <div className="final-mark" aria-hidden="true"><img src={`${BRAND}base4-symbol-transparent.png`} width="1090" height="1067" loading="lazy" decoding="async" alt=""/></div>
      <div className="final-copy"><span>BASE4 SYSTEMS</span><h2>Da máquina que sustenta<br/><em>ao sistema que impulsiona.</em></h2><p>Tecnologia de ponta a ponta.</p></div>
    </article>
    <div className="energy-line" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    <div className="scene-timeline" aria-hidden="true"><span/><i/><i/><i/><i/></div>
  </div></section>
}

function SolutionsScene() {
  const [field, setField] = useState('hardware')
  const [active, setActive] = useState(0)
  const tabsId = useId()
  const tabRefs = useRef([])
  const items = problemsByField[field]
  const changeField = value => { setField(value); setActive(0) }
  const fields = ['hardware', 'software']
  const moveTab = (event, index) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1 }
    if (!(event.key in keys) && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? fields.length - 1 : (index + keys[event.key] + fields.length) % fields.length
    changeField(fields[next])
    tabRefs.current[next]?.focus()
  }
  return <section className="solutions-scene" id="solucoes" tabIndex={-1}>
    <div className="scene-heading" data-reveal><p>O QUE RESOLVEMOS</p><h2>Tecnologia começa<br/>com um problema real.</h2></div>
    <div className="solution-switch" role="tablist" aria-label="Área de solução" data-reveal>{fields.map((value, index) => <button key={value} ref={element => { tabRefs.current[index] = element }} id={`${tabsId}-${value}-tab`} role="tab" aria-selected={field === value} aria-controls={`${tabsId}-panel`} tabIndex={field === value ? 0 : -1} onKeyDown={event => moveTab(event, index)} onClick={() => changeField(value)}>{value === 'hardware' ? 'Hardware' : 'Software'}</button>)}<i className={field}/></div>
    <div className={`problem-stage ${field}`} data-reveal><div className="problem-list" id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-${field}-tab`} tabIndex={0}>{items.map((item, index) => <button key={item.problem} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{item.problem}</span><Plus /></button>)}</div><div className="answer-stage" aria-live="polite"><span>O caminho BASE4</span><h3 key={`${field}-${active}`}>{items[active].answer}</h3><p>{field === 'hardware' ? 'Atendimento presencial, diagnóstico transparente e orçamento antes da execução.' : 'Descoberta, prototipação e desenvolvimento próximo até a entrega.'}</p><div className="answer-orbit"><i/><i/><i/><span>{field === 'hardware' ? 'Estrutura' : 'Evolução'}</span></div></div></div>
  </section>
}

const CHARGE_REVEAL_AT = new Date(chargeRevealAt).getTime()

function ChargeCountdown() {
  const [remaining, setRemaining] = useState(null)
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, CHARGE_REVEAL_AT - Date.now()))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])
  const units = remaining === null ? ['--', '--', '--', '--'] : [
    Math.floor(remaining / 86400000),
    Math.floor((remaining / 3600000) % 24),
    Math.floor((remaining / 60000) % 60),
    Math.floor((remaining / 1000) % 60),
  ].map(value => String(value).padStart(2, '0'))
  return <div className="charge-countdown" aria-label="Contagem regressiva para 20 de setembro de 2026">
    <div className="countdown-signal"><i/><span>TRANSMISSÃO EM PROGRESSO</span><b>20 · SET · 2026</b></div>
    <div className="countdown-units">{units.map((value, index) => <span key={index}><strong>{value}</strong><small>{['dias', 'horas', 'min', 'seg'][index]}</small></span>)}</div>
    <p>Algo novo está tomando forma nos bastidores.</p>
  </div>
}

function ChargeScene() {
  const [expanded, setExpanded] = useState(false)
  const opener = useRef(null)
  const dialog = useRef(null)
  const closeButton = useRef(null)
  const openDemo = event => { opener.current = event.currentTarget; setExpanded(true) }
  useEffect(() => {
    if (!expanded) return undefined
    const trigger = opener.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    const handleKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); setExpanded(false); return }
      if (event.key !== 'Tab') return
      const focusables = [...(dialog.current?.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])') || [])].filter(element => !element.disabled)
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); trigger?.focus() }
  }, [expanded])
  return <section className="charge-scene" id="charge" tabIndex={-1}><div className="charge-heading" data-reveal><span>PRODUTO BASE4 · EM DESENVOLVIMENTO</span><h2>O próximo fluxo<br/>está chegando.</h2><p>Uma nova forma de organizar cobranças está sendo construída. Enquanto a versão completa não é revelada, explore uma amostra navegável do que vem por aí.</p><ChargeCountdown/><a className="action action-dark" href={wa(CONTACTS.hardware, 'Olá! Quero saber quando o B4 Charge for lançado.')} target="_blank" rel="noreferrer">Quero acompanhar <Arrow /></a></div><div className="charge-object" data-reveal><div className="charge-preview-label"><i/> ACESSO ANTECIPADO · WIREFRAME</div><div className="charge-device"><ChargeDemo/></div><button className="charge-expand-button" type="button" onClick={openDemo}>Ampliar demonstração <Arrow/></button><div className="charge-mobile-card"><span>WIREFRAME NAVEGÁVEL</span><strong>Explore o B4 Charge</strong><p>Abra uma demonstração funcional, navegue pelos módulos e alterne o tema.</p><button type="button" onClick={openDemo}>Abrir demonstração <Arrow/></button></div><div className="device-shadow"/></div>{expanded && <div className="charge-modal" onMouseDown={event => { if (event.target === event.currentTarget) setExpanded(false) }}><div ref={dialog} className="charge-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="charge-modal-title"><header className="charge-modal-header"><div><small>DEMONSTRAÇÃO INTERATIVA</small><strong id="charge-modal-title">B4 Charge</strong></div><button ref={closeButton} type="button" onClick={() => setExpanded(false)} aria-label="Fechar demonstração">Fechar <span aria-hidden="true">×</span></button></header><div className="charge-modal-content"><ChargeDemo/></div></div></div>}</section>
}

function CapabilityScene() {
  const [active, setActive] = useState(0)
  const headerUrl = active === 0 ? 'portfoliosaramarques.vercel.app' : active === 1 ? 'obsidian-eta-self.vercel.app' : 'base4.systems / projeto'
  return <section className="capability-scene" id="capacidade"><div className="capability-intro" data-reveal><p>CAPACIDADE DE DESENVOLVIMENTO</p><h2>Do código à operação.</h2><span>Sites, sistemas e automações construídos em torno da operação de cada cliente.</span></div><div className="capability-stage" data-reveal><div className="capability-list">{capabilities.map((item, index) => <button key={item.label} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><small>{item.label}</small><strong>{item.title}</strong><span>{item.detail}</span><Arrow /></button>)}</div><div className={`capability-visual visual-${capabilities[active].visual}`}><div className="screen screen-back"><span/><span/><span/></div><div className="screen screen-front"><header><i/><i/><i/><span>{headerUrl}</span></header>{active === 0 ? <a className="portfolio-preview" href="https://portfoliosaramarques.vercel.app/" target="_blank" rel="noreferrer" aria-label="Abrir o portfólio de Sara Marques em uma nova aba"><img src="/assets/projects/sara-portfolio-preview.jpg" width="1066" height="1600" loading="lazy" decoding="async" alt="Prévia do portfólio de Sara Marques"/><span className="portfolio-shade"/><span className="portfolio-copy"><small>PROJETO EM DESTAQUE</small><strong>Sara Marques</strong><em>Fotografia e audiovisual</em><b>Visitar site <Arrow/></b></span></a> : active === 1 ? <a className="portfolio-preview" href="https://obsidian-eta-self.vercel.app" target="_blank" rel="noreferrer" aria-label="Abrir o site da Obsidian em uma nova aba"><img src="/assets/projects/obsidian-preview.jpg" width="1568" height="741" loading="lazy" decoding="async" alt="Prévia do site da Obsidian Estética Automotiva"/><span className="portfolio-shade"/><span className="portfolio-copy"><small>PROJETO EM DESTAQUE</small><strong>Obsidian</strong><em>Estética automotiva de alta performance</em><b>Visitar site <Arrow/></b></span></a> : <main><span/><strong/><span/><div><i/><i/><i/></div></main>}</div><div className="visual-label">{active === 0 ? 'Clique para visitar' : active === 1 ? 'Clique para visitar' : capabilities[active].label}</div></div></div></section>
}

function PresenceScene() {
  return <section className="presence-scene" id="presenca"><div className="presence-glow"/><div className="presence-heading" data-reveal><p>PRESENÇA</p><h2>Perto na bancada.<br/>Sem fronteiras no código.</h2><span>Você fala com quem entende, executa e acompanha o trabalho.</span></div><div className="presence-content" data-reveal><div className="location-block"><span>Loja física em Bilac</span><h3>Rua XV de Novembro, 283</h3><p>Segunda a sexta · 08h–18h<br/>Sábado · 08h–12h</p><a href="https://www.google.com/maps/dir/?api=1&destination=-21.4055942,-50.4757713" target="_blank" rel="noreferrer">Traçar rota <Arrow /></a><div className="location-line"><i/><span>Atendimento presencial</span><i/></div></div><div className="people-flow">{people.map(person => <a key={person.name} href={wa(person.phone, `Olá, ${person.name}! Encontrei seu contato no site da BASE4.`)} target="_blank" rel="noreferrer"><span>{person.area}</span><strong>{person.name}</strong><small>{person.role}</small><Arrow /></a>)}</div></div><div className="trust-sentence" data-reveal><span>Orçamento antes da execução</span><i/><span>Garantia</span><i/><span>Código-fonte quando aplicável</span><i/><span>Suporte após a entrega</span></div></section>
}

function ContactScene() {
  const [field, setField] = useState('hardware')
  const [values, setValues] = useState({ name: '', detail: '' })
  const [errors, setErrors] = useState({ name: '', detail: '' })
  const [feedback, setFeedback] = useState('')
  const [fallbackUrl, setFallbackUrl] = useState('')
  const uid = useId()
  const nameInput = useRef(null)
  const detailInput = useRef(null)
  const submit = event => {
    event.preventDefault()
    const nextErrors = validateContact(values)
    setErrors({ name: nextErrors.name || '', detail: nextErrors.detail || '' })
    if (Object.keys(nextErrors).length) {
      setFeedback('Revise os campos indicados antes de continuar.')
      window.requestAnimationFrame(() => (nextErrors.name ? nameInput : detailInput).current?.focus())
      return
    }
    const url = buildWhatsAppUrl(field, values.name, values.detail)
    setFallbackUrl(url)
    const popup = window.open(url, '_blank', 'noopener,noreferrer')
    setFeedback(popup ? 'Mensagem preparada. Conclua o envio no WhatsApp.' : 'O navegador bloqueou a nova janela. Use o link abaixo para continuar sem perder seus dados.')
  }
  const update = event => { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setErrors(current => ({ ...current, [event.target.name]: '' })); setFeedback(''); setFallbackUrl('') }
  const switchField = value => { setField(value); setErrors({ name: '', detail: '' }); setFeedback(''); setFallbackUrl('') }
  return <section className="contact-scene" id="contato">
    <div className="contact-intro" data-reveal><Brand compact/><p>UMA ÚNICA BASE PARA TODA A SUA TECNOLOGIA.</p><h2>Qual é o seu<br/>próximo passo?</h2></div>
    <form onSubmit={submit} noValidate data-reveal>
      <fieldset><legend>Escolha uma entrada</legend><div className="contact-choice"><label className={field === 'hardware' ? 'active' : ''}><input type="radio" name="field" value="hardware" checked={field === 'hardware'} onChange={() => switchField('hardware')}/><span>Manutenção de equipamento</span></label><label className={field === 'software' ? 'active' : ''}><input type="radio" name="field" value="software" checked={field === 'software'} onChange={() => switchField('software')}/><span>Desenvolvimento de software</span></label></div></fieldset>
      <label htmlFor={`${uid}-name`}>Seu nome</label>
      <input ref={nameInput} id={`${uid}-name`} name="name" autoComplete="name" value={values.name} onChange={update} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${uid}-name-error` : undefined} placeholder="Como podemos chamar você?"/>
      {errors.name && <p className="field-error" id={`${uid}-name-error`} role="alert">{errors.name}</p>}
      <label htmlFor={`${uid}-detail`}>{field === 'hardware' ? 'O que está acontecendo com o equipamento?' : 'O que você quer construir ou melhorar?'}</label>
      <textarea ref={detailInput} id={`${uid}-detail`} name="detail" rows={3} value={values.detail} onChange={update} aria-invalid={Boolean(errors.detail)} aria-describedby={errors.detail ? `${uid}-detail-error` : undefined} placeholder={field === 'hardware' ? 'Conte o modelo e o problema...' : 'Conte o objetivo do projeto...'}/>
      {errors.detail && <p className="field-error" id={`${uid}-detail-error`} role="alert">{errors.detail}</p>}
      <p className="contact-disclosure">Ao continuar, uma mensagem será preparada no WhatsApp. Nada é enviado automaticamente.</p>
      <button type="submit">Continuar no WhatsApp <Arrow /></button>
      <p className={feedback ? 'form-feedback visible' : 'form-feedback'} role="status">{feedback}</p>
      {fallbackUrl && <a className="whatsapp-fallback" href={fallbackUrl} target="_blank" rel="noreferrer">Abrir conversa manualmente <Arrow/></a>}
    </form>
  </section>
}

function Footer() { return <footer className="site-footer"><Brand/><p>Do componente ao código.</p><nav aria-label="Navegação do rodapé"><a href="#transformacao">Ecossistema</a><a href="#solucoes">Soluções</a><a href="#charge">Charge</a><a href="#presenca">BASE4</a><a href="#contato">Contato</a></nav><div><span>Rua XV de Novembro, 283 · Bilac, SP</span><span>© 2026 BASE4 SYSTEMS</span></div></footer> }

export default function App() { useReveals(); return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header/><main id="conteudo"><HeroScene/><TransformationScene/><SolutionsScene/><ChargeScene/><CapabilityScene/><PresenceScene/><ContactScene/></main><Footer/></> }
