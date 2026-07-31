import { useState, type CSSProperties } from "react"
import { Fan, Sparkles } from "lucide-react"
import { antesDepois } from "../data"
import SectionHeader from "./SectionHeader"
import useInView from "../hooks/useInView"

/**
 * Comparador antes/depois de uma limpeza.
 *
 * O controle é um `input[type=range]` invisível sobre o quadro: arrasta com
 * o dedo, com o mouse e também anda com as setas do teclado, sem precisar de
 * listener de ponteiro nem de biblioteca.
 *
 * As duas metades são desenhadas em CSS. Quando houver foto real de um
 * serviço, basta trocar o conteúdo de cada lado por uma <img>.
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

        <div ref={ref} className={`rv ${inView ? "is-in" : ""}`}>
          <div className="compare" style={{ "--pos": `${pos}%` } as CSSProperties}>
            {/* Cada rótulo fica no canto do seu próprio lado. Centralizados,
                os dois cairiam no mesmo ponto e se sobreporiam sobre a alça. */}
            <div className="compare-side compare-after">
              <span className="compare-tag">
                <Sparkles aria-hidden="true" />
                Depois
              </span>
            </div>
            <div className="compare-side compare-before">
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
            <span className="compare-handle" aria-hidden="true" />
          </div>

          <div className="gains-grid">
            {antesDepois.ganhos.map((ganho) => (
              <div className="gain-card" key={ganho.label}>
                <strong>{ganho.valor}</strong>
                <span>{ganho.label}</span>
              </div>
            ))}
          </div>
          <p className="compare-note">
            Ganhos típicos de uma limpeza com troca de pasta térmica. O resultado
            varia conforme o equipamento e o tempo sem manutenção.
          </p>
        </div>
      </div>
    </section>
  )
}
