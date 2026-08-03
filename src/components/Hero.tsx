import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import OrbStage from "./OrbStage"
import useScrollProgress from "../hooks/useScrollProgress"

/**
 * Abertura em palco fixo.
 *
 * A seção mede várias telas de altura e o palco dentro dela fica preso no
 * topo: o texto permanece parado enquanto a cena da orbe reage à rolagem,
 * soltando um módulo por vez. Quem chega vê a orbe sozinha sobre a
 * plataforma; a composição da arte de abertura se monta conforme desce.
 *
 * Em tela estreita e com movimento reduzido, o hook devolve progresso 1 e o
 * CSS solta o palco: vira um hero comum, com a cena já montada.
 */
export default function Hero() {
  const [ref, progress] = useScrollProgress<HTMLElement>()

  return (
    <section id="inicio" className="hero-shell" ref={ref}>
      <div className="hero-stage">
        <div className="hero-coordinates">
          21°24&apos;15.0&quot;S · 50°28&apos;19.2&quot;W <span>ONLINE</span>
        </div>

        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-kicker"><i /> Ecossistema digital · Bilac, SP</div>
            <p className="hero-brand">BASE4 SYSTEMS</p>
            {/* Uma linha por span para que entrem escalonadas. O contorno vale
                só para a linha do meio, por isso vem por classe e não pelo
                seletor de elemento. */}
            <h1>
              <span className="hero-line">Tecnologia que</span>
              <span className="hero-line is-outline">transforma ideias</span>
              <span className="hero-line">em soluções.</span>
            </h1>
            <p className="hero-description">
              Desenvolvemos sites, sistemas e automações, além de cuidar da manutenção de computadores,
              conectando estratégia e tecnologia para movimentar negócios.
            </p>
            <div className="hero-actions">
              <a href="#servicos" className="btn-signal">Explorar soluções <ArrowDownRight /></a>
              <a href="#contato" className="btn-line">Solicitar orçamento <ArrowUpRight /></a>
            </div>
            <div className="hero-metrics">
              <div><strong>05</strong><span>frentes conectadas</span></div>
              <div><strong>01</strong><span>equipe próxima</span></div>
              <div><strong>24/7</strong><span>ideias em movimento</span></div>
            </div>
          </div>

          <OrbStage progress={progress} />
        </div>

        {/* A barra enche conforme a cena se monta: diz que ainda há o que ver
            antes de a página seguir. */}
        <div className="hero-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress.toFixed(3)})` }} />
        </div>

        <a className="hero-scroll" href="#frentes">
          <span>ROLE PARA MONTAR</span><i />
        </a>
      </div>
    </section>
  )
}
