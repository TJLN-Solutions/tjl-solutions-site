import { useState, type CSSProperties } from "react"
import { AppWindow, ArrowUpRight, Check, ChevronDown, Cog, MonitorSmartphone, ReceiptText, Server } from "lucide-react"

/**
 * Cena da orbe, recriada a partir da arte de abertura (public/og.png): esfera
 * de dados com "BASE4" no centro, gaiola 3D de meridianos girando ao redor,
 * cone de projeção descendo até uma plataforma, e cinco módulos em moldura
 * octogonal ligados por trilhas de circuito.
 *
 * A coreografia é comandada pelo progresso da rolagem: no início existe só a
 * orbe sobre a plataforma; conforme se rola, a gaiola gira e os módulos saem
 * da borda da esfera, um a um, cada um puxando a sua trilha.
 *
 * Os módulos abrem no clique. Só um por vez: cinco cards abertos numa cena com
 * orbe, trilhas e plataforma viraria ruído, e o visitante perde a referência do
 * que está lendo.
 */

type Modulo = {
  label: string
  desc: string
  icon: typeof AppWindow
  /** Ângulo em graus na tela: 0 é à direita, valores negativos sobem. */
  angulo: number
  raio: number
  /** Progresso em que este módulo começa a sair da orbe. */
  inicio: number
  itens: string[]
  href: string
  /** Para que lado o conteúdo abre, para não sair da cena. */
  lado: "esq" | "dir" | "centro"
}

/** Um no topo e dois pares espelhados: a simetria é o que organiza a cena. */
const MODULOS: Modulo[] = [
  {
    label: "Sites",
    desc: "Presença digital",
    icon: AppWindow,
    angulo: -90,
    raio: 252,
    inicio: 0.06,
    lado: "centro",
    href: "#servicos",
    itens: ["Sites institucionais", "Landing pages", "Catálogos digitais", "Otimização para busca"],
  },
  {
    label: "Sistemas",
    desc: "Sob medida",
    icon: MonitorSmartphone,
    angulo: -150,
    raio: 288,
    inicio: 0.2,
    lado: "esq",
    href: "#servicos",
    itens: ["ERP e CRM sob medida", "Painéis e dashboards", "Integração entre sistemas", "Código-fonte entregue"],
  },
  {
    label: "Automações",
    desc: "Fluxos sozinhos",
    icon: Cog,
    angulo: -30,
    raio: 288,
    inicio: 0.34,
    lado: "dir",
    href: "#servicos",
    itens: ["Cobrança automática", "Relatórios programados", "Mensagens no WhatsApp", "Integração entre serviços"],
  },
  {
    label: "Hardware",
    desc: "Diagnóstico",
    icon: Server,
    angulo: 150,
    raio: 288,
    inicio: 0.48,
    lado: "esq",
    href: "#frentes",
    itens: ["Formatação e limpeza", "Troca de peça e upgrade", "Recuperação de dados", "Montagem de PC"],
  },
  {
    label: "BASE4 Charge",
    desc: "Cobrança",
    icon: ReceiptText,
    angulo: 30,
    raio: 288,
    inicio: 0.62,
    lado: "dir",
    href: "#sistemas",
    itens: ["Monitoramento em tempo real", "Relatórios automáticos", "Alertas configuráveis", "Painel web responsivo"],
  },
]

/**
 * Raio da orbe no espaço não escalado da cena, em px.
 *
 * Módulos e trilhas partem DAQUI, não do centro: é o que evita qualquer coisa
 * desenhada sobre a esfera.
 */
const RAIO_ORBE = 162

/** Quanto de rolagem cada módulo leva para completar a saída. */
const DURACAO = 0.26

/** Abaixo disto o módulo ainda está saindo e não deve aceitar clique. */
const LIMIAR_CLIQUE = 0.7

const clamp01 = (valor: number) => Math.min(1, Math.max(0, valor))

/** Desacelera no fim, no mesmo espírito do --ease do projeto. */
const suavizar = (t: number) => 1 - Math.pow(1 - t, 3)

/** Meridianos da gaiola: seis anéis girados em Y formam a esfera. */
const MERIDIANOS = [0, 30, 60, 90, 120, 150]

/** Paralelos: anéis deitados, deslocados no eixo Z, encolhendo nas pontas. */
const PARALELOS = [
  { z: 0, escala: 1 },
  { z: 52, escala: 0.86 },
  { z: -52, escala: 0.86 },
  { z: 88, escala: 0.6 },
  { z: -88, escala: 0.6 },
]

export default function OrbStage({ progress }: { progress: number }) {
  const [aberto, setAberto] = useState<string | null>(null)

  // A cena inteira se aproxima de leve; a gaiola é que gira de verdade.
  const escala = 0.94 + suavizar(clamp01(progress / 0.35)) * 0.06
  const giroY = -18 + progress * 248
  const giroX = 14 - progress * 9
  /** A luz da plataforma cresce com a rolagem, então ela participa da cena. */
  const luz = 0.4 + suavizar(progress) * 0.6
  /**
   * Deslocamento da textura de pontos da esfera: é o que faz a própria orbe
   * girar, e não só a gaiola. Texto não pode girar em 3D e seguir legível,
   * então "BASE4" fica parado na frente e quem gira é a superfície atrás.
   */
  const superficie = progress * 320

  return (
    <div
      className="orb-wrap"
      style={{
        "--escala": escala.toFixed(3),
        "--orb-r": `${RAIO_ORBE}px`,
        "--rot-y": `${giroY.toFixed(2)}deg`,
        "--rot-x": `${giroX.toFixed(2)}deg`,
        "--luz": luz.toFixed(3),
        "--superficie": `${superficie.toFixed(1)}px`,
      } as CSSProperties}
    >
      {/* A cena e os módulos são irmãos, não pai e filho.
          É o que permite ao celular tirar os módulos da órbita e empilhá-los
          embaixo como lista, sem quebrar a matemática de centro no desktop. */}
      <div className="orb-stage">
      {/* Campo de anéis pontilhados ao fundo */}
      <div className="orb-field" aria-hidden="true">
        <span style={{ "--anel": 1 } as CSSProperties} />
        <span style={{ "--anel": 2 } as CSSProperties} />
        <span style={{ "--anel": 3 } as CSSProperties} />
      </div>

      {/* Trilhas: camada própria, ATRÁS da orbe */}
      <div className="orb-links" aria-hidden="true">
        {MODULOS.map((modulo) => {
          const local = suavizar(clamp01((progress - modulo.inicio) / DURACAO))
          return (
            <span
              key={modulo.label}
              className="orb-link"
              style={{
                "--dist": `${((modulo.raio - RAIO_ORBE) * local).toFixed(1)}px`,
                "--ang": `${modulo.angulo}deg`,
                "--local": local.toFixed(3),
              } as CSSProperties}
            />
          )
        })}
      </div>

      {/* Orbe */}
      <div className="orb-core" aria-hidden="true">
        <span className="orb-core-halo" />
        <span className="orb-core-sphere">
          <span className="orb-core-dots" />
          <span className="orb-core-shine" />
        </span>

        {/* Gaiola 3D em preserve-3d: os anéis passam por trás e pela frente da
            esfera quando giram, e é isso que dá volume. */}
        <div className="orb-cage">
          {MERIDIANOS.map((graus) => (
            <span key={`m${graus}`} className="orb-meridian" style={{ "--m": `${graus}deg` } as CSSProperties} />
          ))}
          {PARALELOS.map((paralelo) => (
            <span
              key={`p${paralelo.z}`}
              className="orb-parallel"
              style={{ "--z": `${paralelo.z}px`, "--s": paralelo.escala } as CSSProperties}
            />
          ))}
        </div>

        <strong className="orb-core-label">BASE4</strong>
      </div>

      {/* Projeção e plataforma. Anéis reais deitados em rotateX, empilhados em
          alturas diferentes — disco 3D, não elipse achatada. */}
      <div className="orb-cone" aria-hidden="true" />
      <div className="orb-base" aria-hidden="true">
        <div className="orb-base-disc">
          <span className="orb-base-ring" style={{ "--d": "100%", "--h": "0px" } as CSSProperties} />
          <span className="orb-base-ring" style={{ "--d": "76%", "--h": "11px" } as CSSProperties} />
          <span className="orb-base-ring is-live" style={{ "--d": "48%", "--h": "22px" } as CSSProperties} />
          <span className="orb-base-glow" />
        </div>
      </div>
      </div>

      {/* Módulos: camada própria, À FRENTE da orbe. Partem da borda dela. */}
      <div className="orb-cards">
        {MODULOS.map((modulo) => {
          const Icon = modulo.icon
          const local = suavizar(clamp01((progress - modulo.inicio) / DURACAO))
          const radianos = (modulo.angulo * Math.PI) / 180
          const alcance = RAIO_ORBE + (modulo.raio - RAIO_ORBE) * local
          const estaAberto = aberto === modulo.label
          // Enquanto sai, o card não recebe clique: alvo que se move é alvo
          // que o visitante erra.
          const clicavel = local > LIMIAR_CLIQUE

          return (
            <article
              key={modulo.label}
              className="orb-card"
              data-open={estaAberto}
              data-lado={modulo.lado}
              style={{
                "--x": `${(Math.cos(radianos) * alcance).toFixed(1)}px`,
                "--y": `${(Math.sin(radianos) * alcance).toFixed(1)}px`,
                "--local": local.toFixed(3),
                pointerEvents: clicavel ? "auto" : "none",
                zIndex: estaAberto ? 3 : 1,
              } as CSSProperties}
            >
              <div className="orb-card-inner">
                <button
                  type="button"
                  className="orb-card-head"
                  aria-expanded={estaAberto}
                  onClick={() => setAberto(estaAberto ? null : modulo.label)}
                >
                  <span className="orb-card-icon"><Icon aria-hidden="true" /></span>
                  <span className="orb-card-titles">
                    <span className="orb-card-label">{modulo.label}</span>
                    <small>{modulo.desc}</small>
                  </span>
                  <ChevronDown className="orb-card-chevron" aria-hidden="true" />
                </button>

                <div className="orb-card-body">
                  <ul>
                    {modulo.itens.map((item) => (
                      <li key={item}><Check aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                  <a href={modulo.href} onClick={() => setAberto(null)}>
                    Ver detalhes <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
