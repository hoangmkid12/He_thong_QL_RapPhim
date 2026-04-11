import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useBooking } from '../../context/BookingContext'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function MovieDetailPage() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const { setMovie } = useBooking()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info') // info | comment

  const { data: phim, isLoading } = useQuery({
    queryKey: ['phim', id],
    queryFn: () => api.get(`/phim/${id}`).then(r => r.data.data),
  })

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['binh-luan', id],
    queryFn: () => api.get(`/binh-luan?id_phim=${id}`).then(r => r.data.data),
  })

  // Comment Form State
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return toast.error('Vui lòng đăng nhập để bình luận')
    if (!commentText.trim()) return toast.error('Vui lòng nhập nội dung')
    setSubmitting(true)
    try {
      await api.post('/binh-luan', { id_phim: id, noi_dung: commentText, so_sao: rating })
      toast.success('Đã gửi bình luận')
      setCommentText('')
      setRating(5)
      refetchComments()
    } catch (err) { toast.error('Lỗi khi gửi bình luận') }
    finally { setSubmitting(false) }
  }

  const handleDeleteComment = (commentId) => {
    setConfirm({ isOpen: true, id: commentId })
  }

  const confirmDelete = async () => {
    const commentId = confirm.id
    try {
      await api.delete(`/binh-luan/${commentId}`)
      toast.success('Đã xóa bình luận')
      refetchComments()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Lỗi')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  const handleBooking = () => {
    if (!isAuthenticated) { navigate('/dang-nhap', { state: { from: `/dat-ve/${id}` } }); return }
    setMovie(phim)
    navigate(`/dat-ve/${id}`)
  }

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>
  if (!phim) return <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}><p>Không tìm thấy phim</p></div>

  const imgSrc = phim.img?.startsWith('http') ? phim.img : `/uploads/phim/${phim.img}`
  const ageBadge = phim.gia_han_tuoi ? `C${phim.gia_han_tuoi}` : null
  const releaseDate = phim.date_phat_hanh ? new Date(phim.date_phat_hanh).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null
  const avgStar = comments.length ? (comments.reduce((a, c) => a + (c.so_sao || 5), 0) / comments.length).toFixed(1) : null

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <img src={imgSrc} alt={phim.tieu_de} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px) brightness(.4)', transform: 'scale(1.1)' }}
          onError={e => { e.target.style.display = 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--c-bg) 0%, transparent 60%)' }} />
      </div>

      {/* Content */}
      <div className="container" style={{ marginTop: -160, position: 'relative', paddingBottom: 60 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Poster */}
          <div style={{ flexShrink: 0 }}>
            <img src={imgSrc} alt={phim.tieu_de}
              style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,.7)' }}
              onError={e => { e.target.src = 'https://via.placeholder.com/200x300/1c1c27/e50914?text=🎬' }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 280, paddingTop: 120 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {ageBadge && <span className="badge badge-danger">{ageBadge}</span>}
              <span className="badge badge-primary">{phim.ten_loai}</span>
              {phim.quoc_gia && <span className="badge badge-muted">{phim.quoc_gia}</span>}
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 900, marginBottom: 8, lineHeight: 1.2 }}>{phim.tieu_de}</h1>

            {avgStar && (
              <div className="stars" style={{ marginBottom: 12, fontSize: '1rem' }}>
                {'⭐'.repeat(Math.round(avgStar))} <span style={{ color: '#878797', marginLeft: 6 }}>({avgStar}/5 từ {comments.length} đánh giá)</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#b0b0c0', fontSize: '0.9rem', marginBottom: 20 }}>
              {phim.daodien && <div><span style={{ color: '#878797' }}>Đạo diễn: </span><strong>{phim.daodien}</strong></div>}
              {phim.dienvien && <div><span style={{ color: '#878797' }}>Diễn viên: </span><strong>{phim.dienvien}</strong></div>}
              {releaseDate && <div><span style={{ color: '#878797' }}>Khởi chiếu: </span><strong>{releaseDate}</strong></div>}
              {phim.thoi_luong_phim && <div><span style={{ color: '#878797' }}>Thời lượng: </span><strong>{phim.thoi_luong_phim} phút</strong></div>}
            </div>

            <p style={{ color: '#b0b0c0', lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>{phim.mo_ta}</p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={handleBooking} className="btn btn-primary btn-lg">🎟️ Đặt vé ngay</button>
              {phim.link_trailer && (
                <a href={phim.link_trailer} target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">▶ Xem trailer</a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 24 }}>
            {[['info','Thông tin phim'], ['comment','Bình luận']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  color: activeTab === key ? '#e50914' : '#878797', fontWeight: activeTab === key ? 700 : 500,
                  borderBottom: activeTab === key ? '2px solid #e50914' : '2px solid transparent',
                  marginBottom: -1, transition: 'color .2s', fontSize: '0.9rem' }}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'info' && (
            <div style={{ color: '#b0b0c0', lineHeight: 1.7 }}>
              <p>{phim.mo_ta || 'Chưa có thông tin mô tả.'}</p>
            </div>
          )}
          {activeTab === 'comment' && (
            <div style={{ maxWidth: 800 }}>
              {/* Form nộp bình luận */}
              {isAuthenticated ? (
                <div className="card" style={{ marginBottom: 32, padding: 20 }}>
                  <form onSubmit={handleSubmitComment}>
                    <div style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span>Đánh giá của bạn:</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} type="button" onClick={() => setRating(s)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', 
                              filter: s <= rating ? 'none' : 'grayscale(1) opacity(.3)', transition: '.2s' }}>
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                      placeholder="Chia sẻ cảm nghĩ của bạn về phim..."
                      style={{ width: '100%', minHeight: 100, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 16, color: '#fff', marginBottom: 12, resize: 'vertical' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button disabled={submitting} className="btn btn-primary">
                        {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,.03)', borderRadius: 12, marginBottom: 32 }}>
                  <p style={{ color: '#878797', marginBottom: 12 }}>Vui lòng đăng nhập để đánh giá phim</p>
                  <Link to="/dang-nhap" className="text-primary" style={{ fontWeight: 600 }}>Đăng nhập ngay →</Link>
                </div>
              )}

              {/* Danh sách bình luận */}
              {comments.length === 0 ? (
                <p style={{ color: '#878797', textAlign: 'center', padding: '32px 0' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {comments.map(c => (
                    <div key={c.id} className="card">
                      <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ fontWeight: 700, color: '#e8e8f0' }}>{c.ten_nguoi_dung || 'Ẩn danh'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="stars" style={{ fontSize: '0.85rem' }}>{'⭐'.repeat(c.so_sao || 5)}</div>
                            {(c.id_tk === user?.id || user?.vai_tro >= 2) && (
                               <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: '#e50914', cursor: 'pointer', fontSize: '0.8rem' }}>Xóa</button>
                            )}
                          </div>
                        </div>
                        <p style={{ color: '#b0b0c0', fontSize: '0.95rem', lineHeight: 1.6 }}>{c.noi_dung}</p>
                        <div style={{ fontSize: '0.75rem', color: '#878797', marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                           <span>{c.ngay_bl ? new Date(c.ngay_bl).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
