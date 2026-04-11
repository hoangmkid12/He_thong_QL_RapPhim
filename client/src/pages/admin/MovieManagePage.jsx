import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useAuth } from '../../context/AuthContext'

const INIT = { id: null, ten: '', mo_ta: '', gia: '', id_rap: '' }

export default function MovieManagePage() {
  const qc = useQueryClient()
  const { user, isAdmin, isClusterManager } = useAuth()
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(INIT)
  const [imgFile, setImgFile] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const { data: genres = [] } = useQuery({ queryKey: ['genres'], queryFn: () => api.get('/phim/loai').then(r => r.data.data) })
  const { data: phimList = [], isLoading } = useQuery({ queryKey: ['phim-admin', search], queryFn: () => api.get(`/phim${search ? `?search=${search}` : ''}`).then(r => r.data.data) })

  const openAdd = () => { setForm({ ...INIT, date_phat_hanh_ui: '' }); setImgFile(null); setModal('add') }
  const openEdit = (p) => { 
    const dStr = p.date_phat_hanh?.slice(0,10);
    let dUi = '';
    if (dStr) {
      const [y, m, d] = dStr.split('-');
      dUi = `${d}/${m}/${y}`;
    }
    setForm({ 
      id: p.id, tieu_de: p.tieu_de, daodien: p.daodien, dienvien: p.dienvien, 
      mo_ta: p.mo_ta, thoi_luong_phim: p.thoi_luong_phim, quoc_gia: p.quoc_gia, 
      gia_han_tuoi: p.gia_han_tuoi, date_phat_hanh: dStr, date_phat_hanh_ui: dUi,
      id_loai: p.id_loai, link_trailer: p.link_trailer 
    }); 
    setImgFile(null); setModal('edit') 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (k !== 'id' && v !== undefined && v !== null) fd.append(k, v) })
    if (imgFile) fd.append('img', imgFile)
    try {
      if (modal === 'add') await api.post('/phim', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/phim/${form.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(modal === 'add' ? 'Thêm phim thành công' : 'Cập nhật thành công')
      qc.invalidateQueries(['phim-admin'])
      setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi thao tác') }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/phim/${deleteId}`)
      toast.success('Xóa phim thành công')
      qc.invalidateQueries(['phim-admin'])
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleStatus = async (p, newStatus) => {
    try {
      await api.patch(`/phim/${p.id}/status`, { status: newStatus })
      toast.success('Đã cập nhật trạng thái phim!')
      qc.invalidateQueries(['phim-admin'])
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi cập nhật') }
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>🎬 Quản lý Phim</h1>
        <button onClick={openAdd} className="btn btn-primary">+ Thêm phim</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input className="form-control" style={{ maxWidth: 360 }} placeholder="🔍 Tìm kiếm phim..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      {isLoading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)', color: '#878797' }}>
                  {['Phim', 'Thể loại', 'Ngày chiếu', 'Thời lượng', 'Trạng thái', 'Hành động'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {phimList.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={p.img?.startsWith('http') ? p.img : `/uploads/phim/${p.img}`} alt={p.tieu_de}
                          style={{ width: 44, height: 66, objectFit: 'cover', borderRadius: 4 }}
                          onError={e => { e.target.src = 'https://via.placeholder.com/44x66/1c1c27/888?text=🎬' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.tieu_de}</div>
                          {p.daodien && <div style={{ fontSize: '0.75rem', color: '#878797' }}>ĐD: {p.daodien}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><span className="badge badge-primary">{p.ten_loai}</span></td>
                    <td style={{ padding: '12px 16px', color: '#878797' }}>{p.date_phat_hanh ? new Date(p.date_phat_hanh).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#878797' }}>{p.thoi_luong_phim ? `${p.thoi_luong_phim} phút` : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                        background: p.trang_thai_duyet === 'da_duyet' ? 'rgba(34,197,94,.1)' : 'rgba(245,158,11,.1)',
                        color: p.trang_thai_duyet === 'da_duyet' ? '#22c55e' : '#f59e0b'
                      }}>
                        {p.trang_thai_duyet === 'da_duyet' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {(isAdmin || isClusterManager) && p.trang_thai_duyet === 'cho_duyet' && (
                          <button onClick={() => handleToggleStatus(p, 'da_duyet')} className="btn btn-sm" style={{ background: 'rgba(34,197,94,.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,.3)' }}>Duyệt</button>
                        )}
                        <button onClick={() => openEdit(p)} className="btn btn-secondary btn-sm">✏️ Sửa</button>
                        <button onClick={() => setDeleteId(p.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {phimList.length === 0 && <div style={{ textAlign: 'center', padding: '40px 16px', color: '#878797' }}>Không có phim nào</div>}
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16, overflowY: 'auto' }}>
          <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, width: '100%', maxWidth: 580, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>{modal === 'add' ? '+ Thêm phim mới' : '✏️ Cập nhật phim'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#878797', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    ['tieu_de','Tiêu đề *','text',true],
                    ['daodien','Đạo diễn','text',false],
                    ['dienvien','Diễn viên','text',false],
                    ['quoc_gia','Quốc gia','text',false],
                    ['thoi_luong_phim','Thời lượng (phút)','number',false],
                    ['gia_han_tuoi','Giới hạn tuổi','number',false],
                    ['date_phat_hanh','Ngày phát hành (dd/mm/yyyy)','text',false],
                    ['link_trailer','Link trailer','url',false]
                  ].map(([key, label, type, required]) => (
                    <div key={key} className="form-group" style={{ gridColumn: ['dienvien','mo_ta','link_trailer'].includes(key) ? '1/-1' : undefined }}>
                      <label className="form-label">{label}</label>
                      {key === 'date_phat_hanh' ? (
                        <input type="text" className="form-control" value={form.date_phat_hanh_ui || ''} 
                          onChange={e => {
                            const v = e.target.value;
                            setForm(p => ({ ...p, date_phat_hanh_ui: v }));
                            if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                              const [d, m, y] = v.split('/');
                              setForm(p => ({ ...p, date_phat_hanh: `${y}-${m}-${d}` }));
                            }
                          }} 
                          placeholder="dd/mm/yyyy" />
                      ) : (
                        <input type={type} className="form-control" required={required} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                      )}
                    </div>
                  ))}
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-control" rows={3} value={form.mo_ta || ''} onChange={e => setForm(p => ({ ...p, mo_ta: e.target.value }))} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thể loại</label>
                    <select className="form-control" value={form.id_loai || ''} onChange={e => setForm(p => ({ ...p, id_loai: e.target.value }))}>
                      <option value="">-- Chọn --</option>
                      {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Poster / Ảnh bìa</label>
                    <input type="file" accept="image/*" className="form-control" onChange={e => setImgFile(e.target.files[0])} />
                  </div>
                </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setModal(null)} className="btn btn-ghost">Hủy</button>
                <button type="submit" className="btn btn-primary">{modal === 'add' ? '+ Thêm' : '💾 Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Xóa phim"
        message="Bạn có chắc chắn muốn xóa phim này không? Hành động này sẽ ảnh hưởng đến các lịch chiếu liên quan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
