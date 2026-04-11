import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

export default function NewsPage() {
  const [search, setSearch] = useState('')
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news', search], queryFn: () => api.get(`/tin-tuc${search ? `?search=${search}` : ''}`).then(r => r.data.data),
  })

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.8rem' }}>📰 Tin tức điện ảnh</h1>
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
          <input className="form-control" placeholder="Tìm kiếm tin tức..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} />
        </form>
      </div>

      {isLoading ? <div className="loading-center"><div className="spinner" /></div> : news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📰</div>
          <p>Chưa có tin tức nào</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {news.map(n => (
            <Link key={n.id} to={`/tin-tuc/${n.id}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
              {n.img && (
                <img src={n.img.startsWith('http') ? n.img : n.img} alt={n.tieu_de}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none' }} />
              )}
              {!n.img && (
                <div style={{ height: 120, background: 'linear-gradient(135deg,#1c1c27,#13131a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📰</div>
              )}
              <div className="card-body">
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {n.tieu_de}
                </h3>
                {n.mo_ta && (<p style={{ color: '#878797', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 10 }}>{n.mo_ta}</p>)}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#878797' }}>
                  <span>✍️ {n.ten_tac_gia || 'Ban biên tập'}</span>
                  <span>{n.ngay_dang ? new Date(n.ngay_dang).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
