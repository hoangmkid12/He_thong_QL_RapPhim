import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

const ROLES = { '-1': '👤 Khách', 0: '🎫 KH', 1: '🔧 NV', 2: '⚙️ Admin', 3: '🏟️ QL Rạp', 4: '🌐 QL Cụm' }
const ROLE_COLORS = { '-1': '#878797', 0: '#22c55e', 1: '#3b82f6', 2: '#e50914', 3: '#f59e0b', 4: '#8b5cf6' }

export default function UserManagePage() {
  const { isCinemaManager } = useAuth()
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState({ isOpen: false, id: null, name: '' })

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-admin', search],
    queryFn: () => api.get(`/tai-khoan${search ? `?search=${search}` : ''}`).then(r => r.data.data),
  })

  const openEdit = (u) => { setForm({ id: u.id, name: u.name, phone: u.phone, email: u.email, dia_chi: u.dia_chi, vai_tro: u.vai_tro, trang_thai: u.trang_thai ?? 1 }); setModal('edit') }
  const openAdd = () => { setForm({ name: '', phone: '', email: '', user: '', pass: 'Abc12345', dia_chi: '', vai_tro: 0, trang_thai: 1 }); setModal('add') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modal === 'add') await api.post('/tai-khoan', form)
      else await api.put(`/tai-khoan/${form.id}`, form)
      toast.success(modal === 'add' ? 'Thêm tài khoản thành công !' : 'Cập nhật thành công!')
      qc.invalidateQueries(['users-admin'])
      setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi thao tác') }
  }

  const handleDelete = (id, name) => {
    setConfirm({ isOpen: true, id, name })
  }

  const confirmDelete = async () => {
    const { id } = confirm
    try {
      await api.delete(`/tai-khoan/${id}`)
      toast.success('Đã xóa tài khoản thành công')
      qc.invalidateQueries({ queryKey: ['users-admin'] })
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setConfirm({ isOpen: false, id: null, name: '' })
    }
  }

  const toggleStatus = async (u) => {
    try {
      await api.put(`/tai-khoan/${u.id}`, { ...u, trang_thai: u.trang_thai === 1 ? 0 : 1 })
      toast.success('Đã thay đổi trạng thái'); qc.invalidateQueries(['users-admin'])
    } catch { toast.error('Lỗi') }
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>👥 Quản lý Tài khoản</h1>
        <button onClick={openAdd} className="btn btn-primary">+ Thêm tài khoản</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input className="form-control" style={{ maxWidth: 360 }} placeholder="🔍 Tìm theo tên, email, SĐT..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)', color: '#878797' }}>
                {['#', 'Tên', 'Liên hệ', 'Vai trò', 'Điểm', 'Trạng thái', 'Hành động'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}><div className="spinner" style={{ margin: 'auto' }} /></td></tr> :
                users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <td style={{ padding: '12px 14px', color: '#878797' }}>#{u.id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#878797' }}>@{u.user}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#878797', fontSize: '0.8rem' }}>
                      <div>{u.email}</div><div>{u.phone}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: `${ROLE_COLORS[u.vai_tro] || '#878797'}22`, color: ROLE_COLORS[u.vai_tro] || '#878797', padding: '3px 10px', borderRadius: 12, fontWeight: 700, fontSize: '0.75rem' }}>
                        {ROLES[u.vai_tro] || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#f5c518' }}>{u.id_diem || 0}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => toggleStatus(u)} style={{ background: u.trang_thai === 1 ? 'rgba(34,197,94,.15)' : 'rgba(229,9,20,.15)', color: u.trang_thai === 1 ? '#22c55e' : '#e50914', border: '1px solid', borderColor: u.trang_thai === 1 ? 'rgba(34,197,94,.3)' : 'rgba(229,9,20,.3)', borderRadius: 12, padding: '3px 12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                        {u.trang_thai === 1 ? 'Hoạt động' : 'Khóa'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(u)} className="btn btn-secondary btn-sm">✏️</button>
                        <button onClick={() => handleDelete(u.id, u.name)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {!isLoading && users.length === 0 && <div style={{ textAlign: 'center', padding: '32px', color: '#878797' }}>Không có tài khoản nào</div>}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, width: '100%', maxWidth: 500, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>{modal === 'add' ? '+ Thêm tài khoản' : '✏️ Cập nhật'}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#878797', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                {[['name','Họ tên *','text'],['email','Email','email'],['phone','Điện thoại','text'],['dia_chi','Địa chỉ','text']].map(([f, l, t]) => (
                  <div className="form-group" key={f} style={{ gridColumn: f === 'dia_chi' ? '1/-1' : undefined }}>
                    <label className="form-label">{l}</label>
                    <input type={t} className="form-control" value={form[f] || ''} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} required={f === 'name'} />
                  </div>
                ))}
                {modal === 'add' && (
                  <>
                    <div className="form-group"><label className="form-label">Tên đăng nhập *</label><input className="form-control" value={form.user || ''} onChange={e => setForm(p => ({ ...p, user: e.target.value }))} required /></div>
                    <div className="form-group"><label className="form-label">Mật khẩu *</label><input className="form-control" value={form.pass || ''} onChange={e => setForm(p => ({ ...p, pass: e.target.value }))} required /></div>
                  </>
                )}
                <div className="form-group">
                  <label className="form-label">Vai trò</label>
                  <select className="form-control" value={form.vai_tro ?? 0} onChange={e => setForm(p => ({ ...p, vai_tro: parseInt(e.target.value) }))}>
                    {Object.entries(ROLES)
                      .filter(([v]) => !isCinemaManager || parseInt(v) <= 1)
                      .map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setModal(null)} className="btn btn-ghost">Hủy</button>
                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Thêm' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${confirm.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null, name: '' })}
      />
    </div>
  )
}
