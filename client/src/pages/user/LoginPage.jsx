import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ user: '', pass: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.user || !form.pass) { setError('Vui lòng điền đầy đủ thông tin'); return }
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Chào mừng trở lại, ${user.name}! 🎬`)
      if (user.vai_tro >= 1) navigate('/admin')
      else navigate(from)
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎬</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Galaxy<span style={{ color: '#e50914' }}>Studio</span></h1>
          <p style={{ color: '#878797', marginTop: 4 }}>Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Card */}
        <div className="card" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
          <div className="card-body" style={{ padding: 32 }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: 'rgba(229,9,20,.12)', border: '1px solid rgba(229,9,20,.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#ff6b6b', fontSize: '0.875rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <input
                  className="form-control"
                  placeholder="Nhập tên đăng nhập"
                  value={form.user}
                  onChange={e => setForm(p => ({ ...p, user: e.target.value }))}
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  value={form.pass}
                  onChange={e => setForm(p => ({ ...p, pass: e.target.value }))}
                  autoComplete="current-password"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <Link to="/quen-mat-khau" style={{ color: '#e50914', fontSize: '0.875rem', textDecoration: 'none' }}>
                  Quên mật khẩu?
                </Link>
              </div>

              <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Đang đăng nhập...</> : '🔐 Đăng nhập'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24, color: '#878797', fontSize: '0.875rem' }}>
              Chưa có tài khoản?{' '}
              <Link to="/dang-ky" style={{ color: '#e50914', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#878797', fontSize: '0.8rem' }}>
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <span style={{ color: '#e50914' }}>Điều khoản sử dụng</span> của chúng tôi
        </p>
      </div>
    </div>
  )
}
