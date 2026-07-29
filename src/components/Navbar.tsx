import { useEffect, useState } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { navLinks } from "../data"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("#inicio")

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 56)
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const section = document.querySelector(navLinks[i].href)
        if (section && section.getBoundingClientRect().top <= 180) {
          setActive(navLinks[i].href)
          break
        }
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <header className={`control-bar ${scrolled ? "is-compact" : ""}`}>
        <a href="#inicio" className="control-logo" aria-label="TJL Tecnologia — início">
          <span className="control-logo-mark">T</span>
          <span>TJL <b>TECNOLOGIA</b></span>
        </a>

        <nav className="control-nav" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={active === link.href ? "active" : ""}>
              <span>{link.short}</span>{link.label}
            </a>
          ))}
        </nav>

        <a href="#contato" className="control-cta">Abrir canal <ArrowUpRight size={15} /></a>
        <button
          type="button"
          className="control-menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-command-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>

      <aside id="mobile-command-menu" className={`mobile-command ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-command-label">NAVEGAÇÃO / SISTEMA TJL</div>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            <span>{link.short}</span><strong>{link.label}</strong><ArrowUpRight />
          </a>
        ))}
        <div className="mobile-command-status"><i /> Sistema online · Bilac, SP</div>
      </aside>

      <nav className="side-rail" aria-label="Progresso da página">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className={active === link.href ? "active" : ""}>
            <span>{link.short}</span><em>{link.label}</em>
          </a>
        ))}
      </nav>
    </>
  )
}
