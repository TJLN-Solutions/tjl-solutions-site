import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Clock, MapPin, MapPinned } from "lucide-react"
import { horarios } from "../data"

/**
 * Coordenadas conferidas contra o endereço no Google Maps. Os valores
 * anteriores (-21.4039 / -50.4720) caíam a ~430m do imóvel.
 */
const LAT = -21.4055942
const LNG = -50.4757713

/** Meia-largura da caixa do mapa em graus — ~450m de cada lado. */
const BOX = 0.004

const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`

/**
 * O endpoint `maps.google.com/maps?...&output=embed` usado antes foi
 * descontinuado: hoje responde 301 e o destino devolve 404 com
 * `x-frame-options: SAMEORIGIN`, então o navegador se recusa a exibir e
 * sobrava um bloco vazio de 430px. O embed do OpenStreetMap não exige
 * chave de API e responde 200 sem restrição de frame.
 */
const mapEmbedUrl =
  `https://www.openstreetmap.org/export/embed.html` +
  `?bbox=${LNG - BOX},${LAT - BOX},${LNG + BOX},${LAT + BOX}` +
  `&layer=mapnik&marker=${LAT},${LNG}`

export default function Localizacao() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loadMap, setLoadMap] = useState(false)
  const [failed, setFailed] = useState(false)

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

  const showMap = loadMap && !failed

  return (
    <section id="localizacao" className="map-strip">
      <div className="map-strip-grid" aria-hidden="true" />
      <div className="content-shell location-hub">
        <div className="map-strip-content">
          <div className="map-pin"><MapPin /><i /><span /></div>
          <div><small>BASE FÍSICA / BILAC.SP</small><h2>Rua XV de Novembro, 283</h2><p>Visite nossa loja e converse pessoalmente com a equipe.</p></div>
          <div className="map-data">
            <span>LAT<em>{LAT.toFixed(4)}</em></span>
            <span>LNG<em>{LNG.toFixed(4)}</em></span>
            <span>STATUS<em>ABERTO PARA VISITAS</em></span>
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Traçar rota <ArrowUpRight /></a>
        </div>

        {/* Horário de atendimento: quem procura a loja física precisa saber
            se vale sair de casa agora, antes de olhar o mapa. */}
        <div className="hours-block is-inline">
          <h3><Clock aria-hidden="true" />Horário de atendimento</h3>
          <dl className="hours-list">
            {horarios.map((item) => (
              <div key={item.dia}>
                <dt>{item.dia}</dt>
                <dd className={item.fechado ? "is-closed" : undefined}>{item.hora}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="embedded-map" ref={mapRef}>
          {showMap ? (
            <iframe
              title="Mapa da BASE4 SYSTEMS em Bilac"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // Se o provedor recusar o frame, o placeholder volta em vez de
              // deixar um bloco vazio na página.
              onError={() => setFailed(true)}
            />
          ) : (
            <button type="button" onClick={() => { setFailed(false); setLoadMap(true) }} className="map-placeholder">
              <MapPinned aria-hidden="true" />
              <strong>{failed ? "Não foi possível carregar o mapa" : "Visualizar localização no mapa"}</strong>
              <span>
                {failed
                  ? "Toque para tentar de novo ou use “Traçar rota” acima para abrir no Google Maps."
                  : "O mapa será carregado somente quando necessário para economizar memória e internet."}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
