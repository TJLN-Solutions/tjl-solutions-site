import { useEffect, useRef } from "react"

export default function AmbientExperience() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        glowRef.current?.style.setProperty("--pointer-x", `${event.clientX}px`)
        glowRef.current?.style.setProperty("--pointer-y", `${event.clientY}px`)
      })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-beam ambient-beam-a" />
      <div className="ambient-beam ambient-beam-b" />
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div ref={glowRef} className="cursor-glow" />
      <div className="ambient-noise" />
    </div>
  )
}
