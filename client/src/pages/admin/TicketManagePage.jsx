import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TRANG_THAI = { 0: ['Chờ TT', '#f59e0b'], 1: ['Đã TT', '#22c55e'], 2: ['Đã dùng', '#878797'], 3: ['Đã hủy', '#e50914'], 4: ['Hết hạn', '#e50914'] }

export default function TicketManagePage() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets-admin', filter, search],
    queryFn: () => api.get(`/ve/admin${filter ? `?trang_thai=${filter}` : ''}${search ? `&search=${search}` : ''}`).then(r => r.data.data),
  })

  const updateStatus = async (id, trang_thai) => {
    try { await api.put(`/ve/${id}/trang-thai`, { trang_thai }); toast.success('Đã cập nhật'); qc.invalidateQueries(['tickets-admin']) }
    catch { toast.error('Lỗi') }
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>🎟️ Quản lý Vé</h1>
        <span style={{ color: '#878797', fontSize: '0.875rem' }}>{tickets.length} vé</span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 8, padding: 4 }}>
          {[['', 'Tất cả'], ['0', 'Chờ TT'], ['1', 'Đã TT'], ['2', 'Đã dùng'], ['3', 'Đã hủy']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: filter === v ? '#e50914' : 'transparent', color: filter === v ? '#fff' : '#878797', transition: '.15s' }}>
              {l}
            </button>
          ))}
        </div>
        <input className="form-control" style={{ flex: 1, maxWidth: 300 }} placeholder="Tìm mã vé, tên, phim..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)', color: '#878797' }}>
                {['#VE', 'Phim', 'Khách hàng', 'Ghế', 'Giờ chiếu', 'Giá', 'Trạng thái', 'Hành động'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32 }}><div className="spinner" style={{ margin: 'auto' }} /></td></tr> :
                tickets.map(v => {
                  const [label, color] = TRANG_THAI[v.trang_thai] || ['N/A', '#878797']
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <td style={{ padding: '11px 14px', color: '#e50914', fontWeight: 700 }}>#{v.id}</td>
                      <td style={{ padding: '11px 14px', maxWidth: 180 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{v.tieu_de}</div>
                        <div style={{ fontSize: '0.72rem', color: '#878797' }}>{v.ten_rap}</div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <div>{v.ten_kh || 'Khách'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#878797' }}>{v.email_kh}</div>
                      </td>
                      <td style={{ padding: '11px 14px', fontWeight: 600 }}>{v.ghe}</td>
                      <td style={{ padding: '11px 14px', color: '#878797' }}>
                        <div>{new Date(v.ngay_chieu).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                        <div style={{ fontWeight: 600, color: '#e8e8f0' }}>{String(v.thoi_gian_chieu || '').slice(0, 5)}</div>
                      </td>
                      <td style={{ padding: '11px 14px', color: '#e50914', fontWeight: 700 }}>{(v.gia_ghe || 0).toLocaleString('vi-VN')}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ background: `${color}22`, color, padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.75rem' }}>{label}</span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <select value={v.trang_thai} onChange={e => updateStatus(v.id, parseInt(e.target.value))}
                          style={{ background: '#1c1c27', border: '1px solid rgba(255,255,255,.1)', color: '#e8e8f0', borderRadius: 6, padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          {Object.entries(TRANG_THAI).map(([val, [lbl]]) => <option key={val} value={val}>{lbl}</option>)}
                        </select>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          {!isLoading && tickets.length === 0 && <div style={{ textAlign: 'center', padding: '32px', color: '#878797' }}>Không có vé nào</div>}
        </div>
      </div>
    </div>
  )
}
