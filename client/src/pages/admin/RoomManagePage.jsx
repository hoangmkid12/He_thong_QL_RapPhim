import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function RoomManagePage() {
  const { user, isCinemaManager } = useAuth()
  const qc = useQueryClient()
  const [selectedRap, setSelectedRap] = useState(isCinemaManager ? user.id_rap : '')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit' | 'seats'
  const [form, setForm] = useState({})
  const [seatConfig, setSeatConfig] = useState({ so_hang: 8, so_ghe_moi_hang: 10, hang_vip: 'D,E' })
  const [generating, setGenerating] = useState(false)
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })

  const { data: raps = [] } = useQuery({ 
    queryKey: ['raps-all'], 
    queryFn: () => api.get('/rap').then(r => r.data.data),
    select: (data) => isCinemaManager ? data.filter(r => r.id === user.id_rap) : data
  })
  const { data: phongs = [], isLoading, refetch } = useQuery({
    queryKey: ['phongs', selectedRap],
    queryFn: () => api.get(`/phong/rap/${selectedRap}`).then(r => r.data.data),
    enabled: !!selectedRap,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, id_rap: selectedRap }
      if (modal === 'add') await api.post('/phong', payload)
      else await api.put(`/phong/${form.id}`, payload)
      toast.success(modal === 'add' ? 'Thêm phòng thành công' : 'Cập nhật thành công')
      qc.invalidateQueries(['phongs']); refetch(); setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi') }
  }

  const handleDelete = (id) => {
    setConfirm({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = confirm.id
    try {
      await api.delete(`/phong/${id}`)
      toast.success('Đã xóa phòng thành công')
      refetch()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  const handleGenerateSeats = async (phongId) => {
    setGenerating(true)
    try {
      await api.post(`/phong/${phongId}/generate-seats`, seatConfig)
      toast.success('Tạo sơ đồ ghế thành công!')
      setModal(null); refetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi tạo ghế') }
    finally { setGenerating(false) }
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>🚪 Quản lý Phòng chiếu</h1>
        {selectedRap && <button onClick={() => { setForm({ name: '', loai_phong: '2D' }); setModal('add') }} className="btn btn-primary">+ Thêm phòng</button>}
      </div>

      {/* Select rap */}
      <div style={{ marginBottom: 20 }}>
        <select 
          className="form-control" 
          style={{ maxWidth: 360 }} 
          value={selectedRap} 
          onChange={e => setSelectedRap(e.target.value)}
          disabled={isCinemaManager}
        >
          <option value="">{isCinemaManager ? 'Cơ sở của bạn' : '-- Chọn rạp chiếu --'}</option>
          {raps.map(r => <option key={r.id} value={r.id}>{r.ten_rap}</option>)}
        </select>
      </div>

      {!selectedRap ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>🏟️</div><p>Chọn rạp để quản lý phòng chiếu</p></div>
      ) : isLoading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 16 }}>
          {phongs.map(p => (
            <div key={p.id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{p.name}</h3>
                    <span className="badge badge-muted" style={{ marginTop: 4 }}>{p.loai_phong || '2D'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#e50914' }}>{(p.so_ghe || 0)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#878797' }}>ghế</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => { setForm(p); setSeatConfig({ so_hang: 8, so_ghe_moi_hang: 10, hang_vip: 'D,E' }); setModal({ type: 'seats', id: p.id }) }} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>🗺️ Sơ đồ ghế</button>
                  <button onClick={() => { setForm({ ...p }); setModal('edit') }} className="btn btn-secondary btn-sm">✏️</button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
          {phongs.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#878797' }}>Chưa có phòng chiếu nào</div>}
        </div>
      )}

      {/* Add/Edit modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#13131a', borderRadius: 16, border: '1px solid rgba(255,255,255,.1)', padding: 28, width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>{modal === 'add' ? '+ Thêm phòng' : '✏️ Sửa phòng'}</h3>
              <button onClick={() => setModal(null)} style={{ background:'none',border:'none',color:'#878797',cursor:'pointer',fontSize:'1.3rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Tên phòng *</label><input className="form-control" value={form.name||''} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required /></div>
              <div className="form-group"><label className="form-label">Loại phòng</label>
                <select className="form-control" value={form.loai_phong||'2D'} onChange={e=>setForm(p=>({...p,loai_phong:e.target.value}))}>
                  {['2D','3D','4DX','IMAX','Phòng đôi'].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ display:'flex',gap:10,justifyContent:'flex-end',marginTop:8 }}>
                <button type="button" onClick={()=>setModal(null)} className="btn btn-ghost">Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seat generation modal */}
      {modal?.type === 'seats' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#13131a', borderRadius: 16, border: '1px solid rgba(255,255,255,.1)', padding: 28, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>🗺️ Tạo sơ đồ ghế — {form.name}</h3>
              <button onClick={() => setModal(null)} style={{ background:'none',border:'none',color:'#878797',cursor:'pointer',fontSize:'1.3rem' }}>✕</button>
            </div>
            <p style={{ color:'#f59e0b',fontSize:'0.875rem',marginBottom:16 }}>⚠️ Thao tác này sẽ XÓA toàn bộ ghế hiện có và tạo lại!</p>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 12px' }}>
              <div className="form-group"><label className="form-label">Số hàng</label><input type="number" className="form-control" min={1} max={26} value={seatConfig.so_hang} onChange={e=>setSeatConfig(p=>({...p,so_hang:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Ghế/hàng</label><input type="number" className="form-control" min={1} max={30} value={seatConfig.so_ghe_moi_hang} onChange={e=>setSeatConfig(p=>({...p,so_ghe_moi_hang:e.target.value}))} /></div>
              <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Hàng VIP (phân cách bằng dấu phẩy)</label><input className="form-control" placeholder="D,E" value={seatConfig.hang_vip} onChange={e=>setSeatConfig(p=>({...p,hang_vip:e.target.value}))} /></div>
            </div>
            <div style={{background:'var(--c-surface2)',borderRadius:8,padding:12,marginBottom:16,fontSize:'0.8rem',color:'#878797'}}>
              Tổng: <strong style={{color:'#e8e8f0'}}>{seatConfig.so_hang * seatConfig.so_ghe_moi_hang} ghế</strong>
              {seatConfig.hang_vip && <span> (VIP: hàng {seatConfig.hang_vip})</span>}
            </div>
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end' }}>
              <button onClick={() => setModal(null)} className="btn btn-ghost">Hủy</button>
              <button onClick={() => handleGenerateSeats(modal.id)} disabled={generating} className="btn btn-primary">
                {generating ? '⏳ Đang tạo...' : '✅ Tạo sơ đồ ghế'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xóa phòng chiếu"
        message="Bạn có chắc chắn muốn xóa phòng chiếu này? Mọi sơ đồ ghế và lịch chiếu liên quan sẽ bị ảnh hưởng."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
