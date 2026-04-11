import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from './Header'
import Footer from './Footer'
import AdminSidebar from './AdminSidebar'

export function UserLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</main>
      <Footer />
    </>
  )
}

export function AdminLayout({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!isAdmin) return <Navigate to="/dang-nhap" replace />
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">{children}</div>
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!isAuthenticated) return <Navigate to="/dang-nhap" replace />
  return children
}
