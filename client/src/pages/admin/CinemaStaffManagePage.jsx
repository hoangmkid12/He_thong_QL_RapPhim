import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function CinemaStaffManagePage() {
  const qc = useQueryClient()
  const [selectedRap, setSelectedRap] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', user: '', pass: '', phone: '', dia_chi: '', vai_tro: 1 })

  // Danh sách rạp
  const { data: raps = [] } = useQuery({ queryKey: ['raps-list'], queryFn: () => api.get('/rap').then(r => r.data.data) })

  // Danh sách nhân viên của rạp đang chọn
  const { data: staff = [] } = useQuery({
    queryKey: ['cinema-staff', selectedRap, search],
    queryFn: () => api.get(`/tai-khoan?id_rap=${selectedRap}&search=${search}`).then(r => r.data.data),
    enabled: !!selectedRap
  })

  // Lọc chỉ nhân viên (vai_tro=1) + quản lý rạp (vai_tro=3)
  const filteredStaff = staff.filter(s => s.vai_tro <= 3 && s.vai_tro >= 1)

  const ROLE_MAP = { 1: 'Nhân viên', 3: 'QL Rạp' }
  const ROLE_COLOR = { 1: '#3b82f6', 3: '#f59e0b' }

  const createMut = useMutation({
    mutationFn: (data) => api.post('/tai-khoan', data),
    onSuccess: () => {
      toast.success('Tạo tài khoản thành công')
      qc.invalidateQueries({ queryKey: ['cinema-staff'] })
      resetForm()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi')
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => api.put(`/tai-khoan/${id}`, data),
    onSuccess: () => {
      toast.success('Cập nhật thành công')
      qc.invalidateQueries({ queryKey: ['cinema-staff'] })
      resetForm()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi')
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/tai-khoan/${id}`),
    onSuccess: () => {
      toast.success('Xóa thành công')
      qc.invalidateQueries({ queryKey: ['cinema-staff'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi')
  })

  const resetForm = () => {
    setShowForm(false)
    setEditUser(null)
    setForm({ name: '', email: '', user: '', pass: '', phone: '', dia_chi: '', vai_tro: 1 })
  }

  const openEdit = (u) => {
    setEditUser(u)
    setForm({ name: u.name, email: u.email, user: u.user, pass: '', phone: u.phone || '', dia_chi: u.dia_chi || '', vai_tro: u.vai_tro })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form, id_rap: selectedRap }
    if (editUser) {
      const { pass, ...rest } = payload
      updateMut.mutate({ id: editUser.id, data: rest })
    } else {
      createMut.mutate(payload)
    }
  }

  const cardStyle = {
    background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16, padding: 24
  }

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>👥 Quản lý nhân viên rạp</h1>

      {/* Chọn rạp */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {raps.map(r => (
          <button key={r.id} onClick={() => { setSelectedRap(r.id); setSearch('') }}
            className={selectedRap === r.id ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ borderRadius: 20, padding: '8px 20px', fontSize: '0.85rem' }}>
            🏟️ {r.ten_rap}
          </button>
        ))}
      </div>

      {selectedRap && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                Nhân viên — {raps.find(r => r.id === selectedRap)?.ten_rap}
              </h2>
              <span className="badge badge-primary">{filteredStaff.length} người</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="form-control" placeholder="🔍 Tìm theo tên, email..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: 220 }}
              />
              <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary">+ Thêm</button>
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#878797' }}>
              Chưa có nhân viên nào trong rạp này
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Họ tên</th>
                    <th>Tài khoản</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((s, i) => (
                    <tr key={s.id}>
                      <td style={{ color: '#878797' }}>{i + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%', background: 'rgba(229,9,20,.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                            color: '#e50914', fontSize: '0.8rem', flexShrink: 0
                          }}>{s.name?.[0]?.toUpperCase()}</div>
                          <span style={{ fontWeight: 600 }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#878797', fontSize: '0.82rem' }}>@{s.user}</td>
                      <td style={{ fontSize: '0.82rem' }}>{s.email}</td>
                      <td style={{ fontSize: '0.82rem' }}>{s.phone || '—'}</td>
                      <td>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
                          background: `${ROLE_COLOR[s.vai_tro] || '#878797'}20`, color: ROLE_COLOR[s.vai_tro] || '#878797'
                        }}>
                          {ROLE_MAP[s.vai_tro] || `Vai trò ${s.vai_tro}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(s)} className="btn btn-secondary btn-sm">✏️</button>
                          <button onClick={() => { if(confirm(`Xóa tài khoản ${s.name}?`)) deleteMut.mutate(s.id) }}
                            className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: 'none' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }} onClick={() => resetForm()}>
          <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} style={{
            background: '#1c1c27', borderRadius: 16, padding: 28, maxWidth: 500, width: '100%',
            border: '1px solid rgba(255,255,255,.1)'
          }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>
              {editUser ? '✏️ Sửa tài khoản' : '➕ Thêm nhân viên'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Họ tên *</label>
                <input className="form-control" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Tên đăng nhập *</label>
                  <input className="form-control" required value={form.user} onChange={e => setForm(f => ({...f, user: e.target.value}))} disabled={!!editUser} />
                </div>
                {!editUser && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Mật khẩu *</label>
                    <input className="form-control" type="password" required value={form.pass} onChange={e => setForm(f => ({...f, pass: e.target.value}))} />
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Email *</label>
                <input className="form-control" type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>SĐT</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Vai trò</label>
                  <select className="form-control" value={form.vai_tro} onChange={e => setForm(f => ({...f, vai_tro: parseInt(e.target.value)}))}>
                    <option value={1}>Nhân viên</option>
                    <option value={3}>Quản lý rạp</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Địa chỉ</label>
                <input className="form-control" value={form.dia_chi} onChange={e => setForm(f => ({...f, dia_chi: e.target.value}))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" onClick={resetForm} className="btn btn-ghost">Hủy</button>
              <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn btn-primary">
                {(createMut.isPending || updateMut.isPending) ? 'Đang xử lý...' : (editUser ? 'Cập nhật' : 'Tạo tài khoản')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
