import { Component } from 'react'

// Error boundaries só podem ser componentes de classe (ainda não existe
// equivalente em hooks). Cobre qualquer erro de runtime em qualquer seção
// da página (hooks de scroll, canvas do ChargeDemo, etc.) para que uma
// exceção não derrube o site inteiro numa tela em branco silenciosa.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('BASE4 SYSTEMS — erro não tratado:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="error-fallback" role="alert">
        <div className="error-fallback-card">
          <p className="error-fallback-kicker">BASE4 SYSTEMS</p>
          <h1>Algo deu errado ao carregar a página.</h1>
          <p>Isso é um problema nosso, não seu. Recarregue a página — se continuar acontecendo, fale direto com a gente pelo WhatsApp.</p>
          <div className="error-fallback-actions">
            <button type="button" onClick={() => location.reload()}>Recarregar página</button>
            <a href="https://wa.me/5518996464731?text=Ol%C3%A1!%20O%20site%20da%20BASE4%20apresentou%20um%20erro%20para%20mim." target="_blank" rel="noreferrer">Falar no WhatsApp</a>
          </div>
        </div>
      </div>
    )
  }
}
