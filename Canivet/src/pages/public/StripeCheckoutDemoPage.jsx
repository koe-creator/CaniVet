import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fmtMoney } from '../../utils/formatters'

const css = `
.stripe-demo-wrap { min-height: 100vh; background: linear-gradient(180deg, #0f172a 0%, #111827 100%); padding: 40px 16px; }
.stripe-demo-shell { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: 1.15fr .85fr; gap: 24px; align-items: start; }
.stripe-panel, .stripe-summary { background: #fff; border-radius: 20px; box-shadow: 0 24px 50px rgba(15, 23, 42, .24); overflow: hidden; }
.stripe-head { background: linear-gradient(135deg, #635bff 0%, #4f46e5 100%); color: #fff; padding: 22px 24px; }
.stripe-head strong { display: block; font-size: 24px; font-weight: 800; letter-spacing: -.4px; }
.stripe-head span { display: block; margin-top: 6px; color: rgba(255,255,255,.82); font-size: 14px; }
.stripe-body { padding: 24px; }
.stripe-banner { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; border-radius: 14px; padding: 14px 16px; font-size: 14px; line-height: 1.6; margin-bottom: 18px; }
.stripe-grid { display: grid; gap: 14px; }
.stripe-field label { display: block; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
.stripe-input { width: 100%; border: 1px solid #dbe3ef; border-radius: 12px; padding: 13px 14px; font-size: 14px; color: #334155; background: #f8fafc; }
.stripe-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.stripe-btn { width: 100%; border: none; border-radius: 14px; padding: 15px 18px; font-size: 15px; font-weight: 800; cursor: pointer; }
.stripe-btn.primary { background: #635bff; color: #fff; }
.stripe-btn.secondary { background: #e2e8f0; color: #334155; margin-top: 10px; }
.stripe-note { margin-top: 16px; font-size: 13px; color: #64748b; line-height: 1.7; }
.stripe-summary { padding: 24px; }
.stripe-summary h2 { font-size: 20px; margin: 0 0 16px; color: #0f172a; }
.stripe-amount { font-size: 34px; font-weight: 800; color: #0f172a; margin-bottom: 18px; }
.stripe-list { display: grid; gap: 12px; }
.stripe-item { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; color: #475569; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
.stripe-item strong { color: #0f172a; }
.stripe-ref { margin-top: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; font-size: 13px; color: #475569; }
.stripe-ref strong { display: block; color: #0f172a; margin-bottom: 4px; }
@media (max-width: 900px) { .stripe-demo-shell { grid-template-columns: 1fr; } }
`

const parseAmount = (value) => {
  const amount = Number(value || 0)
  return Number.isFinite(amount) ? amount : 0
}

export const StripeCheckoutDemoPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const data = useMemo(() => ({
    client: searchParams.get('client') || 'Cliente',
    concept: searchParams.get('concept') || 'Servicio veterinario',
    pet: searchParams.get('pet') || 'No especificada',
    reference: searchParams.get('ref') || 'SIM-0000',
    branch: searchParams.get('branch') || 'CaniVet',
    amount: parseAmount(searchParams.get('amount')),
  }), [searchParams])

  return (
    <>
      <style>{css}</style>
      <div className="stripe-demo-wrap">
        <div className="stripe-demo-shell">
          <section className="stripe-panel">
            <div className="stripe-head">
              <strong>Stripe</strong>
              <span>Entorno visual simulado para CaniVet</span>
            </div>
            <div className="stripe-body">
              <div className="stripe-banner">
                Este enlace es una demostracion visual. No procesara cargos reales ni pedira pago verdadero.
              </div>
              <div className="stripe-grid">
                <div className="stripe-field">
                  <label>Cliente</label>
                  <input className="stripe-input" value={data.client} readOnly />
                </div>
                <div className="stripe-field">
                  <label>Concepto</label>
                  <input className="stripe-input" value={data.concept} readOnly />
                </div>
                <div className="stripe-row">
                  <div className="stripe-field">
                    <label>Tarjeta</label>
                    <input className="stripe-input" value="4242 4242 4242 4242" readOnly />
                  </div>
                  <div className="stripe-field">
                    <label>Fecha</label>
                    <input className="stripe-input" value="12 / 34" readOnly />
                  </div>
                </div>
                <div className="stripe-row">
                  <div className="stripe-field">
                    <label>CVC</label>
                    <input className="stripe-input" value="123" readOnly />
                  </div>
                  <div className="stripe-field">
                    <label>Nombre</label>
                    <input className="stripe-input" value={data.client} readOnly />
                  </div>
                </div>
              </div>
              <button className="stripe-btn primary" type="button" onClick={() => navigate('/servicios')}>
                Volver a CaniVet
              </button>
              <button className="stripe-btn secondary" type="button" onClick={() => window.close()}>
                Cerrar esta ventana
              </button>
              <p className="stripe-note">
                La confirmacion o el cambio de estado del cobro se sigue manejando manualmente dentro del panel administrativo de CaniVet.
              </p>
            </div>
          </section>

          <aside className="stripe-summary">
            <h2>Resumen del cobro</h2>
            <div className="stripe-amount">{fmtMoney(data.amount)}</div>
            <div className="stripe-list">
              <div className="stripe-item"><span>Cliente</span><strong>{data.client}</strong></div>
              <div className="stripe-item"><span>Mascota</span><strong>{data.pet}</strong></div>
              <div className="stripe-item"><span>Servicio</span><strong>{data.concept}</strong></div>
              <div className="stripe-item"><span>Sucursal</span><strong>{data.branch}</strong></div>
            </div>
            <div className="stripe-ref">
              <strong>Referencia simulada</strong>
              <div>{data.reference}</div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
