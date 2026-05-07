import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function CommentManagePage() {
  const qc = useQueryClient()
  const [filterPhim, setFilterPhim] = useState('')
  const [replyId, setReplyId] = useState(null)
  const [replyText, setReplyText] = useState('')

  const { data: comments = [] } = useQuery({
    queryKey: ['admin-comments', filterPhim],
    queryFn: () => api.get(`/binh-luan${filterPhim ? `?id_phim=${filterPhim}` : ''}&&limit=100`).then(r => r.data.data)
  })

  const { data: movies = [] } = useQuery({
    queryKey: ['movies-list'],
    queryFn: () => api.get('/phim').then(r => r.data.data)
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/binh-luan/${id}`),
    onSuccess: () => { toast.success('Đã xóa bình luận'); qc.invalidateQueries({ queryKey: ['admin-comments'] }) },
    onError: (e) => toast.error(e.response?.data?.message || 'Lỗi')
  })

  const replyMut = useMutation({
    mutationFn: ({ id, noi_dung }) => api.post(`/binh-luan/${id}/tra-loi`, { noi_dung }),
    onSuccess: () => { toast.success('Đã trả lời bình luận'); setReplyId(null); setReplyText('') },
    onError: (e) => toast.error(e.response?.data?.message || 'Lỗi')
  })

  const renderStars = (n) => '⭐'.repeat(n || 0) + '☆'.repeat(5 - (n || 0))

  const avgRating = comments.length > 0 ? (comments.reduce((s, c) => s + (c.so_sao || 0), 0) / comments.length).toFixed(1) : '0.0'

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>💬 Quản lý bình luận</h1>

      {/* Summary + Filter */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Tổng bình luận', value: comments.length, color: '#3b82f6' },
            { label: 'Đánh giá TB', value: `${avgRating} ⭐`, color: '#f59e0b' },
          ].map((c, i) => (
            <div key={i} style={{ background: `${c.color}10`, border: `1px solid ${c.color}30`, borderRadius: 12, padding: '12px 20px', minWidth: 130 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: c.color }}>{c.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#878797', marginTop: 2 }}>{c.label}</div>
            </div>
          ))}
        </div>
        <select className="form-control" value={filterPhim} onChange={e => setFilterPhim(e.target.value)} style={{ width: 280, marginLeft: 'auto' }}>
          <option value="">🎬 Tất cả phim</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.tieu_de}</option>)}
        </select>
      </div>

      {/* Comments list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797', background: 'rgba(255,255,255,.04)', borderRadius: 16 }}>
            Chưa có bình luận nào
          </div>
        ) : comments.map(c => (
          <div key={c.id} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(229,9,20,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#e50914', fontSize: '0.85rem', flexShrink: 0 }}>
                  {c.ten_nguoi_dung?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.ten_nguoi_dung || 'Ẩn danh'}</div>
                  <div style={{ fontSize: '0.72rem', color: '#878797' }}>
                    🎬 {c.ten_phim} • {c.ngay_bl || '—'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.8rem', letterSpacing: 1 }}>{renderStars(c.so_sao)}</span>
                <button onClick={() => { setReplyId(replyId === c.id ? null : c.id); setReplyText('') }}
                  className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem' }}>↩️ Trả lời</button>
                <button onClick={() => { if(confirm('Xóa bình luận này?')) deleteMut.mutate(c.id) }}
                  className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: 'none', fontSize: '0.72rem' }}>🗑️ Xóa</button>
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#d0d0dc', padding: '0 50px' }}>
              {c.noi_dung}
            </div>

            {/* Reply form */}
            {replyId === c.id && (
              <div style={{ marginTop: 12, padding: '12px 50px', display: 'flex', gap: 10 }}>
                <input
                  className="form-control" placeholder="Nhập phản hồi..."
                  value={replyText} onChange={e => setReplyText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => { if(replyText.trim()) replyMut.mutate({ id: c.id, noi_dung: replyText }) }}
                  disabled={replyMut.isPending || !replyText.trim()}
                  className="btn btn-primary btn-sm"
                >{replyMut.isPending ? '...' : 'Gửi'}</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
