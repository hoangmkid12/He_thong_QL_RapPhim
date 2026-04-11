import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#0d0d14', borderTop: '1px solid rgba(255,255,255,.07)', marginTop: 'auto', padding: '40px 0 20px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 12 }}>🎬 Galaxy<span style={{ color: '#e50914' }}>Studio</span></div>
            <p style={{ color: '#878797', fontSize: '0.875rem', lineHeight: 1.7 }}>Hệ thống rạp chiếu phim hiện đại, mang đến trải nghiệm điện ảnh đẳng cấp thế giới.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 12, color: '#e8e8f0' }}>Khám phá</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Phim đang chiếu', '/phim'], ['Sắp chiếu', '/phim?sap_chieu=1'], ['Khuyến mãi', '/khuyen-mai'], ['Tin tức', '/tin-tuc']].map(([label, to]) => (
                <Link key={to} to={to} style={{ color: '#878797', fontSize: '0.875rem', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color='#e50914'} onMouseLeave={e => e.target.style.color='#878797'}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 12, color: '#e8e8f0' }}>Tài khoản</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Đăng nhập', '/dang-nhap'], ['Đăng ký', '/dang-ky'], ['Vé của tôi', '/ve-cua-toi'], ['Điểm thưởng', '/lich-su-diem']].map(([label, to]) => (
                <Link key={to} to={to} style={{ color: '#878797', fontSize: '0.875rem', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color='#e50914'} onMouseLeave={e => e.target.style.color='#878797'}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 12, color: '#e8e8f0' }}>Liên hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#878797', fontSize: '0.875rem' }}>
              <span>📧 galaxystudio@gmail.com</span>
              <span>📞 0976025124</span>
              <span>📍 TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, color: '#878797', fontSize: '0.8rem' }}>
          <span>© 2024 Galaxy Studio. All rights reserved.</span>
          <span>Made with ❤️ by CinePass Team</span>
        </div>
      </div>
    </footer>
  )
}
