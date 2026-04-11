import { useLocation, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect } from 'react'
import { useBooking } from '../../context/BookingContext'

export default function ConfirmPage() {
  const { state } = useLocation()
  const { reset } = useBooking()
  const data = state?.ticket
  const ticket = data?.ve

  useEffect(() => {
    // Reset booking state after reaching confirm page
    reset()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || !ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <p style={{ color: '#878797' }}>Không có thông tin vé.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Về trang chủ</Link>
      </div>
    )
  }

  const fmt = (n) => Number(n || 0).toLocaleString('vi-VN')

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: 650 }}>
      {/* Success header with checkmark */}
      <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeInDown 0.6s ease-out' }}>
        <div style={{ width: 80, height: 80, background: 'rgba(34,197,94,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid rgba(34,197,94,.3)' }}>
          <span style={{ fontSize: '3rem' }}>🎉</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>Đặt vé thành công!</h1>
        <p style={{ color: '#878797', fontSize: '1.05rem' }}>Cảm ơn bạn đã lựa chọn CinePass. Chúc bạn có buổi xem phim vui vẻ!</p>
      </div>

      {/* Ticket Invoice Card */}
      <div style={{ 
        background: '#13131a', 
        borderRadius: 24, 
        border: '1px solid rgba(255,255,255,.08)', 
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Ticket Header (Gradient) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #e50914 0%, #b20710 100%)', 
          padding: '24px', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>Vé xem phim điện tử</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{ticket.tieu_de}</h2>
          
          {/* Decorative cutouts at the junction */}
          <div style={{ position: 'absolute', left: -12, bottom: -12, width: 24, height: 24, background: 'var(--c-bg)', borderRadius: '50%', zIndex: 2 }} />
          <div style={{ position: 'absolute', right: -12, bottom: -12, width: 24, height: 24, background: 'var(--c-bg)', borderRadius: '50%', zIndex: 2 }} />
        </div>

        <div style={{ padding: '32px 24px', position: 'relative' }}>
          {/* Dashed line at the junction */}
          <div style={{ position: 'absolute', left: 24, right: 24, top: 0, borderTop: '2px dashed rgba(255,255,255,0.1)', height: 1 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
            {/* Info Items */}
            {[
              ['Rạp chiếu', ticket.ten_rap, '🏟️'],
              ['Ngày chiếu', ticket.ngay_chieu ? new Date(ticket.ngay_chieu).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '', '📅'],
              ['Suất chiếu', ticket.thoi_gian_chieu?.slice(0,5), '⏰'],
              ['Phòng', ticket.tenphong, '🚪'],
              ['Ghế ngồi', ticket.ghe, '💺'],
              ['Mã hóa đơn', `#HD${data.id_hd}`, '🧾'],
            ].map(([label, value, icon]) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#878797', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  <span>{icon}</span> {label}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e8e8f0' }}>{value}</div>
              </div>
            ))}

            {ticket.combo && (
              <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,.03)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ color: '#878797', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>🎬 COMBO ĐÃ CHỌN</div>
                <div style={{ fontWeight: 600, color: '#e8e8f0' }}>{ticket.combo}</div>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.07)', margin: '32px 0' }} />

          {/* QR Code & Total Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#878797', fontSize: '0.85rem', marginBottom: 4 }}>Tổng số tiền đã thanh toán</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e50914' }}>{fmt(ticket.thanh_tien)} ₫</div>
              </div>
              
              {data.diem_cong > 0 && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,197,24,.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(245,197,24,.2)' }}>
                  <span style={{ fontSize: '1.2rem' }}>⭐</span>
                  <span style={{ color: '#f5c518', fontWeight: 800, fontSize: '0.85rem' }}>+{data.diem_cong} điểm tích lũy</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                background: '#fff', 
                padding: 12, 
                borderRadius: 16, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                display: 'inline-block' 
              }}>
                <QRCodeSVG value={`TICKET-${data.id_ve}-${data.id_hd}`} size={120} level="H" includeMargin={false} />
              </div>
              <div style={{ color: '#878797', fontSize: '0.75rem', marginTop: 12, fontWeight: 700 }}>Mã vé: #VE{data.id_ve}</div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ background: 'rgba(255,255,255,.02)', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <p style={{ color: '#878797', fontSize: '0.75rem', margin: 0 }}>Vui lòng xuất trình mã QR này tại quầy để nhận vé giấy hoặc vào phòng chiếu.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
        <Link to="/ve-cua-toi" className="btn btn-secondary btn-lg" style={{ flex: 1, height: 52, borderRadius: 12 }}>
          🎟️ Xem danh sách vé
        </Link>
        <Link to="/" className="btn btn-primary btn-lg" style={{ flex: 1, height: 52, borderRadius: 12 }}>
          🏠 Quay lại trang chủ
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  )
}
