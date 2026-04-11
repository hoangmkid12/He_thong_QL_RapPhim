import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

const TRANG_THAI = { 0: ['Chờ TT', '#f59e0b'], 1: ['Đã thanh toán', '#22c55e'], 2: ['Đã sử dụng', '#878797'], 3: ['Đã hủy', '#e50914'], 4: ['Hết hạn', '#e50914'] }

export default function TicketListPage() {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })
  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: () => api.get('/ve/my').then(r => r.data.data),
  })

  const handleCancel = (e, id) => {
    e.stopPropagation()
    setConfirm({ isOpen: true, id })
  }

  const confirmCancel = async () => {
    const id = confirm.id
    try {
      const { data } = await api.post(`/ve/${id}/huy`)
      toast.success(data.message || 'Hủy vé thành công')
      refetch()
    } catch (err) {
      console.error('Cancel ticket error:', err)
      toast.error(err.response?.data?.message || 'Không thể hủy vé')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem' }}>🎟️ Vé của tôi</h1>
        <span style={{ color: '#878797', fontSize: '0.875rem' }}>{tickets.length} vé</span>
      </div>

      {tickets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎬</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Bạn chưa đặt vé nào</h3>
          <p style={{ color: '#878797', marginBottom: 24 }}>Khám phá các bộ phim đang chiếu và đặt vé ngay!</p>
          <Link to="/phim" className="btn btn-primary">Xem phim ngay</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.map(v => {
            const [label, color] = TRANG_THAI[v.trang_thai] || ['N/A', '#878797']
            const showDate = new Date(`${v.ngay_chieu} ${v.thoi_gian_chieu || '00:00'}`)
            const canCancel = v.trang_thai === 1 && (showDate - new Date()) > 4 * 3600000

            return (
              <div key={v.id} onClick={() => setSelectedTicket(v)} className="card ticket-card"
                style={{ borderLeft: `4px solid ${color}`, cursor: 'pointer', transition: 'transform .2s ease' }}>
                <div className="card-body" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>{v.tieu_de}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.8rem', color: '#878797' }}>
                      <span>📅 {new Date(v.ngay_chieu).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} • ⏰ {String(v.thoi_gian_chieu || '').slice(0, 5)}</span>
                      <span>🏟️ {v.ten_rap} — {v.tenphong}</span>
                      <span>💺 Ghế: <strong style={{ color: '#e8e8f0' }}>{v.ghe}</strong></span>
                      {v.combo && <span>🍿 Combo: {v.combo}</span>}
                      <span style={{ color: '#e50914', marginTop: 4, fontWeight: 600 }}>🔍 Nhấn để xem chi tiết & mã QR</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ background: `${color}22`, color, padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: '0.8rem' }}>{label}</span>
                    <span style={{ fontWeight: 800, color: '#e50914', fontSize: '1.1rem' }}>{Number(v.price || 0).toLocaleString('vi-VN')} ₫</span>
                    <span style={{ fontSize: '0.7rem', color: '#878797' }}>Mã: #VE{v.id}</span>
                    {canCancel && (
                      <button onClick={(e) => handleCancel(e, v.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>
                        Hủy vé
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="page-enter" style={{ background: '#13131a', borderRadius: 24, border: '1px solid rgba(255,255,255,.1)', width: '100%', maxWidth: 440, overflow: 'hidden', position: 'relative' }}>
            {/* Header decor */}
            <div style={{ background: '#e50914', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>THÔNG TIN VÉ XEM PHIM</h2>
              <button onClick={() => setSelectedTicket(null)} style={{ position: 'absolute', right: 16, background: 'rgba(0,0,0,.2)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ padding: '20px 24px', textAlign: 'center', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 8, lineHeight: 1.3 }}>{selectedTicket.tieu_de}</h3>
                <div style={{ color: '#e50914', fontWeight: 700, fontSize: '0.9rem' }}>{selectedTicket.ten_rap}</div>
              </div>

              {/* QR Code Container */}
              <div style={{ background: '#fff', padding: 12, borderRadius: 16, display: 'inline-block', marginBottom: 16, boxShadow: '0 8px 30px rgba(0,0,0,.5)' }}>
                <QRCodeSVG value={`TICKET-${selectedTicket.id}-${selectedTicket.id_hd}`} size={160} level="H" includeMargin={false} />
                <div style={{ color: '#000', fontWeight: 800, marginTop: 4, fontSize: '0.85rem' }}>#VE{selectedTicket.id}</div>
              </div>

              <div style={{ textAlign: 'left', background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: 16, fontSize: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ color: '#878797', fontSize: '0.7rem' }}>NGÀY CHIẾU</div>
                    <div style={{ fontWeight: 700 }}>{new Date(selectedTicket.ngay_chieu).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div style={{ color: '#878797', fontSize: '0.7rem' }}>GIỜ CHIẾU</div>
                    <div style={{ fontWeight: 700 }}>{String(selectedTicket.thoi_gian_chieu || '').slice(0, 5)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#878797', fontSize: '0.7rem' }}>PHÒNG CHIẾU</div>
                    <div style={{ fontWeight: 700 }}>{selectedTicket.tenphong}</div>
                  </div>
                  <div>
                    <div style={{ color: '#878797', fontSize: '0.7rem' }}>GHẾ</div>
                    <div style={{ fontWeight: 700, color: '#e50914' }}>{selectedTicket.ghe}</div>
                  </div>
                </div>
                {selectedTicket.combo && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(255,255,255,.15)' }}>
                    <div style={{ color: '#878797', fontSize: '0.7rem' }}>COMBO</div>
                    <div style={{ fontWeight: 700 }}>{selectedTicket.combo}</div>
                  </div>
                )}
              </div>

              <p style={{ marginTop: 16, fontSize: '0.7rem', color: '#878797', fontStyle: 'italic' }}>* Vui lòng xuất trình mã QR này tại quầy soát vé để vào phòng chiếu.</p>

              <button onClick={() => setSelectedTicket(null)} className="btn btn-secondary w-full" style={{ marginTop: 8 }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xác nhận hủy vé"
        message="Bạn có chắc chắn muốn hủy vé xem phim này không? Lưu ý: Bạn chỉ có thể hủy trước giờ chiếu ít nhất 4 tiếng."
        onConfirm={confirmCancel}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
