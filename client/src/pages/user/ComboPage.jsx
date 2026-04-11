import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../services/api'
import { useBooking } from '../../context/BookingContext'

export default function ComboPage() {
  const navigate = useNavigate()
  const { booking, setCombos } = useBooking()
  const { rap, movie } = booking
  const [quantities, setQuantities] = useState({})

  const { data: combos = [], isLoading } = useQuery({
    queryKey: ['combos', rap?.id],
    queryFn: () => api.get(`/store/combo${rap?.id ? `?id_rap=${rap.id}` : ''}`).then(r => r.data.data.filter(c => c.trang_thai === 1)),
    enabled: true,
  })

  const adjust = (id, delta) => {
    setQuantities(prev => {
      const next = (prev[id] || 0) + delta
      if (next < 0) return prev
      return { ...prev, [id]: next }
    })
  }

  const totalComboPrice = combos.reduce((sum, c) => sum + (c.gia * (quantities[c.id] || 0)), 0)

  const selectedCombos = combos
    .filter(c => (quantities[c.id] || 0) > 0)
    .map(c => `${c.ten} x${quantities[c.id]}`)

  const handleNext = () => {
    setCombos(selectedCombos, totalComboPrice)
    navigate('/thanh-toan')
  }

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page-enter" style={{ padding: '32px 16px', maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>🍿 Chọn Combo</h1>
        <p style={{ color: '#878797' }}>Nâng cao trải nghiệm xem phim với combo đồ ăn</p>
      </div>

      {combos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#878797' }}>Hiện tại không có combo nào.</p>
          <button onClick={() => navigate('/thanh-toan')} className="btn btn-primary" style={{ marginTop: 16 }}>Bỏ qua → Thanh toán</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginBottom: 24 }}>
            {combos.map(c => {
              const qty = quantities[c.id] || 0
              const imgSrc = c.img ? `/uploads/combo/${c.img}` : null
              return (
                <div key={c.id} className="card" style={{ border: qty > 0 ? '1px solid rgba(229,9,20,.4)' : undefined }}>
                  {imgSrc && <img src={imgSrc} alt={c.ten} style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
                  <div className="card-body">
                    <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{c.ten}</h3>
                    {c.mo_ta && <p style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 10 }}>{c.mo_ta}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#e50914', fontWeight: 700, fontSize: '1rem' }}>{Number(c.gia || 0).toLocaleString('vi-VN')}đ</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => adjust(c.id, -1)} disabled={qty === 0}
                          style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(255,255,255,.2)', background: 'transparent', color: '#e8e8f0', cursor: qty > 0 ? 'pointer' : 'not-allowed', fontSize: '1rem' }}>−</button>
                        <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                        <button onClick={() => adjust(c.id, 1)}
                          style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e50914', background: '#e50914', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ color: '#878797', fontSize: '0.875rem', marginBottom: 4 }}>
                Ghế: <strong style={{ color: '#e8e8f0' }}>{booking.seats?.join(', ')}</strong>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e50914' }}>
                Tổng combo: {Number(totalComboPrice || 0).toLocaleString('vi-VN')} VND
              </div>
            </div>
            <button onClick={handleNext} className="btn btn-primary btn-lg">
              Tiếp theo → Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  )
}
