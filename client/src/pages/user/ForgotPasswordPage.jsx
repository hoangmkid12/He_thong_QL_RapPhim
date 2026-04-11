import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'

const STEPS = { EMAIL: 1, OTP: 2, RESET: 3, DONE: 4 }

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.EMAIL)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await api.post('/auth/forgot-password/send-otp', { email })
      toast.success('Mã OTP đã gửi về email!')
      setStep(STEPS.OTP)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi gửi OTP') }
    finally { setLoading(false) }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    if (!otp) return
    setLoading(true)
    try {
      await api.post('/auth/forgot-password/verify-otp', { email, otp })
      toast.success('Xác thực thành công!')
      setStep(STEPS.RESET)
    } catch (err) { toast.error(err.response?.data?.message || 'OTP không đúng') }
    finally { setLoading(false) }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    if (pass1.length < 6) { toast.error('Mật khẩu ít nhất 6 ký tự'); return }
    if (pass1 !== pass2) { toast.error('Mật khẩu nhập lại không khớp'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password/reset', { email, pass1, pass2 })
      toast.success('Đổi mật khẩu thành công!')
      setStep(STEPS.DONE)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi đổi mật khẩu') }
    finally { setLoading(false) }
  }

  const stepStyle = (s) => ({
    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.875rem',
    background: step >= s ? '#e50914' : 'rgba(255,255,255,.1)',
    color: step >= s ? '#fff' : '#878797',
  })

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔑</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Quên mật khẩu</h1>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {['Email', 'OTP', 'Mật khẩu'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={stepStyle(i + 1)}>{i + 1}</div>
              <span style={{ fontSize: '0.8rem', color: step > i ? '#e8e8f0' : '#878797' }}>{label}</span>
              {i < 2 && <div style={{ width: 32, height: 2, background: step > i + 1 ? '#e50914' : 'rgba(255,255,255,.1)', borderRadius: 1 }} />}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 28 }}>
            {step === STEPS.EMAIL && (
              <form onSubmit={sendOtp}>
                <div className="form-group">
                  <label className="form-label">Email đã đăng ký</label>
                  <input className="form-control" type="email" placeholder="email@gmail.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                  {loading ? '⏳ Đang gửi...' : '📧 Gửi mã OTP'}
                </button>
              </form>
            )}

            {step === STEPS.OTP && (
              <form onSubmit={verifyOtp}>
                <p style={{ color: '#878797', fontSize: '0.875rem', marginBottom: 16 }}>
                  Nhập mã 6 số đã gửi về <strong style={{ color: '#e8e8f0' }}>{email}</strong>
                </p>
                <div className="form-group">
                  <label className="form-label">Mã OTP</label>
                  <input className="form-control" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} style={{ fontSize: '1.5rem', letterSpacing: 8, textAlign: 'center' }} autoFocus required />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                  {loading ? '⏳ Đang xác thực...' : '✅ Xác nhận OTP'}
                </button>
                <button type="button" onClick={() => setStep(STEPS.EMAIL)} className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }}>← Đổi email</button>
              </form>
            )}

            {step === STEPS.RESET && (
              <form onSubmit={resetPassword}>
                <div className="form-group">
                  <label className="form-label">Mật khẩu mới</label>
                  <input type="password" className="form-control" placeholder="••••••••" value={pass1} onChange={e => setPass1(e.target.value)} autoFocus required />
                </div>
                <div className="form-group">
                  <label className="form-label">Nhập lại mật khẩu</label>
                  <input type="password" className="form-control" placeholder="••••••••" value={pass2} onChange={e => setPass2(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                  {loading ? '⏳ Đang xử lý...' : '🔐 Đổi mật khẩu'}
                </button>
              </form>
            )}

            {step === STEPS.DONE && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#22c55e' }}>Thành công!</h3>
                <p style={{ color: '#878797', marginBottom: 20 }}>Mật khẩu đã được đổi. Vui lòng đăng nhập lại.</p>
                <Link to="/dang-nhap" className="btn btn-primary" style={{ display: 'inline-block' }}>Đăng nhập ngay</Link>
              </div>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.875rem' }}>
          <Link to="/dang-nhap" style={{ color: '#878797', textDecoration: 'none' }}>← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
