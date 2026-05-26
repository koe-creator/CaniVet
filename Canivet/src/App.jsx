import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }    from './context/AuthContext'
import { AppConfigProvider } from './context/AppConfigContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ProtectedRoute }  from './router/ProtectedRoute'
import { HomePage }        from './pages/public/HomePage'
import { LoginPage }       from './pages/public/LoginPage'
import { RegisterPage }    from './pages/public/RegistrerPage'
import { ResetPasswordPage } from './pages/public/ResetPasswordPage'
import { ServicesPage }    from './pages/public/Services'
import { ContactPage }     from './pages/public/Contact'
import { StripeCheckoutDemoPage } from './pages/public/StripeCheckoutDemoPage'
import { AdminLayout }     from './components/layout/AdminLayout'
import { STAFF_ROLES } from './constants/access'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/registro"  element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/contacto"  element={<ContactPage />} />
            <Route path="/stripe-demo" element={<StripeCheckoutDemoPage />} />
            <Route path="/admin/*"   element={
              <ProtectedRoute allowedRoles={STAFF_ROLES}>
                <AppConfigProvider>
                  <AdminLayout />
                </AppConfigProvider>
              </ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
