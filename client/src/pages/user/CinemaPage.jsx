import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function CinemaPage() {
  const { data: raps = [], isLoading } = useQuery({
    queryKey: ['raps-all'], queryFn: () => api.get('/rap').then(r => r.data.data),
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page-enter" style={{ padding: '40px 16px' }}>
      <h1 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: 8 }}>🏟️ Hệ thống rạp chiếu</h1>
      <p style={{ color: '#878797', marginBottom: 28 }}>{raps.length} rạp chiếu trên toàn quốc</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
        {raps.map(r => (
          <Link key={r.id} to={`/rap-chieu/${r.id}`} className="card" style={{ textDecoration: 'none', display: 'block' }}>
            {r.img && (
              <img src={r.img.startsWith('http') ? r.img : `/uploads/rap/${r.img}`} alt={r.ten_rap}
                style={{ width: '100%', height: 160, objectFit: 'cover' }}
                onError={e => { e.target.style.display = 'none' }} />
            )}
            {!r.img && (
              <div style={{ height: 120, background: 'linear-gradient(135deg,#1c1c27,#13131a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏟️</div>
            )}
            <div className="card-body">
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{r.ten_rap}</h3>
              {r.dia_chi && <p style={{ color: '#878797', fontSize: '0.8rem', marginBottom: 8 }}>📍 {r.dia_chi}</p>}
              {r.dien_thoai && <p style={{ color: '#878797', fontSize: '0.8rem', marginBottom: 10 }}>📞 {r.dien_thoai}</p>}
              <span className="btn btn-primary btn-sm">Xem phim đang chiếu →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
