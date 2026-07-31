import { MessageCircle } from 'lucide-react'

const msg = encodeURIComponent('Olá! Encontrei o contato pelo site da BASE4 e gostaria de conhecer melhor os serviços da empresa.')

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/5518996460473?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com BASE4 SYSTEMS pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl border border-white/20"
      style={{
        background: '#16a34a',
        boxShadow: '0 4px 24px rgba(34,197,94,0.32)',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
    >
      <MessageCircle size={26} color="white" fill="white" />
    </a>
  )
}
