import { useState, type CSSProperties } from "react"
import { Fan, MoveHorizontal, Sparkles } from "lucide-react"
import { antesDepois } from "../data"
import SectionHeader from "./SectionHeader"
import Counter from "./Counter"
import useInView from "../hooks/useInView"

/**
 * Comparador antes/depois de uma limpeza.
 *
 * O controle é um `input[type=range]` invisível sobre o quadro: arrasta com
 * o dedo, com o mouse e também anda com as setas do teclado, sem precisar de
 * listener de ponteiro nem de biblioteca.
 *
 * As imagens são ILUSTRATIVAS (ver `antesDepois` em data.ts) — o selo
 * "Ilustração" fica no próprio quadro para o visitante não confundir com
 * registro de um atendimento real.
 */
export default function AntesDepois() {
  const [pos, setPos] = useState(50)
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section id="antes-depois" className="experience-section">
      <div className="section-track" aria-hidden="true"><span>12</span></div>
      <div className="content-shell">
        <SectionHeader
          index="12"
          eyebrow="Antes e depois"
          title="Limpeza que faz diferença de verdade."
          description="Arraste o controle para comparar o resultado de uma manutenção preventiva completa."
        />

        <div ref={ref} className={`compare-stage ${inView ? "is-in" : ""}`}>
          <div className="compare" style={{ "--pos": `${pos}%` } as CSSProperties}>
            {/* Cada rótulo fica no canto do seu próprio lado. Centralizados,
                os dois cairiam no mesmo ponto e se sobreporiam sobre a alça. */}
            <div className="compare-side compare-after">
              <img src={antesDepois.depois} alt="Interior de um computador limpo, sem poeira nos coolers" loading="lazy" />
              <span className="compare-tag">
                <Sparkles aria-hidden="true" />
                Depois
              </span>
            </div>
            <div className="compare-side compare-before">
              <img src={antesDepois.antes} alt="Interior de um computador tomado por poeira nos coolers" loading="lazy" />
              <span className="compare-tag">
                <Fan aria-hidden="true" />
                Antes
              </span>
            </div>
            <input
              className="compare-range"
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(event) => setPos(Number(event.target.value))}
              aria-label="Comparar antes e depois da limpeza"
              aria-valuetext={`${pos}% do resultado após a limpeza`}
            />
            <span className="compare-handle" aria-hidden="true">
              <i><MoveHorizontal /></i>
            </span>
            <span className="compare-illus">Ilustração</span>
          </div>

          <div className="gains-grid">
            {antesDepois.ganhos.map((ganho) => (
              <div className="gain-card" key={ganho.label}>
                <strong>
                  {/* O sinal e a unidade ficam fora do contador: ele anima
                      só o número, e "−15 °C" precisa das duas pontas. */}
                  <span className="gain-sign">−</span>
                  <Counter value={Number(ganho.valor.replace(/[^\d]/g, ""))} />
                  <span className="gain-unit">{ganho.valor.includes("°C") ? "°C" : "%"}</span>
                </strong>
                <span>{ganho.label}</span>
              </div>
            ))}
          </div>
          <p className="compare-note">
            Imagens ilustrativas. Ganhos típicos de uma limpeza com troca de pasta térmica —
            o resultado varia conforme o equipamento e o tempo sem manutenção.
          </p>
        </div>
      </div>
    </section>
  )
}
