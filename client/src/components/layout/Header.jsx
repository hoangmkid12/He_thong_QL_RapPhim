import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import styles from './Header.module.css'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [genres, setGenres] = useState([])
  const [raps, setRaps] = useState([])
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    api.get('/phim/loai').then(r => setGenres(r.data.data || [])).catch(() => {})
    api.get('/rap').then(r => setRaps(r.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/phim?search=${encodeURIComponent(search.trim())}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎬</span>
          <span>Galaxy<span className={styles.logoAccent}>Studio</span></span>
        </Link>

        {/* Hamburger (mobile) */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>

        {/* Nav */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link to="/phim" className={styles.navLink}>Phim</Link>

          <div className={styles.dropdown}>
            <button className={styles.navLink}>Thể loại ▾</button>
            <div className={styles.dropdownMenu}>
              {genres.map(g => (
                <Link key={g.id} to={`/the-loai/${g.id}`} className={styles.dropdownItem}>{g.name}</Link>
              ))}
            </div>
          </div>

          <div className={styles.dropdown}>
            <button className={styles.navLink}>Rạp chiếu ▾</button>
            <div className={styles.dropdownMenu}>
              {raps.map(r => (
                <Link key={r.id} to={`/rap-chieu/${r.id}`} className={styles.dropdownItem}>{r.ten_rap}</Link>
              ))}
            </div>
          </div>

          <Link to="/khuyen-mai" className={styles.navLink}>Khuyến mãi</Link>
          <Link to="/tin-tuc" className={styles.navLink}>Tin tức</Link>

          {/* Search */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm phim..." className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>🔍</button>
          </form>

          {/* Auth */}
          {user ? (
            <div className={styles.dropdown}>
              <button className={styles.userBtn}>
                <span className={styles.avatar}>{user.name?.[0]?.toUpperCase()}</span>
                <span className={styles.userName}>{user.name}</span>
              </button>
              <div className={`${styles.dropdownMenu} ${styles.dropdownRight}`}>
                {isAdmin && <Link to="/admin" className={styles.dropdownItem}>⚙️ Quản trị</Link>}
                <Link to="/ho-so" className={styles.dropdownItem}>👤 Hồ sơ</Link>
                <Link to="/ve-cua-toi" className={styles.dropdownItem}>🎟️ Vé của tôi</Link>
                <Link to="/lich-su-diem" className={styles.dropdownItem}>⭐ Điểm thưởng</Link>
                {(user.vai_tro === 1 || user.vai_tro === 3) && (
                  <>
                    <Link to="/lich-lam-viec" className={styles.dropdownItem}>📅 Lịch làm việc</Link>
                    <Link to="/dang-ky-nghi-phep" className={styles.dropdownItem}>📝 Đăng ký nghỉ</Link>
                  </>
                )}
                <hr className={styles.divider} />
                <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/dang-nhap" className="btn btn-ghost btn-sm">Đăng nhập</Link>
              <Link to="/dang-ky" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
