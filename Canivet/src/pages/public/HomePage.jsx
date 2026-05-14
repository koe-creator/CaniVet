import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/Layout/Navbar'

const css = `
.home { padding-top: 64px; }
.hero {
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%);
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 60px 40px; flex-direction: column; gap: 24px;
}
.hero-badge {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  border-radius: 100px; padding: 6px 18px; color: rgba(255,255,255,.8);
  font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;
}
.hero h1 { font-size: 56px; font-weight: 800; color: #fff; letter-spacing: -2px; line-height: 1.1; }
.hero h1 span { color: #60a5fa; }
.hero p { font-size: 18px; color: rgba(255,255,255,.65); max-width: 560px; line-height: 1.7; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.btn-hero-primary {
  padding: 14px 28px; background: #fff; color: #1d4ed8;
  border: none; border-radius: 10px; font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.btn-hero-primary:hover { background: #eff6ff; }
.btn-hero-secondary {
  padding: 14px 28px; background: rgba(255,255,255,.1);
  border: 1.5px solid rgba(255,255,255,.3); border-radius: 10px;
  font-size: 15px; font-weight: 600; color: #fff; cursor: pointer; transition: all .15s;
}
.btn-hero-secondary:hover { background: rgba(255,255,255,.2); }
.features { padding: 80px 40px; max-width: 1100px; margin: 0 auto; }
.features h2 { font-size: 36px; font-weight: 800; text-align: center; margin-bottom: 12px; }
.features-sub { text-align: center; color: var(--text-muted); font-size: 16px; margin-bottom: 48px; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feat-card {
  background: #fff; border: 1px solid var(--border); border-radius: 14px;
  padding: 28px; transition: border-color .15s;
}
.feat-card:hover { border-color: var(--primary); }
.feat-icon { font-size: 28px; margin-bottom: 14px; }
.feat-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.feat-card p  { font-size: 14px; color: var(--text-muted); line-height: 1.6; }
@media(max-width:768px){ .hero h1{font-size:36px} .features-grid{grid-template-columns:1fr} }
`

const FEATURES = [
  { icon:'👥', title:'Gestion de Clientes',    desc:'Registra y administra la informacion de todos tus clientes y sus mascotas.' },
  { icon:'📅', title:'Agenda de Citas',        desc:'Organiza y gestiona las citas con facilidad. Visualiza la agenda del dia.' },
  { icon:'💊', title:'Inventario',             desc:'Controla el stock de productos y medicamentos. Alertas de bajo inventario.' },
  { icon:'💳', title:'Pagos y Facturacion',    desc:'Registra pagos, genera reportes financieros y controla los ingresos.' },
  { icon:'📊', title:'Reportes',               desc:'Analiza el rendimiento de tu clinica con reportes visuales y exportables.' },
  { icon:'🏥', title:'Multi-sucursal',         desc:'Gestiona multiples sucursales desde un solo panel de administracion.' },
]

export const HomePage = () => {
  const navigate = useNavigate()

  return (
    <>
      <style>{css}</style>
      <Navbar />
      <div className="home">
        <section className="hero">
          <div className="hero-badge">🐾 Sistema Veterinario Profesional</div>
          <h1>Gestiona tu clinica<br /><span>veterinaria</span> con CaniVet</h1>
          <p>La plataforma todo-en-uno para administrar clientes, mascotas, citas, inventario y pagos de tu clinica.</p>
          <div className="hero-btns">
            <button className="btn-hero-primary" onClick={() => navigate('/login')}>Ingresar al sistema</button>
          </div>
        </section>

        <section className="features">
          <h2>Todo lo que necesitas</h2>
          <p className="features-sub">Una plataforma completa para administrar tu clinica veterinaria</p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feat-card" key={f.title}>
                <div className="feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
