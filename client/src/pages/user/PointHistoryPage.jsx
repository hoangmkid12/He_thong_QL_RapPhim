import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function PointHistoryPage() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['point-history'],
    queryFn: () => api.get('/diem/my').then(r => r.data),
  })

  const RANK_COLOR = { DONG: '#cd7f32', BAC: '#c0c0c0', VANG: '#f5c518', BACH_KIM: '#e5e4e2' }
  const RANK_LABEL = { DONG: 'Đồng', BAC: 'Bạc', VANG: 'Vàng', BACH_KIM: 'Bạch Kim' }

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  const userPoints = data?.user || user
  const history = data?.data || []

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: 800 }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.6rem', marginBottom: 24 }}>⭐ Điểm thưởng</h1>

      {/* Points summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          ['⭐ Điểm hiện có', `${(userPoints?.id_diem || 0).toLocaleString()}`, '#f5c518'],
          ['📈 Tổng điểm tích', `${(userPoints?.diem_tich_luy || 0).toLocaleString()}`, '#22c55e'],
          ['🏅 Hạng thành viên', RANK_LABEL[userPoints?.hang_thanh_vien?.toUpperCase()] || 'Đồng', RANK_COLOR[userPoints?.hang_thanh_vien?.toUpperCase()] || '#cd7f32'],
        ].map(([label, value, color]) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ color: '#878797', fontSize: '0.8rem', marginBottom: 6 }}>{label}</div>
            <div style={{ fontWeight: 900, fontSize: '1.4rem', color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Points rules */}
      <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(245,197,24,.3)' }}>
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📜 Quy tắc tích điểm</h3>
          <ul style={{ color: '#878797', fontSize: '0.875rem', lineHeight: 1.9, paddingLeft: 20 }}>
            <li>Mỗi 1.000đ chi tiêu = 1 điểm thưởng</li>
            <li>100 điểm = giảm 10.000đ cho lần đặt vé tiếp theo</li>
            <li>Hạng Đồng: 0 – 999 điểm | Hạng Bạc: 1.000 – 4.999 | Hạng Vàng: 5.000 – 9.999 | Bạch Kim: 10.000+</li>
          </ul>
        </div>
      </div>

      {/* History */}
      <div className="card">
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Lịch sử giao dịch điểm</h3>
          {history.length === 0 ? (
            <p style={{ color: '#878797', textAlign: 'center', padding: '24px 0' }}>Chưa có giao dịch điểm nào</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map(h => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{h.ly_do || 'Giao dịch điểm'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#878797' }}>{h.ngay_giao_dich ? new Date(h.ngay_giao_dich).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: h.loai_giao_dich === 'cong' ? '#22c55e' : '#e50914', fontSize: '1rem' }}>
                    {h.loai_giao_dich === 'cong' ? '+' : '-'}{h.so_diem} điểm
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
