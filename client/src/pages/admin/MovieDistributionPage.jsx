import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function MovieDistributionPage() {
  const qc = useQueryClient()
  const [selectedRap, setSelectedRap] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedMovies, setSelectedMovies] = useState([])

  // Lấy tổng quan rạp
  const { data: raps = [] } = useQuery({ queryKey: ['rap-summary'], queryFn: () => api.get('/phim-rap/summary').then(r => r.data.data) })

  // Lấy phim đã phân phối cho rạp đang chọn
  const { data: distributed = [] } = useQuery({
    queryKey: ['distribution', selectedRap],
    queryFn: () => api.get(`/phim-rap?id_rap=${selectedRap}`).then(r => r.data.data),
    enabled: !!selectedRap
  })

  // Lấy phim chưa phân phối cho rạp đang chọn
  const { data: available = [] } = useQuery({
    queryKey: ['available-movies', selectedRap],
    queryFn: () => api.get(`/phim-rap/available/${selectedRap}`).then(r => r.data.data),
    enabled: !!selectedRap && showModal
  })

  const distributeMut = useMutation({
    mutationFn: (data) => api.post('/phim-rap', data),
    onSuccess: (res) => {
      toast.success(res.data.message)
      qc.invalidateQueries({ queryKey: ['distribution'] })
      qc.invalidateQueries({ queryKey: ['available-movies'] })
      qc.invalidateQueries({ queryKey: ['rap-summary'] })
      setShowModal(false)
      setSelectedMovies([])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi')
  })

  const removeMut = useMutation({
    mutationFn: (id) => api.delete(`/phim-rap/${id}`),
    onSuccess: () => {
      toast.success('Đã gỡ phim khỏi rạp')
      qc.invalidateQueries({ queryKey: ['distribution'] })
      qc.invalidateQueries({ queryKey: ['rap-summary'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi')
  })

  const toggleMovie = (id) => {
    setSelectedMovies(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleDistribute = () => {
    if (!selectedMovies.length) return toast.error('Chọn ít nhất 1 phim')
    distributeMut.mutate({ id_rap: selectedRap, phim_ids: selectedMovies })
  }

  const cardStyle = {
    background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16, padding: 24
  }

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>🎬 Phân phối phim cho rạp</h1>
      </div>

      {/* Danh sách rạp */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
        {raps.map(r => (
          <div key={r.id} onClick={() => setSelectedRap(r.id)}
            style={{
              ...cardStyle, cursor: 'pointer', transition: '.2s',
              border: selectedRap === r.id ? '2px solid #e50914' : '1px solid rgba(255,255,255,.08)',
              background: selectedRap === r.id ? 'rgba(229,9,20,.08)' : 'rgba(255,255,255,.04)',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{r.ten_rap}</div>
                <div style={{ fontSize: '0.78rem', color: '#878797' }}>{r.dia_chi || 'Chưa có địa chỉ'}</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #e50914, #ff6b6b)', borderRadius: 12,
                padding: '8px 14px', fontWeight: 800, fontSize: '1.1rem', color: '#fff'
              }}>
                {r.so_phim}
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#878797', marginTop: 8 }}>phim đang chiếu</div>
          </div>
        ))}
      </div>

      {/* Phim đã phân phối cho rạp đang chọn */}
      {selectedRap && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              📋 Phim tại {raps.find(r => r.id === selectedRap)?.ten_rap}
            </h2>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">+ Thêm phim</button>
          </div>

          {distributed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#878797' }}>
              Chưa có phim nào được phân phối cho rạp này
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {distributed.map(d => (
                <div key={d.id} style={{
                  background: 'rgba(255,255,255,.03)', borderRadius: 12, overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,.06)'
                }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={d.img?.startsWith('http') ? d.img : `/uploads/phim/${d.img}`}
                      alt={d.tieu_de}
                      style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/200x300/1c1c27/e50914?text=🎬' }}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); if(confirm('Gỡ phim này khỏi rạp?')) removeMut.mutate(d.id) }}
                      style={{
                        position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%',
                        background: 'rgba(229,9,20,.9)', border: 'none', color: '#fff', cursor: 'pointer',
                        fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >✕</button>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 4,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {d.tieu_de}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#878797' }}>{d.thoi_luong_phim} phút</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal thêm phim */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1c1c27', borderRadius: 16, padding: 28, maxWidth: 700, width: '100%',
            maxHeight: '80vh', overflow: 'auto', border: '1px solid rgba(255,255,255,.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700 }}>Chọn phim để phân phối</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#878797', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {available.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#878797' }}>
                Tất cả phim đã được phân phối cho rạp này
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
                  {available.map(m => (
                    <div key={m.id} onClick={() => toggleMovie(m.id)}
                      style={{
                        borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: '.2s',
                        border: selectedMovies.includes(m.id) ? '2px solid #22c55e' : '1px solid rgba(255,255,255,.08)',
                        background: selectedMovies.includes(m.id) ? 'rgba(34,197,94,.08)' : 'rgba(255,255,255,.03)',
                        position: 'relative'
                      }}>
                      <img
                        src={m.img?.startsWith('http') ? m.img : `/uploads/phim/${m.img}`}
                        alt={m.tieu_de}
                        style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://via.placeholder.com/150x225/1c1c27/e50914?text=🎬' }}
                      />
                      {selectedMovies.includes(m.id) && (
                        <div style={{
                          position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%',
                          background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.75rem', fontWeight: 800
                        }}>✓</div>
                      )}
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.75rem',
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {m.tieu_de}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowModal(false)} className="btn btn-ghost">Hủy</button>
                  <button onClick={handleDistribute} disabled={distributeMut.isPending || !selectedMovies.length} className="btn btn-primary">
                    {distributeMut.isPending ? 'Đang xử lý...' : `Phân phối ${selectedMovies.length} phim`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
