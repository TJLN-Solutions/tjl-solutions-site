import { useState, useEffect } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre a TJL', href: '#sobre' },
  { label: 'Sistemas', href: '#sistemas' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Contato', href: '#contato' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#inicio')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      const sections = links.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive('#' + sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(2,8,20,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(14,165,233,0.15)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 no-underline">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 0 14px rgba(14,165,233,0.5)' }}
          >
            <Zap size={16} fill="white" color="white" />
          </div>
          <span
            className="font-extrabold text-lg tracking-wider"
            style={{ fontFamily: "'Exo 2', sans-serif", color: 'white' }}
          >
            TJL <span style={{ color: '#0ea5e9' }}>Tecnologia</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 no-underline"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                color: active === link.href ? '#0ea5e9' : 'rgba(226,240,255,0.75)',
                background: active === link.href ? 'rgba(14,165,233,0.1)' : 'transparent',
                borderBottom: active === link.href ? '2px solid #0ea5e9' : '2px solid transparent',
                letterSpacing: '0.03em',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#contato" className="btn-primary hidden md:inline-flex text-sm py-2 px-5">
          Fale com nossa equipe
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="menu-mobile"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="menu-mobile"
          className="md:hidden glass border-t"
          style={{ borderColor: 'rgba(14,165,233,0.15)' }}
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium no-underline border-b"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: active === link.href ? '#0ea5e9' : 'rgba(226,240,255,0.8)',
                  borderColor: 'rgba(14,165,233,0.08)',
                  letterSpacing: '0.03em',
                }}
              >
                {link.label}
              </a>
            ))}
            <a href="#contato" onClick={() => setOpen(false)} className="btn-primary mt-4 justify-center">
              Fale com nossa equipe
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
