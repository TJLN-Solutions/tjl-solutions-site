import { useMemo, useState } from 'react'
import { chargeChart, chargeClients, chargeInstallments, formatChargeMoney } from './chargeDemoData.js'

const views = [
  { id: 'overview', label: 'Visão geral', icon: '▦' },
  { id: 'clients', label: 'Clientes', icon: '♧' },
  { id: 'installments', label: 'Parcelas', icon: '▱' },
]

const passiveNav = [
  ['Vendas e contratos', '▧'],
  ['Mensalidades', '□'],
  ['Calendário', '▦'],
  ['Cobranças', '♢'],
]

function Status({ children }) {
  return <span className={`demo-status status-${children.toLowerCase().replace(' ', '-')}`}>{children}</span>
}

function DemoNav({ view, setView }) {
  const navButton = id => views.find(item => item.id === id)
  return <aside className="demo-sidebar" aria-label="Navegação da demonstração">
    <div className="demo-app-mark"><img src="/assets/brand/base4-symbol-transparent.png" alt=""/><b>CHARGE</b></div>
    <button className={view === 'overview' ? 'active' : ''} onClick={() => setView('overview')}><i>{navButton('overview').icon}</i><span>Visão geral</span></button>
    <p>CARTEIRA</p>
    <button className={view === 'clients' ? 'active' : ''} onClick={() => setView('clients')}><i>{navButton('clients').icon}</i><span>Clientes</span></button>
    <span className="demo-passive"><i>{passiveNav[0][1]}</i>{passiveNav[0][0]}</span>
    <p>RECEBIMENTOS</p>
    <button className={view === 'installments' ? 'active' : ''} onClick={() => setView('installments')}><i>{navButton('installments').icon}</i><span>Parcelas</span></button>
    {passiveNav.slice(1).map(item => <span className="demo-passive" key={item[0]}><i>{item[1]}</i>{item[0]}</span>)}
    <div className="demo-sidebar-footer"><span>◉ <b>Ajuda</b></span><span><i>TD</i><b>Thiago Demo</b></span></div>
  </aside>
}

function DemoHeader({ title, theme, setTheme }) {
  return <header className="demo-header"><span className="demo-menu">☰</span><strong>{title}</strong><div className="demo-search">⌕ <span>Pesquisar...</span></div><span className="demo-bell">♧<b>9</b></span><button className="demo-theme-toggle" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label={`Ativar modo ${theme === 'dark' ? 'claro' : 'escuro'}`}>{theme === 'dark' ? '☼' : '◐'}</button><span className="demo-user"><b>Thiago Demo</b><small>MASTER_ADMIN · B4 Charge Demo</small></span><i className="demo-user-avatar">T</i></header>
}

function LinePlot({ values, variant }) {
  return <div className={`demo-line demo-line-${variant}`}>{values.slice(0, -1).map((value, index) => {
    const next = values[index + 1]
    const width = 100 / (values.length - 1)
    const rise = next - value
    const length = Math.sqrt(width ** 2 + rise ** 2)
    const angle = -Math.atan2(rise, width) * 180 / Math.PI
    return <i key={index} style={{ left: `${index * width}%`, bottom: `${value}%`, width: `${length}%`, transform: `rotate(${angle}deg)` }}/>
  })}</div>
}

function Overview({ installments, paid }) {
  const paidValue = [...paid].reduce((sum, id) => sum + (installments.find(item => item.id === id)?.value || 0), 0)
  const overduePaid = [...paid].reduce((sum, id) => {
    const item = installments.find(entry => entry.id === id)
    return sum + (item?.status === 'Vencida' ? item.value : 0)
  }, 0)
  const received = 850 + paidValue
  const kpis = [
    ['clock', '◷', formatChargeMoney(0), 'A receber hoje', '0 parcelas'],
    ['received', '↗', formatChargeMoney(received), 'Recebido no mês', `${1 + paid.size} confirmados`],
    ['open', '▣', formatChargeMoney(Math.max(0, 20524.5 - paidValue)), 'Em aberto', `${32 - paid.size} parcelas`],
    ['late', '△', formatChargeMoney(Math.max(0, 6124.9 - overduePaid)), 'Atrasado', `${8 - (overduePaid ? 1 : 0)} parcelas`],
    ['clients', '♧', '8', 'Clientes', 'cadastrados'],
    ['contracts', '▧', '6', 'Contratos ativos', 'contratos'],
  ]
  return <div className="demo-view demo-overview">
    <div className="demo-page-title"><strong>Visão Geral</strong><span>Dados demonstrativos</span><b>＋ Nova venda</b></div>
    <div className="demo-welcome"><span>B4</span><div><strong>Bem-vindo ao B4 Charge</strong><small>Dados financeiros da empresa em uma prévia navegável</small></div><aside><small>Vencendo hoje</small><strong>0</strong></aside></div>
    <div className="demo-kpis">{kpis.map(item => <article className={`kpi-${item[0]}`} key={item[3]}><i>{item[1]}</i><strong>{item[2]}</strong><small>{item[3]}</small><span>{item[4]}</span></article>)}</div>
    <div className="demo-grid">
      <article className="demo-chart"><header><strong>Recebimentos e previsão</strong><span><i/> Recebido · <b/> Previsto</span></header><div className="demo-plot"><LinePlot values={chargeChart} variant="received"/><LinePlot values={[24, 31, 39, 74, 43, 43]} variant="forecast"/></div><footer><span>jun</span><span>jul</span><span>ago</span><span>set</span><span>out</span><span>nov</span></footer></article>
      <article className="demo-donut-card"><header>Situação das parcelas</header><div className="demo-donut"><i/></div><footer><span><i/>Em aberto</span><span><i/>Recebida</span><span><i/>Atrasada</span></footer></article>
    </div>
  </div>
}

function Clients() {
  const [selected, setSelected] = useState(1)
  return <div className="demo-view"><div className="demo-view-heading"><div><small>CARTEIRA · DADOS DE EXEMPLO</small><strong>Clientes</strong></div><span className="demo-prototype-action">+ Novo cliente</span></div><div className="demo-client-list">{chargeClients.map(client => <button key={client.id} className={selected === client.id ? 'active' : ''} onClick={() => setSelected(client.id)}><i>{client.initials}</i><span><b>{client.name}</b><small>{client.detail}</small></span><Status>{client.status}</Status><strong>{formatChargeMoney(client.balance)}</strong></button>)}</div><div className="demo-client-foot"><span>{chargeClients.length} clientes demonstrativos</span><span>Selecione uma linha para explorar</span></div></div>
}

function Installments({ installments, paid, receive }) {
  return <div className="demo-view"><div className="demo-view-heading"><div><small>RECEBIMENTOS</small><strong>Parcelas</strong></div><span className="demo-filter">Todas ▾</span></div><div className="demo-installment-list"><header><span>Cliente</span><span>Vencimento</span><span>Valor</span><span>Status</span><span>Ação</span></header>{installments.map(item => { const isPaid = paid.has(item.id); return <div key={item.id}><span className="demo-person"><i>{item.short}</i><b>{item.client}</b><small>Parcela {item.part}</small></span><span>{item.due}/2026</span><strong>{formatChargeMoney(item.value)}</strong><Status>{isPaid ? 'Recebida' : item.status}</Status><button disabled={isPaid} onClick={() => receive(item)}>{isPaid ? 'Concluído' : 'Receber'}</button></div>})}</div></div>
}

export default function ChargeDemo() {
  const [view, setView] = useState('overview')
  const [theme, setTheme] = useState('dark')
  const [paid, setPaid] = useState(() => new Set())
  const [notice, setNotice] = useState('')
  const title = useMemo(() => views.find(item => item.id === view)?.label || 'Visão geral', [view])
  const receive = item => {
    setPaid(current => new Set(current).add(item.id))
    setNotice(`${item.client}: ${formatChargeMoney(item.value)} recebido apenas nesta demonstração.`)
  }
  return <div className={`charge-demo theme-${theme}`} data-testid="charge-demo"><DemoNav view={view} setView={setView}/><div className="demo-workspace"><DemoHeader title={title} theme={theme} setTheme={setTheme}/><main>{view === 'overview' && <Overview installments={chargeInstallments} paid={paid}/>} {view === 'clients' && <Clients/>} {view === 'installments' && <Installments installments={chargeInstallments} paid={paid} receive={receive}/>}</main><footer><i/> Wireframe funcional · nenhum dado é salvo</footer></div>{notice && <button className="demo-notice" onClick={() => setNotice('')} aria-label="Fechar aviso">✓ {notice}<span>×</span></button>}</div>
}
