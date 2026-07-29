import { useEffect, useRef } from 'react'
import { ChevronDown, ArrowRight, Cpu, Users, Building2 } from 'lucide-react'

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLE_COUNT = 80
    type Particle = {
      x: number; y: number; vx: number; vy: number; r: number; alpha: number
    }

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
    }))

    const CONNECTION_DIST = 140

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(14,165,233,${p.alpha})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.35
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(14,165,233,${opacity})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  )
}

const badges = [
  { icon: Cpu, label: 'Soluções personalizadas' },
  { icon: Users, label: 'Atendimento especializado' },
  { icon: Building2, label: 'Tecnologia para empresas' },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 60% 40%, rgba(3,105,161,0.18) 0%, rgba(2,8,20,0) 60%), radial-gradient(ellipse at 20% 80%, rgba(14,165,233,0.08) 0%, transparent 50%), #020814',
      }}
    >
      <ParticleCanvas />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.6), transparent)',
          animation: 'scan-line 8s linear infinite',
          top: 0,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 flex flex-col items-start">
        {/* Badge */}
        <div
          className="mb-8 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.35)',
            color: '#7dd3fc',
            fontFamily: "'Exo 2', sans-serif",
            letterSpacing: '0.12em',
          }}
        >
          ⚡ Empresa de Tecnologia — Bilac, SP
        </div>

        {/* Headline */}
        <h1
          className="max-w-4xl font-black leading-tight mb-6"
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            color: 'white',
          }}
        >
          Tecnologia que{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #7dd3fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'flicker 8s infinite',
            }}
          >
            transforma ideias
          </span>{' '}
          em soluções
        </h1>

        {/* Sub */}
        <p
          className="max-w-2xl text-lg leading-relaxed mb-10"
          style={{ color: 'rgba(226,240,255,0.7)', fontFamily: "'Inter', sans-serif" }}
        >
          Desenvolvemos sistemas, sites e automações que ajudam empresas a modernizar processos,
          melhorar o atendimento e alcançar novos resultados.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-16">
          <a href="#sistemas" className="btn-primary">
            Conheça nossas soluções <ArrowRight size={16} />
          </a>
          <a href="#contato" className="btn-outline">
            Solicite um orçamento
          </a>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-4">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                background: 'rgba(14,165,233,0.07)',
                border: '1px solid rgba(14,165,233,0.2)',
                color: '#7dd3fc',
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              <Icon size={15} className="opacity-80" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#sobre"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs opacity-50 hover:opacity-80 transition-opacity no-underline"
        style={{ color: '#7dd3fc', fontFamily: "'Exo 2', sans-serif" }}
        aria-label="Rolar para baixo"
      >
        <span>Explorar</span>
        <ChevronDown size={20} style={{ animation: 'float 2s ease-in-out infinite' }} />
      </a>
    </section>
  )
}
