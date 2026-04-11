import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

function MovieCard({ p }) {
  return (
    <Link to={`/phim/${p.id}`} className="card movie-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
      <div style={{ position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <img src={p.img?.startsWith('http') ? p.img : `/uploads/phim/${p.img}`} alt={p.tieu_de}
          style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', transition: 'transform .4s' }}
          onError={e => { e.target.src='https://via.placeholder.com/300x450/1c1c27/e50914?text=🎬' }} />
        {p.gia_han_tuoi && <span className="badge badge-danger" style={{ position:'absolute',top:8,right:8 }}>C{p.gia_han_tuoi}</span>}
        {p.is_hot === 1 && <span className="badge badge-warning" style={{ position:'absolute',top:8,left:8 }}>🔥 HOT</span>}
        <div className="movie-card-overlay">
          <div className="movie-card-info" style={{ color:'#fff' }}>
            <p style={{ fontSize:'0.78rem',color:'#ccc',marginBottom:4 }}>{p.ten_loai}</p>
            <p style={{ fontWeight:700,fontSize:'0.9rem',marginBottom:6 }}>{p.tieu_de}</p>
            <p style={{ fontSize:'0.75rem',color:'#aaa' }}>{p.thoi_luong_phim} phút</p>
          </div>
        </div>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px' }}>
        <h3 style={{ fontSize:'0.875rem',fontWeight:700,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',marginBottom:8, minHeight: '2.5rem' }}>{p.tieu_de}</h3>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center', marginTop: 'auto' }}>
          <span style={{ fontSize:'0.75rem',color:'#878797' }}>{p.ten_loai}</span>
          <Link to={`/dat-ve/${p.id}`} className="btn btn-primary btn-sm" onClick={e=>e.stopPropagation()}>Đặt vé</Link>
        </div>
      </div>
    </Link>
  )
}

export default function MovieListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [idLoai, setIdLoai] = useState(searchParams.get('id_loai') || '')
  const [filter, setFilter] = useState(searchParams.get('sap_chieu') === '1' ? 'sap' : 'dang')

  const { data: genres = [] } = useQuery({ queryKey: ['genres'], queryFn: () => api.get('/phim/loai').then(r => r.data.data) })
  const { data: phim = [], isLoading } = useQuery({
    queryKey: ['phim-list', search, idLoai, filter],
    queryFn: () => {
      const p = new URLSearchParams()
      if (search) p.set('search', search)
      if (idLoai) p.set('id_loai', idLoai)
      if (filter === 'sap') p.set('sap_chieu', '1')
      if (filter === 'dang') p.set('dang_chieu', '1')
      if (filter === 'hot') p.set('hot', '1')
      return api.get(`/phim?${p}`).then(r => r.data.data)
    },
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ search, id_loai: idLoai })
  }

  return (
    <div className="container page-enter" style={{ padding: '40px 16px' }}>
      <h1 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: 24 }}>🎬 Phim</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Quick filters */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 8, padding: 4 }}>
          {[['dang','Đang chiếu'],['sap','Sắp chiếu'],['hot','🔥 Hot'],['all','Tất cả']].map(([v, label]) => (
            <button key={v} onClick={() => setFilter(v)}
              style={{ padding:'6px 14px',borderRadius:6,border:'none',cursor:'pointer',fontWeight:600,fontSize:'0.8rem',
                background:filter===v?'#e50914':'transparent', color:filter===v?'#fff':'#878797', transition:'.15s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Genre filter */}
        <select className="form-control" style={{ width:'auto',flex:'none' }} value={idLoai} onChange={e => setIdLoai(e.target.value)}>
          <option value="">Tất cả thể loại</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display:'flex',gap:8,flex:1,minWidth:200 }}>
          <input className="form-control" placeholder="🔍 Tìm tên phim..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-primary">Tìm</button>
        </form>
      </div>

      {/* Count */}
      <p style={{ color:'#878797',fontSize:'0.875rem',marginBottom:20 }}>Tìm thấy {phim.length} phim</p>

      {/* Grid */}
      {isLoading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : phim.length === 0 ? (
        <div style={{ textAlign:'center',padding:'60px 0',color:'#878797' }}>
          <div style={{ fontSize:'3rem',marginBottom:16 }}>🔍</div>
          <p>Không tìm thấy phim phù hợp</p>
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:20 }}>
          {phim.map(p => <MovieCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}
