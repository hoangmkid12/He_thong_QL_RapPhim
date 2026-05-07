import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function GenreManagePage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState({ id: null, name: '' })
  const [deleteId, setDeleteId] = useState(null)

  const { data: genres = [], isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: () => api.get('/phim/loai').then(r => r.data.data)
  })

  const saveMut = useMutation({
    mutationFn: (data) => {
      if (modal === 'add') return api.post('/phim/loai', data)
      return api.put(`/phim/loai/${data.id}`, data)
    },
    onSuccess: () => {
      toast.success(modal === 'add' ? 'Thêm thành công' : 'Cập nhật thành công')
      setModal(null)
      qc.invalidateQueries({ queryKey: ['genres'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi xử lý')
  })

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/phim/loai/${id}`),
    onSuccess: () => {
      toast.success('Xóa thành công')
      setDeleteId(null)
      qc.invalidateQueries({ queryKey: ['genres'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Không thể xóa (có thể thể loại này đã có phim)')
      setDeleteId(null)
    }
  })

  const openAdd = () => { setForm({ id: null, name: '' }); setModal('add'); }
  const openEdit = (g) => { setForm({ id: g.id, name: g.name }); setModal('edit'); }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Vui lòng nhập tên thể loại')
    saveMut.mutate(form)
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontWeight: 800 }}>🏷️ Quản lý Thể loại phim</h1>
          <p style={{ color: '#878797', marginTop: 4 }}>Thêm, sửa, xóa các thể loại phim</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">+ Thêm thể loại</button>
      </div>

      <div className="card" style={{ maxWidth: 800 }}>
        {isLoading ? <p style={{ padding: 20 }}>Đang tải...</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên thể loại</th>
                <th width="150" style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {genres.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>Chưa có thể loại nào</td></tr>}
              {genres.map(g => (
                <tr key={g.id}>
                  <td style={{ color: '#878797' }}>#{g.id}</td>
                  <td style={{ fontWeight: 600 }}>{g.name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                      <button onClick={() => openEdit(g)} className="btn btn-secondary btn-sm">✏️ Sửa</button>
                      <button onClick={() => setDeleteId(g.id)} className="btn btn-sm" style={{ background: 'rgba(239,68,68,.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,.3)' }}>🗑️ Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Add/Edit */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setModal(null)}>
          <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} style={{ background: '#1c1c27', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', border: '1px solid rgba(255,255,255,.1)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>{modal === 'add' ? '+ Thêm thể loại' : '✏️ Sửa thể loại'}</h3>
            <div className="form-group">
              <label className="form-label">Tên thể loại</label>
              <input type="text" className="form-control" autoFocus value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="VD: Hành động, Hài hước..." />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" onClick={() => setModal(null)} className="btn btn-ghost">Hủy</button>
              <button type="submit" disabled={saveMut.isPending} className="btn btn-primary">{modal === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmModal 
        isOpen={!!deleteId}
        title="Xóa thể loại"
        message="Bạn có chắc chắn muốn xóa thể loại này? Nếu đã có phim thuộc thể loại này, thao tác có thể bị lỗi."
        onConfirm={() => delMut.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
