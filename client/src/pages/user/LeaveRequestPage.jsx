import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function LeaveRequestPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState({ tu_ngay: '', den_ngay: '', ly_do: '' })
  const [submitting, setSubmitting] = useState(false)

  const { data: myLeaves = [], isLoading } = useQuery({
    queryKey: ['my-leaves'],
    queryFn: () => api.get('/nghi-phep').then(r => r.data.data),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.tu_ngay || !form.den_ngay || !form.ly_do) return toast.error('Vui lòng điền đầy đủ')
    setSubmitting(true)
    try {
      await api.post('/nghi-phep', form)
      toast.success('Đã gửi đơn nghỉ phép')
      setForm({ tu_ngay: '', den_ngay: '', ly_do: '', tu_ngay_ui: '', den_ngay_ui: '' })
      qc.invalidateQueries(['my-leaves'])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gửi đơn')
    } finally { setSubmitting(false) }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Chờ duyệt': return { background: 'rgba(245,158,11,.15)', color: '#f59e0b' }
      case 'Đã duyệt': return { background: 'rgba(34,197,94,.15)', color: '#22c55e' }
      case 'Từ chối': return { background: 'rgba(229,9,20,.15)', color: '#e50914' }
      default: return { background: 'rgba(255,255,255,.05)', color: '#878797' }
    }
  }

  return (
    <div className="container page-enter" style={{ padding: '32px 16px', maxWidth: 900 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>📝 Đăng ký nghỉ phép</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Form nộp đơn */}
        <div>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Nộp đơn mới</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Từ ngày (dd/mm/yyyy)</label>
                  <input type="text" className="form-control" value={form.tu_ngay_ui || ''} 
                    onChange={e => {
                      const v = e.target.value;
                      setForm(p => ({ ...p, tu_ngay_ui: v }));
                      if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                        const [d, m, y] = v.split('/');
                        setForm(p => ({ ...p, tu_ngay: `${y}-${m}-${d}` }));
                      }
                    }} 
                    placeholder="dd/mm/yyyy" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Đến ngày (dd/mm/yyyy)</label>
                  <input type="text" className="form-control" value={form.den_ngay_ui || ''} 
                    onChange={e => {
                      const v = e.target.value;
                      setForm(p => ({ ...p, den_ngay_ui: v }));
                      if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                        const [d, m, y] = v.split('/');
                        setForm(p => ({ ...p, den_ngay: `${y}-${m}-${d}` }));
                      }
                    }} 
                    placeholder="dd/mm/yyyy" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Lý do nghỉ</label>
                  <textarea className="form-control" rows={4} value={form.ly_do} onChange={e => setForm({ ...form, ly_do: e.target.value })} placeholder="VD: Việc gia đình, ốm đau..." required />
                </div>
                <button disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                  {submitting ? 'Đang gửi...' : 'Gửi đơn ngay'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Lịch sử đơn */}
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Lịch sử nghỉ phép</h3>
          {isLoading ? <div className="spinner" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myLeaves.length === 0 ? (
                <p style={{ color: '#878797', textAlign: 'center', padding: 20 }}>Bạn chưa có đơn nghỉ phép nào.</p>
              ) : (
                myLeaves.map(l => (
                  <div key={l.id} className="card">
                    <div className="card-body" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          📅 {new Date(l.tu_ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} → {new Date(l.den_ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span style={{ ...getStatusStyle(l.trang_thai), padding: '2px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                          {l.trang_thai}
                        </span>
                      </div>
                      <p style={{ color: '#878797', fontSize: '0.85rem', marginBottom: 4 }}>
                        Lý do: <span style={{ color: '#e8e8f0' }}>{l.ly_do}</span>
                      </p>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>
                        Nộp ngày: {new Date(l.ngay_tao).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
