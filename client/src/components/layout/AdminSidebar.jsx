import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { icon: '🏠', label: 'Dashboard', to: '/admin', roles: [1,2,3,4] },
  { icon: '🎬', label: 'Quản lý Phim', to: '/admin/phim', roles: [2,4] },
  { icon: '🏷️', label: 'Thể loại phim', to: '/admin/the-loai-phim', roles: [2,3,4] },
  { icon: '📅', label: 'Lịch chiếu', to: '/admin/lich-chieu', roles: [2,3,4] },
  { icon: '🏟️', label: 'Rạp chiếu', to: '/admin/rap', roles: [2,4] },
  { icon: '🚪', label: 'Phòng chiếu', to: '/admin/phong', roles: [2,3] },
  { icon: '🎟️', label: 'Quản lý Vé', to: '/admin/ve', roles: [1,2,3] },
  { icon: '📷', label: 'Quét Vé QR', to: '/admin/scan-ve', roles: [1,2,3] },
  { icon: '🍿', label: 'Combo', to: '/admin/combo', roles: [2,3] },
  { icon: '🏷️', label: 'Khuyến mãi', to: '/admin/khuyen-mai', roles: [2,3] },
  { icon: '👥', label: 'Tài khoản', to: '/admin/tai-khoan', roles: [2,3,4] },
  { icon: '📝', label: 'Duyệt nghỉ phép', to: '/admin/duyet-nghi-phep', roles: [2,3] },
  { icon: '📅', label: 'Lịch làm việc', to: '/admin/lich-lam-viec', roles: [2,3] },
  { icon: '🗓️', label: 'Lịch của tôi', to: '/admin/lich-cua-toi', roles: [1] },
  { icon: '✍️', label: 'Đăng ký nghỉ', to: '/admin/dang-ky-nghi', roles: [1] },
  { icon: '📊', label: 'Thống kê', to: '/admin/thong-ke', roles: [2,3,4] },
  { icon: '🎞️', label: 'Phân phối phim', to: '/admin/phan-phoi-phim', roles: [2,4] },
  { icon: '🧑‍💼', label: 'NV các rạp', to: '/admin/nhan-vien-rap', roles: [2,4] },
  { icon: '⏰', label: 'Chấm công', to: '/admin/cham-cong', roles: [2,3] },
  { icon: '💰', label: 'Bảng lương', to: '/admin/bang-luong', roles: [2,3] },
  { icon: '🔧', label: 'Thiết bị', to: '/admin/thiet-bi', roles: [2,3] },
  { icon: '💬', label: 'Bình luận', to: '/admin/binh-luan', roles: [2,3] },
  { icon: '🎫', label: 'Bán vé (POS)', to: '/admin/pos', roles: [1,3] },
  { icon: '📷', label: 'Tự chấm công', to: '/admin/cham-cong-ca-nhan', roles: [1] },
  { icon: '📊', label: 'Báo cáo cá nhân', to: '/admin/bao-cao-ca-nhan', roles: [1] },
]

export default function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const ROLE_LABEL = { '-1':'Khách',0:'Khách hàng',1:'Nhân viên',2:'Admin',3:'QL Rạp',4:'QL Cụm' }

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <NavLink to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <span style={{ fontSize: '1.5rem' }}>🎬</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#e8e8f0' }}>Galaxy<span style={{ color: '#e50914' }}>Studio</span></div>
            <div style={{ fontSize: '0.7rem', color: '#878797' }}>Admin Panel</div>
          </div>
        </NavLink>
      </div>

      {/* User info */}
      {user && (
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#e50914,#ff6b6b)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:600, fontSize:'0.875rem', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize:'0.72rem', color:'#e50914', fontWeight:600 }}>{ROLE_LABEL[user.vai_tro] || 'Admin'}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex:1, padding:'12px 8px', overflowY:'auto' }}>
        {MENU.filter(m => !user || m.roles.includes(user.vai_tro)).map(item => (
          <NavLink
            key={item.to} to={item.to} end={item.to === '/admin'}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
              borderRadius:8, marginBottom:2, textDecoration:'none', fontWeight:500,
              fontSize:'0.875rem', transition:'background .15s, color .15s',
              background: isActive ? 'rgba(229,9,20,.15)' : 'transparent',
              color: isActive ? '#e50914' : '#878797',
              borderLeft: isActive ? '2px solid #e50914' : '2px solid transparent',
            })}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
        <NavLink to="/" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, color:'#878797', textDecoration:'none', fontSize:'0.875rem', marginBottom:4, transition:'color .15s,background .15s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.color='#e8e8f0'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#878797'}}>
          🌐 Xem trang web
        </NavLink>
        <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, color:'#e50914', border:'none', background:'transparent', cursor:'pointer', fontSize:'0.875rem', width:'100%', transition:'background .15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(229,9,20,.1)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  )
}
