type Props = {
  index: string
  eyebrow: string
  title: string
  description?: string
}

export default function SectionHeader({ index, eyebrow, title, description }: Props) {
  return (
    <header className="section-heading">
      <div className="section-heading-code"><span>{index}</span>{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  )
}
