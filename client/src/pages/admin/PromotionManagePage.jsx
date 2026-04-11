import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function PromotionManagePage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [imgFile, setImgFile] = useState(null)
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })

  const { data: raps = [] } = useQuery({ queryKey: ['raps-all'], queryFn: () => api.get('/rap').then(r => r.data.data) })
  const { data: kms = [], isLoading } = useQuery({
    queryKey: ['km-admin'], queryFn: () => api.get('/store/khuyen-mai').then(r => r.data.data),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (k !== 'id' && v !== undefined && v !== null) fd.append(k, v) })
    if (imgFile) fd.append('img', imgFile)
    try {
      if (modal === 'add') await api.post('/store/khuyen-mai', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/store/khuyen-mai/${form.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(modal === 'add' ? 'Thêm khuyến mãi thành công' : 'Cập nhật thành công')
      qc.invalidateQueries({ queryKey: ['km-admin'] }); setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi') }
  }

  const handleDelete = (id) => {
    setConfirm({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = confirm.id
    try {
      const res = await api.delete(`/store/khuyen-mai/${id}`)
      toast.success(res.data.message || 'Đã xóa')
      qc.invalidateQueries({ queryKey: ['km-admin'] })
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  const toggleStatus = async (km) => {
    try {
      await api.patch(`/store/khuyen-mai/${km.id}/toggle`)
      qc.invalidateQueries({ queryKey: ['km-admin'] })
    } catch { toast.error('Lỗi') }
  }

  const isActive = (km) => {
    const now = new Date()
    const start = km.ngay_bat_dau ? new Date(km.ngay_bat_dau) : null
    const end = km.ngay_ket_thuc ? new Date(km.ngay_ket_thuc) : null
    return km.trang_thai === 1 && (!start || start <= now) && (!end || end >= now)
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>🏷️ Quản lý Khuyến mãi</h1>
        <button onClick={() => { setForm({ ten: '', phan_tram_giam: '', trang_thai: 1 }); setImgFile(null); setModal('add') }} className="btn btn-primary">+ Thêm KM</button>
      </div>
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)', color: '#878797' }}>
                {['#', 'Tên KM', 'Giảm %', 'Rạp áp dụng', 'Thời gian', 'Trạng thái', 'Hành động'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}><div className="spinner" style={{ margin: 'auto' }} /></td></tr> :
                kms.map(km => {
                  const active = isActive(km)
                  return (
                    <tr key={km.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <td style={{ padding: '12px 14px', color: '#878797' }}>#{km.id}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{km.ten}</div>
                        {km.ma_km && <div style={{ fontSize: '0.72rem', color: '#e50914' }}>CODE: {km.ma_km}</div>}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#e50914', fontSize: '1.1rem' }}>-{Number(km.phan_tram_giam)}%</td>
                      <td style={{ padding: '12px 14px', color: '#878797' }}>{km.ten_rap || 'Tất cả rạp'}</td>
                      <td style={{ padding: '12px 14px', color: '#878797', fontSize: '0.8rem' }}>
                        {km.ngay_bat_dau ? new Date(km.ngay_bat_dau).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '∞'} →{' '}
                        {km.ngay_ket_thuc ? new Date(km.ngay_ket_thuc).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '∞'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => toggleStatus(km)} style={{ background: active ? 'rgba(34,197,94,.15)' : 'rgba(229,9,20,.15)', color: active ? '#22c55e' : '#e50914', border: 'none', borderRadius: 10, padding: '3px 12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                          {active ? '✅ Đang chạy' : '⏸️ Tắt'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => { setForm({ ...km }); setImgFile(null); setModal('edit') }} className="btn btn-secondary btn-sm">✏️</button>
                          <button onClick={() => handleDelete(km.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          {!isLoading && kms.length === 0 && <div style={{ textAlign: 'center', padding: '32px', color: '#878797' }}>Chưa có khuyến mãi nào</div>}
        </div>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#13131a', borderRadius: 16, border: '1px solid rgba(255,255,255,.1)', padding: 28, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>{modal === 'add' ? '+ Thêm KM' : '✏️ Sửa KM'}</h3>
              <button onClick={() => setModal(null)} style={{ background:'none',border:'none',color:'#878797',cursor:'pointer',fontSize:'1.3rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 12px' }}>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Tên chương trình *</label><input className="form-control" value={form.ten||''} onChange={e=>setForm(p=>({...p,ten:e.target.value}))} required /></div>
                <div className="form-group"><label className="form-label">Giảm % *</label><input type="number" className="form-control" value={form.phan_tram_giam||''} onChange={e=>setForm(p=>({...p,phan_tram_giam:e.target.value}))} min={1} max={100} required /></div>
                <div className="form-group"><label className="form-label">Mã khuyến mãi</label><input className="form-control" value={form.ma_km||''} onChange={e=>setForm(p=>({...p,ma_km:e.target.value}))} placeholder="VD: SAVE20" /></div>
                <div className="form-group"><label className="form-label">Từ ngày</label><input type="date" className="form-control" value={form.ngay_bat_dau?.slice(0,10)||''} onChange={e=>setForm(p=>({...p,ngay_bat_dau:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Đến ngày</label><input type="date" className="form-control" value={form.ngay_ket_thuc?.slice(0,10)||''} onChange={e=>setForm(p=>({...p,ngay_ket_thuc:e.target.value}))} /></div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Áp dụng rạp</label>
                  <select className="form-control" value={form.id_rap||''} onChange={e=>setForm(p=>({...p,id_rap:e.target.value||null}))}>
                    <option value="">Tất cả rạp</option>
                    {raps.map(r=><option key={r.id} value={r.id}>{r.ten_rap}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Mô tả</label><textarea className="form-control" rows={2} value={form.mo_ta||''} onChange={e=>setForm(p=>({...p,mo_ta:e.target.value}))} style={{resize:'vertical'}} /></div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Ảnh</label><input type="file" className="form-control" accept="image/*" onChange={e=>setImgFile(e.target.files[0])} /></div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:8}}>
                <button type="button" onClick={()=>setModal(null)} className="btn btn-ghost">Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xóa khuyến mãi"
        message="Bạn có chắc chắn muốn xóa chương trình khuyến mãi này không? Dữ liệu lịch sử vẫn sẽ được bảo lưu."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
