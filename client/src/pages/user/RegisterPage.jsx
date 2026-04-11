import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Field = ({ field, label, type, placeholder, form, errors, setForm, setErrors }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      type={type || 'text'}
      className="form-control"
      placeholder={placeholder}
      value={form[field]}
      onChange={e => {
        setForm(p => ({ ...p, [field]: e.target.value }));
        setErrors(p => ({ ...p, [field]: '' }));
      }}
      style={errors[field] ? { borderColor: '#e50914' } : {}}
    />
    {errors[field] && <p style={{ fontSize: '0.75rem', color: '#e50914', marginTop: 4 }}>{errors[field]}</p>}
  </div>
);

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', dia_chi: '', email: '', user: '', pass: '', pass2: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!/^0[0-9]{9}$/.test(form.phone)) e.phone = 'SĐT không hợp lệ (10 số, bắt đầu bằng 0)'
    if (!form.dia_chi.trim()) e.dia_chi = 'Vui lòng nhập địa chỉ'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ'
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(form.user)) e.user = 'Tên đăng nhập 4-20 ký tự (chữ, số, _)'
    if (form.pass.length < 6) e.pass = 'Mật khẩu ít nhất 6 ký tự'
    if (form.pass !== form.pass2) e.pass2 = 'Mật khẩu nhập lại không khớp'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form)
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/dang-nhap')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const fieldProps = { form, errors, setForm, setErrors };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎬</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Tạo tài khoản</h1>
          <p style={{ color: '#878797', marginTop: 4 }}>Đăng ký để tích điểm và đặt vé dễ dàng hơn</p>
        </div>
        <div className="card">
          <div className="card-body" style={{ padding: 28 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field field="name" label="Họ và tên *" placeholder="Nguyễn Văn A" {...fieldProps} />
                </div>
                <Field field="phone" label="Số điện thoại *" placeholder="0901234567" {...fieldProps} />
                <Field field="email" label="Email *" type="email" placeholder="email@gmail.com" {...fieldProps} />
                <div style={{ gridColumn: '1/-1' }}>
                  <Field field="dia_chi" label="Địa chỉ *" placeholder="123 Đường ABC, TP.HCM" {...fieldProps} />
                </div>
                <Field field="user" label="Tên đăng nhập *" placeholder="username" {...fieldProps} />
                <div />
                <Field field="pass" label="Mật khẩu *" type="password" placeholder="••••••••" {...fieldProps} />
                <Field field="pass2" label="Nhập lại mật khẩu *" type="password" placeholder="••••••••" {...fieldProps} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                {loading ? '⏳ Đang đăng ký...' : '✅ Đăng ký'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 20, color: '#878797', fontSize: '0.875rem' }}>
              Đã có tài khoản? <Link to="/dang-nhap" style={{ color: '#e50914', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
