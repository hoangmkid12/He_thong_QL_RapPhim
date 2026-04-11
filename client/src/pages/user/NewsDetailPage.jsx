import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

export default function NewsDetailPage() {
  const { id } = useParams()
  const { data: news, isLoading } = useQuery({
    queryKey: ['news-detail', id], queryFn: () => api.get(`/tin-tuc/${id}`).then(r => r.data.data),
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>
  if (!news) return <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}><p>Không tìm thấy bài viết</p></div>

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: 800 }}>
      <Link to="/tin-tuc" style={{ color: '#e50914', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>← Quay lại tin tức</Link>
      <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', lineHeight: 1.3, marginBottom: 16 }}>{news.tieu_de}</h1>
      <div style={{ display: 'flex', gap: 16, color: '#878797', fontSize: '0.8rem', marginBottom: 24, flexWrap: 'wrap' }}>
        <span>✍️ {news.ten_tac_gia || 'Ban biên tập'}</span>
        <span>📅 {news.ngay_dang ? new Date(news.ngay_dang).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</span>
        {news.luot_xem && <span>👁️ {news.luot_xem} lượt xem</span>}
      </div>
      {news.img && (
        <img src={news.img.startsWith('http') ? news.img : news.img} alt={news.tieu_de}
          style={{ width: '100%', borderRadius: 12, marginBottom: 28, maxHeight: 400, objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }} />
      )}
      {news.mo_ta && (
        <p style={{ fontSize: '1.05rem', color: '#b0b0c0', fontStyle: 'italic', marginBottom: 20, lineHeight: 1.7, paddingLeft: 16, borderLeft: '3px solid #e50914' }}>
          {news.mo_ta}
        </p>
      )}
      <div style={{ color: '#c8c8d8', lineHeight: 1.9, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
        {news.noi_dung || news.mo_ta}
      </div>
    </div>
  )
}
