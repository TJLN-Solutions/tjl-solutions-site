import { useMemo, useState } from 'react'
import { chargeChart, chargeClients, chargeInstallments, formatChargeMoney } from './chargeDemoData.js'

const views = [
  { id: 'overview', label: 'Visão geral', icon: '◫' },
  { id: 'clients', label: 'Clientes', icon: '◎' },
  { id: 'installments', label: 'Parcelas', icon: '▤' },
]

function Status({ children }) {
  return <span className={`demo-status status-${children.toLowerCase().replace(' ', '-')}`}>{children}</span>
}

function DemoNav({ view, setView }) {
  return <aside className="demo-sidebar" aria-label="Navegação da demonstração">
    <div className="demo-app-mark"><img src="/assets/brand/base4-symbol-transparent.png" alt=""/><b>B4</b></div>
    {views.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)} aria-label={item.label} title={item.label}><i>{item.icon}</i><span>{item.label}</span></button>)}
    <div className="demo-avatar">TD</div>
  </aside>
}

function DemoHeader({ title }) {
  return <header className="demo-header"><div><small>B4 CHARGE DEMO</small><strong>{title}</strong></div><div className="demo-search">⌕ <span>Pesquisar...</span></div><span className="demo-live"><i/> Dados locais</span></header>
}

function Overview({ installments, paid }) {
  const open = installments.filter(item => !paid.has(item.id))
  const overdue = open.filter(item => item.status === 'Vencida')
  const received = 850 + [...paid].reduce((sum, id) => sum + (installments.find(item => item.id === id)?.value || 0), 0)
  return <div className="demo-view demo-overview">
    <div className="demo-welcome"><span>B4</span><div><strong>Bem-vindo ao B4 Charge</strong><small>Dados financeiros em uma visão simples</small></div></div>
    <div className="demo-kpis">
      <article><small>Recebido no mês</small><strong>{formatChargeMoney(received)}</strong><span>↑ confirmado</span></article>
      <article><small>Em aberto</small><strong>{formatChargeMoney(open.reduce((sum, item) => sum + item.value, 0))}</strong><span>{open.length} parcelas</span></article>
      <article><small>Atrasado</small><strong>{formatChargeMoney(overdue.reduce((sum, item) => sum + item.value, 0))}</strong><span>{overdue.length} parcela</span></article>
    </div>
    <div className="demo-grid">
      <article className="demo-chart"><header><div><small>Recebimentos e previsão</small><strong>Últimos 6 meses</strong></div><span>Recebido</span></header><div className="demo-bars">{chargeChart.map((height, index) => <i key={index} style={{ height: `${height}%` }}><b style={{ height: `${Math.max(16, height - 22)}%` }}/></i>)}</div><footer><span>jun</span><span>jul</span><span>ago</span><span>set</span><span>out</span><span>nov</span></footer></article>
      <article className="demo-due"><header><small>Próximos vencimentos</small><button aria-label="Abrir parcelas">•••</button></header>{open.slice(0, 3).map(item => <div key={item.id}><i>{item.short}</i><span><b>{item.client}</b><small>{item.due} · {item.part}</small></span><strong>{formatChargeMoney(item.value)}</strong></div>)}</article>
    </div>
  </div>
}

function Clients() {
  const [selected, setSelected] = useState(1)
  return <div className="demo-view"><div className="demo-view-heading"><div><small>CARTEIRA</small><strong>Clientes</strong></div><button>+ Novo cliente</button></div><div className="demo-client-list">{chargeClients.map(client => <button key={client.id} className={selected === client.id ? 'active' : ''} onClick={() => setSelected(client.id)}><i>{client.initials}</i><span><b>{client.name}</b><small>{client.detail}</small></span><Status>{client.status}</Status><strong>{formatChargeMoney(client.balance)}</strong></button>)}</div><div className="demo-client-foot"><span>{chargeClients.length} clientes demonstrativos</span><span>Selecione uma linha para explorar</span></div></div>
}

function Installments({ installments, paid, receive }) {
  return <div className="demo-view"><div className="demo-view-heading"><div><small>RECEBIMENTOS</small><strong>Parcelas</strong></div><span className="demo-filter">Todas ▾</span></div><div className="demo-installment-list"><header><span>Cliente</span><span>Vencimento</span><span>Valor</span><span>Status</span><span>Ação</span></header>{installments.map(item => { const isPaid = paid.has(item.id); return <div key={item.id}><span className="demo-person"><i>{item.short}</i><b>{item.client}</b><small>Parcela {item.part}</small></span><span>{item.due}/2026</span><strong>{formatChargeMoney(item.value)}</strong><Status>{isPaid ? 'Recebida' : item.status}</Status><button disabled={isPaid} onClick={() => receive(item)}>{isPaid ? 'Concluído' : 'Receber'}</button></div>})}</div></div>
}

export default function ChargeDemo() {
  const [view, setView] = useState('overview')
  const [paid, setPaid] = useState(() => new Set())
  const [notice, setNotice] = useState('')
  const title = useMemo(() => views.find(item => item.id === view)?.label || 'Visão geral', [view])
  const receive = item => {
    setPaid(current => new Set(current).add(item.id))
    setNotice(`${item.client}: ${formatChargeMoney(item.value)} recebido apenas nesta demonstração.`)
  }
  return <div className="charge-demo" data-testid="charge-demo"><DemoNav view={view} setView={setView}/><div className="demo-workspace"><DemoHeader title={title}/><main>{view === 'overview' && <Overview installments={chargeInstallments} paid={paid}/>} {view === 'clients' && <Clients/>} {view === 'installments' && <Installments installments={chargeInstallments} paid={paid} receive={receive}/>}</main><footer><i/> Demonstração isolada · nenhum dado é salvo</footer></div>{notice && <button className="demo-notice" onClick={() => setNotice('')} aria-label="Fechar aviso">✓ {notice}<span>×</span></button>}</div>
}
