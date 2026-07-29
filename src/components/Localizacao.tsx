import { ArrowUpRight, MapPin } from "lucide-react"

const mapsUrl = "https://maps.google.com/?q=Rua+XV+de+Novembro,+283,+Bilac,+São+Paulo"

export default function Localizacao() {
  return (
    <section id="localizacao" className="map-strip">
      <div className="map-strip-grid" aria-hidden="true" />
      <div className="content-shell map-strip-content">
        <div className="map-pin"><MapPin /><i /><span /></div>
        <div><small>BASE FÍSICA / BILAC.SP</small><h2>Rua XV de Novembro, 283</h2><p>Visite nossa loja e converse pessoalmente com a equipe.</p></div>
        <div className="map-data"><span>LAT<em>-21.4039</em></span><span>LNG<em>-50.4720</em></span><span>STATUS<em>ABERTO PARA VISITAS</em></span></div>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Traçar rota <ArrowUpRight /></a>
      </div>
    </section>
  )
}
