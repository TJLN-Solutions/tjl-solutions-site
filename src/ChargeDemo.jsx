import { useEffect, useMemo, useRef, useState } from 'react'
import { chargeChart, chargeClients, chargeInstallments, formatChargeMoney } from './chargeDemoData.js'

const views = [
  { id: 'overview', label: 'Visão geral', icon: '▦', group: null },
  { id: 'clients', label: 'Clientes', icon: '♧', group: 'CARTEIRA' },
  { id: 'sales', label: 'Vendas e contratos', icon: '▧', group: 'CARTEIRA' },
  { id: 'installments', label: 'Parcelas', icon: '▱', group: 'RECEBIMENTOS' },
  { id: 'subscriptions', label: 'Mensalidades', icon: '□', group: 'RECEBIMENTOS' },
  { id: 'calendar', label: 'Calendário', icon: '▦', group: 'RECEBIMENTOS' },
  { id: 'billing', label: 'Cobranças', icon: '♢', group: 'RECEBIMENTOS' },
]

const demoPeople = [
  ...chargeClients,
  { id: 4, initials: 'DD', name: 'Diego Demo Oliveira', detail: '90000000004', status: 'Regular', balance: 0 },
  { id: 5, initials: 'EE', name: 'Empresa Exemplo Demo Comércio Ltda.', detail: '900000000005', status: 'Em dia', balance: 1499.5 },
]

function Status({ children }) {
  return <span className={`demo-status status-${children.toLowerCase().replace(' ', '-')}`}>{children}</span>
}

function DemoNav({ view, setView }) {
  const itemRefs = useRef(new Map())
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1100px)').matches) return
    itemRefs.current.get(view)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
  }, [view])
  const renderButton = item => <button ref={element => { if (element) itemRefs.current.set(item.id, element) }} type="button" key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => setView(item.id)} title={item.label}><i aria-hidden="true">{item.icon}</i><span>{item.label}</span></button>
  return <aside className="demo-sidebar" aria-label="Navegação da demonstração">
    <div className="demo-app-mark"><img src="/assets/brand/base4-symbol-transparent.png" alt=""/><b>CHARGE</b></div>
    {renderButton(views[0])}
    <p>CARTEIRA</p>
    {views.filter(item => item.group === 'CARTEIRA').map(renderButton)}
    <p>RECEBIMENTOS</p>
    {views.filter(item => item.group === 'RECEBIMENTOS').map(renderButton)}
    <div className="demo-sidebar-footer"><span>◉ <b>Ajuda</b></span><span><i>TD</i><b>Thiago Demo</b></span></div>
  </aside>
}

function DemoHeader({ title, theme, setTheme }) {
  return <header className="demo-header"><span className="demo-menu">☰</span><strong>{title}</strong><div className="demo-search">⌕ <span>Pesquisar...</span></div><span className="demo-bell">♧<b>9</b></span><button className="demo-theme-toggle" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label={`Ativar modo ${theme === 'dark' ? 'claro' : 'escuro'}`}>{theme === 'dark' ? '☼' : '◐'}</button><span className="demo-user"><b>Thiago Demo</b><small>MASTER_ADMIN · B4 Charge Demo</small></span><i className="demo-user-avatar">T</i></header>
}

function RevenueChart({ theme }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      const context = canvas.getContext('2d')
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      const grid = theme === 'dark' ? '#27374e' : '#e3e8ef'
      context.strokeStyle = grid
      context.lineWidth = 1
      for (let row = 1; row < 4; row += 1) {
        const y = row * height / 4
        context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke()
      }
      for (let column = 1; column < 6; column += 1) {
        const x = column * width / 6
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke()
      }
      const plot = (values, color, dashed = false) => {
        context.strokeStyle = color
        context.lineWidth = dashed ? 1.5 : 2
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.setLineDash(dashed ? [5, 5] : [])
        context.beginPath()
        values.forEach((value, index) => {
          const x = index * width / (values.length - 1)
          const y = height - (value / 100 * height)
          if (index === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        })
        context.stroke()
        context.setLineDash([])
      }
      plot(chargeChart, '#2f7df4')
      plot([24, 31, 39, 74, 43, 43], '#d6b300', true)
    }
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [theme])
  return <canvas ref={canvasRef} role="img" aria-label="Gráfico demonstrativo de recebimentos e previsão"/>
}

function Overview({ installments, paid, theme, setView }) {
  const paidValue = [...paid].reduce((sum, id) => sum + (installments.find(item => item.id === id)?.value || 0), 0)
  const overduePaid = [...paid].reduce((sum, id) => sum + (installments.find(item => item.id === id)?.status === 'Vencida' ? installments.find(item => item.id === id).value : 0), 0)
  const kpis = [
    ['clock', '◷', formatChargeMoney(0), 'A receber hoje', '0 parcelas'],
    ['received', '↗', formatChargeMoney(850 + paidValue), 'Recebido no mês', `${1 + paid.size} confirmados`],
    ['open', '▣', formatChargeMoney(Math.max(0, 20524.5 - paidValue)), 'Em aberto', `${32 - paid.size} parcelas`],
    ['late', '△', formatChargeMoney(Math.max(0, 6124.9 - overduePaid)), 'Atrasado', `${8 - (overduePaid ? 1 : 0)} parcelas`],
    ['clients', '♧', '8', 'Clientes', 'cadastrados'],
    ['contracts', '▧', '6', 'Contratos ativos', 'contratos'],
  ]
  return <div className="demo-view demo-overview">
    <div className="demo-page-title"><strong>Visão Geral</strong><span>Dados demonstrativos</span><button onClick={() => setView('sales')}>＋ Nova venda</button></div>
    <div className="demo-welcome"><span>B4</span><div><strong>Bem-vindo ao B4 Charge</strong><small>Dados financeiros da empresa em uma prévia navegável</small></div><aside><small>Vencendo hoje</small><strong>0</strong></aside></div>
    <div className="demo-kpis">{kpis.map(item => <article className={`kpi-${item[0]}`} key={item[3]}><i>{item[1]}</i><strong>{item[2]}</strong><small>{item[3]}</small><span>{item[4]}</span></article>)}</div>
    <div className="demo-grid"><article className="demo-chart"><header><strong>Recebimentos e previsão</strong><span><i/> Recebido · <b/> Previsto</span></header><div className="demo-plot"><RevenueChart theme={theme}/></div><footer><span>jun</span><span>jul</span><span>ago</span><span>set</span><span>out</span><span>nov</span></footer></article><article className="demo-donut-card"><header>Situação das parcelas</header><div className="demo-donut"><i/></div><footer><span><i/>Em aberto</span><span><i/>Recebida</span><span><i/>Atrasada</span></footer></article></div>
  </div>
}

function Clients() {
  const [selected, setSelected] = useState(1)
  return <div className="demo-view"><PageHeading eyebrow="CARTEIRA · DADOS DE EXEMPLO" title="Clientes" action="+ Novo cliente"/><div className="demo-client-list">{demoPeople.map(client => <button key={client.id} className={selected === client.id ? 'active' : ''} onClick={() => setSelected(client.id)}><i>{client.initials}</i><span><b>{client.name}</b><small>{client.detail}</small></span><Status>{client.status}</Status><strong>{formatChargeMoney(client.balance)}</strong></button>)}</div><div className="demo-client-foot"><span>{demoPeople.length} clientes demonstrativos</span><span>Selecione uma linha para explorar</span></div></div>
}

function PageHeading({ eyebrow, title, action = null }) {
  return <div className="demo-view-heading"><div><small>{eyebrow}</small><strong>{title}</strong></div>{action && <span className="demo-prototype-action" aria-label={`${action} — apenas uma referência visual`}>{action}<small>prévia</small></span>}</div>
}

function Sales() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState(null)
  const labels = ['Selecionar cliente', 'Dados da venda', 'Parcelamento', 'Revisão']
  return <div className="demo-view demo-sales"><PageHeading eyebrow="FLUXO DEMONSTRATIVO" title="Nova venda"/><div className="demo-steps">{labels.map((label, index) => <button className={step === index + 1 ? 'active' : ''} onClick={() => setStep(index + 1)} key={label}><b>{index + 1}</b><span>{label}</span></button>)}</div><div className="demo-sales-grid"><section><strong>{labels[step - 1]}</strong>{step === 1 ? <div className="demo-sale-clients">{demoPeople.slice(0, 4).map(client => <button className={selected === client.id ? 'active' : ''} onClick={() => setSelected(client.id)} key={client.id}><i>{client.initials}</i><span><b>{client.name}</b><small>{client.detail}</small></span><em>{client.status}</em></button>)}</div> : <div className="demo-form-placeholder"><label>{step === 2 ? 'Produto ou serviço' : step === 3 ? 'Quantidade de parcelas' : 'Resumo da operação'}</label><div>{step === 2 ? 'Notebook Profissional' : step === 3 ? '6 parcelas de R$ 400,00' : `${demoPeople.find(item => item.id === selected)?.name || 'Cliente demonstrativo'} · R$ 2.400,00`}</div><label>{step === 2 ? 'Valor da venda' : 'Condição demonstrativa'}</label><div>{step === 2 ? 'R$ 2.400,00' : 'Sem registro ou persistência'}</div></div>}</section><aside><small>RESUMO</small><span>Cliente <b>{demoPeople.find(item => item.id === selected)?.name || 'Não selecionado'}</b></span><span>Valor <b>R$ 2.400,00</b></span><span>Parcelas <b>6x R$ 400,00</b></span><button onClick={() => setStep(current => current === 4 ? 1 : current + 1)} disabled={step === 1 && !selected}>{step === 4 ? 'Recomeçar' : 'Continuar'}</button></aside></div></div>
}

function Installments({ installments, paid, receive }) {
  return <div className="demo-view"><PageHeading eyebrow="RECEBIMENTOS" title="Parcelas" action="Todas ▾"/><div className="demo-installment-list"><header><span>Cliente</span><span>Vencimento</span><span>Valor</span><span>Status</span><span>Ação</span></header>{installments.map(item => { const isPaid = paid.has(item.id); return <div key={item.id}><span className="demo-person"><i>{item.short}</i><b>{item.client}</b><small>Parcela {item.part}</small></span><span>{item.due}/2026</span><strong>{formatChargeMoney(item.value)}</strong><Status>{isPaid ? 'Recebida' : item.status}</Status><button disabled={isPaid} onClick={() => receive(item)}>{isPaid ? 'Concluído' : 'Receber'}</button></div>})}</div></div>
}

function Subscriptions() {
  return <div className="demo-view"><PageHeading eyebrow="RECEBIMENTOS RECORRENTES" title="Mensalidades" action="+ Nova mensalidade"/><div className="demo-summary-cards"><article><i>✓</i><strong>1</strong><span>Mensalidade ativa</span></article><article><i>▣</i><strong>R$ 299,90</strong><span>Valor mensal recorrente</span></article><article><i>▱</i><strong>6</strong><span>Parcelas geradas</span></article></div><h4 className="demo-subtitle">Lista de mensalidades</h4><div className="demo-simple-table"><header><span>Cliente</span><span>Plano</span><span>Valor total</span><span>Status</span></header><div><b>EE · Empresa Exemplo Demo</b><span>Plano de Manutenção Premium</span><strong>R$ 1.799,40</strong><Status>Em dia</Status></div></div></div>
}

function Calendar() {
  const days = Array.from({ length: 14 }, (_, index) => index + 1)
  const [selectedDay, setSelectedDay] = useState(1)
  return <div className="demo-view"><PageHeading eyebrow="VENCIMENTOS, RECEBIMENTOS E ATRASOS" title="Calendário" action={`Dia ${selectedDay} · Agosto de 2026`}/><div className="demo-calendar-summary"><span><b>R$ 2.124,90</b>A receber no mês</span><span><b>R$ 850,00</b>Recebido no mês</span><span><b>4</b>Vencimentos</span></div><div className="demo-calendar-grid"><header>{['DOM','SEG','TER','QUA','QUI','SEX','SÁB'].map(day => <b key={day}>{day}</b>)}</header><main>{days.map(day => <button type="button" className={selectedDay === day ? 'active' : ''} aria-pressed={selectedDay === day} onClick={() => setSelectedDay(day)} key={day}><b>{day}</b>{day === 1 && <><i className="late">4 atrasadas</i><i>R$ 2,1 mil</i></>}{day === 4 && <i className="paid">R$ 850,00</i>}</button>)}</main></div></div>
}

function Billing() {
  const [selected, setSelected] = useState(null)
  return <div className="demo-view"><PageHeading eyebrow="COMUNICAÇÃO DE RECEBIMENTOS" title="Cobranças"/><div className="demo-billing-grid"><section><strong>Parcelas para cobrança</strong><small>Selecione um cliente para gerar uma mensagem demonstrativa.</small>{demoPeople.map(client => <button className={selected === client.id ? 'active' : ''} onClick={() => setSelected(client.id)} key={client.id}><i>{client.initials}</i><span><b>{client.name}</b><small>1 contrato · parcelas em aberto</small></span><em>⌄</em></button>)}</section><aside><i>▢</i><strong>{selected ? demoPeople.find(item => item.id === selected).name : 'Selecione uma parcela'}</strong><span>{selected ? 'Olá! Identificamos uma parcela próxima do vencimento. Esta é apenas uma prévia e não será enviada.' : 'A mensagem será gerada automaticamente.'}</span>{selected && <button onClick={() => setSelected(null)}>Limpar prévia</button>}</aside></div></div>
}

export default function ChargeDemo() {
  const [view, setView] = useState('overview')
  const [theme, setTheme] = useState('dark')
  const [paid, setPaid] = useState(() => new Set())
  const [notice, setNotice] = useState('')
  const title = useMemo(() => views.find(item => item.id === view)?.label || 'Visão geral', [view])
  const receive = item => { setPaid(current => new Set(current).add(item.id)); setNotice(`${item.client}: ${formatChargeMoney(item.value)} recebido apenas nesta demonstração.`) }
  const screens = { overview: <Overview installments={chargeInstallments} paid={paid} theme={theme} setView={setView}/>, clients: <Clients/>, sales: <Sales/>, installments: <Installments installments={chargeInstallments} paid={paid} receive={receive}/>, subscriptions: <Subscriptions/>, calendar: <Calendar/>, billing: <Billing/> }
  return <div className={`charge-demo theme-${theme}`} data-testid="charge-demo"><DemoNav view={view} setView={setView}/><div className="demo-workspace"><DemoHeader title={title} theme={theme} setTheme={setTheme}/><main>{screens[view]}</main><footer><i/> Wireframe funcional · nenhum dado é salvo</footer></div>{notice && <button className="demo-notice" onClick={() => setNotice('')} aria-label="Fechar aviso">✓ {notice}<span>×</span></button>}</div>
}
