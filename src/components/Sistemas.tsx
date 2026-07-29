import { ArrowUpRight, Bell, Check, Clock3, CreditCard, MessageCircle, Users } from "lucide-react"
import SectionHeader from "./SectionHeader"

const process = ["Cobrança criada", "Lembrete enviado", "Cliente notificado", "Pagamento identificado", "Status atualizado"]

export default function Sistemas() {
  const whatsapp = encodeURIComponent("Olá! Tenho interesse em saber mais sobre o TJL Charge.")
  return (
    <section id="sistemas" className="experience-section charge-section">
      <div className="section-track" aria-hidden="true"><span>03</span></div>
      <div className="content-shell">
        <SectionHeader
          index="03"
          eyebrow="Produto em desenvolvimento"
          title="TJL Charge"
          description="Cobranças automáticas, organização financeira e mais controle para o seu negócio."
        />

        <div className="charge-stage">
          <div className="charge-copy">
            <div className="launch-badge"><i /> Lançamento em breve</div>
            <p>
              Sistema criado para empresas, comércios e profissionais que trabalham com mensalidades,
              crediários ou parcelamentos próprios.
            </p>
            <p>
              Organize clientes, acompanhe pagamentos, automatize lembretes e controle cobranças em atraso
              em uma experiência simples e moderna.
            </p>
            <ul>
              <li><Check /> Cadastro e gerenciamento de clientes</li>
              <li><Check /> Controle de mensalidades e parcelamentos</li>
              <li><Check /> Histórico e relatórios financeiros</li>
              <li><Check /> Mensagens e lembretes automáticos</li>
            </ul>
            <a className="btn-signal" href={`https://wa.me/5518996460473?text=${whatsapp}`} target="_blank" rel="noopener noreferrer">
              Tenho interesse <ArrowUpRight />
            </a>
          </div>

          <div className="charge-dashboard" aria-label="Demonstração visual do painel TJL Charge">
            <div className="dash-top">
              <div><span className="dash-logo">T</span><strong>TJL Charge</strong></div>
              <div className="dash-live"><i /> SINCRONIZADO</div>
            </div>
            <div className="dash-metrics">
              <article><CreditCard /><span>Total de cobranças</span><strong>R$ 28.450</strong><small>+12,8% no mês</small></article>
              <article><Check /><span>Pagamentos recebidos</span><strong>R$ 21.820</strong><small>76,7% confirmado</small></article>
              <article><Clock3 /><span>Pendentes</span><strong>R$ 6.630</strong><small>18 cobranças</small></article>
            </div>
            <div className="dash-main">
              <div className="dash-chart">
                <div className="dash-card-title"><span>Fluxo financeiro</span><small>Últimos 7 meses</small></div>
                <svg viewBox="0 0 520 170" role="img" aria-label="Gráfico demonstrativo de crescimento financeiro">
                  <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#22d3ee" stopOpacity=".35"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0"/></linearGradient></defs>
                  <path className="chart-area" d="M10 145 C70 130 85 100 145 112 S225 70 275 88 S355 28 410 50 S470 18 510 20 L510 165 L10 165Z" />
                  <path className="chart-line" d="M10 145 C70 130 85 100 145 112 S225 70 275 88 S355 28 410 50 S470 18 510 20" />
                </svg>
                <div className="chart-labels"><span>JAN</span><span>FEV</span><span>MAR</span><span>ABR</span><span>MAI</span><span>JUN</span><span>JUL</span></div>
              </div>
              <div className="dash-activity">
                <div className="dash-card-title"><span>Atividade</span><Bell /></div>
                <div><i className="green" /><p><strong>Pagamento identificado</strong><small>Clínica Horizonte · agora</small></p></div>
                <div><i /><p><strong>Lembrete enviado</strong><small>Mercado Central · 4 min</small></p></div>
                <div><i className="violet" /><p><strong>Novo cliente</strong><small>Studio 13 · 18 min</small></p></div>
                <div className="dash-people"><Users /><span>128 clientes</span><MessageCircle /><span>47 mensagens</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="charge-process">
          {process.map((item, index) => (
            <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><i /><p>{item}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}
