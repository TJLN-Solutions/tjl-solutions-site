import { Code2, Wrench } from "lucide-react"
import { areas, type ServiceArea } from "../data"

const icons: Record<ServiceArea, typeof Wrench> = { hardware: Wrench, software: Code2 }
const order: ServiceArea[] = ["hardware", "software"]

type Props = {
  value: ServiceArea
  onChange: (area: ServiceArea) => void
  /** Liga os botões ao painel que eles controlam, para leitor de tela. */
  controls: string
}

/**
 * Alternador entre as duas frentes. Usado por "Como funciona" e por
 * "Prazos e garantia", que mostram conteúdos diferentes para hardware e
 * software e não caberiam lado a lado sem virar duas tabelas gigantes.
 */
export default function AreaTabs({ value, onChange, controls }: Props) {
  return (
    <div className="area-tabs" role="tablist" aria-label="Escolha a frente de atendimento">
      {order.map((area) => {
        const Icon = icons[area]
        const selected = value === area
        return (
          <button
            type="button"
            key={area}
            role="tab"
            id={`${controls}-tab-${area}`}
            aria-selected={selected}
            aria-controls={controls}
            className={selected ? "is-active" : ""}
            onClick={() => onChange(area)}
          >
            <Icon aria-hidden="true" />
            {areas[area].tab}
          </button>
        )
      })}
    </div>
  )
}
