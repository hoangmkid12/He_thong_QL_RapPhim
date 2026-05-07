import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AttendancePage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const [selectedRap, setSelectedRap] = useState(user?.vai_tro === 3 ? user.id_rap : null)
  const [dateFilter, setDateFilter] = useState(today)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ id_nv: '', ngay: today, gio_vao: '08:00', gio_ra: '17:00', ghi_chu: '' })
  const [editId, setEditId] = useState(null)
  const [viewImg, setViewImg] = useState(null)

  const { data: raps = [] } = useQuery({ queryKey: ['raps'], queryFn: () => api.get('/rap').then(r => r.data.data), enabled: user?.vai_tro !== 3 })
  const rapId = user?.vai_tro === 3 ? user.id_rap : selectedRap

  const { data: records = [] } = useQuery({
    queryKey: ['chamcong', rapId, dateFilter],
    queryFn: () => api.get(`/cham-cong?id_rap=${rapId}&ngay_tu=${dateFilter}&ngay_den=${dateFilter}`).then(r => r.data.data),
    enabled: !!rapId
  })

  const { data: staffList = [] } = useQuery({
    queryKey: ['staff-rap', rapId],
    queryFn: () => api.get(`/cham-cong/staff/${rapId}`).then(r => r.data.data),
    enabled: !!rapId
  })

  const createMut = useMutation({
    mutationFn: (d) => editId ? api.put(`/cham-cong/${editId}`, d) : api.post('/cham-cong', { ...d, id_rap: rapId }),
    onSuccess: () => { toast.success(editId ? 'Cập nhật thành công' : 'Chấm công thành công'); qc.invalidateQueries({ queryKey: ['chamcong'] }); resetForm() },
    onError: (e) => toast.error(e.response?.data?.message || 'Lỗi')
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/cham-cong/${id}`),
    onSuccess: () => { toast.success('Xóa thành công'); qc.invalidateQueries({ queryKey: ['chamcong'] }) },
    onError: (e) => toast.error(e.response?.data?.message || 'Lỗi')
  })

  const resetForm = () => { setShowForm(false); setEditId(null); setForm({ id_nv: '', ngay: today, gio_vao: '08:00', gio_ra: '17:00', ghi_chu: '' }) }

  const openEdit = (r) => {
    setEditId(r.id)
    setForm({ id_nv: r.id_nv, ngay: r.ngay, gio_vao: r.gio_vao?.slice(0,5), gio_ra: r.gio_ra?.slice(0,5), ghi_chu: r.ghi_chu || '' })
    setShowForm(true)
  }

  const calcHours = (vao, ra) => {
    if (!vao || !ra || ra === '00:00:00') return '—'
    const [h1,m1] = vao.split(':').map(Number)
    const [h2,m2] = ra.split(':').map(Number)
    const diff = (h2*60+m2) - (h1*60+m1)
    return diff > 0 ? `${(diff/60).toFixed(1)}h` : '—'
  }

  const STATUS_COLOR = { present: '#22c55e', late: '#f59e0b', absent: '#ef4444' }

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>⏰ Chấm công nhân viên</h1>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {user?.vai_tro !== 3 && (
          <select className="form-control" value={selectedRap || ''} onChange={e => setSelectedRap(Number(e.target.value))} style={{ width: 220 }}>
            <option value="">-- Chọn rạp --</option>
            {raps.map(r => <option key={r.id} value={r.id}>{r.ten_rap}</option>)}
          </select>
        )}
        <input type="date" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 180 }} />
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary" disabled={!rapId}>+ Chấm công</button>
        <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: '#878797' }}>
          📊 {records.length} bản ghi
        </div>
      </div>

      {/* Table */}
      {rapId ? (
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nhân viên</th>
                  <th>Ngày</th>
                  <th>Giờ vào</th>
                  <th>Giờ ra</th>
                  <th>Số giờ</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: '#878797' }}>Không có dữ liệu chấm công ngày này</td></tr>
                ) : records.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ color: '#878797' }}>{i+1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.ten_nv}</div>
                      <div style={{ fontSize: '0.72rem', color: '#878797' }}>@{r.username}</div>
                    </td>
                    <td>{r.ngay?.split('T')[0]}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#22c55e', fontWeight: 600, fontFamily: 'monospace' }}>{r.gio_vao?.slice(0,5)}</span>
                        {r.anh_vao && <button onClick={() => setViewImg(r.anh_vao)} title="Xem ảnh Check-IN" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '0.75rem', borderRadius: 4, color: '#e8e8f0' }}>Xem ảnh</button>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: r.gio_ra === '00:00:00' ? '#878797' : '#3b82f6', fontWeight: 600, fontFamily: 'monospace' }}>{r.gio_ra === '00:00:00' ? '—' : r.gio_ra?.slice(0,5)}</span>
                        {r.anh_ra && <button onClick={() => setViewImg(r.anh_ra)} title="Xem ảnh Check-OUT" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '0.75rem', borderRadius: 4, color: '#e8e8f0' }}>Xem ảnh</button>}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{calcHours(r.gio_vao, r.gio_ra)}</td>
                    <td style={{ fontSize: '0.8rem', color: '#878797', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ghi_chu || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(r)} className="btn btn-secondary btn-sm">✏️</button>
                        <button onClick={() => { if(confirm('Xóa bản ghi này?')) deleteMut.mutate(r.id) }} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: 'none' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}>Vui lòng chọn rạp để xem chấm công</div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => resetForm()}>
          <form onSubmit={e => { e.preventDefault(); createMut.mutate(form) }} onClick={e => e.stopPropagation()} style={{ background: '#1c1c27', borderRadius: 16, padding: 28, maxWidth: 460, width: '100%', border: '1px solid rgba(255,255,255,.1)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>{editId ? '✏️ Sửa chấm công' : '⏰ Chấm công nhân viên'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {!editId && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Nhân viên *</label>
                  <select className="form-control" required value={form.id_nv} onChange={e => setForm(f => ({...f, id_nv: e.target.value}))}>
                    <option value="">-- Chọn nhân viên --</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.name} (@{s.user})</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Ngày *</label>
                <input type="date" className="form-control" required value={form.ngay} onChange={e => setForm(f => ({...f, ngay: e.target.value}))} disabled={!!editId} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Giờ vào *</label>
                  <input type="time" className="form-control" required value={form.gio_vao} onChange={e => setForm(f => ({...f, gio_vao: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Giờ ra</label>
                  <input type="time" className="form-control" value={form.gio_ra} onChange={e => setForm(f => ({...f, gio_ra: e.target.value}))} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Ghi chú</label>
                <input className="form-control" value={form.ghi_chu} onChange={e => setForm(f => ({...f, ghi_chu: e.target.value}))} placeholder="VD: Đi muộn 15 phút..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" onClick={resetForm} className="btn btn-ghost">Hủy</button>
              <button type="submit" disabled={createMut.isPending} className="btn btn-primary">
                {createMut.isPending ? 'Đang xử lý...' : (editId ? 'Cập nhật' : 'Chấm công')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Modal */}
      {viewImg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setViewImg(null)}>
          <div style={{ position: 'relative', maxWidth: 800, width: '100%' }}>
            <button onClick={() => setViewImg(null)} style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
            <img src={viewImg} style={{ width: '100%', height: 'auto', borderRadius: 8 }} alt="Chấm công" />
          </div>
        </div>
      )}
    </div>
  )
}
