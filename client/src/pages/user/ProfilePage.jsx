import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'

const TABS = [['info', '👤 Thông tin'], ['password', '🔐 Đổi mật khẩu'], ['tickets', '🎟️ Vé của tôi']]
const RANK = { DONG: '🥉 Đồng', BAC: '🥈 Bạc', VANG: '🥇 Vàng', BACH_KIM: '💎 Bạch Kim' }

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const qc = useQueryClient()
  const [tab, setTab] = useState('info')
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', user: user?.user || '', phone: user?.phone || '', dia_chi: user?.dia_chi || '' })
  const [pwForm, setPwForm] = useState({ pass: '', passmoi: '', passmoi1: '' })
  const [imgFile, setImgFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState({ isOpen: false, id: null })

  const { data: tickets = [] } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: () => api.get('/ve/my').then(r => r.data.data),
    enabled: tab === 'tickets',
  })

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imgFile) fd.append('img', imgFile)
      await api.put('/tai-khoan/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await refreshUser()
      toast.success('Cập nhật hồ sơ thành công!')
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi cập nhật') }
    finally { setSaving(false) }
  }

  const handleChangePw = async (e) => {
    e.preventDefault()
    if (pwForm.passmoi !== pwForm.passmoi1) { toast.error('Mật khẩu mới không khớp'); return }
    setSaving(true)
    try {
      await api.put('/auth/change-password', pwForm)
      toast.success('Đổi mật khẩu thành công!')
      setPwForm({ pass: '', passmoi: '', passmoi1: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi đổi mật khẩu') }
    finally { setSaving(false) }
  }

  const handleCancelTicket = (id) => {
    setConfirm({ isOpen: true, id })
  }

  const confirmCancel = async () => {
    const id = confirm.id
    try {
      const { data } = await api.post(`/ve/${id}/huy`)
      toast.success(data.message || 'Hủy vé thành công')
      qc.invalidateQueries(['my-tickets'])
    } catch (err) {
      console.error('Cancel ticket error:', err)
      toast.error(err.response?.data?.message || 'Không thể hủy vé')
    } finally {
      setConfirm({ isOpen: false, id: null })
    }
  }

  const avatarSrc = user?.img ? (user.img.startsWith('http') ? user.img : user.img) : null
  const TRANG_THAI = { 0: ['Chờ TT', '#f59e0b'], 1: ['Đã thanh toán', '#22c55e'], 2: ['Đã dùng', '#878797'], 3: ['Đã hủy', '#e50914'], 4: ['Hết hạn', '#e50914'] }

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: 900 }}>
      {/* Profile header */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#e50914,#ff6b6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#fff', border: '3px solid rgba(229,9,20,.4)', overflow: 'hidden' }}>
              {avatarSrc ? <img src={avatarSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 4 }}>{user?.name}</h2>
            <div style={{ fontSize: '0.875rem', color: '#878797' }}>{user?.email} • {user?.phone}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(245,197,24,.15)', borderRadius: 8, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, color: '#f5c518' }}>
                ⭐ {user?.id_diem?.toLocaleString() || 0} điểm
              </div>
              {user?.hang_thanh_vien && (
                <div style={{ background: 'rgba(229,9,20,.15)', borderRadius: 8, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, color: '#e50914' }}>
                  {RANK[user.hang_thanh_vien.toUpperCase()] || user.hang_thanh_vien}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,.07)', marginBottom: 24 }}>
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: tab === key ? 700 : 500,
              color: tab === key ? '#e50914' : '#878797', borderBottom: tab === key ? '2px solid #e50914' : '2px solid transparent', marginBottom: -1, fontSize: '0.875rem' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Thông tin */}
      {tab === 'info' && (
        <div className="card">
          <div className="card-body" style={{ padding: 24 }}>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {[['name','Họ và tên','text'],['phone','Số điện thoại','text'],['email','Email','email'],['user','Tên đăng nhập','text'],['dia_chi','Địa chỉ','text']].map(([f, label, type]) => (
                  <div className="form-group" key={f} style={{ gridColumn: f === 'dia_chi' ? '1/-1' : undefined }}>
                    <label className="form-label">{label}</label>
                    <input type={type} className="form-control" value={form[f] || ''} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} />
                  </div>
                ))}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Ảnh đại diện</label>
                  <input type="file" className="form-control" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Đổi mật khẩu */}
      {tab === 'password' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-body" style={{ padding: 24 }}>
            <form onSubmit={handleChangePw}>
              {[['pass','Mật khẩu cũ'],['passmoi','Mật khẩu mới'],['passmoi1','Nhập lại mật khẩu mới']].map(([f, label]) => (
                <div className="form-group" key={f}>
                  <label className="form-label">{label}</label>
                  <input type="password" className="form-control" value={pwForm[f]} onChange={e => setPwForm(p => ({ ...p, [f]: e.target.value }))} required />
                </div>
              ))}
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? '⏳ Đang xử lý...' : '🔐 Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Vé */}
      {tab === 'tickets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎟️</div>
              <p style={{ color: '#878797' }}>Bạn chưa có vé nào</p>
            </div>
          ) : tickets.map(v => {
            const [label, color] = TRANG_THAI[v.trang_thai] || ['N/A', '#878797']
            return (
              <div key={v.id} className="card">
                <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{v.tieu_de}</div>
                    <div style={{ fontSize: '0.8rem', color: '#878797', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span>📅 {v.ngay_chieu}</span><span>⏰ {String(v.thoi_gian_chieu || '').slice(0,5)}</span>
                      <span>🏟️ {v.ten_rap}</span><span>💺 {v.ghe}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ background: `${color}22`, color, padding: '4px 12px', borderRadius: 20, fontWeight: 600, fontSize: '0.78rem' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: '#e50914' }}>{v.price?.toLocaleString('vi-VN')}đ</span>
                    {v.trang_thai === 1 && (
                      <button onClick={() => handleCancelTicket(v.id)} className="btn btn-sm" style={{ background: 'rgba(229,9,20,.15)', color: '#e50914', border: '1px solid rgba(229,9,20,.3)' }}>
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <ConfirmModal 
        isOpen={confirm.isOpen}
        title="Hủy vé xem phim"
        message="Bạn có chắc chắn muốn hủy vé này không? Tiền vé và điểm thưởng sẽ được xử lý theo chính sách của rạp."
        onConfirm={confirmCancel}
        onCancel={() => setConfirm({ isOpen: false, id: null })}
      />
    </div>
  )
}
