import { useEffect, useId, useRef, useState } from 'react'
import ChargeDemo from './ChargeDemo.jsx'
import { chargeRevealAt } from './chargeDemoData.js'
import { capabilities, faq, people, problemsByField } from './data.js'
import { buildWhatsAppUrl, contactPhones, validateContact } from './formLogic.js'

const BRAND = '/assets/brand/'
const CONTACTS = contactPhones
const wa = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
const clamp = value => Math.max(0, Math.min(1, value))

function seekScrollSvg(object, progress, immediate = false) {
  if (!(object instanceof HTMLElement)) return false
  const svg = object.querySelector('svg')
  const duration = Number(object.dataset.duration)
  if (!(svg instanceof SVGSVGElement) || typeof svg.setCurrentTime !== 'function' || typeof svg.getCurrentTime !== 'function' || !Number.isFinite(duration)) return false
  svg.pauseAnimations?.()
  const target = clamp(progress) * Math.max(0, duration - 1 / 60)
  const current = svg.getCurrentTime()
  const difference = target - current
  svg.setCurrentTime(immediate || Math.abs(difference) < .012 ? target : current + difference * .16)
  return !immediate && Math.abs(difference) >= .012
}

function hardwareScrollTimeline(progress) {
  const local = clamp(progress)
  if (local < .2) return local / .2 * .22
  if (local < .45) return .22 + (local - .2) / .25 * .53
  return .75 + (local - .45) / .55 * .23
}

const SOFTWARE_PALETTE = new Map([
  ['#ed509e', '#1685f5'], ['#ff3d9e', '#2b99ff'], ['#ff8ac4', '#69b9ff'],
  ['#ff8e3a', '#0878ed'], ['#e07624', '#075fbf'], ['#ef8534', '#0b6fd8'],
  ['#e37e31', '#0b72dd'], ['#fb7b18', '#0878ed'], ['#ff8324', '#1388f2'],
  ['#ff9442', '#339df4'], ['#e5863e', '#237fc8'], ['#f5954d', '#1685f5'],
  ['#d18347', '#0b6fd8'], ['#cf6f26', '#075fbf'], ['#b26d38', '#164f8d'],
  ['#91582b', '#123f6b'],
  ['#510ee1', '#0878ed'], ['#561cd4', '#096ccb'], ['#6228e2', '#1685f5'],
  ['#551dcd', '#075fbf'], ['#5631a5', '#164f8d'], ['#6320f3', '#1488f5'],
  ['#783bfc', '#329cff'], ['#8d58fd', '#4ba8f8'], ['#9c71f9', '#62b4fa'],
  ['#9c73f8', '#68b7f7'], ['#5e4b86', '#345777'], ['#5c4195', '#28577f'],
  ['#4d22aa', '#0c4f91'], ['#4b2a92', '#174d7c'], ['#6b51a4', '#3d6d98'],
  ['#5f4d84', '#395c7c'], ['#e0d1ff', '#c7e3fb'], ['#e7dbff', '#d2e9fb'],
  ['#c19aad', '#6f8faa'], ['#757647', '#526477'], ['#676756', '#4b5968'],
  ['#3d3e00', '#182330'], ['#474739', '#303d4b'], ['#4e4e41', '#394654'],
  ['#5b5b57', '#465565'], ['#23231f', '#172330'], ['#000000', '#0a1018'],
  ['#ffffff', '#21384b'], ['#fafafa', '#29445a'], ['#ece6f9', '#34526a'],
  ['#f2f2f3', '#c5d3df'], ['#f2f2f2', '#cbd8e3'], ['#eae9ed', '#9eb1c1'],
  ['#f2eefc', '#afc4d5'], ['#e8e7e9', '#9eb1c1'], ['#d5d3da', '#8fa5b7'],
  ['#bfbdc1', '#71889b'], ['#8464c9', '#248eea']
])

const SOFTWARE_ORIGINAL_COLOR_GROUPS = new Set(['i0', 'i3', 'i6', 'i22', 'i24', 'i25', 'i26', 'i27'])

function softwareTopLevelGroupId(node, svg) {
  let group = node
  while (group?.parentElement && group.parentElement !== svg) group = group.parentElement
  return group?.tagName?.toLowerCase() === 'g' ? group.id : ''
}

function polishSoftwareSvg(svg) {
  const pale = new Set(['#ffffff', '#f2f2f3', '#f2f2f2', '#fafafa', '#ece6f9', '#eae9ed', '#f2eefc', '#e8e7e9'])
  svg.querySelectorAll('[fill]').forEach(node => {
    if (SOFTWARE_ORIGINAL_COLOR_GROUPS.has(softwareTopLevelGroupId(node, svg))) return
    const fill = node.getAttribute('fill')?.toLowerCase()
    if (!fill) return
    if (pale.has(fill) && node instanceof SVGGraphicsElement) {
      const box = node.getBBox()
      if (box.width >= 18 && box.width <= 72 && box.height >= 18 && box.height <= 72) {
        node.setAttribute('fill', 'none')
        return
      }
    }
    const replacement = SOFTWARE_PALETTE.get(fill)
    if (replacement) node.setAttribute('fill', replacement)
  })
  svg.querySelectorAll('[stop-color]').forEach(node => {
    if (SOFTWARE_ORIGINAL_COLOR_GROUPS.has(softwareTopLevelGroupId(node, svg))) return
    const color = node.getAttribute('stop-color')?.toLowerCase()
    const replacement = color && SOFTWARE_PALETTE.get(color)
    if (replacement) node.setAttribute('stop-color', replacement)
  })
}

function ScrollSvg({ src, role, duration, className }) {
  const container = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [markup, setMarkup] = useState('')

  useEffect(() => {
    let active = true
    fetch(src)
      .then(response => {
        if (!response.ok) throw new Error(`Não foi possível carregar ${src}`)
        return response.text()
      })
      .then(source => {
        const document = new DOMParser().parseFromString(source, 'image/svg+xml')
        document.querySelectorAll('script, foreignObject').forEach(node => node.remove())
        document.querySelectorAll('*').forEach(node => {
          for (const attribute of [...node.attributes]) {
            if (/^on/i.test(attribute.name)) node.removeAttribute(attribute.name)
            if ((attribute.name === 'href' || attribute.name === 'xlink:href') && !attribute.value.startsWith('#')) node.removeAttribute(attribute.name)
          }
        })
        const svg = document.documentElement
        svg.removeAttribute('width')
        svg.removeAttribute('height')
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        if (active) setMarkup(svg.outerHTML)
      })
      .catch(() => { if (active) setMarkup('') })
    return () => { active = false }
  }, [src])

  useEffect(() => {
    const svg = container.current?.querySelector('svg')
    if (!(svg instanceof SVGSVGElement)) return
    if (role === 'software') polishSoftwareSvg(svg)
    svg.pauseAnimations?.()
    svg.setCurrentTime?.(0)
    container.current?.dispatchEvent(new Event('svgready'))
  }, [markup, role])

  return <div ref={container} className={className} data-scroll-svg={role} data-duration={duration} dangerouslySetInnerHTML={{ __html: markup }}/>
}

// Scroll suave feito à mão: o `scroll-behavior: smooth` nativo do navegador é
// cancelado no meio da animação pelos hooks de scroll desta página (eles fazem
// getBoundingClientRect a cada frame), o que fazia o clique em links âncora
// (#menu, #contato...) não rolar a página. Esta versão controla o scroll
// diretamente, então nada a interrompe.
function smoothScrollToId(id) {
  const element = document.getElementById(id)
  if (!element) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { element.scrollIntoView(); return }
  const startY = window.scrollY
  const targetY = startY + element.getBoundingClientRect().top
  const distance = targetY - startY
  if (Math.abs(distance) < 2) return
  const duration = Math.min(900, Math.max(320, Math.abs(distance) * .32))
  const startTime = performance.now()
  const ease = t => 1 - (1 - t) ** 3
  const step = now => {
    const progress = Math.min(1, (now - startTime) / duration)
    scrollTo(0, startY + distance * ease(progress))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
  // Rede de segurança: se o navegador atrasar o rAF (aba em segundo plano etc.),
  // garante que o destino final seja alcançado mesmo assim.
  setTimeout(() => { if (Math.abs(window.scrollY - targetY) > 2) scrollTo(0, targetY) }, duration + 150)
}

function smoothNavigate(event) {
  const href = event.currentTarget.getAttribute('href')
  if (!href || href.charAt(0) !== '#' || href.length < 2) return
  event.preventDefault()
  smoothScrollToId(href.slice(1))
  if (history.pushState) history.pushState(null, '', href)
}

function useDesktopSceneMotion(ref, { pointer = false, phases = false } = {}) {
  useEffect(() => {
    const desktop = matchMedia('(min-width: 1101px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const clearMotion = element => {
      for (const property of ['--progress', '--build', '--matter', '--core', '--data', '--energy', '--final', '--cursor-x', '--cursor-y']) element.style.removeProperty(property)
    }
    const syncAnimations = (element, progress, isDesktop) => {
      const hardwareAnimation = element.querySelector('[data-scroll-svg="hardware"]')
      const softwareAnimation = element.querySelector('[data-scroll-svg="software"]')
      if (isDesktop) {
        const hardwareSeeking = seekScrollSvg(hardwareAnimation, hardwareScrollTimeline(progress / .3))
        const softwareSeeking = seekScrollSvg(softwareAnimation, (progress - .62) / .29)
        return hardwareSeeking || softwareSeeking
      }
      let seeking = false
      for (const animation of [hardwareAnimation, softwareAnimation]) {
        if (!animation) continue
        const card = animation.closest('.transformation-card')
        if (!card) continue
        const cardRect = card.getBoundingClientRect()
        seeking = seekScrollSvg(animation, (innerHeight - cardRect.top) / Math.max(1, innerHeight + cardRect.height)) || seeking
      }
      return seeking
    }
    const update = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      if (reduced.matches) {
        clearMotion(element)
        element.querySelectorAll('[data-scroll-svg]').forEach(animation => seekScrollSvg(animation, 0, true))
        return
      }
      if (!desktop.matches) {
        clearMotion(element)
        const seeking = phases && syncAnimations(element, 0, false)
        if (seeking && !frame) frame = requestAnimationFrame(update)
        return
      }
      const rect = element.getBoundingClientRect()
      const progress = clamp(-rect.top / Math.max(1, rect.height - innerHeight))
      element.style.setProperty('--progress', progress.toFixed(4))
      if (phases) {
        element.style.setProperty('--build', clamp(progress / .3).toFixed(4))
        const seeking = syncAnimations(element, progress, true)
        element.style.setProperty('--matter', (1 - clamp((progress - .28) / .1)).toFixed(4))
        element.style.setProperty('--core', (clamp((progress - .3) / .1) * (1 - clamp((progress - .62) / .1))).toFixed(4))
        element.style.setProperty('--data', (clamp((progress - .62) / .1) * (1 - clamp((progress - .91) / .07))).toFixed(4))
        element.style.setProperty('--energy', (clamp((progress - .16) / .18) * (1 - clamp((progress - .84) / .1))).toFixed(4))
        element.style.setProperty('--final', clamp((progress - .94) / .05).toFixed(4))
        if (seeking && !frame) frame = requestAnimationFrame(update)
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
    const animations = ref.current?.querySelectorAll('[data-scroll-svg]') ?? []
    animations.forEach(animation => animation.addEventListener('svgready', request))
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
      animations.forEach(animation => animation.removeEventListener('svgready', request))
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
function Check() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l6 6L20 6"/></svg> }
function SnowflakeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M4.22 6.22l15.56 11.56M19.78 6.22 4.22 17.78M9 4.5 12 2l3 2.5M9 19.5l3 2.5 3-2.5M4.22 6.22l3.6.3M4.22 6.22l1 3.5M19.78 17.78l-3.6-.3M19.78 17.78l-1-3.5M19.78 6.22l-3.6.3M19.78 6.22l-1-3.5M4.22 17.78l3.6-.3M4.22 17.78l1 3.5"/></svg> }
function BoltIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg> }
function ShieldIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/></svg> }
function DragIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8 4 12l4 4M16 8l4 4-4 4M4 12h16"/></svg> }
function ImageIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="8" cy="9" r="1.5"/></svg> }

// Revela um título palavra por palavra (borrado → nítido, com leve atraso
// entre uma palavra e outra). `startIndex` encadeia o atraso entre linhas.
function RevealWords({ text, startIndex = 0 }) {
  const words = text.split(' ')
  return words.map((word, index) => <span key={index} style={/** @type {React.CSSProperties} */ ({ '--w': startIndex + index })}>{word}{index < words.length - 1 ? ' ' : ''}</span>)
}

function Brand({ compact = false, className = '' }) {
  return <a className={`brand ${compact ? 'brand-compact' : ''} ${className}`} href="#inicio" onClick={smoothNavigate} aria-label="BASE4 SYSTEMS — início">
    <img className="brand-symbol" src={`${BRAND}base4-symbol-transparent.png`} width="1090" height="1067" decoding="async" alt="" />
    {!compact && <img className="brand-wordmark" src={`${BRAND}base4-wordmark-white.png`} width="1010" height="99" decoding="async" alt="BASE4 SYSTEMS" />}
  </a>
}

const NAV_ITEMS = [['Ecossistema', '#transformacao'], ['Soluções', '#solucoes'], ['Charge', '#charge'], ['Capacidade', '#capacidade'], ['Hardware', '#hardware'], ['BASE4', '#presenca'], ['Sobre', '#sobre'], ['Equipe', '#equipe'], ['FAQ', '#faq']]

// Benefícios genéricos da limpeza/manutenção — sem números específicos de um
// caso real (ainda não temos fotos/métricas reais; ver HardwareScene abaixo).
const HARDWARE_BENEFITS = [
  { title: 'Refrigeração', text: 'Poeira acumulada é a principal causa de superaquecimento. A limpeza remove esse acúmulo e evita desligamentos inesperados.', Icon: SnowflakeIcon },
  { title: 'Performance', text: 'Pasta térmica velha faz o processador reduzir a velocidade sozinho para não superaquecer. Trocá-la devolve o desempenho original.', Icon: BoltIcon },
  { title: 'Vida útil e ruído', text: 'Um cooler sujo trabalha mais forçado — mais barulho, mais desgaste. Limpo, dura mais e roda mais silencioso.', Icon: ShieldIcon },
]

const ABOUT_POINTS = ['Hardware e software sob o mesmo teto', 'Equipe tecnicamente capacitada', 'Orçamento antes da execução, sem letra miúda']

// TODO: números reais a substituir — Nicolas vai passar os valores certos depois.
const ABOUT_STATS = [
  { value: '2026', label: 'Ano de fundação' },
  { value: '50+', label: 'Equipamentos atendidos' },
  { value: '5+', label: 'Projetos entregues' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  const menuPanel = useRef(null)
  const closeReason = useRef('cancel')
  const closeMenu = () => { closeReason.current = 'cancel'; setOpen(false) }
  const focusTarget = href => {
    window.setTimeout(() => {
      const target = document.querySelector(href)
      if (!target) return
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }, 0)
  }
  const navigate = event => {
    const href = event.currentTarget.getAttribute('href')
    smoothNavigate(event)
    if (href) focusTarget(href)
  }
  const navigateMenu = event => {
    const href = event.currentTarget.getAttribute('href')
    if (!href) return
    smoothNavigate(event)
    closeReason.current = 'navigate'
    setOpen(false)
    focusTarget(href)
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
    <nav className="desktop-nav" aria-label="Navegação principal">{NAV_ITEMS.map(([label, href]) => <a key={href} href={href} onClick={navigate}>{label}</a>)}</nav>
    <a className="header-contact" href="#contato" onClick={navigate}>Iniciar conversa <Arrow /></a>
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
        <ScrollSvg className="scene-motion hardware-motion" src="/assets/scene/gpu.svg" role="hardware" duration="5.35"/>
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
        <ScrollSvg className="scene-motion software-motion" src="/assets/scene/coding.svg" role="software" duration="7"/>
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
  return <section className="charge-scene" id="charge" tabIndex={-1}><div className="charge-heading" data-reveal><span>PRODUTO BASE4 · EM DESENVOLVIMENTO</span><h2><RevealWords text="O próximo fluxo"/><br/><RevealWords text="está chegando." startIndex={3}/></h2><p>Uma nova forma de organizar cobranças está sendo construída. Enquanto a versão completa não é revelada, explore uma amostra navegável do que vem por aí.</p><ChargeCountdown/><a className="action action-dark" href={wa(CONTACTS.hardware, 'Olá! Quero saber quando o B4 Charge for lançado.')} target="_blank" rel="noreferrer">Quero acompanhar <Arrow /></a></div><div className="charge-object" data-reveal><div className="charge-preview-label"><i/> ACESSO ANTECIPADO · WIREFRAME</div><div className="charge-device"><ChargeDemo/></div><button className="charge-expand-button" type="button" onClick={openDemo}>Ampliar demonstração <Arrow/></button><div className="charge-mobile-card"><span>WIREFRAME NAVEGÁVEL</span><strong>Explore o B4 Charge</strong><p>Abra uma demonstração funcional, navegue pelos módulos e alterne o tema.</p><button type="button" onClick={openDemo}>Abrir demonstração <Arrow/></button></div><div className="device-shadow"/></div>{expanded && <div className="charge-modal" onMouseDown={event => { if (event.target === event.currentTarget) setExpanded(false) }}><div ref={dialog} className="charge-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="charge-modal-title"><header className="charge-modal-header"><div><small>DEMONSTRAÇÃO INTERATIVA</small><strong id="charge-modal-title">B4 Charge</strong></div><button ref={closeButton} type="button" onClick={() => setExpanded(false)} aria-label="Fechar demonstração">Fechar <span aria-hidden="true">×</span></button></header><div className="charge-modal-content"><ChargeDemo/></div></div></div>}</section>
}

function CapabilityScene() {
  const [active, setActive] = useState(0)
  const headerUrl = active === 0 ? 'portfoliosaramarques.vercel.app' : active === 1 ? 'obsidian-eta-self.vercel.app' : 'base4.systems / projeto'
  return <section className="capability-scene" id="capacidade"><div className="capability-intro" data-reveal><p>CAPACIDADE DE DESENVOLVIMENTO</p><h2>Do código à operação.</h2><span>Sites, sistemas e automações construídos em torno da operação de cada cliente.</span></div><div className="capability-stage" data-reveal><div className="capability-list">{capabilities.map((item, index) => <button key={item.label} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><small>{item.label}</small><strong>{item.title}</strong><span>{item.detail}</span><Arrow /></button>)}</div><div className={`capability-visual visual-${capabilities[active].visual}`}><div className="screen screen-back"><span/><span/><span/></div><div className="screen screen-front"><header><i/><i/><i/><span>{headerUrl}</span></header>{active === 0 ? <a className="portfolio-preview" href="https://portfoliosaramarques.vercel.app/" target="_blank" rel="noreferrer" aria-label="Abrir o portfólio de Sara Marques em uma nova aba"><img src="/assets/projects/sara-portfolio-preview.jpg" width="1066" height="1600" loading="lazy" decoding="async" alt="Prévia do portfólio de Sara Marques"/><span className="portfolio-shade"/><span className="portfolio-copy"><small>PROJETO EM DESTAQUE</small><strong>Sara Marques</strong><em>Fotografia e audiovisual</em><b>Visitar site <Arrow/></b></span></a> : active === 1 ? <a className="portfolio-preview" href="https://obsidian-eta-self.vercel.app" target="_blank" rel="noreferrer" aria-label="Abrir o site da Obsidian em uma nova aba"><img src="/assets/projects/obsidian-preview.jpg" width="1568" height="741" loading="lazy" decoding="async" alt="Prévia do site da Obsidian Estética Automotiva"/><span className="portfolio-shade"/><span className="portfolio-copy"><small>PROJETO EM DESTAQUE</small><strong>Obsidian</strong><em>Estética automotiva de alta performance</em><b>Visitar site <Arrow/></b></span></a> : <main><span/><strong/><span/><div><i/><i/><i/></div></main>}</div><div className="visual-label">{active === 0 ? 'Clique para visitar' : active === 1 ? 'Clique para visitar' : capabilities[active].label}</div></div></div></section>
}

// Comparador antes/depois: um <input type="range"> nativo, esticado por CSS
// para cobrir toda a área visual (em vez de só a trilha fina padrão), controla
// um clip-path sobre a foto "antes". Isso dá suporte a teclado/leitor de tela
// de graça, sem precisar reimplementar drag com pointer events.
function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = 'Antes', afterLabel = 'Depois' }) {
  const [value, setValue] = useState(50)
  return <div className="hardware-compare" style={/** @type {React.CSSProperties} */ ({ '--pos': `${value}%` })}>
    <div className="hardware-compare-media">
      <div className="hardware-compare-frame hardware-compare-after">
        {afterSrc ? <img src={afterSrc} alt="" /> : <div className="hardware-compare-placeholder"><ImageIcon/><span>Foto em breve</span></div>}
        <span className="hardware-compare-tag hardware-compare-tag-after">{afterLabel}</span>
      </div>
      <div className="hardware-compare-frame hardware-compare-before">
        {beforeSrc ? <img src={beforeSrc} alt="" /> : <div className="hardware-compare-placeholder"><ImageIcon/><span>Foto em breve</span></div>}
        <span className="hardware-compare-tag hardware-compare-tag-before">{beforeLabel}</span>
      </div>
    </div>
    <input className="hardware-compare-range" type="range" min={0} max={100} value={value} onChange={event => setValue(Number(event.target.value))} aria-label="Arraste para comparar antes e depois da limpeza" />
    <div className="hardware-compare-line" aria-hidden="true"/>
    <div className="hardware-compare-handle" aria-hidden="true"><DragIcon/></div>
  </div>
}

function HardwareScene() {
  return <section className="hardware-scene" id="hardware"><div className="hardware-heading" data-reveal><p>MANUTENÇÃO DE HARDWARE</p><h2>Antes e depois<br/>da limpeza.</h2><span>Arraste o controle para comparar — poeira acumulada é a inimiga silenciosa de qualquer notebook ou PC.</span></div><div className="hardware-compare-wrap" data-reveal>
    <BeforeAfterSlider beforeSrc="/assets/projects/hardware/pc-antes.png" afterSrc="/assets/projects/hardware/pc-depois.png" />
  </div><div className="hardware-benefits" data-reveal>{HARDWARE_BENEFITS.map(benefit => <div className="hardware-benefit-card" key={benefit.title}><benefit.Icon/><strong>{benefit.title}</strong><p>{benefit.text}</p></div>)}</div></section>
}

function PresenceScene() {
  return <section className="presence-scene" id="presenca"><div className="presence-glow"/><div className="presence-heading" data-reveal><p>PRESENÇA</p><h2>Perto na bancada.<br/>Sem fronteiras no código.</h2><span>Você fala com quem entende, executa e acompanha o trabalho.</span></div><div className="presence-content" data-reveal><div className="location-block"><span>Loja física em Bilac</span><h3>Rua XV de Novembro, 283</h3><p>Segunda a sexta · 08h–18h<br/>Sábado · 08h–12h</p><a href="https://www.google.com/maps/dir/?api=1&destination=-21.4055942,-50.4757713" target="_blank" rel="noreferrer">Traçar rota <Arrow /></a><div className="location-line"><i/><span>Atendimento presencial</span><i/></div></div><div className="location-map"><iframe src="https://maps.google.com/maps?q=-21.4055942,-50.4757713&z=16&output=embed" title="Localização da BASE4 SYSTEMS em Bilac, SP" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div></div><div className="trust-sentence" data-reveal><span>Orçamento antes da execução</span><i/><span>Garantia</span><i/><span>Código-fonte quando aplicável</span><i/><span>Suporte após a entrega</span></div></section>
}

function AboutScene() {
  return <section className="about-scene" id="sobre"><div className="about-content" data-reveal><span>NOSSA HISTÓRIA</span><h2>Uma base para o que<br/>antes era separado.</h2><p>A BASE4 nasceu em 2026, em Bilac, para resolver um problema simples: quem precisa de tecnologia normalmente precisa contratar duas empresas diferentes — uma para consertar o hardware, outra para construir o software. Reunimos as duas coisas debaixo do mesmo teto, com uma equipe que entende tanto de bancada quanto de código.</p><ul className="about-points">{ABOUT_POINTS.map(point => <li key={point}><Check/>{point}</li>)}</ul></div><div className="about-stats" data-reveal>{ABOUT_STATS.map(stat => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></section>
}

// Ícones do card de sócio — mail e GitHub vieram do card original do Uiverse;
// WhatsApp e LinkedIn são os paths oficiais da simple-icons.
function MailIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> }
function WhatsAppIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> }
function LinkedInIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> }
function GithubIcon() { return <svg viewBox="0 0 496 512" aria-hidden="true"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg> }

// Card de sócio — adaptado de https://uiverse.io/Centered101/cowardly-newt-15
// (mesma mecânica de hover, recolorido pra paleta do site). WhatsApp já linka
// pro número real; LinkedIn e GitHub ficam sem link até termos os perfis.
function MemberCard({ person, index }) {
  const initials = person.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  return <div className="member-card-wrap" data-reveal style={/** @type {React.CSSProperties} */ ({ '--i': index })}>
    <div className="member-card">
      <button className="member-mail" type="button" aria-label={`E-mail de ${person.name} (em breve)`}><MailIcon/></button>
      <div className="member-photo">{person.photo ? <img src={person.photo} alt="" /> : <b aria-hidden="true">{initials}</b>}</div>
      <div className="member-bottom">
        <div className="member-content">
          <span className="member-name">{person.name}</span>
          <span className="member-role">{person.role}</span>
          <span className="member-bio">{person.differential}</span>
        </div>
        <div className="member-footer">
          <div className="member-socials">
            <a href={wa(person.phone, `Olá, ${person.name}! Encontrei seu contato no site da BASE4.`)} target="_blank" rel="noreferrer" aria-label={`WhatsApp de ${person.name}`}><WhatsAppIcon/></a>
            <span aria-hidden="true" title="LinkedIn (em breve)"><LinkedInIcon/></span>
            <span aria-hidden="true" title="GitHub (em breve)"><GithubIcon/></span>
          </div>
          <a className="member-button" href={wa(person.phone, `Olá, ${person.name}! Encontrei seu contato no site da BASE4.`)} target="_blank" rel="noreferrer">Falar</a>
        </div>
      </div>
    </div>
  </div>
}

function TeamScene() {
  return <section className="team-scene" id="equipe"><div className="team-heading" data-reveal><p>EQUIPE</p><h2>Quem faz a BASE4<br/>acontecer.</h2><span>Pessoas de verdade, por trás de cada reparo e cada linha de código.</span></div><div className="team-grid">{people.map((person, index) => <MemberCard key={person.name} person={person} index={index}/>)}</div></section>
}

function FaqScene() {
  const [open, setOpen] = useState(0)
  const uid = useId()
  return <section className="faq-scene" id="faq"><div className="faq-heading" data-reveal><span>PERGUNTAS FREQUENTES</span><h2>Antes de falar com a gente.</h2></div><div className="faq-list" data-reveal>{faq.map((item, index) => {
    const isOpen = open === index
    return <div key={item.q} className={`faq-item${isOpen ? ' is-open' : ''}`}><h3><button type="button" id={`${uid}-q-${index}`} aria-expanded={isOpen} aria-controls={`${uid}-a-${index}`} onClick={() => setOpen(isOpen ? -1 : index)}>{item.q}<Plus/></button></h3><div className="faq-answer" id={`${uid}-a-${index}`} role="region" aria-labelledby={`${uid}-q-${index}`}><div className="faq-answer-inner"><p>{item.a}</p></div></div></div>
  })}</div></section>
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

function Footer() { return <footer className="site-footer"><Brand/><p>Do componente ao código.</p><nav aria-label="Navegação do rodapé"><a href="#transformacao" onClick={smoothNavigate}>Ecossistema</a><a href="#solucoes" onClick={smoothNavigate}>Soluções</a><a href="#charge" onClick={smoothNavigate}>Charge</a><a href="#presenca" onClick={smoothNavigate}>BASE4</a><a href="#sobre" onClick={smoothNavigate}>Sobre</a><a href="#equipe" onClick={smoothNavigate}>Equipe</a><a href="#faq" onClick={smoothNavigate}>FAQ</a><a href="#contato" onClick={smoothNavigate}>Contato</a></nav><div><span>Rua XV de Novembro, 283 · Bilac, SP</span><span>© 2026 BASE4 SYSTEMS</span></div></footer> }

export default function App() { useReveals(); return <><a className="skip-link" href="#conteudo" onClick={smoothNavigate}>Pular para o conteúdo</a><Header/><main id="conteudo"><HeroScene/><TransformationScene/><SolutionsScene/><ChargeScene/><CapabilityScene/><HardwareScene/><PresenceScene/><AboutScene/><TeamScene/><FaqScene/><ContactScene/></main><Footer/></> }
