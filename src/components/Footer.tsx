import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react"
import { baseMessage, navLinks, team, whatsappUrl } from "../data"

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t footer-rule">
      <div className="content-shell">
        <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr_1fr] pb-12">
          <div>
            <div className="control-logo mb-5"><span className="control-logo-mark">B</span><span>BASE4 <b>SYSTEMS</b></span></div>
            <p className="max-w-sm text-sm leading-7 footer-text">Tecnologia, inovação e soluções personalizadas para movimentar o seu negócio.</p>
            <p className="mt-5 flex items-center gap-2 text-xs footer-meta"><MapPin size={14} className="footer-icon"/> Rua XV de Novembro, 283 — Bilac, SP</p>
          </div>
          <div>
            <p className="terminal-label mb-5">MAPA DO SISTEMA</p>
            <div className="grid gap-3">
              {navLinks.map((link) => <a key={link.href} href={link.href} className="footer-nav-link group flex items-center gap-2 text-sm transition"><span className="font-mono text-[8px] footer-icon">{link.short}</span>{link.label}<ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100"/></a>)}
            </div>
          </div>
          <div>
            <p className="terminal-label mb-5">CANAIS DIRETOS</p>
            <div className="grid gap-4">
              {team.map((member) => <a key={member.name} href={whatsappUrl(member.phone, baseMessage)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-b footer-rule pb-3 text-sm footer-strong"><span>{member.name}<small className="ml-2 text-[9px] footer-meta">{member.display}</small></span><MessageCircle size={14} className="footer-icon"/></a>)}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t footer-rule pt-7 text-[10px] tracking-widest footer-meta sm:flex-row">
          <p>© {new Date().getFullYear()} BASE4 SYSTEMS · TODOS OS DIREITOS RESERVADOS</p>
          <p>SISTEMA DESENVOLVIDO PELA BASE4</p>
        </div>
      </div>
    </footer>
  )
}
