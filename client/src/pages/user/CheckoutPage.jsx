import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useBooking } from '../../context/BookingContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { booking, totalPrice, reset } = useBooking()
  const { user } = useAuth()
  const [method, setMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [voucherCode, setVoucherCode] = useState('')
  const [applyingVoucher, setApplyingVoucher] = useState(false)

  const { setDiscount } = useBooking()

  const { movie, rap, selectedDate, showtime, seats, combos, seatPrice, comboPrice } = booking
  const total = totalPrice()

  if (!showtime || !seats?.length) {
    navigate('/phim'); return null
  }

  const handleConfirm = async () => {
    if (!method) return toast.error('Vui lòng chọn phương thức thanh toán')

    const payload = {
      id_phim: movie.id,
      id_lc: showtime.id_lc,
      id_gio: showtime.id_gio,
      id_rap: rap?.id,
      ghe: seats,
      combo: combos?.join(' | ') || '',
      gia_ghe: total,
      diem_doi: booking.diemDoi || 0,
      giam_gia_diem: booking.giamGiaDiem || 0,
      id_km: booking.idKm || null,
      phuong_thuc: method,
    }

    // Nếu chọn MoMo → chuyển sang cổng thanh toán MoMo
    if (method === 'Momo') {
      navigate('/thanh-toan/momo', { state: { payload } })
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/ve/dat-ve', payload)
      toast.success('Đặt vé thành công! 🎉')
      navigate('/xac-nhan', { state: { ticket: data.data } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt vé thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return toast.error('Vui lòng nhập mã voucher')
    setApplyingVoucher(true)
    try {
      const { data } = await api.get(`/voucher/check/${voucherCode.trim()}`)
      const v = data.data
      let discountAmount = 0
      const basePrice = seatPrice + comboPrice
      
      if (v.loai_giam === 'phan_tram') {
        discountAmount = Math.floor(basePrice * (v.gia_tri / 100))
      } else {
        discountAmount = v.gia_tri
      }
      
      setDiscount(discountAmount, v.id)
      toast.success(`Mã ${v.ma_voucher} đã được áp dụng! -${fmt(discountAmount)} ₫`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mã giảm giá không hợp lệ')
    } finally {
      setApplyingVoucher(false)
    }
  }

  const fmt = (n) => Number(n || 0).toLocaleString('vi-VN')

  const PAYMENT_METHODS = [
    { id: 'Momo', name: 'Ví MoMo', icon: '💖', desc: 'Thanh toán qua ứng dụng MoMo', color: '#ae1472' },
    { id: 'ATM', name: 'Thẻ ATM', icon: '🏦', desc: 'Thẻ ngân hàng nội địa / Internet Banking', color: '#005baa' },
    { id: 'Visa', name: 'Visa / Mastercard', icon: '💳', desc: 'Thẻ thanh toán quốc tế', color: '#1a1f71' },
  ]

  return (
    <div className="container page-enter" style={{ padding: '32px 16px', maxWidth: 850 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>💳 Xác nhận & Thanh toán</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Cột trái: Thông tin vé & Thanh toán */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                🎬 Thông tin đặt vé
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  {[
                    ['Phim', movie?.tieu_de],
                    ['Rạp', rap?.ten_rap],
                    ['Ngày chiếu', selectedDate],
                    ['Giờ chiếu', showtime?.thoi_gian_chieu?.slice(0,5)],
                    ['Phòng', showtime?.ten_phong],
                    ['Ghế', seats?.join(', ')],
                    combos?.length ? ['Combo', combos.join(' | ')] : null,
                  ].filter(Boolean).map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ padding: '8px 0', color: '#878797', width: 110 }}>{label}</td>
                      <td style={{ padding: '8px 0', fontWeight: 600 }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                💰 Chi tiết thanh toán
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#878797' }}>Ghế ({seats?.length} vé)</span>
                  <span>{fmt(seatPrice)} ₫</span>
                </div>
                {comboPrice > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#878797' }}>Combo</span>
                    <span>{fmt(comboPrice)} ₫</span>
                  </div>
                )}
                {booking.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#878797' }}>Khuyến mãi</span>
                    <span style={{ color: '#22c55e' }}>-{fmt(booking.discount)} ₫</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem' }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: '#e50914' }}>{fmt(total)} ₫</span>
                </div>
              </div>
            </div>
            <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                🎟️ Mã giảm giá / Voucher
              </h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập mã voucher..." 
                  value={voucherCode}
                  onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                  disabled={applyingVoucher || booking.idKm}
                />
                <button 
                  onClick={handleApplyVoucher}
                  disabled={applyingVoucher || !voucherCode || booking.idKm}
                  className="btn btn-secondary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {applyingVoucher ? '...' : (booking.idKm ? 'Đã áp dụng' : 'Áp dụng')}
                </button>
              </div>
              {booking.idKm && (
                <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#22c55e', display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ Đã áp dụng mã giảm giá</span>
                  <button 
                    onClick={() => { setDiscount(0, null); setVoucherCode('') }} 
                    style={{ background: 'none', border: 'none', color: '#878797', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Cột phải: Phương thức thanh toán & Xác nhận */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                💳 Phương thức thanh toán
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PAYMENT_METHODS.map(m => (
                  <div key={m.id} onClick={() => setMethod(m.id)}
                    style={{
                      padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                      border: method === m.id ? `2px solid ${m.color}` : '1px solid rgba(255,255,255,.1)',
                      background: method === m.id ? `${m.color}15` : 'rgba(255,255,255,.03)',
                      transition: '.2s', position: 'relative'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: method === m.id ? m.color : '#e8e8f0' }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#878797', marginTop: 2 }}>{m.desc}</div>
                      </div>
                    </div>
                    {method === m.id && (
                      <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: m.color, fontWeight: 800 }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="card-body" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 700, color: '#e8e8f0' }}>{user?.name}</div>
                    <div style={{ color: '#878797', fontSize: '0.75rem' }}>{user?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleConfirm}
                disabled={loading || !method}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', height: 54, fontSize: '1.1rem' }}
              >
                {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Đang xử lý...</> : '✅ Xác nhận thanh toán'}
              </button>
              <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ width: '100%' }}>← Quay lại</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
