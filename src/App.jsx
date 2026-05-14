import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }    from './context/AuthContext'
import { ProtectedRoute }  from './router/ProtectedRoute'
import { HomePage }        from './pages/public/HomePage'
import { LoginPage }       from './pages/public/LoginPage'
import { RegisterPage }    from './pages/public/RegisterPage'
import { ServicesPage }    from './pages/public/ServicesPage'
import { ContactPage }     from './pages/public/ContactPage'
import { AdminLayout }     from './components/layout/AdminLayout'

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}