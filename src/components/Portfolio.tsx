import { ArrowUpRight, Boxes, Scale, ShoppingBag, Workflow } from "lucide-react"
import { portfolio, portfolioDestaque } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * Projetos entregues. A miniatura é um bloco gráfico e não uma foto:
 * enquanto não houver captura real de cada projeto, um placeholder honesto
 * é melhor que imagem de banco que finge ser o trabalho da empresa. O
 * placeholder usa o próprio número do projeto como elemento gráfico — não
 * é decoração solta, é a mesma numeração que já organiza a lista, só que
 * grande o bastante pra preencher o quadro.
 *
 * O BASE4 Charge é exceção: tem captura real (`portfolioDestaque`) e é
 * produto próprio, não projeto de cliente — por isso abre a seção num
 * cartão à parte, maior, clicável, em vez de entrar como mais um item
 * da grade.
 */
const ICONES: Record<string, typeof Boxes> = {
  erp: Boxes,
  loja: ShoppingBag,
  juridico: Scale,
  automacao: Workflow,
}

export default function Portfolio() {
  const [featureRef, featureInView] = useInView<HTMLAnchorElement>()
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="portfolio" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>11</span></div>
      <div className="content-shell">
        <SectionHeader
          index="11"
          eyebrow="Portfólio"
          title="Projetos entregues, com código na mão do cliente."
          description="Cada entrega inclui código-fonte, documentação e suporte pós-entrega."
        />

        <a
          ref={featureRef}
          className={`work-feature rv rv-sides ${featureInView ? "is-in" : ""}`}
          href={portfolioDestaque.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="work-feature-media">
            <img src={portfolioDestaque.imagem} alt={`Painel do sistema ${portfolioDestaque.titulo}`} loading="lazy" />
            <div className="launch-badge work-feature-badge"><i /> Em breve</div>
          </div>
          <div className="work-feature-body">
            <span className="terminal-label">{portfolioDestaque.categoria}</span>
            <h3>{portfolioDestaque.titulo}</h3>
            <p>{portfolioDestaque.desc}</p>
            <span className="work-feature-link">Acessar o sistema <ArrowUpRight /></span>
          </div>
        </a>

        <div ref={ref} className={`work-grid rv ${inView ? "is-in" : ""}`}>
          {portfolio.map((projeto) => {
            // Só o card com captura real (`imagem`) é clicável — os
            // placeholders gráficos não levam a lugar nenhum, então viram
            // link seria prometer uma demonstração que não existe.
            const Tag = projeto.href ? "a" : "article"
            const linkProps = projeto.href
              ? { href: projeto.href, target: "_blank", rel: "noopener noreferrer" }
              : {}
            const Icone = ICONES[projeto.icone ?? ""] ?? Boxes

            return (
              <Tag className="work-card" key={projeto.numero} {...linkProps}>
                {projeto.imagem ? (
                  <div className="work-thumb work-thumb-photo">
                    <img src={projeto.imagem} alt={`Tela inicial do site ${projeto.titulo}`} loading="lazy" />
                  </div>
                ) : (
                  <div className="work-thumb" aria-hidden="true">
                    <span className="work-thumb-num">{projeto.numero}</span>
                    <span className="work-thumb-icon"><Icone /></span>
                  </div>
                )}
                <span className="work-thumb-code">PROJ. {projeto.numero}</span>
                <div className="work-body">
                  <span className="terminal-label">{projeto.categoria}</span>
                  <h3>{projeto.titulo}</h3>
                  <p>{projeto.desc}</p>
                  <ul className="work-stack">
                    {projeto.stack.map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
              </Tag>
            )
          })}
        </div>
      </div>
    </section>
  )
}
