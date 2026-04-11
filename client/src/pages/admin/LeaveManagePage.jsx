import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function LeaveManagePage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const [confirm, setConfirm] = useState({ isOpen: false, id: null, status: '' })

  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ['admin-leaves'],
    queryFn: () => api.get('/nghi-phep').then(r => r.data.data),
  })

  const updateStatus = (id, status) => {
    setConfirm({ isOpen: true, id, status })
  }

  const handleConfirmAction = async () => {
    const { id, status } = confirm
    try {
      await api.patch(`/nghi-phep/${id}/status`, { trang_thai: status })
      toast.success('Đã cập nhật trạng thái đơn nghỉ phép')
      qc.invalidateQueries(['admin-leaves'])
    } catch (err) {
      console.error('Update status error:', err)
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setConfirm({ isOpen: false, id: null, status: '' })
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Chờ duyệt': return { background: 'rgba(245,158,11,.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,.3)' }
      case 'Đã duyệt': return { background: 'rgba(34,197,94,.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,.3)' }
      case 'Từ chối': return { background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }
      default: return { background: 'rgba(255,255,255,.05)', color: '#878797', border: '1px solid rgba(255,255,255,.1)' }
    }
  }

  return (
    <div className="admin-page page-enter" style={{ padding: 24 }}>
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>📋 Duyệt đơn nghỉ phép</h1>
        <div style={{ color: '#878797', fontSize: '0.9rem' }}>
          Theater: <span style={{ color: '#e8e8f0', fontWeight: 600 }}>{user?.rap_name || 'Hệ thống'}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '0.8rem', color: '#878797' }}>NHÂN VIÊN</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '0.8rem', color: '#878797' }}>THỜI GIAN NGHỈ</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '0.8rem', color: '#878797' }}>LÝ DO</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontSize: '0.8rem', color: '#878797' }}>TRẠNG THÁI</th>
                <th style={{ textAlign: 'right', padding: '16px 20px', fontSize: '0.8rem', color: '#878797' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#878797' }}>Không có đơn nghỉ phép nào cần xử lý.</td>
                </tr>
              ) : leaves.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700 }}>{l.ten_nhan_vien}</div>
                    <div style={{ fontSize: '0.75rem', color: '#878797' }}>Rạp: {l.ten_rap}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{new Date(l.tu_ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} → {new Date(l.den_ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#b0b0c0', maxWidth: 240 }}>
                    {l.ly_do}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ ...getStatusStyle(l.trang_thai), padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                      {l.trang_thai}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {l.trang_thai === 'Chờ duyệt' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <button onClick={() => updateStatus(l.id, 'Đã duyệt')}
                          style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Duyệt</button>
                        <button onClick={() => updateStatus(l.id, 'Từ chối')}
                          style={{ background: 'none', border: 'none', color: '#e50914', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Từ chối</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Xác nhận duyệt đơn"
        message={`Bạn có chắc chắn muốn ${confirm.status.toLowerCase()} đơn nghỉ phép này không?`}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirm({ isOpen: false, id: null, status: '' })}
        type={confirm.status === 'Đã duyệt' ? 'info' : 'danger'}
      />
    </div>
  )
}
