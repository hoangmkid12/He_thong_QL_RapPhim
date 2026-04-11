import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

function MovieCard({ phim }) {
  return (
    <Link to={`/phim/${phim.id}`} className="card movie-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
      <div style={{ position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={phim.img?.startsWith('http') ? phim.img : `/uploads/phim/${phim.img}` || '/placeholder-movie.jpg'}
          alt={phim.tieu_de}
          style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', transition: 'transform .4s ease' }}
          onError={e => { e.target.src = 'https://via.placeholder.com/300x450/1c1c27/e50914?text=🎬' }}
        />
        {phim.gia_han_tuoi && (
          <span className="badge badge-danger" style={{ position: 'absolute', top: 10, right: 10 }}>
            C{phim.gia_han_tuoi}
          </span>
        )}
        <div className="movie-card-overlay">
          <div className="movie-card-info" style={{ color: '#fff' }}>
            <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: 4 }}>{phim.ten_loai}</div>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.95rem' }}>{phim.tieu_de}</div>
            <div style={{ fontSize: '0.78rem', color: '#aaa' }}>{phim.thoi_luong_phim} phút</div>
          </div>
        </div>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.4rem' }}>{phim.tieu_de}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: '#878797' }}>{phim.ten_loai}</span>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); window.location.href = `/dat-ve/${phim.id}` }}
            className="btn btn-primary btn-sm"
          >Đặt vé</button>
        </div>
      </div>
    </Link>
  )
}

function HeroBanner({ phim }) {
  if (!phim) return null
  const bg = phim.img?.startsWith('http') ? phim.img : `/uploads/phim/${phim.img}`
  return (
    <div style={{
      position: 'relative', height: '75vh', minHeight: 480, overflow: 'hidden',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src={bg} alt={phim.tieu_de} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,.6) 40%, transparent 100%)' }} />
      </div>
      <div className="container" style={{ position: 'relative', paddingBottom: 40 }}>
        <span className="badge badge-primary" style={{ marginBottom: 12 }}>{phim.ten_loai}</span>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, maxWidth: 600, lineHeight: 1.2, marginBottom: 16 }}>{phim.tieu_de}</h1>
        <p style={{ color: '#b0b0c0', maxWidth: 500, marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.7,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {phim.mo_ta}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to={`/dat-ve/${phim.id}`} className="btn btn-primary btn-lg">🎟️ Đặt vé ngay</Link>
          <Link to={`/phim/${phim.id}`} className="btn btn-secondary btn-lg">ℹ️ Xem chi tiết</Link>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { data: allPhim } = useQuery({ queryKey: ['phim-home'], queryFn: () => api.get('/phim').then(r => r.data.data) })
  const { data: hotPhim } = useQuery({ queryKey: ['phim-hot'], queryFn: () => api.get('/phim?hot=1').then(r => r.data.data) })
  const { data: promotions } = useQuery({ queryKey: ['promotions-active'], queryFn: () => api.get('/store/khuyen-mai/active').then(r => r.data.data) })

  const hero = hotPhim?.[0] || allPhim?.[0]
  const dangChieu = allPhim?.filter(p => new Date(p.date_phat_hanh) <= new Date()).slice(0, 8) || []
  const sapChieu = allPhim?.filter(p => new Date(p.date_phat_hanh) > new Date()).slice(0, 8) || []

  return (
    <div>
      <HeroBanner phim={hero} />

      {/* Đang chiếu */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Phim Đang Chiếu</h2>
            <Link to="/phim" style={{ color: '#e50914', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          {dangChieu.length === 0 ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 20 }}>
              {dangChieu.map(p => <MovieCard key={p.id} phim={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promotions banner */}
      {promotions && promotions.length > 0 && (
        <section style={{ background: 'linear-gradient(135deg,#1a0a0a 0%,#2a0d0d 100%)', padding: '40px 0', margin: '0 0 48px' }}>
          <div className="container">
            <h2 className="section-title">🏷️ Khuyến Mãi Đang Diễn Ra</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {promotions.slice(0, 3).map(km => (
                <div key={km.id} className="card" style={{ border: '1px solid rgba(229,9,20,.3)' }}>
                  <div className="card-body">
                    <div style={{ color: '#e50914', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
                      -{km.phan_tram_giam}% OFF
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 8 }}>{km.ten}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#878797' }}>{km.mo_ta}</p>
                    <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#878797' }}>
                      {km.ten_rap && <span>📍 {km.ten_rap} | </span>}
                      Đến {new Date(km.ngay_ket_thuc).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/khuyen-mai" className="btn btn-primary">Xem tất cả khuyến mãi</Link>
            </div>
          </div>
        </section>
      )}

      {/* Sắp chiếu */}
      {sapChieu.length > 0 && (
        <section style={{ padding: '0 0 48px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className="section-title" style={{ margin: 0 }}>🔜 Phim Sắp Chiếu</h2>
              <Link to="/phim?sap_chieu=1" style={{ color: '#e50914', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Xem tất cả →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 20 }}>
              {sapChieu.map(p => <MovieCard key={p.id} phim={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
