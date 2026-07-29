import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react"
import { baseMessage, navLinks, team } from "../data"

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t border-sky-300/10">
      <div className="content-shell">
        <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr_1fr] pb-12">
          <div>
            <div className="control-logo mb-5"><span className="control-logo-mark">T</span><span>TJL <b>SOLUTIONS</b></span></div>
            <p className="max-w-sm text-sm leading-7 text-slate-400">Tecnologia, inovação e soluções personalizadas para movimentar o seu negócio.</p>
            <p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><MapPin size={14} className="text-cyan-400"/> Rua XV de Novembro, 283 — Bilac, SP</p>
          </div>
          <div>
            <p className="terminal-label mb-5">MAPA DO SISTEMA</p>
            <div className="grid gap-3">
              {navLinks.map((link) => <a key={link.href} href={link.href} className="footer-nav-link group flex items-center gap-2 text-sm text-slate-400 transition"><span className="font-mono text-[8px] text-cyan-500">{link.short}</span>{link.label}<ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100"/></a>)}
            </div>
          </div>
          <div>
            <p className="terminal-label mb-5">CANAIS DIRETOS</p>
            <div className="grid gap-4">
              {team.map((member) => <a key={member.name} href={`https://wa.me/${member.phone}?text=${encodeURIComponent(baseMessage)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-b border-sky-300/10 pb-3 text-sm text-slate-300"><span>{member.name}<small className="ml-2 text-[9px] text-slate-600">{member.display}</small></span><MessageCircle size={14} className="text-cyan-400"/></a>)}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-sky-300/10 pt-7 text-[10px] tracking-widest text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} TJL SOLUTIONS · TODOS OS DIREITOS RESERVADOS</p>
          <p>SISTEMA DESENVOLVIDO PELA TJL</p>
        </div>
      </div>
    </footer>
  )
}
