import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const STATUS_MAP = { tot: 'Tốt', can_bao_tri: 'Cần bảo trì', hong: 'Hỏng' }
const STATUS_COLOR = { tot: '#22c55e', can_bao_tri: '#f59e0b', hong: '#ef4444' }

export default function EquipmentPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const [selectedRap, setSelectedRap] = useState(user?.vai_tro === 3 ? user.id_rap : null)
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ id_phong: '', ten_thiet_bi: '', so_luong: 1, tinh_trang: 'tot', ghi_chu: '' })

  const { data: raps = [] } = useQuery({ queryKey: ['raps'], queryFn: () => api.get('/rap').then(r => r.data.data), enabled: user?.vai_tro !== 3 })
  const rapId = user?.vai_tro === 3 ? user.id_rap : selectedRap

  const { data: items = [] } = useQuery({
    queryKey: ['thietbi', rapId, filterStatus],
    queryFn: () => api.get(`/thiet-bi?id_rap=${rapId}${filterStatus ? `&tinh_trang=${filterStatus}` : ''}`).then(r => r.data.data),
    enabled: !!rapId
  })

  const { data: phongs = [] } = useQuery({
    queryKey: ['phong-rap', rapId],
    queryFn: () => api.get(`/thiet-bi/phong/${rapId}`).then(r => r.data.data),
    enabled: !!rapId
  })

  const saveMut = useMutation({
    mutationFn: (d) => editItem ? api.put(`/thiet-bi/${editItem.id}`, d) : api.post('/thiet-bi', d),
    onSuccess: () => { toast.success(editItem ? 'Cập nhật thành công' : 'Thêm thiết bị thành công'); qc.invalidateQueries({ queryKey: ['thietbi'] }); resetForm() },
    onError: (e) => toast.error(e.response?.data?.message || 'Lỗi')
  })

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/thiet-bi/${id}`),
    onSuccess: () => { toast.success('Xóa thành công'); qc.invalidateQueries({ queryKey: ['thietbi'] }) }
  })

  const resetForm = () => { setShowForm(false); setEditItem(null); setForm({ id_phong: '', ten_thiet_bi: '', so_luong: 1, tinh_trang: 'tot', ghi_chu: '' }) }

  const openEdit = (item) => {
    setEditItem(item)
    setForm({ id_phong: item.id_phong, ten_thiet_bi: item.ten_thiet_bi, so_luong: item.so_luong, tinh_trang: item.tinh_trang, ghi_chu: item.ghi_chu || '' })
    setShowForm(true)
  }

  // Group by phong
  const grouped = {}
  items.forEach(i => {
    const key = `${i.ten_phong} (${i.loai_phong})`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(i)
  })

  const totCount = items.filter(i => i.tinh_trang === 'tot').length
  const baoTriCount = items.filter(i => i.tinh_trang === 'can_bao_tri').length
  const hongCount = items.filter(i => i.tinh_trang === 'hong').length

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>🔧 Quản lý thiết bị / Tài sản</h1>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {user?.vai_tro !== 3 && (
          <select className="form-control" value={selectedRap || ''} onChange={e => setSelectedRap(Number(e.target.value))} style={{ width: 220 }}>
            <option value="">-- Chọn rạp --</option>
            {raps.map(r => <option key={r.id} value={r.id}>{r.ten_rap}</option>)}
          </select>
        )}
        <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 160 }}>
          <option value="">Tất cả trạng thái</option>
          <option value="tot">✅ Tốt</option>
          <option value="can_bao_tri">⚠️ Cần bảo trì</option>
          <option value="hong">❌ Hỏng</option>
        </select>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary" disabled={!rapId}>+ Thêm thiết bị</button>
      </div>

      {/* Summary cards */}
      {rapId && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Tổng thiết bị', value: items.length, color: '#3b82f6' },
            { label: 'Hoạt động tốt', value: totCount, color: '#22c55e' },
            { label: 'Cần bảo trì', value: baoTriCount, color: '#f59e0b' },
            { label: 'Hỏng', value: hongCount, color: '#ef4444' },
          ].map((c, i) => (
            <div key={i} style={{ background: `${c.color}10`, border: `1px solid ${c.color}30`, borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: c.color }}>{c.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#878797', marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Grouped table */}
      {rapId ? Object.entries(grouped).length > 0 ? Object.entries(grouped).map(([phong, list]) => (
        <div key={phong} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', fontWeight: 700, fontSize: '0.95rem' }}>
            🚪 Phòng {phong}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr><th>Thiết bị</th><th>Số lượng</th><th>Tình trạng</th><th>Ghi chú</th><th>Hành động</th></tr>
              </thead>
              <tbody>
                {list.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.ten_thiet_bi}</td>
                    <td>{item.so_luong}</td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: `${STATUS_COLOR[item.tinh_trang]}20`, color: STATUS_COLOR[item.tinh_trang] }}>
                        {STATUS_MAP[item.tinh_trang]}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#878797' }}>{item.ghi_chu || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(item)} className="btn btn-secondary btn-sm">✏️</button>
                        <button onClick={() => { if(confirm('Xóa thiết bị này?')) deleteMut.mutate(item.id) }} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: 'none' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )) : <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}>Chưa có thiết bị nào</div>
      : <div style={{ textAlign: 'center', padding: '60px 0', color: '#878797' }}>Vui lòng chọn rạp</div>}

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={resetForm}>
          <form onSubmit={e => { e.preventDefault(); saveMut.mutate(form) }} onClick={e => e.stopPropagation()} style={{ background: '#1c1c27', borderRadius: 16, padding: 28, maxWidth: 460, width: '100%', border: '1px solid rgba(255,255,255,.1)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>{editItem ? '✏️ Sửa thiết bị' : '➕ Thêm thiết bị'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Phòng chiếu *</label>
                <select className="form-control" required value={form.id_phong} onChange={e => setForm(f => ({...f, id_phong: e.target.value}))}>
                  <option value="">-- Chọn phòng --</option>
                  {phongs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.loai_phong})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Tên thiết bị *</label>
                <input className="form-control" required value={form.ten_thiet_bi} onChange={e => setForm(f => ({...f, ten_thiet_bi: e.target.value}))} placeholder="VD: Máy chiếu, Loa, Ghế..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Số lượng</label>
                  <input type="number" min="1" className="form-control" value={form.so_luong} onChange={e => setForm(f => ({...f, so_luong: e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Tình trạng</label>
                  <select className="form-control" value={form.tinh_trang} onChange={e => setForm(f => ({...f, tinh_trang: e.target.value}))}>
                    <option value="tot">✅ Tốt</option>
                    <option value="can_bao_tri">⚠️ Cần bảo trì</option>
                    <option value="hong">❌ Hỏng</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Ghi chú</label>
                <input className="form-control" value={form.ghi_chu} onChange={e => setForm(f => ({...f, ghi_chu: e.target.value}))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" onClick={resetForm} className="btn btn-ghost">Hủy</button>
              <button type="submit" disabled={saveMut.isPending} className="btn btn-primary">{saveMut.isPending ? '...' : (editItem ? 'Cập nhật' : 'Thêm')}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
