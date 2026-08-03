import { useEffect, useRef, useState, type FocusEvent } from "react"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"
import { menuLinks, navGroups } from "../data"
import ThemeToggle from "./ThemeToggle"

/**
 * Barra enxuta: marca, quatro entradas, um botão de ação e o alternador de
 * tema como ícone. As entradas ficam junto da marca, não centralizadas — soltas
 * no meio deixavam um vazio grande à esquerda.
 *
 * Cada entrada abre um cartão com as seções internas do assunto. O trigger é
 * link de verdade: quem clica vai para a seção, mesmo que o cartão nunca abra.
 */

/** Todas as âncoras da barra, achatadas, para saber qual grupo está ativo. */
const anchors = navGroups.flatMap((group) =>
  [group.href, ...group.items.map((item) => item.href)].map((href) => ({ href, group: group.href })),
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [active, setActive] = useState("")

  /**
   * O fechamento é atrasado de propósito: entre o link e o cartão existe um
   * vão de alguns pixels, e sem essa folga o cartão fecharia no meio do
   * caminho do cursor.
   */
  const closeTimer = useRef<number | undefined>(undefined)

  const openNow = (href: string) => {
    window.clearTimeout(closeTimer.current)
    setOpenGroup(href)
  }

  const closeSoon = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 160)
  }

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 56)
      // Percorre de baixo para cima: vale a última âncora cujo topo já passou
      // da linha de leitura.
      let current = ""
      for (let i = anchors.length - 1; i >= 0; i--) {
        const section = document.querySelector(anchors[i].href)
        if (section && section.getBoundingClientRect().top <= 180) {
          current = anchors[i].group
          break
        }
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      setOpenGroup(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  /** Só fecha quando o foco sai do grupo inteiro, não ao pular link a link. */
  const onGroupBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
    setOpenGroup(null)
  }

  return (
    <>
      <header className={`control-bar ${scrolled ? "is-compact" : ""}`}>
        <a href="#inicio" className="control-logo" aria-label="BASE4 SYSTEMS — início">
          <span className="control-logo-mark">B</span>
          <span>BASE4 <b>SYSTEMS</b></span>
        </a>

        <nav className="control-nav" aria-label="Navegação principal">
          {navGroups.map((group) => {
            const isOpen = openGroup === group.href
            return (
              <div
                key={group.href}
                className="nav-group"
                onMouseEnter={() => openNow(group.href)}
                onMouseLeave={closeSoon}
                onFocus={() => openNow(group.href)}
                onBlur={onGroupBlur}
              >
                <a
                  href={group.href}
                  className={active === group.href ? "active" : ""}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {group.label}
                  <ChevronDown aria-hidden="true" />
                </a>

                {isOpen && (
                  <div className="nav-pop">
                    <p className="nav-pop-label">{group.short} · {group.label}</p>
                    {group.items.map((item) => (
                      <a key={item.href} href={item.href} onClick={() => setOpenGroup(null)}>
                        <strong>{item.label}</strong>
                        <small>{item.desc}</small>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="control-actions">
          <ThemeToggle />
          <a href="#contato" className="control-cta">
            Falar com a equipe <ArrowUpRight size={15} />
          </a>
          <button
            type="button"
            className="control-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-command-menu"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu de seções"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* `inert` tira o painel fechado da ordem de tabulação: sem isso, o Tab
          entra em treze links invisíveis antes de chegar ao conteúdo. */}
      <aside
        id="mobile-command-menu"
        className={`mobile-command ${menuOpen ? "is-open" : ""}`}
        inert={!menuOpen}
      >
        <p className="mobile-command-label">TODAS AS SEÇÕES</p>
        {menuLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            <span>{link.short}</span><strong>{link.label}</strong><ArrowUpRight />
          </a>
        ))}
        <ThemeToggle />
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="command-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        />
      )}
    </>
  )
}
