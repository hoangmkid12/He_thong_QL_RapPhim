import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function ScheduleManagePage() {
  const qc = useQueryClient()
  const { user, isCinemaManager } = useAuth()
  const [selectedRap, setSelectedRap] = useState(isCinemaManager ? user.id_rap : '')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [gioForm, setGioForm] = useState({ thoi_gian_chieu: '', id_phong: '', gia_ve: 55000 })
  const [confirm, setConfirm] = useState({ isOpen: false, id: null, type: '' })

  const { data: raps = [] } = useQuery({ 
    queryKey: ['raps-all'], 
    queryFn: () => api.get('/rap').then(r => r.data.data),
    select: (data) => isCinemaManager ? data.filter(r => r.id === user.id_rap) : data
  })
  const { data: phims = [] } = useQuery({ queryKey: ['phim-all'], queryFn: () => api.get('/phim').then(r => r.data.data) })
  const { data: phongs = [] } = useQuery({ queryKey: ['phongs-rap', selectedRap], queryFn: () => api.get(`/phong/rap/${selectedRap}`).then(r => r.data.data), enabled: !!selectedRap })
  const { data: lichChieu = [], isLoading, refetch } = useQuery({
    queryKey: ['lichChieu-admin', selectedRap, selectedDate],
    queryFn: () => api.get(`/lich-chieu?id_rap=${selectedRap}&ngay_chieu=${selectedDate}&limit=50`).then(r => r.data.data),
    enabled: !!selectedRap && !!selectedDate,
  })

  const handleAddLich = async (e) => {
    e.preventDefault()
    try {
      await api.post('/lich-chieu', { ...form, id_rap: selectedRap })
      toast.success('Thêm lịch chiếu thành công!')
      if (form.ngay_chieu) setSelectedDate(form.ngay_chieu)
      refetch(); setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi thêm lịch chiếu') }
  }

  const handleAddGio = async (lichId) => {
    try {
      await api.post('/lich-chieu/khung-gio', { id_lich_chieu: lichId, id_phong: gioForm.id_phong, thoi_gian_chieu: gioForm.thoi_gian_chieu, gia_ve: gioForm.gia_ve })
      toast.success('Thêm khung giờ thành công!')
      refetch(); setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi thêm khung giờ') }
  }

  const handleDeleteLich = (id) => {
    setConfirm({ isOpen: true, id, type: 'lich' })
  }

  const handleDeleteGio = (id) => {
    setConfirm({ isOpen: true, id, type: 'gio' })
  }

  const handleConfirmAction = async () => {
    const { id, type } = confirm
    try {
      if (type === 'lich') {
        await api.delete(`/lich-chieu/${id}`)
        toast.success('Đã xóa lịch chiếu thành công')
      } else {
        await api.delete(`/lich-chieu/khung-gio/${id}`)
        toast.success('Đã xóa khung giờ thành công')
      }
      refetch()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setConfirm({ isOpen: false, id: null, type: '' })
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/lich-chieu/${id}/status`, { status })
      toast.success(`Đã ${status.toLowerCase()} lịch chiếu!`)
      refetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái') }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã duyệt': return { color: '#22c55e', background: 'rgba(34,197,94,.1)' }
      case 'Từ chối': return { color: '#ef4444', background: 'rgba(239,68,68,.1)' }
      default: return { color: '#f59e0b', background: 'rgba(245,158,11,.1)' }
    }
  }

  // Dates for next 30 days
  const dates = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10) })

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>📅 Quản lý Lịch chiếu</h1>
        {selectedRap && selectedDate && (
          <button onClick={() => { setForm({ id_phim: '', ngay_chieu: selectedDate, id_rap: selectedRap }); setModal('add-lich') }} className="btn btn-primary">+ Thêm lịch chiếu</button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select 
          className="form-control" 
          style={{ maxWidth: 260 }} 
          value={selectedRap} 
          onChange={e => setSelectedRap(e.target.value)}
          disabled={isCinemaManager}
        >
          <option value="">{isCinemaManager ? 'Cơ sở của bạn' : '-- Chọn rạp chiếu --'}</option>
          {raps.map(r => <option key={r.id} value={r.id}>{r.ten_rap}</option>)}
        </select>
        <select className="form-control" style={{ maxWidth: 200 }} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
          {dates.map(d => {
            const dt = new Date(d)
            return <option key={d} value={d}>{dt.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}</option>
          })}
        </select>
      </div>

      {!selectedRap ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div><p>Chọn rạp và ngày để quản lý lịch chiếu</p></div>
      ) : isLoading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {lichChieu.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#878797' }}>Không có lịch chiếu nào trong ngày này</div>
          ) : lichChieu.map(lc => (
            <div key={lc.id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>{lc.tieu_de}</h3>
                      <span style={{ 
                        fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                        ...getStatusStyle(lc.trang_thai_duyet)
                      }}>
                        {lc.trang_thai_duyet}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: '0.82rem', color: '#878797' }}>
                      <span>📅 {new Date(lc.ngay_chieu).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      <span>🎬 {lc.thoi_luong_phim} phút</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(user.vai_tro === 4 || user.vai_tro === 2) && lc.trang_thai_duyet === 'Chờ duyệt' && (
                      <>
                        <button onClick={() => handleUpdateStatus(lc.id, 'Đã duyệt')} className="btn btn-sm" style={{ background: 'rgba(34,197,94,.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,.3)' }}>Duyệt</button>
                        <button onClick={() => handleUpdateStatus(lc.id, 'Từ chối')} className="btn btn-sm" style={{ background: 'rgba(239,68,68,.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,.3)' }}>Từ chối</button>
                      </>
                    )}
                    <button onClick={() => { setGioForm({ thoi_gian_chieu: '', id_phong: '', gia_ve: 55000 }); setModal({ type: 'add-gio', lichId: lc.id }) }}
                      className="btn btn-secondary btn-sm">+ Thêm giờ</button>
                    <button onClick={() => handleDeleteLich(lc.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>🗑️</button>
                  </div>
                </div>

                {/* Khung giờ */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {(lc.khung_gio || []).map(kg => (
                    <div key={kg.id} style={{ background: 'var(--c-surface2)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '8px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{String(kg.thoi_gian_chieu).slice(0, 5)}</div>
                        <div style={{ fontSize: '0.7rem', color: '#878797' }}>{kg.ten_phong}</div>
                      </div>
                      {kg.so_ghe_trong !== undefined && (
                        <span style={{ fontSize: '0.72rem', color: '#22c55e', background: 'rgba(34,197,94,.1)', borderRadius: 6, padding: '2px 6px' }}>{kg.so_ghe_trong} chỗ</span>
                      )}
                      <button onClick={() => handleDeleteGio(kg.id)} style={{ background: 'none', border: 'none', color: '#878797', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }} title="Xóa giờ chiếu">✕</button>
                    </div>
                  ))}
                  {(!lc.khung_gio || lc.khung_gio.length === 0) && (
                    <span style={{ color: '#878797', fontSize: '0.8rem', fontStyle: 'italic' }}>Chưa có khung giờ nào</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal thêm lịch chiếu */}
      {modal === 'add-lich' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#13131a', borderRadius: 16, border: '1px solid rgba(255,255,255,.1)', padding: 28, width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>+ Thêm lịch chiếu mới</h3>
              <button onClick={() => setModal(null)} style={{ background:'none',border:'none',color:'#878797',cursor:'pointer',fontSize:'1.3rem' }}>✕</button>
            </div>
            <form onSubmit={handleAddLich}>
              <div className="form-group"><label className="form-label">Phim *</label>
                <select className="form-control" value={form.id_phim||''} onChange={e=>setForm(p=>({...p,id_phim:e.target.value}))} required>
                  <option value="">-- Chọn phim --</option>
                  {phims.map(p=><option key={p.id} value={p.id}>{p.tieu_de}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Ngày chiếu (dd/mm/yyyy) *</label>
                <input type="text" className="form-control" value={form.ngay_chieu_ui||''} 
                  onChange={e=>{
                    const v = e.target.value;
                    setForm(p=>({...p, ngay_chieu_ui: v}));
                    if(/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                      const [d,m,y] = v.split('/');
                      setForm(p=>({...p, ngay_chieu: `${y}-${m}-${d}`}));
                    }
                  }} 
                  placeholder="dd/mm/yyyy" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Giờ chiếu *</label>
                  <input type="time" className="form-control" value={form.thoi_gian_chieu||''} onChange={e=>setForm(p=>({...p,thoi_gian_chieu:e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phòng *</label>
                  <select className="form-control" value={form.id_phong||''} onChange={e=>setForm(p=>({...p,id_phong:e.target.value}))} required>
                    <option value="">-- Chọn phòng --</option>
                    {phongs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Giá vé (VND)</label>
                <input type="number" className="form-control" value={form.gia_ve||55000} onChange={e=>setForm(p=>({...p,gia_ve:e.target.value}))} min={0} />
              </div>

              <div style={{display:'flex',gap:10,justifyContent:'flex-end', marginTop: 12}}>
                <button type="button" onClick={()=>setModal(null)} className="btn btn-ghost">Hủy</button>
                <button type="submit" className="btn btn-primary">Thêm lịch & Giờ chiếu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm khung giờ */}
      {modal?.type === 'add-gio' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#13131a', borderRadius: 16, border: '1px solid rgba(255,255,255,.1)', padding: 28, width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>+ Thêm giờ chiếu</h3>
              <button onClick={() => setModal(null)} style={{ background:'none',border:'none',color:'#878797',cursor:'pointer',fontSize:'1.3rem' }}>✕</button>
            </div>
            <div className="form-group"><label className="form-label">Giờ chiếu *</label><input type="time" className="form-control" value={gioForm.thoi_gian_chieu} onChange={e=>setGioForm(p=>({...p,thoi_gian_chieu:e.target.value}))} required /></div>
            <div className="form-group"><label className="form-label">Phòng chiếu *</label>
              <select className="form-control" value={gioForm.id_phong} onChange={e=>setGioForm(p=>({...p,id_phong:e.target.value}))}>
                <option value="">-- Chọn phòng --</option>
                {phongs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Giá vé (VND)</label><input type="number" className="form-control" value={gioForm.gia_ve} onChange={e=>setGioForm(p=>({...p,gia_ve:e.target.value}))} min={0} /></div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={()=>setModal(null)} className="btn btn-ghost">Hủy</button>
              <button onClick={()=>handleAddGio(modal.lichId)} disabled={!gioForm.thoi_gian_chieu||!gioForm.id_phong} className="btn btn-primary">Thêm giờ chiếu</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title={confirm.type === 'lich' ? "Xóa lịch chiếu" : "Xóa khung giờ"}
        message={confirm.type === 'lich' 
          ? "Bạn có chắc chắn muốn xóa lịch chiếu này? Tất cả khung giờ liên quan cũng sẽ bị xóa!" 
          : "Bạn có chắc chắn muốn xóa khung giờ này không?"}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirm({ isOpen: false, id: null, type: '' })}
      />
    </div>
  )
}
