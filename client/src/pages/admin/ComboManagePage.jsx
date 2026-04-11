import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function ComboManagePage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [imgFile, setImgFile] = useState(null)
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })

  const { data: combos = [], isLoading } = useQuery({
    queryKey: ['combos-admin'], queryFn: () => api.get('/store/combo').then(r => r.data.data),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (k !== 'id' && v !== undefined) fd.append(k, v) })
    if (imgFile) fd.append('img', imgFile)
    try {
      if (modal === 'add') await api.post('/store/combo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/store/combo/${form.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(modal === 'add' ? 'Thêm combo thành công' : 'Cập nhật thành công')
      qc.invalidateQueries(['combos-admin']); setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi') }
  }

  const handleDelete = (id) => {
    setConfirm({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = confirm.id
    try {
      await api.delete(`/store/combo/${id}`)
      toast.success('Đã xóa combo thành công')
      qc.invalidateQueries(['combos-admin'])
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  const toggleStatus = async (c) => {
    try { await api.patch(`/store/combo/${c.id}/toggle`); qc.invalidateQueries(['combos-admin']) }
    catch { toast.error('Lỗi') }
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>🍿 Quản lý Combo</h1>
        <button onClick={() => { setForm({ ten: '', gia: '', mo_ta: '', trang_thai: 1 }); setImgFile(null); setModal('add') }} className="btn btn-primary">+ Thêm combo</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {isLoading ? <div className="loading-center" style={{ gridColumn: '1/-1' }}><div className="spinner" /></div> :
          combos.map(c => (
            <div key={c.id} className="card" style={{ opacity: c.trang_thai !== 1 ? .6 : 1 }}>
              {c.img && <img src={c.img.startsWith('http') ? c.img : `/uploads/combo/${c.img}`} alt={c.ten} style={{ width: '100%', height: 140, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
              {!c.img && <div style={{ height: 80, background: 'linear-gradient(135deg,#1c1c27,#13131a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🍿</div>}
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', flex: 1 }}>{c.ten}</h3>
                  <button onClick={() => toggleStatus(c)} style={{ background: c.trang_thai === 1 ? 'rgba(34,197,94,.15)' : 'rgba(229,9,20,.15)', color: c.trang_thai === 1 ? '#22c55e' : '#e50914', border: 'none', borderRadius: 10, padding: '2px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                    {c.trang_thai === 1 ? 'ON' : 'OFF'}
                  </button>
                </div>
                {c.mo_ta && <p style={{ color: '#878797', fontSize: '0.78rem', marginBottom: 10 }}>{c.mo_ta}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#e50914', fontWeight: 800, fontSize: '1rem' }}>{Number(c.gia || 0).toLocaleString('vi-VN')}đ</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setForm({ ...c }); setImgFile(null); setModal('edit') }} className="btn btn-secondary btn-sm">✏️</button>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
        {!isLoading && combos.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#878797' }}>Chưa có combo nào</div>}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#13131a', borderRadius: 16, border: '1px solid rgba(255,255,255,.1)', padding: 28, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>{modal === 'add' ? '+ Thêm combo' : '✏️ Sửa combo'}</h3>
              <button onClick={() => setModal(null)} style={{ background:'none',border:'none',color:'#878797',cursor:'pointer',fontSize:'1.3rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Tên combo *</label><input className="form-control" value={form.ten||''} onChange={e=>setForm(p=>({...p,ten:e.target.value}))} required /></div>
              <div className="form-group"><label className="form-label">Giá (VND) *</label><input type="number" className="form-control" value={form.gia||''} onChange={e=>setForm(p=>({...p,gia:e.target.value}))} required min={0} /></div>
              <div className="form-group"><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={form.mo_ta||''} onChange={e=>setForm(p=>({...p,mo_ta:e.target.value}))} style={{resize:'vertical'}} /></div>
              <div className="form-group"><label className="form-label">Ảnh</label><input type="file" className="form-control" accept="image/*" onChange={e=>setImgFile(e.target.files[0])} /></div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" onClick={()=>setModal(null)} className="btn btn-ghost">Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xóa combo"
        message="Bạn có chắc chắn muốn xóa combo này không? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
