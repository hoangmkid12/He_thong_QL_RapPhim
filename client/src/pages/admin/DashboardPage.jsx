import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const StatCard = ({ icon, label, value, sub, color = '#e50914' }) => (
  <div className="card" style={{ padding: '20px 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: '#878797', fontSize: '0.875rem', marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: '#878797', marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: '2rem', opacity: .8 }}>{icon}</div>
    </div>
  </div>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const today = new Date()
  const from30 = new Date(today.getTime() - 30 * 86400e3).toISOString().slice(0, 10)
  const toDay = today.toISOString().slice(0, 10)
  const fromToday = today.toISOString().slice(0, 10)
  const to7Days = new Date(today.getTime() + 7 * 86400e3).toISOString().slice(0, 10)

  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: () => api.get('/thong-ke/summary').then(r => r.data.data),
    enabled: user.vai_tro !== 1 // Staff don't strictly need system stats first
  })

  const { data: mySchedules = [] } = useQuery({
    queryKey: ['my-schedules-dash'],
    queryFn: () => api.get(`/lich-lam-viec/my?from=${fromToday}&to=${to7Days}`).then(r => r.data.data),
    enabled: user.vai_tro === 1
  })

  const { data: revenueData = [] } = useQuery({
    queryKey: ['revenue-date'],
    queryFn: () => api.get(`/thong-ke/revenue-by-date?from=${from30}&to=${toDay}`).then(r => r.data.data),
  })

  const { data: topMovies = [] } = useQuery({
    queryKey: ['top-movies'],
    queryFn: () => api.get(`/thong-ke/top-movies?from=${from30}&to=${toDay}&limit=5`).then(r => r.data.data),
  })

  const { data: rapRevenue = [] } = useQuery({
    queryKey: ['rap-revenue'],
    queryFn: () => api.get(`/thong-ke/revenue-by-rap?from=${from30}&to=${toDay}`).then(r => r.data.data),
  })

  const fmt = (n) => n >= 1e9 ? `${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : (n || 0).toLocaleString('vi-VN')

  const chartRevenue = revenueData.slice(-14).map(d => ({
    name: new Date(d.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    revenue: parseInt(d.revenue || 0),
  }))

  const isStaffView = user.vai_tro === 1

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24, padding: '24px 0 0' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>🏠 Dashboard</h1>
        <div style={{ fontSize: '0.875rem', color: '#878797', marginTop: 4 }}>
          {today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
      </div>

      {/* Staff Focus: Upcoming Shifts */}
      {isStaffView && (
        <div className="card" style={{ marginBottom: 28, background: 'linear-gradient(135deg, #1c1c27, #13131a)', border: '1px solid rgba(229,9,20,.2)' }}>
          <div className="card-body" style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                🗓️ Lịch làm việc sắp tới của bạn
              </h3>
              <Link to="/lich-lam-viec" style={{ color: '#e50914', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Xem lịch tuần →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {mySchedules.slice(0, 3).map(s => (
                <div key={s.id} style={{ background: 'rgba(255,255,255,.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, color: '#e8e8f0' }}>{s.ca_lam}</div>
                    <div style={{ fontSize: '0.8rem', color: '#e50914', fontWeight: 700 }}>
                      {new Date(s.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#878797', marginBottom: 10 }}>
                    🕒 {s.gio_bat_dau.slice(0,5)} - {s.gio_ket_thuc.slice(0,5)}
                  </div>
                  {s.ghi_chu && <div style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>📝 {s.ghi_chu}</div>}
                </div>
              ))}
              {mySchedules.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#878797', background: 'rgba(255,255,255,.02)', borderRadius: 12, gridColumn: '1/-1' }}>
                  Bạn hiện chưa được phân ca làm việc nào trong 7 ngày tới.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards (System stats for Admins, secondary for Staff) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="💰" label="Doanh thu" value={fmt(summary?.total_revenue)} color="#e50914" />
        <StatCard icon="🎟️" label="Vé đã bán" value={summary?.total_tickets?.toLocaleString()} color="#22c55e" />
        <StatCard icon="🎬" label="Phim đang chiếu" value={summary?.total_movies} color="#8b5cf6" />
        <StatCard icon="👥" label="Thành viên" value={summary?.total_customers?.toLocaleString()} color="#f59e0b" />
      </div>

      {/* Revenue and Cinema Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📈 Doanh thu 14 ngày gần nhất</h3>
            {chartRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#878797' }} />
                  <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11, fill: '#878797' }} />
                  <Tooltip
                    contentStyle={{ background: '#1c1c27', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#e8e8f0' }}
                    formatter={(v) => [`${v.toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#e50914" strokeWidth={2} dot={{ r: 3, fill: '#e50914' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="loading-center" style={{ height: 220 }}><div className="spinner" /></div>}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🏟️ Doanh thu theo Rạp</h3>
            {rapRevenue.slice(0, 5).map((r, i) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{ color: '#878797', flexShrink: 0, width: 16 }}>#{i + 1}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ten_rap}</span>
                </div>
                <span style={{ color: '#e50914', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{fmt(r.doanh_thu)}₫</span>
              </div>
            ))}
            <Link to="/admin/thong-ke" style={{ fontSize: '0.8rem', color: '#e50914', textDecoration: 'none' }}>Xem chi tiết →</Link>
          </div>
        </div>
      </div>

      {/* Top Movies - Lower priority for staff */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700 }}>🎬 Top phim (30 ngày)</h3>
            <Link to="/admin/phim" className="btn btn-ghost btn-sm">Xem tất cả</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)', color: '#878797' }}>
                  {['#', 'Phim', 'Vé bán', 'Doanh thu'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: h === '#' ? 'center' : 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topMovies.map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#878797' }}>#{i + 1}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={m.img ? `/uploads/phim/${m.img}` : `https://via.placeholder.com/36x54/1c1c27/888?text=🎬`}
                          alt={m.tieu_de} style={{ width: 36, height: 54, objectFit: 'cover', borderRadius: 4 }} />
                        <span style={{ fontWeight: 600 }}>{m.tieu_de}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>{m.so_ve?.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: '#e50914', fontWeight: 700 }}>{fmt(m.doanh_thu)} ₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
