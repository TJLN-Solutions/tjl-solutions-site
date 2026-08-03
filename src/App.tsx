import { useEffect } from "react"
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Frentes from './components/Frentes'
import Numeros from './components/Numeros'
import Sobre from './components/Sobre'
import Equipe from './components/Equipe'
import Sistemas from './components/Sistemas'
import Servicos from './components/Servicos'
import ComoFunciona from './components/ComoFunciona'
import Prazos from './components/Prazos'
import Investimento from './components/Investimento'
import Portfolio from './components/Portfolio'
import AntesDepois from './components/AntesDepois'
import Tecnologias from './components/Tecnologias'
import Depoimentos from './components/Depoimentos'
import Diferenciais from './components/Diferenciais'
import Dicas from './components/Dicas'
import Faq from './components/Faq'
import Contato from './components/Contato'
import Localizacao from './components/Localizacao'
import CtaFinal from './components/CtaFinal'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ScrollProgress from './components/ScrollProgress'
import LoadingExperience from "./components/LoadingExperience"
import AmbientExperience from "./components/AmbientExperience"
import { empresa, faq, team } from "./data"

/** Dados estruturados: ajudam a loja física a aparecer na busca local. */
const structuredData = () => [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: empresa.nome,
    description:
      "Manutenção de computadores e desenvolvimento de sites, sistemas e automações em Bilac, SP.",
    address: {
      "@type": "PostalAddress",
      streetAddress: empresa.endereco,
      addressLocality: empresa.cidade,
      addressRegion: empresa.uf,
      postalCode: empresa.cep,
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: empresa.lat, longitude: empresa.lng },
    telephone: `+${team[0].phone}`,
    foundingDate: empresa.fundacao,
    areaServed: ["Bilac", "Birigui", "Araçatuba", "Penápolis", "Lins"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: { "@type": "Answer", text: item.resposta },
    })),
  },
]

export default function App() {
  useEffect(() => {
    document.documentElement.dataset.siteRelease = '9'
    document.title = 'BASE4 SYSTEMS | Sites, Sistemas, Automações e Manutenção em Bilac'
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.content = content
    }
    setMeta('description', 'A BASE4 SYSTEMS desenvolve sites, sistemas e automações, além de oferecer manutenção de computadores em Bilac, São Paulo. Conheça o BASE4 Charge.')
    setMeta('keywords', 'empresa de tecnologia Bilac, desenvolvimento de sites Bilac, manutenção computadores Bilac, BASE4 Charge, automação empresas')
    setMeta('og:title', 'BASE4 SYSTEMS | Sites, Sistemas, Automações e Manutenção em Bilac', true)
    setMeta('og:description', 'Soluções digitais completas para empresas em Bilac, SP.', true)
    setMeta('og:type', 'website', true)

    // Um único bloco por render: remove o anterior antes de inserir, para o
    // HMR não empilhar cópias do mesmo JSON-LD durante o desenvolvimento.
    const previous = document.getElementById('base4-jsonld')
    previous?.remove()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'base4-jsonld'
    script.textContent = JSON.stringify(structuredData())
    document.head.appendChild(script)
    return () => script.remove()
  }, [])

  return (
    <>
      <LoadingExperience />
      <AmbientExperience />
      <ScrollProgress />
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Frentes />
        <Numeros />
        <Sobre />
        <Equipe />
        <Sistemas />
        <Servicos />
        <ComoFunciona />
        <Prazos />
        <Investimento />
        <Portfolio />
        <AntesDepois />
        <Tecnologias />
        <Depoimentos />
        <Diferenciais />
        <Dicas />
        <Faq />
        <Contato />
        <Localizacao />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
