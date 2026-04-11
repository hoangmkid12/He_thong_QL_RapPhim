import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

function CrudModal({ title, fields, form, setForm, onSubmit, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, width: '100%', maxWidth: 540, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#878797', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            {fields.map(([key, label, type = 'text', full, opts]) => (
              <div key={key} className="form-group" style={{ gridColumn: full ? '1/-1' : undefined }}>
                <label className="form-label">{label}</label>
                {type === 'textarea' ? (
                  <textarea className="form-control" rows={3} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={{ resize: 'vertical' }} />
                ) : type === 'select' ? (
                  <select className="form-control" value={form[key] ?? ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}>
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                ) : type === 'file' ? (
                  <input type="file" accept="image/*" className="form-control" onChange={e => setForm(p => ({ ...p, _file: e.target.files[0] }))} />
                ) : (
                  <input type={type} className="form-control" value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Hủy</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Cinema Manage ───────────────────────────────────────────────
export default function CinemaManagePage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })

  const { data: raps = [], isLoading } = useQuery({ queryKey: ['raps-admin'], queryFn: () => api.get('/rap').then(r => r.data.data) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (k !== '_file' && v !== undefined) fd.append(k, v) })
    if (form._file) fd.append('img', form._file)
    try {
      if (modal === 'add') await api.post('/rap', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      else await api.put(`/rap/${form.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(modal === 'add' ? 'Thêm rạp thành công' : 'Cập nhật thành công')
      qc.invalidateQueries(['raps-admin']); setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi') }
  }

  const handleDelete = (id) => {
    setConfirm({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = confirm.id
    try {
      await api.delete(`/rap/${id}`)
      toast.success('Đã xóa rạp thành công')
      qc.invalidateQueries(['raps-admin'])
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  const FIELDS = [
    ['ten_rap', 'Tên rạp *', 'text', true],
    ['dia_chi', 'Địa chỉ', 'text', true],
    ['dien_thoai', 'Điện thoại', 'text'],
    ['email', 'Email', 'email'],
    ['mo_ta', 'Mô tả', 'textarea', true],
    ['img', 'Ảnh rạp', 'file', true],
  ]

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>🏟️ Quản lý Rạp chiếu</h1>
        <button onClick={() => { setForm({}); setModal('add') }} className="btn btn-primary">+ Thêm rạp</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {isLoading ? <div className="loading-center" style={{ gridColumn: '1/-1' }}><div className="spinner" /></div> :
          raps.map(r => (
            <div key={r.id} className="card">
              {r.img && <img src={r.img.startsWith('http') ? r.img : `/uploads/rap/${r.img}`} alt={r.ten_rap} style={{ width: '100%', height: 140, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
              {!r.img && <div style={{ height: 80, background: 'linear-gradient(135deg,#1c1c27,#13131a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏟️</div>}
              <div className="card-body">
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{r.ten_rap}</h3>
                {r.dia_chi && <p style={{ color: '#878797', fontSize: '0.8rem', marginBottom: 8 }}>📍 {r.dia_chi}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => { setForm({ ...r }); setModal('edit') }} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)', flex: 1 }}>🗑️ Xóa</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      {modal && <CrudModal title={modal === 'add' ? '+ Thêm rạp' : '✏️ Sửa rạp'} fields={FIELDS} form={form} setForm={setForm} onSubmit={handleSubmit} onClose={() => setModal(null)} />}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xóa rạp chiếu"
        message="Bạn có chắc chắn muốn xóa rạp này không? Hành động này có thể ảnh hưởng đến lịch chiếu và phòng chiếu liên quan."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
