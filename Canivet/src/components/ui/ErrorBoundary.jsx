import { Component } from 'react'

const css = `
.app-crash {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f8fafc;
}
.app-crash-card {
  width: 100%;
  max-width: 620px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, .08);
}
.app-crash-card h1 {
  margin: 0 0 10px;
  font-size: 24px;
  color: #0f172a;
}
.app-crash-card p {
  margin: 0 0 14px;
  color: #475569;
  line-height: 1.6;
}
.app-crash-card pre {
  margin: 0 0 16px;
  padding: 14px;
  border-radius: 12px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  overflow: auto;
}
.app-crash-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.app-crash-actions button {
  padding: 11px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}
.app-crash-primary {
  background: #1d4ed8;
  color: #fff;
}
.app-crash-secondary {
  background: #e2e8f0;
  color: #0f172a;
}
`

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Ocurrio un error inesperado.',
    }
  }

  componentDidCatch(error) {
    console.error('[ErrorBoundary]', error)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.assign('/')
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <style>{css}</style>
          <div className="app-crash">
            <div className="app-crash-card">
              <h1>La pagina encontro un error</h1>
              <p>
                Esto no parece un problema de permisos de Supabase por si solo. Si vuelve a pasar,
                prueba tambien sin extensiones del navegador o traduccion automatica.
              </p>
              <pre>{this.state.errorMessage}</pre>
              <div className="app-crash-actions">
                <button className="app-crash-primary" onClick={this.handleReload}>Recargar</button>
                <button className="app-crash-secondary" onClick={this.handleGoHome}>Ir al inicio</button>
              </div>
            </div>
          </div>
        </>
      )
    }

    return this.props.children
  }
}
