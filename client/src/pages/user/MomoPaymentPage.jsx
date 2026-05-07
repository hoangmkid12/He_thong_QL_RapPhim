import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'
import { useBooking } from '../../context/BookingContext'
import toast from 'react-hot-toast'

export default function MomoPaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { booking, totalPrice, reset } = useBooking()
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 phút
  const [processing, setProcessing] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)
  const timerRef = useRef(null)

  const payload = location.state?.payload
  const total = totalPrice()
  const fmt = (n) => Number(n || 0).toLocaleString('vi-VN')
  const orderId = useRef(Date.now().toString().slice(-10)).current

  useEffect(() => {
    if (!payload) { navigate('/thanh-toan'); return }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); toast.error('Đã hết thời gian thanh toán'); navigate('/thanh-toan'); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')

  const handlePay = async () => {
    setProcessing(true)
    // Giả lập chờ xử lý thanh toán MoMo
    await new Promise(r => setTimeout(r, 2000))
    try {
      const { data } = await api.post('/ve/dat-ve', payload)
      setPaySuccess(true)
      clearInterval(timerRef.current)
      toast.success('Thanh toán MoMo thành công! 🎉')
      setTimeout(() => navigate('/xac-nhan', { state: { ticket: data.data } }), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thanh toán thất bại')
      setProcessing(false)
    }
  }

  if (!payload) return null

  // Gradient MoMo
  const momoGrad = 'linear-gradient(135deg, #a50064 0%, #d8247e 50%, #ff6ea0 100%)'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
      {/* Header MoMo */}
      <div style={{ background: momoGrad, padding: '14px 0', boxShadow: '0 2px 20px rgba(165,0,100,.4)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 900 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', color: '#fff',
              letterSpacing: -0.5
            }}>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                <span>Mo</span><span>Mo</span>
              </span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Cổng thanh toán MoMo</div>
              <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '0.7rem' }}>Thanh toán an toàn & bảo mật</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.9)', fontSize: '0.75rem' }}>
            🔒 SSL Secured
          </div>
        </div>
      </div>

      {/* Warning bar */}
      <div style={{ background: 'rgba(255,180,0,.08)', borderBottom: '1px solid rgba(255,180,0,.15)', padding: '8px 0' }}>
        <div className="container" style={{ maxWidth: 900, textAlign: 'center', fontSize: '0.78rem', color: '#ffb400' }}>
          ⚠️ Vui lòng không tắt trình duyệt này khi chưa hoàn tất thanh toán.
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ maxWidth: 900, padding: '32px 16px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28 }}>

          {/* LEFT: Order Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Order card */}
            <div style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 16, padding: 24, backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '0.95rem', color: '#e8e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                📋 Thông tin đơn hàng
              </h3>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', color: '#878797', marginBottom: 4 }}>Nhà cung cấp</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>🎬</span>
                  <span style={{ fontWeight: 700, color: '#e8e8f0' }}>Galaxy Studio</span>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', color: '#878797', marginBottom: 4 }}>Mã đơn hàng</div>
                <div style={{ fontWeight: 600, color: '#e8e8f0', fontFamily: 'monospace', fontSize: '0.95rem' }}>{orderId}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', color: '#878797', marginBottom: 4 }}>Mô tả</div>
                <div style={{ fontWeight: 600, color: '#e8e8f0', fontSize: '0.85rem' }}>
                  Thanh toán vé phim {booking.movie?.tieu_de}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 16 }}>
                <div style={{ fontSize: '0.72rem', color: '#878797', marginBottom: 6 }}>Số tiền</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, background: momoGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {fmt(total)}đ
                </div>
              </div>
            </div>

            {/* Timer */}
            <div style={{
              background: 'rgba(165,0,100,.08)', border: '1px solid rgba(165,0,100,.2)',
              borderRadius: 16, padding: 20, textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#878797', marginBottom: 10 }}>Đơn hàng sẽ hết hạn sau:</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[
                  { v: mm, l: 'Phút' },
                  { v: ss, l: 'Giây' },
                ].map((t, i) => (
                  <div key={i} style={{
                    background: momoGrad, borderRadius: 10, padding: '10px 18px', minWidth: 64,
                    boxShadow: '0 4px 15px rgba(165,0,100,.3)'
                  }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{t.v}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,.7)', marginTop: 4 }}>{t.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigate('/thanh-toan')}
              style={{ background: 'none', border: 'none', color: '#d8247e', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}>
              ← Quay về trang thanh toán
            </button>
          </div>

          {/* RIGHT: Payment Form */}
          <div style={{
            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 16, padding: 28, backdropFilter: 'blur(10px)'
          }}>
            {paySuccess ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
                <h2 style={{ fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>Thanh toán thành công!</h2>
                <p style={{ color: '#878797' }}>Đang chuyển hướng...</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: momoGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📱</span>
                  Xác nhận thanh toán MoMo
                </h3>

                {/* QR / Simulated payment area */}
                <div style={{
                  background: 'linear-gradient(145deg, #1a0a14 0%, #0f0a1a 100%)',
                  borderRadius: 14, padding: 28, textAlign: 'center', marginBottom: 24,
                  border: '1px solid rgba(165,0,100,.2)'
                }}>
                  {/* Fake QR */}
                  <div style={{
                    width: 180, height: 180, margin: '0 auto 20px', borderRadius: 16,
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: 2, width: 140, height: 140
                    }}>
                      {Array.from({ length: 81 }).map((_, i) => (
                        <div key={i} style={{
                          background: Math.random() > 0.4 ? '#1a1a1a' : '#fff',
                          borderRadius: 1
                        }} />
                      ))}
                    </div>
                    {/* MoMo logo overlay */}
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, background: momoGrad,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,.3)',
                        fontWeight: 900, fontSize: '0.55rem', color: '#fff', flexDirection: 'column', lineHeight: 1
                      }}>
                        <span>Mo</span><span>Mo</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 8 }}>
                    Quét mã QR bằng ứng dụng MoMo
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#555' }}>
                    hoặc nhấn nút bên dưới để xác nhận thanh toán
                  </div>
                </div>

                {/* Order Summary */}
                <div style={{
                  background: 'rgba(255,255,255,.03)', borderRadius: 12, padding: 16, marginBottom: 24,
                  border: '1px solid rgba(255,255,255,.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem' }}>
                    <span style={{ color: '#878797' }}>Phim</span>
                    <span style={{ fontWeight: 600 }}>{booking.movie?.tieu_de}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem' }}>
                    <span style={{ color: '#878797' }}>Ghế</span>
                    <span style={{ fontWeight: 600 }}>{booking.seats?.join(', ')}</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem' }}>
                    <span>Tổng thanh toán</span>
                    <span style={{ background: momoGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fmt(total)} ₫</span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={processing}
                  style={{
                    width: '100%', padding: '16px 0', border: 'none', borderRadius: 12,
                    background: processing ? '#555' : momoGrad, color: '#fff', fontSize: '1rem', fontWeight: 700,
                    cursor: processing ? 'not-allowed' : 'pointer',
                    boxShadow: processing ? 'none' : '0 4px 20px rgba(165,0,100,.4)',
                    transition: '.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  {processing ? (
                    <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Đang xử lý thanh toán...</>
                  ) : (
                    <>🔒 Xác nhận thanh toán {fmt(total)}đ</>
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.7rem', color: '#555' }}>
                  Giao dịch được bảo mật bởi MoMo & Galaxy Studio
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
