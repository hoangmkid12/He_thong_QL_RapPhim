import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function LuongPage() {
  const qc = useQueryClient()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ thuong: 0, khau_tru: 0, ghi_chu: '', trang_thai_thanh_toan: 'chua_thanh_toan' })

  const { data: salaries = [], isLoading } = useQuery({
    queryKey: ['luong', selectedMonth],
    queryFn: () => api.get(`/luong?thang=${selectedMonth}`).then(r => r.data.data)
  })

  const calcMut = useMutation({
    mutationFn: () => api.post('/luong/calculate', { thang: selectedMonth }),
    onSuccess: (data) => {
      toast.success(data.data.message || 'Đã tổng hợp lương thành công')
      qc.invalidateQueries({ queryKey: ['luong'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi tổng hợp lương')
  })

  const updateMut = useMutation({
    mutationFn: () => api.put(`/luong/${editId}`, form),
    onSuccess: () => {
      toast.success('Cập nhật thành công')
      setEditId(null)
      qc.invalidateQueries({ queryKey: ['luong'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi cập nhật')
  })

  const openEdit = (s) => {
    setEditId(s.id)
    setForm({ thuong: s.thuong || 0, khau_tru: s.khau_tru || 0, ghi_chu: s.ghi_chu || '', trang_thai_thanh_toan: s.trang_thai_thanh_toan || 'chua_thanh_toan' })
  }

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontWeight: 800 }}>💰 Bảng lương nhân viên</h1>
          <p style={{ color: '#878797', marginTop: 4 }}>Quản lý lương, thưởng và trạng thái thanh toán</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#878797', marginBottom: 6 }}>Chọn tháng</label>
            <input 
              type="month" 
              className="form-control" 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
          <button 
            onClick={() => calcMut.mutate()} 
            disabled={calcMut.isPending}
            className="btn btn-primary"
          >
            {calcMut.isPending ? 'Đang tính toán...' : '🧮 Tổng hợp lương tháng này'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div style={{ overflowX: 'auto' }}>
            {isLoading ? <p>Đang tải dữ liệu...</p> : (
              <table className="table" style={{ whiteSpace: 'nowrap' }}>
                <thead>
                  <tr>
                    <th>Nhân viên</th>
                    <th>Rạp</th>
                    <th>Giờ làm</th>
                    <th>Lương/Giờ</th>
                    <th>Thưởng</th>
                    <th>Khấu trừ</th>
                    <th>Tổng lương</th>
                    <th>Trạng thái</th>
                    <th width="100"></th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.length === 0 && (
                    <tr><td colSpan={9} style={{ textAlign: 'center', color: '#878797', padding: 40 }}>Chưa có dữ liệu bảng lương tháng này. Hãy bấm "Tổng hợp lương"</td></tr>
                  )}
                  {salaries.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.ten_nv}</div>
                        <div style={{ fontSize: '0.75rem', color: '#878797' }}>@{s.username}</div>
                      </td>
                      <td>{s.ten_rap}</td>
                      <td><strong style={{ color: '#3b82f6' }}>{s.so_gio}h</strong></td>
                      <td>{formatMoney(s.luong_theo_gio)}</td>
                      <td style={{ color: '#10b981' }}>+{formatMoney(s.thuong)}</td>
                      <td style={{ color: '#ef4444' }}>-{formatMoney(s.khau_tru)}</td>
                      <td><strong style={{ fontSize: '1.1rem', color: '#f59e0b' }}>{formatMoney(s.tong_luong)}</strong></td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600,
                          background: s.trang_thai_thanh_toan === 'da_thanh_toan' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: s.trang_thai_thanh_toan === 'da_thanh_toan' ? '#10b981' : '#ef4444'
                        }}>
                          {s.trang_thai_thanh_toan === 'da_thanh_toan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => openEdit(s)} className="btn btn-secondary btn-sm">✏️ Chỉnh sửa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {editId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setEditId(null)}>
          <form onSubmit={e => { e.preventDefault(); updateMut.mutate() }} onClick={e => e.stopPropagation()} style={{ background: '#1c1c27', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', border: '1px solid rgba(255,255,255,.1)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>✏️ Cập nhật lương</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Thưởng thêm (VNĐ)</label>
                <input type="number" className="form-control" value={form.thuong} onChange={e => setForm({...form, thuong: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Khấu trừ (VNĐ)</label>
                <input type="number" className="form-control" value={form.khau_tru} onChange={e => setForm({...form, khau_tru: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Trạng thái thanh toán</label>
                <select className="form-control" value={form.trang_thai_thanh_toan} onChange={e => setForm({...form, trang_thai_thanh_toan: e.target.value})}>
                  <option value="chua_thanh_toan">Chưa thanh toán</option>
                  <option value="da_thanh_toan">Đã thanh toán</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#878797', marginBottom: 4, display: 'block' }}>Ghi chú</label>
                <textarea className="form-control" value={form.ghi_chu} onChange={e => setForm({...form, ghi_chu: e.target.value})} rows={3} placeholder="Ghi chú thêm..."></textarea>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" onClick={() => setEditId(null)} className="btn btn-ghost">Hủy</button>
              <button type="submit" disabled={updateMut.isPending} className="btn btn-primary">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
