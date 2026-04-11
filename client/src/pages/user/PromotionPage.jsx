import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

export default function PromotionPage() {
  const { data: kms = [], isLoading } = useQuery({
    queryKey: ['promotions'], queryFn: () => api.get('/store/khuyen-mai/active').then(r => r.data.data),
  })

  const today = new Date()
  const isExpired = (end) => end && new Date(end) < today
  const daysLeft = (end) => {
    if (!end) return null
    const diff = Math.ceil((new Date(end) - today) / 86400000)
    return diff > 0 ? diff : null
  }

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page-enter" style={{ padding: '40px 16px' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: 8 }}>🏷️ Khuyến mãi</h1>
        <p style={{ color: '#878797' }}>Những ưu đãi hấp dẫn dành riêng cho bạn</p>
      </div>

      {kms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏷️</div>
          <p>Hiện không có chương trình khuyến mãi nào</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {kms.map(km => {
            const days = daysLeft(km.ngay_ket_thuc)
            return (
              <div key={km.id} className="card" style={{ border: '1px solid rgba(229,9,20,.25)', overflow: 'visible', position: 'relative' }}>
                {days !== null && days <= 3 && (
                  <div style={{ position: 'absolute', top: -10, right: 16, background: '#e50914', color: '#fff', padding: '3px 12px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700 }}>
                    Còn {days} ngày
                  </div>
                )}
                {km.img && (
                  <img src={km.img.startsWith('http') ? km.img : km.img} alt={km.ten}
                    style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none' }} />
                )}
                {!km.img && (
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#e50914' }}>-{Number(km.phan_tram_giam)}%</span>
                )}
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>{km.ten}</h3>
                    <span style={{ background: 'rgba(229,9,20,.2)', color: '#e50914', padding: '2px 10px', borderRadius: 8, fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, marginLeft: 8 }}>-{Number(km.phan_tram_giam)}%</span>
                  </div>
                  {km.mo_ta && <p style={{ color: '#878797', fontSize: '0.8rem', marginBottom: 12 }}>{km.mo_ta}</p>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#878797' }}>
                    {km.ten_rap && <span>📍 {km.ten_rap}</span>}
                    {km.ngay_bat_dau && <span>🗓️ {new Date(km.ngay_bat_dau).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} → {km.ngay_ket_thuc ? new Date(km.ngay_ket_thuc).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '∞'}</span>}
                    {km.ma_km && (
                      <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 6, padding: '6px 10px', marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Mã: <strong style={{ color: '#e50914', letterSpacing: 2 }}>{km.ma_km}</strong></span>
                        <button onClick={() => { navigator.clipboard?.writeText(km.ma_km); }}
                          style={{ background: 'none', border: '1px solid rgba(255,255,255,.15)', borderRadius: 4, color: '#878797', cursor: 'pointer', fontSize: '0.7rem', padding: '2px 8px' }}>
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
