import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

export default function GenrePage() {
  const { id } = useParams()
  const { data: genres = [] } = useQuery({ queryKey: ['genres'], queryFn: () => api.get('/phim/loai').then(r => r.data.data) })
  const { data: phim = [], isLoading } = useQuery({ queryKey: ['phim-genre', id], queryFn: () => api.get(`/phim?id_loai=${id}`).then(r => r.data.data) })
  const genre = genres.find(g => String(g.id) === String(id))

  return (
    <div className="container page-enter" style={{ padding: '40px 16px' }}>
      <h1 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: 6 }}>🎭 {genre?.name || 'Thể loại'}</h1>
      <p style={{ color: '#878797', marginBottom: 28 }}>{phim.length} phim</p>
      {isLoading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 20 }}>
          {phim.map(p => (
            <Link key={p.id} to={`/phim/${p.id}`} className="card movie-card" style={{ display: 'block', textDecoration: 'none' }}>
              <img src={p.img?.startsWith('http') ? p.img : `/uploads/phim/${p.img}`} alt={p.tieu_de}
                style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                onError={e => { e.target.src='https://via.placeholder.com/300x450/1c1c27/e50914?text=🎬' }} />
              <div className="card-body">
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>{p.tieu_de}</h3>
                <p style={{ fontSize: '0.75rem', color: '#878797', marginTop: 4 }}>{p.thoi_luong_phim} phút</p>
              </div>
            </Link>
          ))}
          {phim.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#878797', padding: '40px 0' }}>Không có phim nào trong thể loại này</p>}
        </div>
      )}
    </div>
  )
}
