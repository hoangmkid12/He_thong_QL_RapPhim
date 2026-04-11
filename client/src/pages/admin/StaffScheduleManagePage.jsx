import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function StaffScheduleManagePage() {
  const { user } = useAuth()
  const [selectedRap, setSelectedRap] = useState(user?.id_rap || '')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ id_nhan_vien: '', gio_bat_dau: '08:00', gio_ket_thuc: '16:00', ca_lam: 'Ca sáng', ghi_chu: '' })
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })

  const { data: raps = [] } = useQuery({ 
    queryKey: ['raps-all'], 
    queryFn: () => api.get('/rap').then(r => r.data.data),
    select: (data) => user.vai_tro === 3 ? data.filter(r => r.id === user.id_rap) : data
  })
  
  // Lấy danh sách nhân viên của rạp
  const { data: staffs = [] } = useQuery({ 
    queryKey: ['staffs-rap', selectedRap], 
    queryFn: () => api.get(`/tai-khoan?vai_tro=1&id_rap=${selectedRap}`).then(r => r.data.data),
    enabled: !!selectedRap 
  })

  const { data: schedules = [], isLoading, refetch } = useQuery({
    queryKey: ['schedules-admin', selectedRap, selectedDate],
    queryFn: () => api.get(`/lich-lam-viec?id_rap=${selectedRap}&from=${selectedDate}&to=${selectedDate}`).then(r => r.data.data),
    enabled: !!selectedRap && !!selectedDate,
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await api.post('/lich-lam-viec', { ...form, id_rap: selectedRap, ngay: selectedDate })
      toast.success('Phân ca thành công!')
      refetch(); setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi phân ca') }
  }

  const handleDelete = (id) => {
    setConfirm({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = confirm.id
    try {
      await api.delete(`/lich-lam-viec/${id}`)
      toast.success('Đã xóa ca làm việc thành công')
      refetch()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Không thể xóa')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  const fmtTime = (t) => t?.slice(0, 5)

  return (
    <div className="admin-page page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem', marginBottom: 4 }}>👥 Quản lý Lịch làm việc</h1>
          <p style={{ color: '#878797', fontSize: '0.875rem' }}>Phân công ca trực và quản lý nhân sự tại hệ thống rạp.</p>
        </div>
        {selectedRap && (
          <button onClick={() => setModal('add')} className="btn btn-primary" style={{ padding: '10px 24px', boxShadow: '0 8px 24px rgba(229,9,20,.3)' }}>
            + Phân ca làm
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, background: '#1c1c27', border: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🏟️</span>
            <select className="form-control" style={{ paddingLeft: 40, width: '100%' }} value={selectedRap} onChange={e => setSelectedRap(e.target.value)} disabled={user.vai_tro === 3}>
              <option value="">{user.vai_tro === 3 ? 'Cơ sở của bạn' : '-- Chọn rạp để quản lý --'}</option>
              {raps.map(r => <option key={r.id} value={r.id}>{r.ten_rap}</option>)}
            </select>
          </div>
          <div style={{ position: 'relative', flex: 1, maxWidth: 200 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>📅</span>
            <input type="date" className="form-control" style={{ paddingLeft: 40, width: '100%' }} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </div>
        </div>
      </div>

      {!selectedRap ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px 40px', color: '#878797' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}>👥</div>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Vui lòng chọn rạp để xem danh sách lịch trực</p>
        </div>
      ) : isLoading ? <div className="loading-center" style={{ height: 300 }}><div className="spinner" /></div> : (
        <div className="card overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.05)' }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,.02)' }}>
                <th style={{ padding: '16px 20px', color: '#878797', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Nhân viên</th>
                <th style={{ padding: '16px', color: '#878797', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Ca trực</th>
                <th style={{ padding: '16px', color: '#878797', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Thời gian</th>
                <th style={{ padding: '16px', color: '#878797', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Ghi chú</th>
                <th style={{ padding: '16px', color: '#878797', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Trạng thái</th>
                <th style={{ padding: '16px 20px', color: '#878797', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.03)', transition: 'background .2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(229,9,20,.1)', color: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                        {s.ten_nhan_vien?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 700, color: '#e8e8f0' }}>{s.ten_nhan_vien}</div>
                    </div>
                  </td>
                  <td style={{ padding: '18px 16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(59,130,246,.15)', color: '#3b82f6' }}>
                      {s.ca_lam}
                    </span>
                  </td>
                  <td style={{ padding: '18px 16px', color: '#e8e8f0', fontWeight: 500 }}>
                    <span style={{ opacity: 0.6 }}>🕒</span> {fmtTime(s.gio_bat_dau)} - {fmtTime(s.gio_ket_thuc)}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#878797', fontSize: '0.875rem' }}>{s.ghi_chu || '-'}</td>
                  <td style={{ padding: '18px 16px' }}>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: 4, fontWeight: 700, background: s.trang_thai === 'lich' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)', color: s.trang_thai === 'lich' ? '#22c55e' : '#ef4444' }}>
                      {s.trang_thai === 'lich' ? 'ĐANG TRỰC' : 'TẠM NGHỈ'}
                    </span>
                  </td>
                  <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(s.id)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444', borderRadius: 8 }}>🗑️</button>
                  </td>
                </tr>
              ))}
              {schedules.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '60px 40px', color: '#878797' }}>Khung giờ này hiện chưa có nhân sự trực.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal === 'add' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="page-enter" style={{ background: '#13131a', borderRadius: 20, border: '1px solid rgba(255,255,255,.1)', padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 25px 50px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>+ Phân công ca trực</h3>
              <button onClick={() => setModal(null)} style={{ border: 'none', background: 'transparent', color: '#878797', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Chọn nhân sự trực *</label>
                <select className="form-control" style={{ height: 44 }} value={form.id_nhan_vien} onChange={e => setForm({...form, id_nhan_vien: e.target.value})} required>
                  <option value="">-- Danh sách nhân viên --</option>
                  {staffs.map(s => <option key={s.id} value={s.id}>{s.name} (@{s.user})</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Tên ca (VD: Ca hành chính, Ca đêm...)</label>
                <input type="text" className="form-control" style={{ height: 44 }} placeholder="Nhập tên ca làm" value={form.ca_lam} onChange={e => setForm({...form, ca_lam: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Bắt đầu *</label>
                  <input type="time" className="form-control" style={{ height: 44 }} value={form.gio_bat_dau} onChange={e => setForm({...form, gio_bat_dau: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Kết thúc *</label>
                  <input type="time" className="form-control" style={{ height: 44 }} value={form.gio_ket_thuc} onChange={e => setForm({...form, gio_ket_thuc: e.target.value})} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>Ghi chú công việc</label>
                <textarea className="form-control" style={{ padding: '12px' }} rows={3} placeholder="Ghi chú các đầu việc quan trọng..." value={form.ghi_chu} onChange={e => setForm({...form, ghi_chu: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setModal(null)} className="btn btn-ghost" style={{ flex: 1, height: 44 }}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, height: 44, fontWeight: 700 }}>Xác nhận phân ca</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xóa ca làm việc"
        message="Bạn có chắc chắn muốn xóa ca làm việc này không? Dữ liệu lịch sử sẽ không bị ảnh hưởng nhưng lịch trực sẽ biến mất."
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
