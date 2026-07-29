import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, MapPin, MapPinned } from "lucide-react"

const mapsUrl = "https://maps.google.com/?q=Rua+XV+de+Novembro,+283,+Bilac,+São+Paulo"
const mapEmbedUrl = "https://maps.google.com/maps?q=Rua+XV+de+Novembro,+283,+Bilac,+S%C3%A3o+Paulo&z=16&output=embed"

export default function Localizacao() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loadMap, setLoadMap] = useState(false)

  useEffect(() => {
    const element = mapRef.current
    if (!element || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadMap(true)
          observer.disconnect()
        }
      },
      { rootMargin: "240px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="localizacao" className="map-strip">
      <div className="map-strip-grid" aria-hidden="true" />
      <div className="content-shell location-hub">
        <div className="map-strip-content">
          <div className="map-pin"><MapPin /><i /><span /></div>
          <div><small>BASE FÍSICA / BILAC.SP</small><h2>Rua XV de Novembro, 283</h2><p>Visite nossa loja e converse pessoalmente com a equipe.</p></div>
          <div className="map-data"><span>LAT<em>-21.4039</em></span><span>LNG<em>-50.4720</em></span><span>STATUS<em>ABERTO PARA VISITAS</em></span></div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Traçar rota <ArrowUpRight /></a>
        </div>

        <div className="embedded-map" ref={mapRef}>
          {loadMap ? (
            <iframe
              title="Mapa da TJL Solutions em Bilac"
              src={mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <button type="button" onClick={() => setLoadMap(true)} className="map-placeholder">
              <MapPinned aria-hidden="true" />
              <strong>Visualizar localização no mapa</strong>
              <span>O mapa será carregado somente quando necessário para economizar memória e internet.</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
