import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }    from './context/AuthContext'
import { AppConfigProvider } from './context/AppConfigContext'
import { ProtectedRoute }  from './router/ProtectedRoute'
import { HomePage }        from './pages/public/HomePage'
import { LoginPage }       from './pages/public/LoginPage'
import { RegisterPage }    from './pages/public/RegistrerPage'
import { ServicesPage }    from './pages/public/Services'
import { ContactPage }     from './pages/public/Contact'
import { AdminLayout }     from './components/layout/AdminLayout'

export default function App() {
  return (
    <AuthProvider>
      <AppConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/registro"  element={<RegisterPage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/contacto"  element={<ContactPage />} />
            <Route path="/admin/*"   element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppConfigProvider>
    </AuthProvider>
  )
}
