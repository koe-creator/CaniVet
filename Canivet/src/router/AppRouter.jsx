import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute }  from './ProtectedRoute'
import { LoginPage }       from '../Pages/public/LoginPage'
import { RegisterPage }    from '../Pages/public/RegistrerPage'
import { HomePage }        from '../Pages/public/HomePage'
import { AdminLayout }     from '../components/Layout/AdminLayout'

export const AppRouter = () => (
  <Routes>
    <Route path="/"         element={<HomePage />} />
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/registro" element={<RegisterPage />} />
    <Route path="/admin/*"  element={
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    }/>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
