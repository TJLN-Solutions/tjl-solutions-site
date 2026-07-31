import useInView from "../hooks/useInView"

type Props = {
  index: string
  eyebrow: string
  title: string
  description?: string
}

/**
 * Cabeçalho de seção, com revelação própria.
 *
 * Antes só os grids de conteúdo animavam e o título aparecia pronto — o que
 * deixava a seção começando morta e ganhando vida depois. Como todas as
 * seções usam este componente, revelar aqui acerta as vinte de uma vez: o
 * código, o título e a descrição entram escalonados pelo `nth-child` do `.rv`.
 */
export default function SectionHeader({ index, eyebrow, title, description }: Props) {
  const [ref, inView] = useInView<HTMLElement>()

  return (
    <header ref={ref} className={`section-heading rv ${inView ? "is-in" : ""}`}>
      <div className="section-heading-code"><span>{index}</span>{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  )
}
