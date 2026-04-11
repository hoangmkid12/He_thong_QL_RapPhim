import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

export default function MovieByCinemaPage() {
  const { id } = useParams()
  const { data: rap } = useQuery({ queryKey: ['rap', id], queryFn: () => api.get(`/rap/${id}`).then(r => r.data.data) })
  const { data: phim = [], isLoading } = useQuery({ queryKey: ['phim-rap', id], queryFn: () => api.get(`/rap/${id}/phim`).then(r => r.data.data) })

  return (
    <div className="container page-enter" style={{ padding: '40px 16px' }}>
      {rap && (
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: 4 }}>{rap.ten_rap}</h1>
          <p style={{ color: '#878797' }}>📍 {rap.dia_chi}</p>
        </div>
      )}
      {isLoading ? <div className="loading-center"><div className="spinner" /></div> : phim.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📽️</div>
          <p>Rạp này hiện chưa có lịch chiếu</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 20 }}>
          {phim.map(p => (
            <Link key={p.id} to={`/dat-ve/${p.id}`} className="card movie-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
              <div style={{ position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                <img src={p.img?.startsWith('http') ? p.img : `/uploads/phim/${p.img}`} alt={p.tieu_de}
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                  onError={e => { e.target.src='https://via.placeholder.com/300x450/1c1c27/e50914?text=🎬' }} />
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>{p.tieu_de}</h3>
                <p style={{ fontSize: '0.75rem', color: '#878797', marginTop: 4 }}>{p.ten_loai} • {p.thoi_luong_phim} phút</p>
                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  <span className="btn btn-primary btn-sm" style={{ display: 'inline-block' }}>Đặt vé</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
