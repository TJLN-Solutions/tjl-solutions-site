import { useEffect } from "react"
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Sobre from './components/Sobre'
import Sistemas from './components/Sistemas'
import Servicos from './components/Servicos'
import Diferenciais from './components/Diferenciais'
import Contato from './components/Contato'
import Localizacao from './components/Localizacao'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ScrollProgress from './components/ScrollProgress'
import LoadingExperience from "./components/LoadingExperience"
import AmbientExperience from "./components/AmbientExperience"

export default function App() {
  useEffect(() => {
    document.documentElement.dataset.siteRelease = '6'
    document.title = 'TJL Tecnologia | Sites, Sistemas, Automações e Manutenção em Bilac'
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.content = content
    }
    setMeta('description', 'A TJL Tecnologia desenvolve sites, sistemas e automações, além de oferecer manutenção de computadores em Bilac, São Paulo. Conheça o TJL Charge.')
    setMeta('keywords', 'empresa de tecnologia Bilac, desenvolvimento de sites Bilac, manutenção computadores Bilac, TJL Charge, automação empresas')
    setMeta('og:title', 'TJL Tecnologia | Sites, Sistemas, Automações e Manutenção em Bilac', true)
    setMeta('og:description', 'Soluções digitais completas para empresas em Bilac, SP.', true)
    setMeta('og:type', 'website', true)
  }, [])

  return (
    <>
      <LoadingExperience />
      <AmbientExperience />
      <ScrollProgress />
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Sobre />
        <Sistemas />
        <Servicos />
        <Diferenciais />
        <Contato />
        <Localizacao />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
