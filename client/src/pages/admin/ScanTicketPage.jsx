import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ScanTicketPage() {
  const qc = useQueryClient()
  const [ticketId, setTicketId] = useState('')
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(false)

  const scanMutation = useMutation({
    mutationFn: (id_ve) => api.post('/scan-ve', { id_ve: parseInt(id_ve) }).then(r => r.data),
    onSuccess: (data) => { setResult({ success: true, data: data.data, message: data.message }); toast.success(data.message) },
    onError: (err) => { setResult({ success: false, message: err.response?.data?.message || 'Lỗi quét vé', data: err.response?.data?.data }); toast.error(err.response?.data?.message || 'Lỗi quét vé') },
  })

  const { data: history = [] } = useQuery({
    queryKey: ['scan-history'],
    queryFn: () => api.get('/scan-ve/history').then(r => r.data.data),
    refetchInterval: 15000,
  })

  const handleScan = () => {
    if (!ticketId.trim()) return
    const id = ticketId.trim().replace(/[^0-9]/g, '')
    if (!id) { toast.error('Mã vé không hợp lệ'); return }
    setResult(null); scanMutation.mutate(id)
  }

  const TRANGTHAI_MAP = { 0: ['Chờ thanh toán','#f59e0b'], 1: ['Đã thanh toán','#22c55e'], 2: ['Đã sử dụng','#878797'], 3: ['Đã hủy','#e50914'], 4: ['Quá hạn','#e50914'] }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>📷 Quét Vé QR</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
        {/* Input */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Nhập mã vé</h3>
            <div className="form-group">
              <label className="form-label">Mã hoặc số ID vé</label>
              <input
                className="form-control" placeholder="VD: 123 hoặc #VE123"
                value={ticketId} onChange={e => setTicketId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
                autoFocus
              />
            </div>
            <button onClick={handleScan} disabled={scanMutation.isLoading || !ticketId.trim()} className="btn btn-primary w-full" style={{ width: '100%' }}>
              {scanMutation.isLoading ? '...Đang kiểm tra' : '🔍 Xác nhận vé'}
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="card" style={{ border: result ? (result.success ? '1px solid rgba(34,197,94,.4)' : '1px solid rgba(229,9,20,.4)') : undefined }}>
          <div className="card-body">
            {!result ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#878797' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
                <p>Nhập mã vé để kiểm tra</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: '2.5rem' }}>{result.success ? '✅' : '❌'}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: result.success ? '#22c55e' : '#e50914' }}>{result.message}</div>
                  </div>
                </div>
                {result.data && (
                  <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        ['Mã vé', `#VE${result.data.id}`],
                        ['Khách hàng', result.data.ten_kh],
                        ['Phim', result.data.tieu_de],
                        ['Ghế', result.data.ghe],
                        ['Ngày chiếu', result.data.ngay_chieu],
                        ['Giờ chiếu', result.data.thoi_gian_chieu?.slice(0,5)],
                        ['Phòng', result.data.tenphong],
                        ['Rạp', result.data.ten_rap],
                        ['Trạng thái', TRANGTHAI_MAP[result.data.trang_thai]?.[0] || 'N/A'],
                      ].map(([label, value]) => value && (
                        <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                          <td style={{ padding: '7px 0', color: '#878797', width: 130 }}>{label}</td>
                          <td style={{ padding: '7px 0', fontWeight: 600 }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <button onClick={() => { setResult(null); setTicketId('') }} className="btn btn-ghost" style={{ marginTop: 16, width: '100%' }}>
                  Quét vé mới
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card">
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🕒 Lịch sử check-in hôm nay</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)', color: '#878797' }}>
                  {['Mã vé', 'Phim', 'Khách hàng', 'Ghế', 'Trạng thái'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(v => {
                  const [label, color] = TRANGTHAI_MAP[v.trang_thai] || ['N/A', '#878797']
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#e50914' }}>#{v.id}</td>
                      <td style={{ padding: '10px 12px' }}>{v.tieu_de}</td>
                      <td style={{ padding: '10px 12px', color: '#878797' }}>{v.ten_kh}</td>
                      <td style={{ padding: '10px 12px' }}>{v.ghe}</td>
                      <td style={{ padding: '10px 12px' }}><span className="badge" style={{ background: `${color}22`, color }}>{label}</span></td>
                    </tr>
                  )
                })}
                {history.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#878797' }}>Chưa có lịch sử check-in</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
